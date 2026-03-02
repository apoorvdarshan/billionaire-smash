"use client";

import { useState } from "react";

interface ShareButtonProps {
  winnerName: string;
  loserName: string;
}

export function ShareButton({ winnerName, loserName }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `💰 I picked ${winnerName} over ${loserName} on bsmash! 💎\n\n🛠️ Made by @apoorvdarshan\n\n🔥 Play now: https://bsmash.app`;
  const siteUrl = "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API not available
    }
  };

  const handleShareX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)] p-0.5 animate-fade-in">
      <button
        onClick={handleCopy}
        className="px-2.5 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] transition-all duration-300"
      >
        {copied ? (
          <span className="inline-flex items-center gap-1">
            <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </span>
        ) : (
          "Copy"
        )}
      </button>
      <button
        onClick={handleShareX}
        className="px-2.5 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-bright)] hover:shadow-[0_0_16px_rgba(212,168,83,0.2)] transition-all duration-300"
      >
        Share on X
      </button>
    </div>
  );
}
