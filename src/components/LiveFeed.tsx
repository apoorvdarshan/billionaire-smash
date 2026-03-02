"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface VoteFeedItem {
  id: string;
  type: "vote";
  voterName: string;
  winnerName: string;
  loserName: string;
  createdAt: string;
}

interface BoostFeedItem {
  id: string;
  type: "boost";
  boosterName: string;
  billionaireName: string;
  eloAmount: number;
  createdAt: string;
}

type FeedItem = VoteFeedItem | BoostFeedItem;

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
  const pendingFeedRef = useRef<FeedItem[] | null>(null);
  const hasInitialFeed = useRef(false);
  const fetchedThisCycleRef = useRef(false);
  const lastFetchTimeRef = useRef(0);

  const fetchFeed = useCallback(() => {
    lastFetchTimeRef.current = Date.now();
    fetch("/api/feed?limit=8")
      .then((res) => res.json())
      .then((data) => {
        if (data.feed) {
          if (!hasInitialFeed.current) {
            hasInitialFeed.current = true;
            setFeed(data.feed);
          } else {
            pendingFeedRef.current = data.feed;
          }
        }
      })
      .catch(() => {});
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Update relative times every 10s
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  // rAF-driven scroll with scroll-driven fetching
  useEffect(() => {
    let rafId: number;
    const step = () => {
      const el = scrollRef.current;
      if (el) {
        if (!pausedRef.current) {
          const halfWidth = el.scrollWidth / 2;
          posRef.current -= 0.5;

          if (halfWidth > 0) {
            const progress = Math.abs(posRef.current) / halfWidth;

            // Trigger fetch at ~80% of scroll cycle
            if (progress >= 0.8 && !fetchedThisCycleRef.current) {
              fetchedThisCycleRef.current = true;
              fetchFeed();
            }

            // Wrap point: swap in buffered data and reset cycle flag
            if (Math.abs(posRef.current) >= halfWidth) {
              posRef.current += halfWidth;
              fetchedThisCycleRef.current = false;
              if (pendingFeedRef.current) {
                setFeed(pendingFeedRef.current);
                pendingFeedRef.current = null;
              }
            }
          }

          el.style.transform = `translateX(${posRef.current}px)`;
        } else {
          // Paused (hover): fallback fetch every 15s so data doesn't go stale
          if (Date.now() - lastFetchTimeRef.current > 15000) {
            lastFetchTimeRef.current = Date.now();
            fetch("/api/feed?limit=8")
              .then((res) => res.json())
              .then((data) => {
                if (data.feed) {
                  setFeed(data.feed);
                  pendingFeedRef.current = null;
                }
              })
              .catch(() => {});
          }
        }
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [fetchFeed]);

  const onMouseEnter = useCallback(() => {
    pausedRef.current = true;
  }, []);
  const onMouseLeave = useCallback(() => {
    pausedRef.current = false;
  }, []);

  if (feed.length === 0) return null;

  const tickerItems = feed.slice(0, 8).map((item) => (
    <span key={item.id} className="inline-flex items-center shrink-0">
      {item.type === "boost" ? (
        <>
          <span className="font-semibold text-[var(--accent)]">
            {item.boosterName || "Someone"}
          </span>
          <span className="text-[var(--text-tertiary)] mx-1.5">boosted</span>
          <span className="font-medium text-[var(--text-primary)]">
            {item.billionaireName}
          </span>
          <span className="font-bold text-green-400 ml-1.5">
            +{Math.round(item.eloAmount)} Elo
          </span>
        </>
      ) : (
        <>
          <span className="font-semibold text-[var(--accent)]">
            {item.voterName}
          </span>
          <span className="text-[var(--text-tertiary)] mx-1.5">picked</span>
          <span className="font-medium text-[var(--text-primary)]">
            {item.winnerName}
          </span>
          <span className="text-[var(--text-tertiary)] mx-1.5">over</span>
          <span className="font-medium text-[var(--text-primary)]">
            {item.loserName}
          </span>
        </>
      )}
      <span className="text-[var(--text-tertiary)] ml-1.5 text-[10px]">
        {timeAgo(item.createdAt)}
      </span>
      <span className="text-[var(--accent)] mx-5 text-[6px] opacity-40">
        &#x25C6;
      </span>
    </span>
  ));

  return (
    <div
      className="w-full h-8 overflow-hidden relative border-b border-[var(--border)]"
      role="marquee"
      aria-live="off"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="absolute left-0 top-0 h-full z-10 flex items-center pl-3 pr-8 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)] to-transparent">
        <span className="relative flex h-1.5 w-1.5 mr-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
        <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
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
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10" />
    </div>
  );
}
