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
      <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
        Live Feed
      </h3>
      <div className="max-h-64 overflow-y-auto space-y-1 scrollbar-thin">
        {feed.map((item) => (
          <div
            key={item.id}
            className="text-sm py-1.5 px-3 rounded-lg hover:bg-[var(--bg-card)] transition-colors"
          >
            <span className="font-semibold text-[var(--accent)]">
              {item.voterName}
            </span>{" "}
            <span className="text-[var(--text-secondary)]">picked</span>{" "}
            <span className="font-medium">{item.winnerName}</span>{" "}
            <span className="text-[var(--text-secondary)]">over</span>{" "}
            <span className="font-medium">{item.loserName}</span>{" "}
            <span className="text-xs text-[var(--text-secondary)]">
              · {timeAgo(item.createdAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
