"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  HeartPulse,
  Loader2,
  MessageCircle,
  MessageSquare,
  Search,
  ShieldCheck,
  Stethoscope,
  Trash2,
} from "lucide-react";

import { createClient } from "@/lib/supabase";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

type Conversation = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
};

type SymptomEntry = {
  id: string;
  symptom: string;
  duration: string;
  severity: string;
  notes: string;
  created_at: string;
};

type HistoryTab = "all" | "conversations" | "symptoms";

export default function HistoryPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [activeTab, setActiveTab] = useState<HistoryTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedConversation, setExpandedConversation] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      const [conversationsResult, symptomsResult] = await Promise.all([
        supabase
          .from("conversations")
          .select(`
            id,
            title,
            created_at,
            updated_at,
            messages (
              id,
              role,
              content,
              created_at
            )
          `)
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false }),

        supabase
          .from("symptom_entries")
          .select(
            "id, symptom, duration, severity, notes, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (conversationsResult.error) {
        throw conversationsResult.error;
      }

      if (symptomsResult.error) {
        throw symptomsResult.error;
      }

      setConversations(
        (conversationsResult.data ?? []) as Conversation[]
      );

      setSymptoms((symptomsResult.data ?? []) as SymptomEntry[]);
    } catch (err) {
      console.error("History loading error:", err);
      setError("Unable to load your history. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router, supabase]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const deleteConversation = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    try {
      const { error: deleteError } = await supabase
        .from("conversations")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setConversations((previous) =>
        previous.filter((conversation) => conversation.id !== id)
      );

      if (expandedConversation === id) {
        setExpandedConversation(null);
      }
    } catch (err) {
      console.error("Conversation deletion error:", err);
      setError("Unable to delete this conversation.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredConversations = conversations.filter((conversation) => {
    const query = searchQuery.toLowerCase();

    return (
      (conversation.title ?? "").toLowerCase().includes(query) ||
      conversation.messages.some((message) =>
        message.content.toLowerCase().includes(query)
      )
    );
  });

  const filteredSymptoms = symptoms.filter((entry) => {
    const query = searchQuery.toLowerCase();

    return (
      entry.symptom.toLowerCase().includes(query) ||
      entry.notes.toLowerCase().includes(query) ||
      entry.severity.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "Unknown date";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const tabs = [
    { id: "all", label: "All History" },
    { id: "conversations", label: "AI Conversations" },
    { id: "symptoms", label: "Symptom Records" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#080d18] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0d1524]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/10 text-teal-400">
              <Stethoscope size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold">MediMind AI</h1>
              <p className="text-xs text-slate-500">Health Workspace</p>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:border-teal-400/30 hover:text-teal-400"
          >
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8">
        {/* Page Title */}
        <section>
          <p className="mb-2 text-sm font-medium text-teal-400">
            Your Personal Records
          </p>

          <h2 className="text-3xl font-bold tracking-tight">
            Health History
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Review your previous AI conversations and symptom records.
          </p>
        </section>

        {/* Summary Cards */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-[#111a2a] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  AI Conversations
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {loading ? "—" : conversations.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-400/10 text-teal-400">
                <MessageCircle size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#111a2a] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Symptom Records
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {loading ? "—" : symptoms.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
                <HeartPulse size={23} />
              </div>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search conversations, symptoms, or notes..."
            className="w-full rounded-xl border border-white/10 bg-[#111a2a] py-4 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-400/40"
          />
        </section>

        {/* Tabs */}
        <section className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-teal-400/10 text-teal-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </section>

        {/* Error */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            <span>{error}</span>

            <button
              onClick={loadHistory}
              className="font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-400">
            <Loader2 size={22} className="animate-spin text-teal-400" />
            Loading your health history...
          </div>
        ) : (
          <div className="space-y-8">
            {/* Conversations */}
            {(activeTab === "all" || activeTab === "conversations") && (
              <section>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">
                      AI Conversations
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Your previous conversations with MediMind AI
                    </p>
                  </div>

                  <MessageSquare
                    size={21}
                    className="text-teal-400"
                  />
                </div>

                {filteredConversations.length === 0 ? (
                  <EmptyState
                    icon={<MessageCircle size={24} />}
                    title="No conversations found"
                    description="Your previous AI conversations will appear here."
                  />
                ) : (
                  <div className="space-y-3">
                    {filteredConversations.map((conversation) => {
                      const isExpanded =
                        expandedConversation === conversation.id;

                      return (
                        <div
                          key={conversation.id}
                          className="overflow-hidden rounded-2xl border border-white/5 bg-[#111a2a]"
                        >
                          <div className="flex items-center gap-3 p-5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-400/10 text-teal-400">
                              <MessageCircle size={21} />
                            </div>

                            <button
                              onClick={() =>
                                setExpandedConversation(
                                  isExpanded ? null : conversation.id
                                )
                              }
                              className="min-w-0 flex-1 text-left"
                            >
                              <p className="truncate text-sm font-semibold text-white">
                                {conversation.title ||
                                  "New AI Conversation"}
                              </p>

                              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <CalendarDays size={13} />
                                  {formatDate(conversation.created_at)}
                                </span>

                                <span className="flex items-center gap-1">
                                  <MessageSquare size={13} />
                                  {conversation.messages?.length ?? 0} messages
                                </span>
                              </div>
                            </button>

                            <button
                              onClick={() =>
                                setExpandedConversation(
                                  isExpanded ? null : conversation.id
                                )
                              }
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-teal-400"
                              aria-label="Toggle conversation"
                            >
                              {isExpanded ? (
                                <ChevronUp size={20} />
                              ) : (
                                <ChevronDown size={20} />
                              )}
                            </button>

                            <button
                              onClick={() =>
                                deleteConversation(conversation.id)
                              }
                              disabled={deletingId === conversation.id}
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                              aria-label="Delete conversation"
                            >
                              {deletingId === conversation.id ? (
                                <Loader2
                                  size={18}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="space-y-4 border-t border-white/5 bg-[#0d1524] p-5">
                              {conversation.messages.length === 0 ? (
                                <p className="py-4 text-center text-sm text-slate-500">
                                  This conversation has no messages.
                                </p>
                              ) : (
                                conversation.messages
                                  .slice()
                                  .sort(
                                    (a, b) =>
                                      new Date(a.created_at).getTime() -
                                      new Date(b.created_at).getTime()
                                  )
                                  .map((message) => (
                                    <div
                                      key={message.id}
                                      className={`flex ${
                                        message.role === "user"
                                          ? "justify-end"
                                          : "justify-start"
                                      }`}
                                    >
                                      <div
                                        className={`max-w-[90%] rounded-2xl p-4 sm:max-w-[80%] ${
                                          message.role === "user"
                                            ? "bg-teal-500/10 text-teal-100"
                                            : "border border-white/5 bg-[#182337] text-slate-300"
                                        }`}
                                      >
                                        <div className="mb-2 flex items-center justify-between gap-4">
                                          <span className="text-xs font-semibold text-teal-400">
                                            {message.role === "user"
                                              ? "You"
                                              : "MediMind AI"}
                                          </span>

                                          <span className="text-[10px] text-slate-500">
                                            {formatTime(message.created_at)}
                                          </span>
                                        </div>

                                        <p className="whitespace-pre-wrap break-words text-sm leading-6">
                                          {message.content}
                                        </p>
                                      </div>
                                    </div>
                                  ))
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* Symptom Records */}
            {(activeTab === "all" || activeTab === "symptoms") && (
              <section>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">
                      Symptom Records
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Your previously recorded symptom entries
                    </p>
                  </div>

                  <ClipboardList
                    size={21}
                    className="text-blue-400"
                  />
                </div>

                {filteredSymptoms.length === 0 ? (
                  <EmptyState
                    icon={<HeartPulse size={24} />}
                    title="No symptom records found"
                    description="Your recorded symptoms will appear here."
                  />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredSymptoms.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-2xl border border-white/5 bg-[#111a2a] p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
                              <HeartPulse size={20} />
                            </div>

                            <div>
                              <h4 className="font-semibold text-white">
                                {entry.symptom}
                              </h4>

                              <p className="mt-1 text-xs text-slate-500">
                                {formatDate(entry.created_at)}
                              </p>
                            </div>
                          </div>

                          <span className="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                            {entry.severity}
                          </span>
                        </div>

                        <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                          <Clock size={15} className="text-teal-400" />
                          Duration: {entry.duration}
                        </div>

                        {entry.notes && (
                          <div className="mt-4 rounded-xl bg-[#0d1524] p-4">
                            <p className="mb-2 text-xs font-semibold text-slate-400">
                              Notes
                            </p>

                            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">
                              {entry.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-400/10 bg-amber-400/5 p-4">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-amber-400"
          />

          <p className="text-xs leading-5 text-slate-400">
            <strong className="text-amber-400">Privacy reminder:</strong>{" "}
            Your records are private to your account. MediMind AI provides
            educational information and does not replace professional medical
            advice.
          </p>
        </div>

        <footer className="pb-4 text-center text-xs text-slate-600">
          © 2026 MediMind AI. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#111a2a] px-5 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400/10 text-teal-400">
        {icon}
      </div>

      <h4 className="mt-4 font-semibold text-white">{title}</h4>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}