"use client";

import Link from "next/link";
import {
  loadConversations as loadSavedConversations,
  createConversation as createSavedConversation,
  saveMessage as saveSavedMessage,
  updateConversation as updateSavedConversation,
  deleteConversation as deleteSavedConversation,
  type Conversation as SavedConversation,
} from "@/lib/conversations";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowUp,
  BrainCircuit,
  HeartPulse,
  LayoutDashboard,
  ClipboardList,
  Settings,
  Sparkles,
  ShieldCheck,
  User,
  Plus,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Trash2,
  MessageSquare,
} from "lucide-react";

type AIResponse = {
  title: string;
  summary: string;
  keyPoints: string[];
  whenToSeekHelp: string;
  questionsForClinician: string[];
  disclaimer: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  data?: AIResponse;
};

type Conversation = {
  id: string;
  title: string;
  updatedAt: number;
  messages: Message[];
};

const suggestions = [
  "What is the difference between a cold and the flu?",
  "How does sleep affect general health?",
  "What information should I track about headaches?",
  "Explain what blood pressure measurements mean.",
];

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [savingConsent, setSavingConsent] = useState(false);

  const [error, setError] = useState("");
  const [saveWarning, setSaveWarning] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const [persistedConversationIds, setPersistedConversationIds] = useState<
    Set<string>
  >(new Set());

  const [persistedMessageIds, setPersistedMessageIds] = useState<Set<string>>(
    new Set()
  );

  const [deletingConversationId, setDeletingConversationId] = useState<
    string | null
  >(null);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId
  );

  const messages = activeConversation?.messages ?? [];

  // Load conversations from Supabase
  useEffect(() => {
    let isMounted = true;

    async function fetchConversations() {
      try {
        const savedConversations = await loadSavedConversations();

        const formattedConversations: Conversation[] =
          savedConversations.map((conversation: SavedConversation) => ({
            id: conversation.id,
            title: conversation.title,
            updatedAt: new Date(conversation.updated_at).getTime(),
            messages: (conversation.messages ?? []).map((message) => {
              let content = message.content;
              let data: AIResponse | undefined;

              if (message.role === "assistant") {
                try {
                  const parsed: unknown = JSON.parse(message.content);

                  if (
                    parsed !== null &&
                    typeof parsed === "object" &&
                    "summary" in parsed &&
                    typeof parsed.summary === "string"
                  ) {
                    data = parsed as AIResponse;
                    content = data.summary;
                  }
                } catch {
                  // Keep plain text if stored content is not JSON.
                }
              }

              return {
                id: message.id,
                role: message.role,
                content,
                data,
              };
            }),
          }));

        if (isMounted) {
          setConversations(formattedConversations);

          setPersistedConversationIds(
            new Set(formattedConversations.map((conversation) => conversation.id))
          );

          setPersistedMessageIds(
            new Set(
              formattedConversations.flatMap((conversation) =>
                conversation.messages.map((message) => message.id)
              )
            )
          );

          setActiveConversationId(formattedConversations[0]?.id ?? null);
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);

        if (isMounted) {
          setError("Unable to load your conversation history.");
        }
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    }

    fetchConversations();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSend(text?: string) {
    const content = (text ?? input).trim();

    if (!content || loading || !consent) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    const conversationId = activeConversationId ?? crypto.randomUUID();

    const currentMessages = activeConversation?.messages ?? [];

    const updatedMessages = [...currentMessages, userMessage];

    const conversationTitle =
      currentMessages.length === 0
        ? content.length > 35
          ? content.slice(0, 35) + "..."
          : content
        : activeConversation?.title ?? "New Conversation";

    const updatedConversation: Conversation = {
      id: conversationId,
      title: conversationTitle,
      updatedAt: Date.now(),
      messages: updatedMessages,
    };

    setConversations((previous) => {
      const existingIndex = previous.findIndex(
        (conversation) => conversation.id === conversationId
      );

      if (existingIndex !== -1) {
        return previous.map((conversation) =>
          conversation.id === conversationId
            ? updatedConversation
            : conversation
        );
      }

      return [updatedConversation, ...previous];
    });

    setActiveConversationId(conversationId);
    setInput("");
    setLoading(true);
    setError("");
    setSaveWarning("");

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((message) => ({
            role: message.role,
            content: message.data
              ? JSON.stringify(message.data)
              : message.content,
          })),
          consent: true,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      if (!result.data || typeof result.data.summary !== "string") {
        throw new Error("The AI returned an invalid response.");
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.data.summary,
        data: result.data,
      };

      const finalMessages = [...updatedMessages, assistantMessage];

      // Update the interface immediately.
      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                updatedAt: Date.now(),
                messages: finalMessages,
              }
            : conversation
        )
      );

      // Save conversation only when the user explicitly agrees.
      if (savingConsent) {
        try {
          let databaseConversationId = conversationId;

          const isAlreadyPersisted =
            persistedConversationIds.has(conversationId);

          // Create a database conversation if this is a new chat.
          if (!isAlreadyPersisted) {
            const createdConversation =
              await createSavedConversation(conversationTitle);

            databaseConversationId = createdConversation.id;

            setPersistedConversationIds((previous) => {
              const next = new Set(previous);
              next.add(databaseConversationId);
              return next;
            });

            // Replace the temporary ID with the real database ID.
            setConversations((previous) =>
              previous.map((conversation) =>
                conversation.id === conversationId
                  ? {
                      ...conversation,
                      id: databaseConversationId,
                    }
                  : conversation
              )
            );

            setActiveConversationId((previous) =>
              previous === conversationId
                ? databaseConversationId
                : previous
            );
          }

          // Save messages that have not already been stored.
          for (const message of finalMessages) {
            if (persistedMessageIds.has(message.id)) {
              continue;
            }

            const messageContent = message.data
              ? JSON.stringify(message.data)
              : message.content;

            await saveSavedMessage(
              databaseConversationId,
              message.role,
              messageContent
            );

            setPersistedMessageIds((previous) => {
              const next = new Set(previous);
              next.add(message.id);
              return next;
            });
          }

          await updateSavedConversation(databaseConversationId);
        } catch (saveError) {
          console.error("Failed to save conversation:", saveError);

          setSaveWarning(
            "Your AI response was generated, but the conversation could not be saved to your history."
          );
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unable to connect to the AI service.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function startNewChat() {
    setActiveConversationId(null);
    setInput("");
    setConsent(false);
    setSavingConsent(false);
    setError("");
    setSaveWarning("");
  }

  function openConversation(id: string) {
    setActiveConversationId(id);
    setInput("");
    setError("");
    setSaveWarning("");
  }

  async function deleteConversation(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?"
    );

    if (!confirmed || deletingConversationId) return;

    setDeletingConversationId(id);
    setError("");
    setSaveWarning("");

    try {
      // Delete from Supabase only if the conversation was saved.
      if (persistedConversationIds.has(id)) {
        await deleteSavedConversation(id);
      }

      setConversations((previous) =>
        previous.filter((conversation) => conversation.id !== id)
      );

      setPersistedConversationIds((previous) => {
        const next = new Set(previous);
        next.delete(id);
        return next;
      });

      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    } catch (deleteError) {
      console.error("Failed to delete conversation:", deleteError);

      setError(
        "Unable to delete this conversation. Please try again."
      );
    } finally {
      setDeletingConversationId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#080d18] text-white">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-white/5 bg-[#0d1524] p-6 lg:flex lg:flex-col">

          <Link href="/" className="mb-10 flex items-center gap-3">
            <div className="rounded-xl bg-teal-400/10 p-2">
              <Activity className="h-6 w-6 text-teal-400" />
            </div>

            <span className="text-xl font-bold">
              MediMind <span className="text-teal-400">AI</span>
            </span>
          </Link>

          <button
            onClick={startNewChat}
            className="mb-8 flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-teal-300"
          >
            <Plus size={18} />
            New Conversation
          </button>

          {/* Navigation */}
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Workspace
          </p>

          <nav className="space-y-2">
            <SidebarLink
              href="/dashboard"
              icon={<LayoutDashboard size={19} />}
              label="Dashboard"
            />

            <SidebarLink
              href="/assistant"
              icon={<BrainCircuit size={19} />}
              label="AI Assistant"
              active
            />

            <SidebarLink
              href="/symptoms"
              icon={<HeartPulse size={19} />}
              label="Symptom Journal"
            />

            <SidebarLink
              href="/history"
              icon={<ClipboardList size={19} />}
              label="Health History"
            />
          </nav>

          {/* Conversation History */}
          <div className="mt-9 flex min-h-0 flex-1 flex-col">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Recent Conversations
              </p>

              <MessageSquare size={15} className="text-slate-500" />
            </div>

            <div className="space-y-2 overflow-y-auto pr-1">
              {!isLoaded ? (
                <p className="text-xs text-slate-500">
                  Loading history...
                </p>
              ) : conversations.length === 0 ? (
                <p className="text-xs leading-6 text-slate-500">
                  Your conversations will appear here.
                </p>
              ) : (
                conversations
                  .slice()
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`group flex items-center gap-2 rounded-xl px-3 py-3 transition ${
                        activeConversationId === conversation.id
                          ? "bg-teal-400/10"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <button
                        onClick={() => openConversation(conversation.id)}
                        className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      >
                        <MessageCircle
                          size={16}
                          className="shrink-0 text-teal-400"
                        />

                        <span className="truncate text-xs text-slate-300">
                          {conversation.title}
                        </span>
                      </button>

                      <button
                        onClick={() => deleteConversation(conversation.id)}
                        disabled={deletingConversationId === conversation.id}
                        className="shrink-0 text-slate-600 opacity-0 transition hover:text-red-400 group-hover:opacity-100 disabled:opacity-50"
                        title="Delete conversation"
                      >
                        {deletingConversationId === conversation.id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="mt-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Preferences
            </p>

            <SidebarLink
              href="/settings"
              icon={<Settings size={19} />}
              label="Settings"
            />
          </div>

          {/* Responsible AI */}
          <div className="mt-8 rounded-2xl border border-teal-400/10 bg-teal-400/5 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-teal-400" />

              <div>
                <p className="text-sm font-semibold text-teal-300">
                  Responsible AI
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Educational information only. Not a medical diagnosis.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex min-w-0 flex-1 flex-col">

          {/* Header */}
          <header className="flex items-center justify-between border-b border-white/5 bg-[#0d1524]/70 px-6 py-5 lg:px-10">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-slate-400 transition hover:text-white"
              >
                <ArrowLeft size={19} />
              </Link>

              <div>
                <p className="text-sm text-slate-400">
                  Workspace / AI Assistant
                </p>

                <h1 className="mt-1 text-xl font-bold">
                  AI Health Assistant
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full border border-teal-400/20 bg-teal-400/5 px-3 py-1.5 text-xs text-teal-300">
                Groq AI
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/15 text-teal-400">
                <User size={19} />
              </div>
            </div>
          </header>

          {/* Chat Area */}
          <div className="flex flex-1 flex-col">
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 py-8">

              {!isLoaded ? (
                <div className="flex flex-1 items-center justify-center">
                  <Loader2 className="h-7 w-7 animate-spin text-teal-400" />
                </div>
              ) : messages.length === 0 ? (

                /* Welcome Screen */
                <div className="flex flex-1 flex-col items-center justify-center py-12">
                  <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-teal-400/20 bg-teal-400/10">
                    <BrainCircuit className="h-10 w-10 text-teal-400" />
                  </div>

                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-teal-400">
                    <Sparkles size={16} />
                    MediMind AI Assistant
                  </div>

                  <h2 className="text-center text-3xl font-bold md:text-4xl">
                    How can I help you today?
                  </h2>

                  <p className="mt-4 max-w-lg text-center leading-7 text-slate-400">
                    Ask general questions about health, medical terminology,
                    and wellness. Get structured educational information.
                  </p>

                  <div className="mt-12 grid w-full gap-3 sm:grid-cols-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSend(suggestion)}
                        disabled={!consent || loading}
                        className="rounded-2xl border border-white/10 bg-[#111a2a] p-5 text-left text-sm leading-6 text-slate-300 transition hover:border-teal-400/30 hover:bg-[#162236] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <MessageCircle className="mb-3 h-5 w-5 text-teal-400" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

              ) : (

                /* Messages */
                <div className="flex-1 space-y-8 pb-8">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          message.role === "user"
                            ? "bg-blue-400/10 text-blue-400"
                            : "bg-teal-400/10 text-teal-400"
                        }`}
                      >
                        {message.role === "user" ? (
                          <User size={19} />
                        ) : (
                          <BrainCircuit size={19} />
                        )}
                      </div>

                      <div
                        className={`max-w-[90%] rounded-2xl p-5 text-sm leading-7 ${
                          message.role === "user"
                            ? "bg-blue-400/10 text-slate-200"
                            : "w-full border border-white/5 bg-[#111a2a] text-slate-300"
                        }`}
                      >
                        {message.role === "user" ? (
                          message.content
                        ) : message.data ? (
                          <AIResponseCard data={message.data} />
                        ) : (
                          message.content
                        )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <Loader2 className="h-5 w-5 animate-spin text-teal-400" />
                      MediMind is preparing your response...
                    </div>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                  <div>
                    <p className="font-semibold">Request failed</p>
                    <p className="mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Save Warning */}
              {saveWarning && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-300">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                  <div>
                    <p className="font-semibold">History not saved</p>
                    <p className="mt-1">{saveWarning}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 border-t border-white/5 bg-[#080d18] px-5 py-5">
              <div className="mx-auto max-w-4xl">

                {/* Groq Consent */}
                <label className="mb-3 flex cursor-pointer items-start gap-3 rounded-xl border border-white/5 bg-[#111a2a] p-4">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-teal-400"
                  />

                  <span className="text-xs leading-6 text-slate-400">
                    I understand that my message will be sent to Groq, an
                    external AI service, to generate a response. I will avoid
                    sharing identifying or unnecessary sensitive information.
                  </span>
                </label>

                {/* History Consent */}
                <label className="mb-4 flex cursor-pointer items-start gap-3 rounded-xl border border-white/5 bg-[#111a2a] p-4">
                  <input
                    type="checkbox"
                    checked={savingConsent}
                    onChange={(e) => setSavingConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-teal-400"
                  />

                  <span className="text-xs leading-6 text-slate-400">
                    I agree to save this conversation and its messages in my
                    MediMind account so I can access them later. If unchecked,
                    new messages will not be saved to my history.
                  </span>
                </label>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-end gap-3 rounded-2xl border border-white/10 bg-[#111a2a] p-3 focus-within:border-teal-400/40"
                >
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !e.shiftKey &&
                        !loading
                      ) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask a general health question..."
                    rows={1}
                    className="max-h-36 min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                  />

                  <button
                    type="submit"
                    disabled={!input.trim() || !consent || loading || !isLoaded}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-400 text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowUp size={21} />
                  </button>
                </form>

                <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-600">
                  <ShieldCheck size={14} />
                  Educational information only. Not a medical diagnosis.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function AIResponseCard({ data }: { data: AIResponse }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-teal-400">
          <CheckCircle2 size={15} />
          AI INFORMATION RESPONSE
        </div>

        <h3 className="text-xl font-bold text-white">{data.title}</h3>

        <p className="mt-3 leading-7 text-slate-300">{data.summary}</p>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#182337] p-5">
        <h4 className="mb-4 font-semibold text-white">Key Points</h4>

        <ul className="space-y-3">
          {data.keyPoints.map((point, index) => (
            <li key={index} className="flex gap-3 text-sm leading-6">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-400" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-5">
        <div className="mb-3 flex items-center gap-2 font-semibold text-amber-300">
          <AlertCircle size={18} />
          When to Seek Professional Help
        </div>

        <p className="text-sm leading-7 text-slate-300">
          {data.whenToSeekHelp}
        </p>
      </div>

      <div>
        <h4 className="mb-3 font-semibold text-white">
          Questions for Your Healthcare Professional
        </h4>

        <ul className="space-y-2">
          {data.questionsForClinician.map((question, index) => (
            <li
              key={index}
              className="rounded-lg border border-white/5 bg-[#182337] p-3 text-sm leading-6 text-slate-300"
            >
              {question}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3 border-t border-white/5 pt-4 text-xs leading-6 text-slate-500">
        <ShieldCheck className="h-5 w-5 shrink-0 text-teal-400" />
        {data.disclaimer}
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
        active
          ? "bg-teal-400/10 text-teal-400"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}