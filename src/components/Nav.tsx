"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight">
            <span className="text-[var(--accent)]">BILLIONAIRE</span>
            <span className="text-[var(--text-primary)]"> SMASH</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/"
                ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
            }`}
          >
            Arena
          </Link>
          <Link
            href="/leaderboard"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/leaderboard"
                ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
            }`}
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
