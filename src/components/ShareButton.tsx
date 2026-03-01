"use client";

import { useState } from "react";

interface ShareButtonProps {
  winnerName: string;
  loserName: string;
}

export function ShareButton({ winnerName, loserName }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `I picked ${winnerName} over ${loserName} on Billionaire Smash!`;
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${siteUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API not available
    }
  };

  const handleShareX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] p-1 animate-fade-in">
      <button
        onClick={handleCopy}
        className="px-3 py-1.5 rounded-full text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-all duration-300"
      >
        {copied ? (
          <span className="inline-flex items-center gap-1">
            <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </span>
        ) : (
          "Copy Link"
        )}
      </button>
      <button
        onClick={handleShareX}
        className="px-3 py-1.5 rounded-full text-xs font-bold bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-bright)] hover:shadow-[0_0_16px_rgba(212,168,83,0.3)] transition-all duration-300"
      >
        Share on X
      </button>
    </div>
  );
}
