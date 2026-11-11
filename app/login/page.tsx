"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Activity, ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070B14] px-4 py-12 text-white">
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-10 flex items-center justify-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-400/10 text-teal-400">
            <Activity size={25} />
          </div>

          <span className="text-2xl font-bold tracking-tight">
            MediMind <span className="text-teal-400">AI</span>
          </span>
        </Link>

        <div className="rounded-3xl border border-white/10 bg-[#101827]/90 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
          <div className="mb-8">
            <p className="mb-3 text-sm font-medium text-teal-400">
              WELCOME BACK
            </p>

            <h1 className="text-3xl font-bold">Welcome back</h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Sign in to your MediMind AI account to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-[#0B1220] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-teal-400"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm text-slate-300">
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-teal-400 transition hover:text-teal-300"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-white/10 bg-[#0B1220] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-teal-400"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-400 py-3.5 font-semibold text-[#07111A] transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-teal-400 transition hover:text-teal-300"
            >
              Create account
            </Link>
          </p>
        </div>

        <p className="mt-7 text-center text-xs text-slate-500">
          Your health information deserves privacy and care.
        </p>
      </div>
    </main>
  );
}