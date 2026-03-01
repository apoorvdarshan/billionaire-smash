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
    <div className="flex items-center gap-2 animate-fade-in">
      <button
        onClick={handleCopy}
        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-colors"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
      <button
        onClick={handleShareX}
        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-dim)] transition-colors"
      >
        Share on X
      </button>
    </div>
  );
}
