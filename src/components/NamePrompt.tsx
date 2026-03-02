"use client";

import { useState, FormEvent } from "react";

interface NamePromptProps {
  onSubmit: (name: string) => void;
}

export function NamePrompt({ onSubmit }: NamePromptProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]/85 backdrop-blur-lg px-4">
      <form
        onSubmit={handleSubmit}
        className="glass-surface flex flex-col items-center gap-5 w-full max-w-sm p-8 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(212,168,83,0.08)] animate-modal-in"
      >
        <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
          <span className="text-2xl">&#x1F451;</span>
        </div>
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            What&apos;s your <span className="text-gradient">name</span>?
          </h2>
          <p className="text-[var(--text-secondary)] text-sm">
            So everyone can see who&apos;s voting
          </p>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={30}
          autoFocus
          placeholder="Enter your name..."
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] text-center text-lg focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(212,168,83,0.12)] transition-all duration-300"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="w-full px-8 py-3 rounded-xl font-bold bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-bright)] hover:shadow-[0_0_32px_rgba(212,168,83,0.25)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Let&apos;s Go
        </button>
      </form>
    </div>
  );
}
