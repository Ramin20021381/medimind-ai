"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  HeartPulse,
  LayoutDashboard,
  Pencil,
  Plus,
  Send,
  Settings,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

type SymptomEntry = {
  id: string;
  user_id: string;
  symptom: string;
  duration: string;
  severity: string;
  notes: string | null;
  created_at: string;
};

export default function SymptomsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [symptom, setSymptom] = useState("");
  const [duration, setDuration] = useState("Today");
  const [severity, setSeverity] = useState("Mild");
  const [notes, setNotes] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      router.replace("/login");
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("symptom_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError("Unable to load your symptom entries. Please try again.");
      setLoading(false);
      return;
    }

    setEntries((data ?? []) as SymptomEntry[]);
    setLoading(false);
  }, [router, supabase]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  function resetForm() {
    setSymptom("");
    setDuration("Today");
    setSeverity("Mild");
    setNotes("");
    setEditingId(null);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!symptom.trim()) {
      setError("Please describe your symptom.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setError("Your session has expired. Please log in again.");
      setSaving(false);
      return;
    }

    const entryData = {
      symptom: symptom.trim(),
      duration,
      severity,
      notes: notes.trim(),
    };

    if (editingId) {
      const { error: updateError } = await supabase
        .from("symptom_entries")
        .update(entryData)
        .eq("id", editingId)
        .eq("user_id", user.id);

      if (updateError) {
        setError("Unable to update this entry. Please try again.");
        setSaving(false);
        return;
      }

      setSuccess("Symptom entry updated successfully.");
    } else {
      const { error: insertError } = await supabase
        .from("symptom_entries")
        .insert({
          ...entryData,
          user_id: user.id,
        });

      if (insertError) {
        setError("Unable to save this entry. Please try again.");
        setSaving(false);
        return;
      }

      setSuccess("Symptom entry saved successfully.");
    }

    resetForm();
    await loadEntries();
    setSuccess(
      editingId
        ? "Symptom entry updated successfully."
        : "Symptom entry saved successfully."
    );

    setSaving(false);
  }

  function startEditing(entry: SymptomEntry) {
    setSymptom(entry.symptom);
    setDuration(entry.duration);
    setSeverity(entry.severity);
    setNotes(entry.notes ?? "");
    setEditingId(entry.id);
    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteEntry(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this symptom entry?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setError("Please log in again.");
      return;
    }

    const { error: deleteError } = await supabase
      .from("symptom_entries")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      setError("Unable to delete this entry. Please try again.");
      return;
    }

    setEntries((previous) => previous.filter((entry) => entry.id !== id));
    setSuccess("Symptom entry deleted successfully.");

    if (editingId === id) {
      resetForm();
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  function severityStyle(value: string) {
    switch (value) {
      case "Mild":
        return "border-green-400/20 bg-green-400/10 text-green-300";
      case "Moderate":
        return "border-amber-400/20 bg-amber-400/10 text-amber-300";
      case "Severe":
        return "border-red-400/20 bg-red-400/10 text-red-300";
      default:
        return "border-slate-400/20 bg-slate-400/10 text-slate-300";
    }
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
            <SidebarLink
              href="/dashboard"
              icon={<LayoutDashboard size={19} />}
              label="Dashboard"
            />
            <SidebarLink
              href="/assistant"
              icon={<Activity size={19} />}
              label="AI Assistant"
            />
            <SidebarLink
              href="/symptoms"
              icon={<HeartPulse size={19} />}
              label="Symptom Journal"
              active
            />
            <SidebarLink
              href="/history"
              icon={<ClipboardList size={19} />}
              label="Health History"
            />
          </nav>

          <div className="mt-12">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Preferences
            </p>
            <SidebarLink
              href="/settings"
              icon={<Settings size={19} />}
              label="Settings"
            />
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-white/5 bg-[#0d1524]/70 px-6 py-5 lg:px-10">
            <div>
              <p className="text-sm text-slate-400">
                Workspace / Symptom Journal
              </p>
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

              <h2 className="text-3xl font-bold">Record Your Symptoms</h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                Record and organize your health information. You can review,
                update, and delete your entries whenever you need.
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
                    This journal is for personal record-keeping. It does not
                    diagnose conditions or replace professional medical care.
                    Seek urgent medical help for severe or emergency symptoms.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-teal-400/20 bg-teal-400/5 p-4 text-sm text-teal-300">
                {success}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-7 rounded-2xl border border-white/5 bg-[#111a2a] p-6 lg:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-teal-400/10 p-3">
                    <HeartPulse className="text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {editingId ? "Edit Symptom Entry" : "Symptom Details"}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {editingId
                        ? "Update the information below."
                        : "Tell us what you have been experiencing."}
                    </p>
                  </div>
                </div>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                )}
              </div>

              <div>
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
                    Severity
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
                  Your entries are stored in your account and protected by
                  database access policies.
                </p>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-3 rounded-xl bg-teal-400 px-7 py-4 font-semibold text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={18} />
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Entry"
                      : "Save Entry"}
                </button>
              </div>
            </form>

            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-bold">Your Symptom History</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {entries.length} recorded{" "}
                    {entries.length === 1 ? "entry" : "entries"}
                  </p>
                </div>

                <button
                  onClick={loadEntries}
                  type="button"
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5"
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-white/5 bg-[#111a2a] p-10 text-center text-slate-400">
                  Loading your entries...
                </div>
              ) : entries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-[#111a2a] p-10 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-400/10">
                    <ClipboardList className="h-7 w-7 text-teal-400" />
                  </div>
                  <h4 className="text-lg font-semibold">
                    No entries yet
                  </h4>
                  <p className="mt-2 text-sm text-slate-400">
                    Your saved symptom entries will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <article
                      key={entry.id}
                      className="rounded-2xl border border-white/5 bg-[#111a2a] p-6"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="break-words text-lg font-semibold">
                              {entry.symptom}
                            </h4>

                            <span
                              className={`rounded-full border px-3 py-1 text-xs ${severityStyle(
                                entry.severity
                              )}`}
                            >
                              {entry.severity}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Clock size={14} />
                              {entry.duration}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <CalendarDays size={14} />
                              {formatDate(entry.created_at)}
                            </span>
                          </div>

                          {entry.notes && (
                            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                              {entry.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex shrink-0 items-start gap-2">
                          <button
                            onClick={() => startEditing(entry)}
                            type="button"
                            aria-label="Edit entry"
                            className="rounded-lg border border-white/10 p-2.5 text-slate-400 transition hover:border-teal-400/30 hover:text-teal-400"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => deleteEntry(entry.id)}
                            type="button"
                            aria-label="Delete entry"
                            className="rounded-lg border border-white/10 p-2.5 text-slate-400 transition hover:border-red-400/30 hover:text-red-400"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <div className="rounded-xl border border-teal-400/10 bg-teal-400/5 p-4 text-xs leading-6 text-slate-400">
              <CheckCircle2 className="mb-2 h-5 w-5 text-teal-400" />
              MediMind AI is an educational health information platform.
              Symptom records are for personal organization and should not be
              used as a substitute for professional medical assessment.
            </div>
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
  icon: ReactNode;
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