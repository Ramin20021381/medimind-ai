"use client";

import Link from "next/link";
import {
  Activity,
  BrainCircuit,
  HeartPulse,
  LayoutDashboard,
  ClipboardList,
  Settings,
  Bell,
  ArrowUpRight,
  Plus,
  CalendarDays,
  FileText,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const stats = [
  {
    title: "Health Reports",
    value: "08",
    description: "Reports recorded",
    icon: FileText,
  },
  {
    title: "AI Consultations",
    value: "12",
    description: "Information sessions",
    icon: BrainCircuit,
  },
  {
    title: "Health Metrics",
    value: "06",
    description: "Tracked metrics",
    icon: Activity,
  },
];

const activities = [
  {
    title: "Health report created",
    description: "Your latest health information was recorded.",
    date: "Today",
  },
  {
    title: "AI information session",
    description: "You explored general information about headaches.",
    date: "Yesterday",
  },
  {
    title: "Health metrics updated",
    description: "Your personal records were updated.",
    date: "2 days ago",
  },
];

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#080d18] text-white">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/5 bg-[#0d1524] p-6 transition-transform lg:static lg:translate-x-0 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-12 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="rounded-xl bg-teal-400/10 p-2">
                <Activity className="h-6 w-6 text-teal-400" />
              </div>
              <span className="text-xl font-bold">
                MediMind <span className="text-teal-400">AI</span>
              </span>
            </Link>

            <button
              onClick={() => setMenuOpen(false)}
              className="text-slate-400 lg:hidden"
            >
              <X />
            </button>
          </div>

          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Workspace
          </p>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl bg-teal-400/10 px-4 py-3 text-teal-400"
            >
              <LayoutDashboard size={19} />
              Dashboard
            </Link>

            <Link
              href="/assistant"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <BrainCircuit size={19} />
              AI Assistant
            </Link>

            <Link
              href="/symptoms"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <HeartPulse size={19} />
              Symptom Journal
            </Link>

            <Link
              href="/history"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <ClipboardList size={19} />
              Health History
            </Link>
          </nav>

          <div className="mt-12">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Preferences
            </p>

            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <Settings size={19} />
              Settings
            </Link>
          </div>

          <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-teal-400/10 bg-teal-400/5 p-4">
            <ShieldMessage />
          </div>
        </aside>

        {menuOpen && (
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          />
        )}

        <section className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-white/5 bg-[#0d1524]/70 px-6 py-5 lg:px-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuOpen(true)}
                className="text-slate-300 lg:hidden"
              >
                <Menu />
              </button>

              <div>
                <p className="text-sm text-slate-400">Workspace / Overview</p>
                <h1 className="mt-1 text-xl font-bold">Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                aria-label="Notifications"
                className="rounded-xl border border-white/10 p-2.5 text-slate-400 transition hover:text-white"
              >
                <Bell size={19} />
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/15 font-bold text-teal-400">
                U
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold">
                  Welcome to your workspace
                </h2>
                <p className="mt-2 text-slate-400">
                  Manage and understand your health information.
                </p>
              </div>

              <Link
                href="/symptoms"
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-teal-300"
              >
                <Plus size={19} />
                New Health Report
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-white/5 bg-[#111a2a] p-6"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-400">{stat.title}</p>
                      <div className="rounded-xl bg-teal-400/10 p-3">
                        <Icon className="h-5 w-5 text-teal-400" />
                      </div>
                    </div>

                    <p className="mt-5 text-3xl font-bold">{stat.value}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {stat.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-2xl border border-white/5 bg-[#111a2a] p-6 xl:col-span-2">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Health Activity
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Example visualization of your activity
                    </p>
                  </div>

                  <TrendingUp className="text-teal-400" />
                </div>

                <div className="flex h-56 items-end justify-around gap-3">
                  {[35, 55, 42, 75, 60, 88, 68, 95, 72, 82, 55, 90].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex h-full flex-1 flex-col justify-end"
                      >
                        <div
                          className="w-full rounded-t-lg bg-teal-400/70 transition hover:bg-teal-300"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    )
                  )}
                </div>

                <div className="mt-4 flex justify-between text-xs text-slate-500">
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>May</span>
                  <span>Jul</span>
                  <span>Sep</span>
                  <span>Nov</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#111a2a] p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-semibold">Quick Access</h3>
                  <ArrowUpRight className="text-slate-500" size={18} />
                </div>

                <div className="space-y-3">
                  <QuickLink
                    href="/assistant"
                    icon={<BrainCircuit size={20} />}
                    title="AI Assistant"
                    description="Explore health information"
                  />

                  <QuickLink
                    href="/symptoms"
                    icon={<HeartPulse size={20} />}
                    title="Symptom Journal"
                    description="Record your symptoms"
                  />

                  <QuickLink
                    href="/history"
                    icon={<CalendarDays size={20} />}
                    title="Health History"
                    description="Review past records"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#111a2a] p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Link
                  href="/history"
                  className="text-sm text-teal-400 hover:text-teal-300"
                >
                  View history
                </Link>
              </div>

              <div className="space-y-5">
                {activities.map((activity) => (
                  <div
                    key={activity.title}
                    className="flex items-start justify-between gap-4 border-b border-white/5 pb-5 last:border-0 last:pb-0"
                  >
                    <div className="flex gap-4">
                      <div className="rounded-xl bg-teal-400/10 p-3">
                        <Activity className="h-5 w-5 text-teal-400" />
                      </div>

                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {activity.description}
                        </p>
                      </div>
                    </div>

                    <span className="whitespace-nowrap text-xs text-slate-500">
                      {activity.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-xs leading-6 text-slate-600">
              This dashboard currently displays demonstration data only.
              MediMind AI does not provide medical diagnoses.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function QuickLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#182337] p-4 transition hover:border-teal-400/30"
    >
      <div className="rounded-lg bg-teal-400/10 p-2 text-teal-400">
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
    </Link>
  );
}

function ShieldMessage() {
  return (
    <div className="flex gap-3">
      <div className="rounded-lg bg-teal-400/10 p-2">
        <Activity className="h-5 w-5 text-teal-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-teal-300">
          Your Health Matters
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Your health information deserves responsible handling.
        </p>
      </div>
    </div>
  );
}