import Link from "next/link";
import {
  Activity,
  BrainCircuit,
  HeartPulse,
  ShieldCheck,
  ArrowRight,
  ChartNoAxesCombined,
  Stethoscope,
  LayoutDashboard,
  ClipboardList,
  Settings,
  MessageCircle,
  Radio,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Health Assistant",
    description:
      "Get clear, structured health information powered by artificial intelligence.",
    href: "/assistant",
  },
  {
    icon: HeartPulse,
    title: "Symptom Insights",
    description:
      "Describe your symptoms and receive general health information and guidance.",
    href: "/symptoms",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Health Dashboard",
    description:
      "Keep track of your health records and view your progress through charts.",
    href: "/dashboard",
  },
];

const workspaceLinks = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Your personal health overview",
    href: "/dashboard",
  },
  {
    icon: BrainCircuit,
    title: "AI Assistant",
    description: "Ask general health questions",
    href: "/assistant",
  },
  {
    icon: HeartPulse,
    title: "Symptom Journal",
    description: "Organize your symptom information",
    href: "/symptoms",
  },
  {
    icon: ClipboardList,
    title: "Health History",
    description: "Review your health records",
    href: "/history",
  },
  {
    icon: Settings,
    title: "Settings",
    description: "Manage your account preferences",
    href: "/settings",
  },
];

function ECGAnimation() {
  const waveform =
    "M 0 55 L 55 55 L 68 55 L 78 48 L 87 65 L 101 10 L 116 94 L 130 55 L 145 55 L 200 55 L 255 55 L 268 55 L 278 48 L 287 65 L 301 10 L 316 94 L 330 55 L 345 55 L 400 55 L 455 55 L 468 55 L 478 48 L 487 65 L 501 10 L 516 94 L 530 55 L 545 55 L 600 55";

  return (
    <div className="relative mb-5 overflow-hidden rounded-3xl border border-teal-400/20 bg-[#0d1928] p-5 md:p-6">
      <style>{`
        @keyframes ecg-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-600px);
          }
        }

        @keyframes ecg-pulse {
          0%, 100% {
            opacity: 0.55;
          }
          50% {
            opacity: 1;
          }
        }

        .ecg-track {
          animation: ecg-scroll 5s linear infinite;
          will-change: transform;
        }

        .ecg-glow {
          animation: ecg-pulse 2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .ecg-track,
          .ecg-glow {
            animation: none !important;
          }
        }
      `}</style>

      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-teal-400/10 p-2.5">
            <Activity className="h-5 w-5 text-teal-400" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Heartbeat Visualization
            </p>
            <p className="mt-1 text-xs text-slate-500">
              ECG-inspired animation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/5 px-3 py-1.5">
          <span className="ecg-glow h-2 w-2 rounded-full bg-teal-400" />
          <span className="text-xs font-medium text-teal-300">
            ACTIVE
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#080f1c] px-2 py-4">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <svg
            viewBox="0 0 600 110"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            {Array.from({ length: 13 }).map((_, index) => (
              <line
                key={`vertical-${index}`}
                x1={index * 50}
                y1="0"
                x2={index * 50}
                y2="110"
                stroke="#64748b"
                strokeWidth="0.5"
              />
            ))}

            {Array.from({ length: 5 }).map((_, index) => (
              <line
                key={`horizontal-${index}`}
                x1="0"
                y1={index * 27.5}
                x2="600"
                y2={index * 27.5}
                stroke="#64748b"
                strokeWidth="0.5"
              />
            ))}
          </svg>
        </div>

        <svg
          viewBox="0 0 600 110"
          preserveAspectRatio="none"
          className="relative h-24 w-full"
          role="img"
          aria-label="Animated ECG waveform"
        >
          <defs>
            <filter id="ecg-shadow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className="ecg-track" filter="url(#ecg-shadow)">
            <path
              d={waveform}
              fill="none"
              stroke="#14b8a6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d={waveform}
              transform="translate(600 0)"
              fill="none"
              stroke="#14b8a6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <Radio className="h-3.5 w-3.5 text-teal-400" />
        <span>Heartbeat Monitor</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080d18] text-white">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="rounded-xl bg-teal-400/10 p-2.5">
            <Activity className="h-6 w-6 text-teal-400" />
          </div>

          <span className="text-xl font-bold tracking-tight">
            MediMind<span className="text-teal-400"> AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-slate-400 lg:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>

          <a href="#workspace" className="transition hover:text-white">
            Workspace
          </a>

          <Link href="/about" className="transition hover:text-white">
            About
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:text-white sm:px-4"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-teal-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-teal-300 sm:px-5"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
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
              Get Started
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/assistant"
              className="flex items-center gap-3 rounded-xl border border-white/10 px-7 py-4 font-medium text-slate-300 transition hover:border-teal-400/40 hover:text-white"
            >
              <MessageCircle className="h-5 w-5 text-teal-400" />
              Try AI Assistant
            </Link>
          </div>

          <p className="mt-7 text-xs leading-6 text-slate-500">
            MediMind AI provides educational health information. It does not
            diagnose conditions or replace professional medical advice.
          </p>
        </div>

        {/* Right Side */}
        <div className="relative z-10">
          <ECGAnimation />

          {/* Preview Card */}
          <div className="rounded-3xl border border-white/10 bg-[#111a2a] p-6 shadow-2xl shadow-teal-950/30">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Your health overview
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Welcome to MediMind
                </h2>
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

      {/* Workspace Quick Access */}
      <section
        id="workspace"
        className="border-y border-white/5 bg-[#0b1220] px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <p className="font-semibold text-teal-400">
              YOUR WORKSPACE
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-5xl">
              Explore MediMind Workspace
            </h2>

            <p className="mt-5 max-w-2xl leading-7 text-slate-400">
              Access the different areas of MediMind AI directly from here.
              Choose a section to explore its available features.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {workspaceLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-white/10 bg-[#111a2a] p-6 transition hover:-translate-y-1 hover:border-teal-400/40 hover:bg-[#142033]"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="rounded-xl bg-teal-400/10 p-3">
                      <Icon className="h-6 w-6 text-teal-400" />
                    </div>

                    <ArrowRight className="h-5 w-5 text-slate-600 transition group-hover:translate-x-1 group-hover:text-teal-400" />
                  </div>

                  <h3 className="text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="font-semibold text-teal-400">
              WHAT WE OFFER
            </p>

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
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group rounded-2xl border border-white/10 bg-[#111a2a] p-8 transition hover:-translate-y-1 hover:border-teal-400/30"
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

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-teal-400">
                    Explore feature
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-slate-500">
        © 2026 MediMind AI. Built for responsible health information.
      </footer>
    </main>
  );
}