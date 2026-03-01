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

export function LiveFeedTicker() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    const fetchFeed = () => {
      fetch("/api/feed?limit=20")
        .then((res) => res.json())
        .then((data) => {
          if (data.feed) setFeed(data.feed);
        })
        .catch(() => {});
    };

    fetchFeed();
    const interval = setInterval(fetchFeed, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update relative times every 10s
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  if (feed.length === 0) return null;

  const duration = Math.max(15, feed.length * 2);

  const items = feed.map((item) => (
    <span key={item.id} className="inline-flex items-center shrink-0">
      <span className="font-semibold text-[var(--accent)]">
        {item.voterName}
      </span>
      <span className="text-[var(--text-secondary)] mx-1">picked</span>
      <span className="font-medium">{item.winnerName}</span>
      <span className="text-[var(--text-secondary)] mx-1">over</span>
      <span className="font-medium">{item.loserName}</span>
      <span className="text-[var(--text-tertiary)] ml-1">
        · {timeAgo(item.createdAt)}
      </span>
      {/* Gold dot divider */}
      <span className="mx-4 h-1 w-1 rounded-full bg-[var(--accent)] opacity-40 shrink-0" />
    </span>
  ));

  return (
    <div
      className="sticky top-16 z-40 h-9 glass-surface border-b border-white/[0.04] overflow-hidden"
      role="marquee"
      aria-live="off"
    >
      {/* LIVE badge with gradient fade */}
      <div className="absolute left-0 top-0 h-full z-10 flex items-center pl-4 pr-8 bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-secondary)] to-transparent">
        <span className="relative flex h-1.5 w-1.5 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
        </span>
        <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
          Live
        </span>
      </div>

      {/* Scrolling ticker content */}
      <div className="h-full flex items-center pl-24">
        <div
          className="ticker-scroll flex items-center whitespace-nowrap text-xs"
          style={{ animationDuration: `${duration}s` }}
        >
          {/* Render items twice for seamless loop */}
          {items}
          {items}
        </div>
      </div>

      {/* Right gradient fade */}
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[var(--bg-secondary)] to-transparent z-10 pointer-events-none" />
    </div>
  );
}
