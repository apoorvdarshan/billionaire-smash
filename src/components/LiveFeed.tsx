"use client";

import { useState, useEffect } from "react";

interface FeedItem {
  id: number;
  voterName: string;
  winnerName: string;
  loserName: string;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface LiveFeedProps {
  limit?: number;
  className?: string;
}

export function LiveFeed({ limit = 20, className = "" }: LiveFeedProps) {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    const fetchFeed = () => {
      fetch(`/api/feed?limit=${limit}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.feed) setFeed(data.feed);
        })
        .catch(() => {});
    };

    fetchFeed();
    const interval = setInterval(fetchFeed, 5000);
    return () => clearInterval(interval);
  }, [limit]);

  // Update relative times every 10s
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  if (feed.length === 0) return null;

  const duration = Math.max(30, feed.length * 4);

  const tickerItems = feed.map((item) => (
    <span key={item.id} className="inline-flex items-center shrink-0">
      <span className="font-semibold text-[var(--accent)]">
        {item.voterName}
      </span>
      <span className="text-[var(--text-secondary)] mx-1">picked</span>
      <span className="font-medium">{item.winnerName}</span>
      <span className="text-[var(--text-secondary)] mx-1">over</span>
      <span className="font-medium">{item.loserName}</span>
      <span className="text-[var(--text-tertiary)] ml-1 text-[10px]">
        {timeAgo(item.createdAt)}
      </span>
      <span className="text-[var(--border)] mx-4">|</span>
    </span>
  ));

  return (
    <>
      {/* Mobile: horizontal scrolling ticker */}
      <div className="lg:hidden w-full h-9 overflow-hidden relative" role="marquee" aria-live="off">
        <div className="absolute left-0 top-0 h-full z-10 flex items-center pl-3 pr-6 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)] to-transparent">
          <span className="relative flex h-1.5 w-1.5 mr-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
          </span>
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
            Live
          </span>
        </div>
        <div className="h-full flex items-center pl-20">
          <div
            className="ticker-scroll flex items-center whitespace-nowrap text-xs"
            style={{ animationDuration: `${duration}s` }}
          >
            {tickerItems}
            {tickerItems}
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10" />
      </div>

      {/* Desktop: vertical sidebar list */}
      <div className={`hidden lg:block w-full ${className}`}>
        <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          Live Feed
        </h3>
        <div className="max-h-[70vh] overflow-y-auto space-y-0.5 scrollbar-thin">
          {feed.map((item) => (
            <div
              key={item.id}
              className="text-sm py-2 px-3 rounded-lg border-l-2 border-transparent hover:border-[var(--accent)] hover:bg-[var(--bg-card)] transition-all duration-200"
            >
              <span className="font-semibold text-[var(--accent)]">
                {item.voterName}
              </span>{" "}
              <span className="text-[var(--text-secondary)]">picked</span>{" "}
              <span className="font-medium">{item.winnerName}</span>{" "}
              <span className="text-[var(--text-secondary)]">over</span>{" "}
              <span className="font-medium">{item.loserName}</span>{" "}
              <span className="text-xs text-[var(--text-tertiary)]">
                · {timeAgo(item.createdAt)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
