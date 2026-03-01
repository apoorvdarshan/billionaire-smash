"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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

export function LiveFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [, setTick] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const fetchFeed = () => {
      fetch("/api/feed?limit=8")
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

  // rAF-driven scroll
  useEffect(() => {
    let rafId: number;
    const step = () => {
      const el = scrollRef.current;
      if (el && !pausedRef.current) {
        const halfWidth = el.scrollWidth / 2;
        posRef.current -= 0.5;
        if (halfWidth > 0 && Math.abs(posRef.current) >= halfWidth) {
          posRef.current += halfWidth;
        }
        el.style.transform = `translateX(${posRef.current}px)`;
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const onMouseEnter = useCallback(() => {
    pausedRef.current = true;
  }, []);
  const onMouseLeave = useCallback(() => {
    pausedRef.current = false;
  }, []);

  if (feed.length === 0) return null;

  const tickerItems = feed.slice(0, 8).map((item) => (
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
    <div
      className="w-full h-9 overflow-hidden relative"
      role="marquee"
      aria-live="off"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
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
          ref={scrollRef}
          className="flex items-center whitespace-nowrap text-xs will-change-transform"
        >
          {tickerItems}
          {tickerItems}
        </div>
      </div>
      <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10" />
    </div>
  );
}
