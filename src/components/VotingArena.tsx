"use client";

import { useState, useEffect, useCallback } from "react";
import { BillionaireCard } from "./BillionaireCard";
import { NamePrompt } from "./NamePrompt";
import { ShareButton } from "./ShareButton";
import { LiveFeed } from "./LiveFeed";
import { usePlayerName } from "@/hooks/usePlayerName";

interface Billionaire {
  id: number;
  name: string;
  netWorth: number;
  country: string;
  photoUrl: string;
  source: string;
  elo: number;
}

type VoteResult = { winnerId: number; loserId: number } | null;

interface LastVote {
  winnerName: string;
  loserName: string;
}

export function VotingArena() {
  const { name: playerName, saveName } = usePlayerName();
  const [pair, setPair] = useState<[Billionaire, Billionaire] | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voteResult, setVoteResult] = useState<VoteResult>(null);
  const [animKey, setAnimKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [lastVote, setLastVote] = useState<LastVote | null>(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingVote, setPendingVote] = useState<{ winnerId: number; loserId: number } | null>(null);

  const fetchPair = useCallback(async () => {
    setLoading(true);
    setVoteResult(null);
    try {
      const res = await fetch("/api/pair");
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setPair(null);
      } else {
        setPair(data.pair);
        setError(null);
        setAnimKey((k) => k + 1);
      }
    } catch {
      setError("Failed to load billionaires");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPair();
  }, [fetchPair]);

  const submitVote = useCallback(async (winnerId: number, loserId: number, voterName: string) => {
    if (!pair) return;
    setVoting(true);
    setVoteResult({ winnerId, loserId });

    const winnerName =
      pair[0].id === winnerId ? pair[0].name : pair[1].name;
    const loserName =
      pair[0].id === loserId ? pair[0].name : pair[1].name;

    try {
      await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winnerId, loserId, voterName }),
      });
      setTotalVotes((v) => v + 1);
      setLastVote({ winnerName, loserName });
    } catch {
      // vote failed but still move on
    }

    setTimeout(() => {
      setVoting(false);
      fetchPair();
    }, 1000);
  }, [pair, fetchPair]);

  const handleVote = (winnerId: number, loserId: number) => {
    if (voting || !pair) return;
    if (!playerName) {
      setPendingVote({ winnerId, loserId });
      setShowNamePrompt(true);
      return;
    }
    submitVote(winnerId, loserId, playerName);
  };

  const handleNameSubmit = (name: string) => {
    saveName(name);
    setShowNamePrompt(false);
    if (pendingVote) {
      submitVote(pendingVote.winnerId, pendingVote.loserId, name);
      setPendingVote(null);
    }
  };

  const handleSkip = () => {
    if (voting) return;
    setLastVote(null);
    fetchPair();
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setError(null);
        fetchPair();
      }
    } catch {
      setError("Failed to sync data");
    } finally {
      setSyncing(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <p className="text-[var(--text-secondary)] text-lg">{error}</p>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="px-6 py-3 rounded-xl font-bold bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-dim)] transition-colors disabled:opacity-50"
        >
          {syncing ? "Syncing Forbes Data..." : "Sync Billionaires from Forbes"}
        </button>
      </div>
    );
  }

  if (loading && !pair) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)]">Loading billionaires...</p>
        </div>
      </div>
    );
  }

  if (!pair) return null;

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4">
      {showNamePrompt && <NamePrompt onSubmit={handleNameSubmit} />}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-black">
          Who&apos;s more{" "}
          <span className="text-[var(--accent)]">smash</span>-worthy?
        </h1>
        <p className="text-[var(--text-secondary)]">
          Click the billionaire you prefer
        </p>
        {totalVotes > 0 && (
          <p className="text-xs text-[var(--text-secondary)]">
            {totalVotes} vote{totalVotes !== 1 ? "s" : ""} this session
          </p>
        )}
      </div>

      <div
        key={animKey}
        className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 w-full max-w-4xl"
      >
        <div className="animate-slide-left flex-1 flex justify-center max-w-sm w-full">
          <BillionaireCard
            billionaire={pair[0]}
            onClick={() => handleVote(pair[0].id, pair[1].id)}
            animationClass=""
            resultClass={
              voteResult
                ? voteResult.winnerId === pair[0].id
                  ? "winner-glow"
                  : "loser-dim"
                : ""
            }
            disabled={voting}
          />
        </div>

        <div className="animate-fade-in flex-shrink-0">
          <div className="vs-badge w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-xl">
            VS
          </div>
        </div>

        <div className="animate-slide-right flex-1 flex justify-center max-w-sm w-full">
          <BillionaireCard
            billionaire={pair[1]}
            onClick={() => handleVote(pair[1].id, pair[0].id)}
            animationClass=""
            resultClass={
              voteResult
                ? voteResult.winnerId === pair[1].id
                  ? "winner-glow"
                  : "loser-dim"
                : ""
            }
            disabled={voting}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSkip}
          disabled={voting}
          className="px-5 py-2 rounded-xl text-sm font-medium border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-colors disabled:opacity-30"
        >
          Skip
        </button>
        {lastVote && (
          <ShareButton
            winnerName={lastVote.winnerName}
            loserName={lastVote.loserName}
          />
        )}
      </div>

      <button
        onClick={handleSync}
        disabled={syncing}
        className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors disabled:opacity-50"
      >
        {syncing ? "Syncing..." : "Refresh Forbes Data"}
      </button>

      <LiveFeed className="max-w-2xl mt-4" />
    </div>
  );
}
