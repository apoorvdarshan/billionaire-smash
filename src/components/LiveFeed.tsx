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

  return (
    <div className={`w-full ${className}`}>
      <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
        {/* Green pulsing dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        Live Feed
      </h3>
      <div className="max-h-64 overflow-y-auto space-y-0.5 scrollbar-thin">
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
  );
}
