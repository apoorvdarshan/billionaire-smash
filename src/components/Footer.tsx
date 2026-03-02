"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function Footer() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/visitors")
      .then((res) => res.json())
      .then((data) => setVisitorCount(data.count))
      .catch(() => {});

    if (!localStorage.getItem("bsmash_visited")) {
      localStorage.setItem("bsmash_visited", "1");
      fetch("/api/visitors", { method: "POST" })
        .then((res) => res.json())
        .then((data) => setVisitorCount(data.count))
        .catch(() => {});
    }
  }, []);

  return (
    <footer className="border-t border-[var(--border)] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10 flex flex-col gap-6">
        {/* Links row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-[var(--text-tertiary)]">
          <a
            href="https://x.com/apoorvdarshan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Follow on X
          </a>

          <a
            href="mailto:apoorvdarshan@gmail.com"
            className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Contact
          </a>

          <a
            href="https://github.com/sponsors/apoorvdarshan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Sponsor
          </a>

          <a
            href="https://paypal.me/apoorvdarshan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H9.603c-.564 0-1.04.408-1.13.964L7.076 21.337zm7.342-15.6H13.1c-.283 0-.523.207-.567.487l-.467 3.05c.27-.015.54-.015.81-.015 2.077 0 3.756-.656 4.347-3.143.087-.36.1-.68.047-.96-.175-.94-1.127-1.42-2.852-1.42z" />
            </svg>
            Donate
          </a>
        </div>

        {/* Bottom row: legal + visitors */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-[var(--text-tertiary)]">
          <Link
            href="/privacy"
            className="hover:text-[var(--accent)] transition-colors duration-300"
          >
            Privacy
          </Link>
          <span className="opacity-30">|</span>
          <Link
            href="/tos"
            className="hover:text-[var(--accent)] transition-colors duration-300"
          >
            Terms
          </Link>
          {visitorCount !== null && (
            <>
              <span className="opacity-30">|</span>
              <span>{visitorCount.toLocaleString()} visitors</span>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
