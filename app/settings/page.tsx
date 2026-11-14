"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Save,
  Loader2,
  Settings as SettingsIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email ?? "");
      setLoading(false);
    }

    loadUser();
  }, [router]);

  async function handlePasswordChange(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Your password has been updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    }

    setSaving(false);
  }

  async function handleSignOut() {
    setSigningOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      setSigningOut(false);
      return;
    }

    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080f1d] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080f1d] px-5 py-10 text-white">
      <div className="mx-auto max-w-4xl">

        <button
          onClick={() => router.push("/dashboard")}
          className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-teal-400"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl border border-teal-400/20 bg-teal-400/10 p-3">
              <SettingsIcon className="text-teal-400" size={25} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage your account and security preferences.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-xl border border-teal-500/20 bg-teal-500/10 p-4 text-sm text-teal-400">
            {message}
          </div>
        )}

        <div className="space-y-6">

          <section className="rounded-2xl border border-white/10 bg-[#111a2a] p-6">
            <div className="mb-6 flex items-center gap-3">
              <User className="text-teal-400" size={21} />

              <div>
                <h2 className="font-semibold">Account Information</h2>
                <p className="text-sm text-slate-400">
                  Your registered account details.
                </p>
              </div>
            </div>

            <label className="mb-2 block text-sm text-slate-400">
              Email Address
            </label>

            <div className="rounded-xl border border-white/10 bg-[#080f1d] px-4 py-3 text-sm text-slate-300">
              {email}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              This is the email address associated with your account.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#111a2a] p-6">
            <div className="mb-6 flex items-center gap-3">
              <Lock className="text-teal-400" size={21} />

              <div>
                <h2 className="font-semibold">Change Password</h2>
                <p className="text-sm text-slate-400">
                  Update your account password.
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-white/10 bg-[#080f1d] px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-teal-400/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-white/10 bg-[#080f1d] px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-teal-400/50"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-[#08111f] transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Save size={17} />
                )}

                {saving ? "Updating..." : "Update Password"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#111a2a] p-6">
            <div className="mb-5 flex items-center gap-3">
              <ShieldCheck className="text-teal-400" size={21} />

              <div>
                <h2 className="font-semibold">Security</h2>
                <p className="text-sm text-slate-400">
                  Your account security information.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#080f1d] p-4">
              <div>
                <p className="text-sm font-medium">Authentication</p>
                <p className="mt-1 text-xs text-slate-500">
                  Your account is currently signed in.
                </p>
              </div>

              <span className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium text-teal-400">
                Active
              </span>
            </div>
          </section>

          <section className="rounded-2xl border border-red-500/20 bg-[#111a2a] p-6">
            <div className="mb-5 flex items-center gap-3">
              <LogOut className="text-red-400" size={21} />

              <div>
                <h2 className="font-semibold">Sign Out</h2>
                <p className="text-sm text-slate-400">
                  Sign out of your MediMind AI account.
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
            >
              {signingOut ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <LogOut size={17} />
              )}

              {signingOut ? "Signing Out..." : "Sign Out"}
            </button>
          </section>

        </div>

        <p className="mt-10 text-center text-xs text-slate-600">
          MediMind AI · Account Settings
        </p>

      </div>
    </main>
  );
}
