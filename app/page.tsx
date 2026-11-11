import Link from "next/link";
import {
  Activity,
  BrainCircuit,
  HeartPulse,
  ShieldCheck,
  ArrowRight,
  ChartNoAxesCombined,
  Stethoscope,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Health Assistant",
    description:
      "Get clear, structured health information powered by artificial intelligence.",
  },
  {
    icon: HeartPulse,
    title: "Symptom Insights",
    description:
      "Describe your symptoms and receive general health information and guidance.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Health Dashboard",
    description:
      "Keep track of your health records and view your progress through charts.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080d18] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-xl bg-teal-400/10 p-2.5">
            <Activity className="h-6 w-6 text-teal-400" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            MediMind<span className="text-teal-400"> AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#about" className="transition hover:text-white">
            About
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-teal-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-28 pt-24 md:grid-cols-2 md:pt-32">
        <div className="absolute left-1/3 top-10 -z-0 h-80 w-80 rounded-full bg-teal-500/10 blur-[120px]" />

        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/5 px-4 py-2 text-sm text-teal-300">
            <span className="h-2 w-2 rounded-full bg-teal-400" />
            AI-powered health information platform
          </div>

          <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Understand Your Health.
            <span className="mt-2 block text-teal-400">
              Make Informed Decisions.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
            Explore health information, organize your symptoms, and understand
            your health records with an AI-powered assistant.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="group flex items-center gap-3 rounded-xl bg-teal-400 px-7 py-4 font-semibold text-slate-950 transition hover:bg-teal-300"
            >
              Explore MediMind
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-white/10 px-7 py-4 font-medium text-slate-300 transition hover:border-white/30 hover:text-white"
            >
              Discover Features
            </a>
          </div>

          <p className="mt-7 text-xs leading-6 text-slate-500">
            MediMind AI provides educational health information. It does not
            diagnose conditions or replace professional medical advice.
          </p>
        </div>

        <div className="relative z-10">
          <div className="rounded-3xl border border-white/10 bg-[#111a2a] p-6 shadow-2xl shadow-teal-950/30">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Your health overview</p>
                <h2 className="mt-1 text-xl font-semibold">Welcome to MediMind</h2>
              </div>
              <div className="rounded-xl bg-teal-400/10 p-3">
                <HeartPulse className="h-6 w-6 text-teal-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/5 bg-[#182337] p-5">
                <Activity className="mb-4 h-6 w-6 text-teal-400" />
                <p className="text-sm text-slate-400">Health Records</p>
                <p className="mt-2 text-2xl font-bold">Organized</p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#182337] p-5">
                <BrainCircuit className="mb-4 h-6 w-6 text-blue-400" />
                <p className="text-sm text-slate-400">AI Assistant</p>
                <p className="mt-2 text-2xl font-bold">Available</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/5 bg-[#182337] p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg bg-teal-400/10 p-2">
                  <Stethoscope className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <p className="font-semibold">Health Information</p>
                  <p className="text-xs text-slate-500">
                    Understand your health, one step at a time.
                  </p>
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                <div className="h-full w-3/4 rounded-full bg-teal-400" />
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Your personal health space
              </p>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-teal-400" />
              Designed with privacy and responsible AI in mind
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-white/5 bg-[#0b1220] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="font-semibold text-teal-400">WHAT WE OFFER</p>
            <h2 className="mt-4 text-3xl font-bold md:text-5xl">
              Your Health, Better Organized
            </h2>
            <p className="mt-5 leading-7 text-slate-400">
              A collection of tools designed to help you understand and
              organize your health information.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-[#111a2a] p-8 transition hover:-translate-y-1 hover:border-teal-400/30"
                >
                  <div className="mb-6 inline-flex rounded-xl bg-teal-400/10 p-3">
                    <Icon className="h-7 w-7 text-teal-400" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="leading-7 text-slate-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer
        id="about"
        className="border-t border-white/5 px-6 py-8 text-center text-sm text-slate-500"
      >
        © 2026 MediMind AI. Built for responsible health information.
      </footer>
    </main>
  );
}