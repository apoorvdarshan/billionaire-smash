"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="glass-surface border-b border-white/[0.03] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300"
        >
          <span className="text-base md:text-lg">&#x1F48E;</span>
          <span className="text-base md:text-2xl font-black tracking-[-0.04em]">
            <span className="text-gradient">BILLIONAIRE</span>
            <span className="text-[var(--text-primary)]"> SMASH</span>
          </span>
        </Link>

        <div className="flex items-center gap-0.5 rounded-full bg-[var(--bg-primary)]/60 border border-[var(--border)] p-1">
          <Link
            href="/"
            className={`px-3.5 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${
              pathname === "/"
                ? "bg-[var(--accent)] text-[var(--bg-primary)] shadow-[0_0_20px_rgba(212,168,83,0.25)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Arena
          </Link>
          <Link
            href="/leaderboard"
            className={`px-3.5 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${
              pathname === "/leaderboard"
                ? "bg-[var(--accent)] text-[var(--bg-primary)] shadow-[0_0_20px_rgba(212,168,83,0.25)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
