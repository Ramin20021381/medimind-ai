"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquare,
  Settings,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase";

type SymptomEntry = {
  id: string;
  symptom: string;
  severity: string;
  created_at: string;
};

type Conversation = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

type RecentActivity = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "symptom" | "conversation";
  timestamp: number;
};

type MonthlyActivity = {
  label: string;
  count: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messageCount, setMessageCount] = useState(0);
  const [monthlyActivity, setMonthlyActivity] = useState<MonthlyActivity[]>([]);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
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

      setUserEmail(user.email ?? "");

      const [symptomsResult, conversationsResult] = await Promise.all([
        supabase
          .from("symptom_entries")
          .select("id, symptom, severity, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),

        supabase
          .from("conversations")
          .select("id, title, created_at, updated_at")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false }),
      ]);

      if (symptomsResult.error) throw symptomsResult.error;
      if (conversationsResult.error) throw conversationsResult.error;

      const symptomData = (symptomsResult.data ?? []) as SymptomEntry[];
      const conversationData =
        (conversationsResult.data ?? []) as Conversation[];

      setSymptoms(symptomData);
      setConversations(conversationData);

      // Calculate chart data after the component has mounted.
      const now = new Date();
      const months: MonthlyActivity[] = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

        const count = symptomData.filter((entry) => {
          const entryDate = new Date(entry.created_at);

          return (
            entryDate.getMonth() === date.getMonth() &&
            entryDate.getFullYear() === date.getFullYear()
          );
        }).length;

        months.push({
          label: date.toLocaleDateString("en-US", {
            month: "short",
          }),
          count,
        });
      }

      setMonthlyActivity(months);

      if (conversationData.length > 0) {
        const conversationIds = conversationData.map(
          (conversation) => conversation.id
        );

        const { count, error: messagesError } = await supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .in("conversation_id", conversationIds);

        if (messagesError) throw messagesError;

        setMessageCount(count ?? 0);
      } else {
        setMessageCount(0);
      }
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router, supabase]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const recentActivities = useMemo<RecentActivity[]>(() => {
    const symptomActivities: RecentActivity[] = symptoms.map((entry) => ({
      id: `symptom-${entry.id}`,
      title: entry.symptom,
      description: `Symptom entry · Severity: ${entry.severity}`,
      date: entry.created_at,
      type: "symptom",
      timestamp: Date.parse(entry.created_at),
    }));

    const conversationActivities: RecentActivity[] = conversations.map(
      (conversation) => ({
        id: `conversation-${conversation.id}`,
        title: conversation.title || "New AI Conversation",
        description: "AI conversation",
        date: conversation.updated_at,
        type: "conversation",
        timestamp: Date.parse(conversation.updated_at),
      })
    );

    return [...symptomActivities, ...conversationActivities]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }, [symptoms, conversations]);

  const maxActivity = Math.max(
    ...monthlyActivity.map((month) => month.count),
    1
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "Unknown date";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const initials = userEmail ? userEmail.charAt(0).toUpperCase() : "U";

  const stats = [
    {
      title: "Symptom Entries",
      value: symptoms.length,
      description: "Total recorded entries",
      icon: ClipboardList,
    },
    {
      title: "AI Conversations",
      value: conversations.length,
      description: "Total conversations",
      icon: MessageCircle,
    },
    {
      title: "Messages Exchanged",
      value: messageCount,
      description: "Messages in your conversations",
      icon: MessageSquare,
    },
  ];

  const sidebarLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: true },
    { label: "AI Assistant", href: "/assistant", icon: MessageCircle, active: false },
    { label: "Symptom Journal", href: "/symptoms", icon: ClipboardList, active: false },
    { label: "Health History", href: "/history", icon: HeartPulse, active: false },
    { label: "Settings", href: "/settings", icon: Settings, active: false },
  ];

  return (
    <div className="min-h-screen bg-[#080d18] text-white">
      <div className="flex min-h-screen">

        {/* Desktop Sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-white/5 bg-[#0d1524] lg:flex lg:flex-col">
          <div className="flex h-20 items-center gap-3 border-b border-white/5 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
              <Stethoscope size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-white">MediMind AI</h1>
              <p className="text-xs text-slate-500">Health Workspace</p>
            </div>
          </div>

          <div className="flex-1 px-5 py-7">
            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Workspace
            </p>

            <nav className="space-y-2">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <button
                    key={link.label}
                    onClick={() => router.push(link.href)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                      link.active
                        ? "border border-teal-400/10 bg-teal-400/10 text-teal-400"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={19} />
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-white/5 p-5">
            <div className="mb-5 rounded-xl border border-teal-400/10 bg-teal-400/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-teal-400">
                <ShieldCheck size={18} />
                <span className="text-sm font-semibold">Responsible AI</span>
              </div>

              <p className="text-xs leading-5 text-slate-400">
                MediMind provides educational health information, not medical
                diagnosis or treatment.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              aria-label="Close menu"
              className="absolute inset-0 bg-black/70"
              onClick={() => setMobileMenuOpen(false)}
            />

            <aside className="relative flex h-full w-72 flex-col border-r border-white/10 bg-[#0d1524]">
              <div className="flex h-20 items-center justify-between border-b border-white/5 px-5">
                <div className="flex items-center gap-3">
                  <Stethoscope className="text-teal-400" size={23} />
                  <span className="font-bold">MediMind AI</span>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="flex-1 space-y-2 px-4 py-7">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <button
                      key={link.label}
                      onClick={() => {
                        router.push(link.href);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${
                        link.active
                          ? "bg-teal-400/10 text-teal-400"
                          : "text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      <Icon size={19} />
                      {link.label}
                    </button>
                  );
                })}
              </nav>

              <div className="border-t border-white/5 p-4">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1">

          {/* Header */}
          <header className="flex h-20 items-center justify-between border-b border-white/5 bg-[#0d1524] px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              <div>
                <h2 className="text-xl font-bold text-white">Dashboard</h2>
                <p className="hidden text-xs text-slate-500 sm:block">
                  Your personal health overview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-white">My Account</p>
                <p className="max-w-48 truncate text-xs text-slate-500">
                  {userEmail}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-400/20 bg-teal-400/10 font-bold text-teal-400">
                {initials}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="mx-auto max-w-7xl space-y-7 p-5 sm:p-8">

            {/* Welcome */}
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="mb-2 text-sm font-medium text-teal-400">
                  Personal Health Workspace
                </p>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Welcome back!
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                  Here is an overview of your MediMind activity.
                </p>
              </div>

              <button
                onClick={() => router.push("/assistant")}
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-[#080d18] shadow-lg shadow-teal-500/10 transition hover:bg-teal-400"
              >
                <MessageCircle size={18} />
                New AI Conversation
              </button>
            </section>

            {/* Error */}
            {error && (
              <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                <span>{error}</span>

                <button
                  onClick={loadDashboard}
                  className="font-semibold underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Stats */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-white/5 bg-[#111a2a] p-5 shadow-lg shadow-black/10 transition hover:border-teal-400/20"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-400">
                          {stat.title}
                        </p>

                        <p className="mt-3 text-3xl font-bold text-white">
                          {loading ? "—" : stat.value}
                        </p>
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal-400/10 bg-teal-400/10 text-teal-400">
                        <Icon size={21} />
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-500">
                      {stat.description}
                    </p>
                  </div>
                );
              })}
            </section>

            {/* Chart and Quick Actions */}
            <section className="grid gap-6 xl:grid-cols-3">

              {/* Activity Chart */}
              <div className="rounded-2xl border border-white/5 bg-[#111a2a] p-6 shadow-lg shadow-black/10 xl:col-span-2">
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">
                      Symptom Entries Over Time
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Your recorded entries during the last six months
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/10 text-teal-400">
                    <Activity size={20} />
                  </div>
                </div>

                {loading ? (
                  <div className="flex h-48 items-center justify-center text-sm text-slate-500">
                    Loading activity...
                  </div>
                ) : (
                  <>
                    <div className="flex h-48 items-end justify-between gap-3 border-b border-white/5 pb-2">
                      {monthlyActivity.map((month) => {
                        const height =
                          month.count === 0
                            ? 0
                            : Math.max(
                                (month.count / maxActivity) * 100,
                                8
                              );

                        return (
                          <div
                            key={month.label}
                            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                          >
                            <span className="text-xs font-medium text-slate-400">
                              {month.count > 0 ? month.count : ""}
                            </span>

                            <div className="flex h-full w-full items-end justify-center">
                              <div
                                className="w-full max-w-12 rounded-t-lg bg-teal-500 transition-all duration-500"
                                style={{
                                  height: `${height}%`,
                                  minHeight: month.count > 0 ? "8px" : "0",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3 flex justify-between gap-3">
                      {monthlyActivity.map((month) => (
                        <span
                          key={month.label}
                          className="flex-1 text-center text-xs text-slate-500"
                        >
                          {month.label}
                        </span>
                      ))}
                    </div>

                    {symptoms.length === 0 && (
                      <p className="mt-5 text-center text-xs text-slate-500">
                        Your symptom activity will appear here after your
                        first entry.
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl border border-white/5 bg-[#111a2a] p-6 shadow-lg shadow-black/10">
                <h3 className="font-bold text-white">Quick Actions</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Access your main tools
                </p>

                <div className="mt-6 space-y-3">
                  <QuickAction
                    title="Ask MediMind AI"
                    description="Explore health information"
                    icon={<MessageCircle size={20} />}
                    onClick={() => router.push("/assistant")}
                  />

                  <QuickAction
                    title="Symptom Journal"
                    description="Record a new entry"
                    icon={<ClipboardList size={20} />}
                    onClick={() => router.push("/symptoms")}
                  />

                  <QuickAction
                    title="Health History"
                    description="Review your activity"
                    icon={<HeartPulse size={20} />}
                    onClick={() => router.push("/history")}
                  />
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="rounded-2xl border border-white/5 bg-[#111a2a] shadow-lg shadow-black/10">
              <div className="flex items-center justify-between border-b border-white/5 p-6">
                <div>
                  <h3 className="font-bold text-white">Recent Activity</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Your latest records and conversations
                  </p>
                </div>

                <CalendarDays size={20} className="text-slate-500" />
              </div>

              <div className="divide-y divide-white/5">
                {loading ? (
                  <div className="p-8 text-center text-sm text-slate-500">
                    Loading recent activity...
                  </div>
                ) : recentActivities.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-400/10 text-teal-400">
                      <Activity size={22} />
                    </div>

                    <p className="mt-4 font-semibold text-white">
                      No activity yet
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Your symptom entries and AI conversations will appear
                      here.
                    </p>
                  </div>
                ) : (
                  recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 px-6 py-4"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          activity.type === "symptom"
                            ? "bg-blue-400/10 text-blue-400"
                            : "bg-teal-400/10 text-teal-400"
                        }`}
                      >
                        {activity.type === "symptom" ? (
                          <ClipboardList size={19} />
                        ) : (
                          <MessageCircle size={19} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                          {activity.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {activity.description}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs text-slate-500">
                        {formatDate(activity.date)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-400/10 bg-amber-400/5 p-4">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-amber-400"
              />

              <p className="text-xs leading-5 text-slate-400">
                <strong className="text-amber-400">Important:</strong>{" "}
                MediMind AI provides educational health information only. It
                does not diagnose medical conditions or replace professional
                medical advice. Consult a qualified healthcare professional
                for personal medical concerns.
              </p>
            </div>

            <footer className="pb-3 text-center text-xs text-slate-600">
              © 2026 MediMind AI. All rights reserved.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

function QuickAction({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-[#182337] p-4 text-left transition hover:border-teal-400/20 hover:bg-[#1c2b40]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-400">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <ArrowUpRight size={17} className="text-slate-500" />
    </button>
  );
}