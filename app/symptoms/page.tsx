"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  HeartPulse,
  LayoutDashboard,
  MessageSquare,
  Send,
  Settings,
  ShieldAlert,
  X,
} from "lucide-react";

export default function SymptomsPage() {
  const [symptom, setSymptom] = useState("");
  const [duration, setDuration] = useState("Today");
  const [severity, setSeverity] = useState("Mild");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!symptom.trim()) return;

    setSubmitted(true);
  }

  function resetForm() {
    setSymptom("");
    setDuration("Today");
    setSeverity("Mild");
    setNotes("");
    setSubmitted(false);
  }

  return (
    <main className="min-h-screen bg-[#080d18] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/5 bg-[#0d1524] p-6 lg:block">
          <Link href="/" className="mb-12 flex items-center gap-3">
            <div className="rounded-xl bg-teal-400/10 p-2">
              <Activity className="h-6 w-6 text-teal-400" />
            </div>
            <span className="text-xl font-bold">
              MediMind <span className="text-teal-400">AI</span>
            </span>
          </Link>

          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Workspace
          </p>

          <nav className="space-y-2">
            <SidebarLink href="/dashboard" icon={<LayoutDashboard size={19} />} label="Dashboard" />
            <SidebarLink href="/assistant" icon={<Activity size={19} />} label="AI Assistant" />
            <SidebarLink
              href="/symptoms"
              icon={<HeartPulse size={19} />}
              label="Symptom Journal"
              active
            />
            <SidebarLink href="/history" icon={<ClipboardList size={19} />} label="Health History" />
          </nav>

          <div className="mt-12">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Preferences
            </p>
            <SidebarLink href="/settings" icon={<Settings size={19} />} label="Settings" />
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-white/5 bg-[#0d1524]/70 px-6 py-5 lg:px-10">
            <div>
              <p className="text-sm text-slate-400">Workspace / Symptom Journal</p>
              <h1 className="mt-1 text-xl font-bold">Symptom Journal</h1>
            </div>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={17} />
              Dashboard
            </Link>
          </header>

          <div className="mx-auto max-w-5xl space-y-8 p-6 lg:p-10">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/5 px-3 py-1.5 text-xs text-teal-300">
                <HeartPulse size={14} />
                Personal Health Journal
              </div>

              <h2 className="text-3xl font-bold">
                Record Your Symptoms
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                Describe what you are experiencing. Keeping an organized
                record can help you communicate more clearly with a
                healthcare professional.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
              <div className="flex gap-3">
                <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-400" />
                <div>
                  <h3 className="font-semibold text-amber-300">
                    Important Health Notice
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    This journal is not an emergency service or a diagnostic
                    tool. If you are experiencing severe symptoms, such as
                    difficulty breathing, severe chest pain, or sudden
                    confusion, seek emergency medical help immediately.
                  </p>
                </div>
              </div>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-teal-400/20 bg-[#111a2a] p-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-teal-400/10">
                  <CheckCircle2 className="h-8 w-8 text-teal-400" />
                </div>

                <h3 className="text-2xl font-bold">
                  Entry Created Successfully
                </h3>

                <p className="mt-3 text-slate-400">
                  Your symptom entry is currently displayed as a local
                  preview. It has not been saved to a database.
                </p>

                <div className="mt-8 space-y-4 rounded-xl border border-white/5 bg-[#182337] p-5">
                  <div>
                    <p className="text-xs text-slate-500">Symptom</p>
                    <p className="mt-1 font-medium">{symptom}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Duration</p>
                      <p className="mt-1">{duration}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Severity</p>
                      <p className="mt-1">{severity}</p>
                    </div>
                  </div>

                  {notes && (
                    <div>
                      <p className="text-xs text-slate-500">Additional Notes</p>
                      <p className="mt-1 whitespace-pre-wrap">{notes}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={resetForm}
                  className="mt-7 rounded-xl bg-teal-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-teal-300"
                >
                  Create Another Entry
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-7 rounded-2xl border border-white/5 bg-[#111a2a] p-6 lg:p-8"
              >
                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-teal-400/10 p-3">
                      <HeartPulse className="text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Symptom Details
                      </h3>
                      <p className="text-sm text-slate-500">
                        Tell us what you have been experiencing.
                      </p>
                    </div>
                  </div>

                  <label className="mb-2 block text-sm font-medium">
                    Describe your symptom
                  </label>

                  <textarea
                    value={symptom}
                    onChange={(e) => setSymptom(e.target.value)}
                    placeholder="For example: I have been experiencing occasional headaches..."
                    required
                    rows={4}
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#182337] px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-teal-400/50"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-3 flex items-center gap-2 text-sm font-medium">
                      <Clock size={16} className="text-teal-400" />
                      How long have you experienced this?
                    </label>

                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#182337] px-4 py-4 text-sm text-white outline-none focus:border-teal-400/50"
                    >
                      <option>Today</option>
                      <option>2-3 days</option>
                      <option>About a week</option>
                      <option>Several weeks</option>
                      <option>Several months</option>
                      <option>Not sure</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-3 flex items-center gap-2 text-sm font-medium">
                      <Activity size={16} className="text-teal-400" />
                      How would you describe it?
                    </label>

                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#182337] px-4 py-4 text-sm text-white outline-none focus:border-teal-400/50"
                    >
                      <option>Mild</option>
                      <option>Moderate</option>
                      <option>Severe</option>
                      <option>Not sure</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <CalendarDays size={16} className="text-teal-400" />
                    Additional Information
                  </label>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="When does it happen? Is there anything else you would like to record?"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#182337] px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-teal-400/50"
                  />
                </div>

                <div className="flex flex-col justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center">
                  <p className="max-w-md text-xs leading-5 text-slate-500">
                    This information is for personal record-keeping only.
                    It does not establish a diagnosis.
                  </p>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-3 rounded-xl bg-teal-400 px-7 py-4 font-semibold text-slate-950 transition hover:bg-teal-300"
                  >
                    <Send size={18} />
                    Review Entry
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
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