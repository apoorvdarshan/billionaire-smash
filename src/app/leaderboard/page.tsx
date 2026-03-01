"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { countryToFlag } from "@/lib/flags";
import { LiveFeed } from "@/components/LiveFeed";

interface Billionaire {
  id: number;
  name: string;
  netWorth: number;
  country: string;
  photoUrl: string;
  source: string;
  elo: number;
  wins: number;
  losses: number;
  rank: number;
}

export default function LeaderboardPage() {
  const [billionaires, setBillionaires] = useState<Billionaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 100;

  useEffect(() => {
    fetch("/api/leaderboard?limit=10000")
      .then((res) => res.json())
      .then((data) => {
        setBillionaires(data.billionaires || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = billionaires.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.country.toLowerCase().includes(q) ||
      b.source.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = search
    ? filtered
    : filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (billionaires.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-[var(--text-secondary)] text-lg">
          No data yet. Start voting to see rankings!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          <span className="text-gradient">Elo</span> Leaderboard
        </h1>
        <p className="text-[var(--text-secondary)] mt-3">
          {total} billionaires ranked by community votes
        </p>
      </div>

      <LiveFeed limit={5} className="mb-8 p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]" />

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, country, or source..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(212,168,83,0.15)] transition-all duration-300"
          />
        </div>
        {search && (
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{search}&quot;
          </p>
        )}
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-4 px-4 pb-2 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
        <div className="w-10 text-center">#</div>
        <div className="w-12" />
        <div className="flex-1">Name</div>
        <div className="flex-shrink-0 text-right w-24">Elo / Record</div>
      </div>

      <div className="space-y-2">
        {paginated.map((b, i) => {
          const globalIndex = search ? i : (page - 1) * PAGE_SIZE + i;
          const totalGames = b.wins + b.losses;
          const winRate =
            totalGames > 0 ? Math.round((b.wins / totalGames) * 100) : 0;
          const isTop3 = globalIndex < 3;

          return (
            <div
              key={b.id}
              className={`animate-fade-in flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                isTop3
                  ? "border-[var(--border-accent)] bg-gradient-to-r from-[var(--accent)]/[0.06] to-transparent hover:from-[var(--accent)]/[0.1]"
                  : "border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)]"
              }`}
              style={{ animationDelay: `${i * 30}ms`, animationFillMode: "backwards" }}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-10 text-center">
                {globalIndex === 0 ? (
                  <span className="text-2xl">&#x1f947;</span>
                ) : globalIndex === 1 ? (
                  <span className="text-2xl">&#x1f948;</span>
                ) : globalIndex === 2 ? (
                  <span className="text-2xl">&#x1f949;</span>
                ) : (
                  <span className="text-lg font-bold text-[var(--text-tertiary)]">
                    {globalIndex + 1}
                  </span>
                )}
              </div>

              {/* Photo */}
              <div className={`relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 ${
                isTop3 ? "border-[var(--accent)]/60 shadow-[0_0_12px_rgba(212,168,83,0.2)]" : "border-[var(--border)]"
              }`}>
                <Image
                  src={b.photoUrl}
                  alt={b.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                  unoptimized
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold truncate tracking-tight">{b.name}</h3>
                  <span className="flex-shrink-0 text-xs text-[var(--text-tertiary)]">
                    {countryToFlag(b.country)} {b.country}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-medium text-[var(--accent)]">
                    ${b.netWorth}B
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {b.source}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-shrink-0 text-right space-y-1.5">
                <div className="text-lg font-black text-[var(--accent)]">
                  {Math.round(b.elo)}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  {totalGames > 0 ? (
                    <div className="flex items-center gap-2 justify-end">
                      <span>{b.wins}W-{b.losses}L</span>
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-1.5 rounded-full bg-[var(--bg-card-hover)] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[var(--accent)]"
                            style={{ width: `${winRate}%` }}
                          />
                        </div>
                        <span className="text-[var(--text-tertiary)] w-8 text-right">{winRate}%</span>
                      </div>
                    </div>
                  ) : (
                    "No votes"
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!search && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-sm font-medium hover:bg-[var(--bg-card-hover)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          {(() => {
            const pages: (number | "...")[] = [];
            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              pages.push(1);
              if (page > 3) pages.push("...");
              for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
              if (page < totalPages - 2) pages.push("...");
              pages.push(totalPages);
            }
            return pages.map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="px-1 text-[var(--text-tertiary)]">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-300 ${
                    p === page
                      ? "bg-[var(--accent)] text-[var(--bg-primary)] shadow-[0_0_16px_rgba(212,168,83,0.3)]"
                      : "border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)]"
                  }`}
                >
                  {p}
                </button>
              )
            );
          })()}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-sm font-medium hover:bg-[var(--bg-card-hover)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
