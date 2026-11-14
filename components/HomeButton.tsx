"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";

export default function HomeButton() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <Link
      href="/"
      aria-label="Go to homepage"
      title="Go to Homepage"
      className="fixed bottom-6 left-6 z-[100] flex items-center gap-2 rounded-xl border border-teal-400/20 bg-[#111a2a] px-4 py-3 text-sm font-semibold text-teal-400 shadow-xl shadow-black/30 transition hover:border-teal-400/50 hover:bg-[#182337] hover:text-teal-300"
    >
      <Home size={18} />
      <span>Home</span>
    </Link>
  );
}