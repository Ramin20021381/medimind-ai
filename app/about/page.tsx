"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Code2,
  Brain,
  Globe,
  GraduationCap,
  ExternalLink,
  GitBranch,
} from "lucide-react";

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "Node.js",
  "Supabase",
  "Tailwind CSS",
];

const interests = [
  {
    title: "Artificial Intelligence",
    description:
      "Exploring AI technologies and building intelligent applications.",
    icon: Brain,
  },
  {
    title: "Web Development",
    description:
      "Creating modern, responsive, and user-friendly web applications.",
    icon: Globe,
  },
  {
    title: "Software Engineering",
    description:
      "Learning software architecture and developing practical solutions.",
    icon: Code2,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#080f1d] px-5 py-12 text-white">
      <div className="mx-auto max-w-5xl">

        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-teal-400"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* Page Header */}
        <section className="mb-16 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10">
            <Brain size={32} className="text-teal-400" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            About <span className="text-teal-400">MediMind AI</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-slate-400">
            An educational health information platform designed to make
            health knowledge easier to understand through artificial
            intelligence.
          </p>
        </section>

        {/* About Project */}
        <section className="mb-10 rounded-2xl border border-white/10 bg-[#111a2a] p-7 md:p-9">
          <h2 className="mb-4 text-2xl font-bold">
            About the Project
          </h2>

          <p className="leading-8 text-slate-400">
            MediMind AI is a personal software project focused on
            educational health information. It uses artificial intelligence
            to help users understand general health topics, medical
            terminology, and health-related information in a simple and
            accessible way.
          </p>

          <p className="mt-4 leading-8 text-slate-400">
            The platform is designed for educational purposes only.
            It does not provide medical diagnoses or replace professional
            medical advice.
          </p>
        </section>

        {/* Developer Section */}
        <section className="mb-10 rounded-2xl border border-teal-400/20 bg-gradient-to-br from-[#111a2a] to-[#0d1928] p-7 md:p-9">
          <div className="mb-7 flex items-center gap-3">
            <GraduationCap size={25} className="text-teal-400" />

            <h2 className="text-2xl font-bold">
              About the Developer
            </h2>
          </div>

          <h3 className="text-3xl font-bold">
            Ramin Motamed
          </h3>

          <p className="mt-2 text-teal-400">
            Software Engineering Student & Developer
          </p>

          <p className="mt-5 max-w-3xl leading-8 text-slate-400">
            I am a Software Engineering student with a strong interest
            in software development, artificial intelligence, and modern
            web technologies.
            <br />
            <br />
            I enjoy learning new technologies and turning ideas into
            practical applications. MediMind AI is one of my projects,
            created to explore the possibilities of AI-powered
            applications while improving my software engineering skills.
          </p>
        </section>

        {/* Technical Interests */}
        <section className="mb-10">
          <h2 className="mb-6 text-2xl font-bold">
            Technical Interests
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {interests.map((interest) => {
              const Icon = interest.icon;

              return (
                <div
                  key={interest.title}
                  className="rounded-2xl border border-white/10 bg-[#111a2a] p-6 transition hover:border-teal-400/30"
                >
                  <Icon
                    size={27}
                    className="mb-5 text-teal-400"
                  />

                  <h3 className="mb-3 font-semibold">
                    {interest.title}
                  </h3>

                  <p className="text-sm leading-7 text-slate-400">
                    {interest.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-10 rounded-2xl border border-white/10 bg-[#111a2a] p-7 md:p-9">
          <h2 className="mb-6 text-2xl font-bold">
            Technologies & Skills
          </h2>

          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-xl border border-teal-400/20 bg-teal-400/5 px-4 py-2 text-sm text-teal-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-2xl border border-teal-400/20 bg-[#111a2a] p-8 text-center md:p-12">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-teal-400/10">
            <Mail size={27} className="text-teal-400" />
          </div>

          <h2 className="text-3xl font-bold">
            Let's Connect
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
            Have a question, an idea, or an opportunity to collaborate?
            Feel free to get in touch.
          </p>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=dipper.mort2002@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-teal-500 px-7 py-4 font-semibold text-[#08111f] transition hover:bg-teal-400"
            >
            <Mail size={19} />
            Contact Me
            <ExternalLink size={16} />
          </a>

          <div className="mt-6">
            <a
              href="https://github.com/Ramin20021381"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-teal-400"
            >
              <GitBranch size={18} />
              GitHub Profile
            </a>
          </div>
        </section>

        <footer className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-slate-600">
          © 2026 MediMind AI. Built by Ramin Motamed.
        </footer>

      </div>
    </main>
  );
}