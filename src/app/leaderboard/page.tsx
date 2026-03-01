"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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

  useEffect(() => {
    fetch("/api/leaderboard?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setBillionaires(data.billionaires || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
          No data yet. Sync billionaires and start voting!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-black">
          <span className="text-[var(--accent)]">Elo</span> Leaderboard
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">
          {total} billionaires ranked by community votes
        </p>
      </div>

      <div className="space-y-2">
        {billionaires.map((b, i) => {
          const totalGames = b.wins + b.losses;
          const winRate =
            totalGames > 0 ? Math.round((b.wins / totalGames) * 100) : 0;

          return (
            <div
              key={b.id}
              className={`animate-fade-in flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-colors ${
                i < 3 ? "border-[var(--accent)]/30" : ""
              }`}
              style={{ animationDelay: `${i * 30}ms`, animationFillMode: "backwards" }}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-10 text-center">
                {i === 0 ? (
                  <span className="text-2xl">&#x1f947;</span>
                ) : i === 1 ? (
                  <span className="text-2xl">&#x1f948;</span>
                ) : i === 2 ? (
                  <span className="text-2xl">&#x1f949;</span>
                ) : (
                  <span className="text-lg font-bold text-[var(--text-secondary)]">
                    {i + 1}
                  </span>
                )}
              </div>

              {/* Photo */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-[var(--border)]">
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
                  <h3 className="font-bold truncate">{b.name}</h3>
                  <span className="flex-shrink-0 text-xs text-[var(--text-secondary)]">
                    {b.country}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-medium text-[var(--accent)]">
                    ${b.netWorth}B
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {b.source}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-shrink-0 text-right space-y-1">
                <div className="text-lg font-black text-[var(--accent)]">
                  {Math.round(b.elo)}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  {totalGames > 0 ? (
                    <>
                      {b.wins}W-{b.losses}L ({winRate}%)
                    </>
                  ) : (
                    "No votes"
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
