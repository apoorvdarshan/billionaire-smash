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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]/90 backdrop-blur-sm px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6 w-full max-w-sm animate-fade-in"
      >
        <h2 className="text-2xl md:text-3xl font-black text-center">
          What&apos;s your <span className="text-[var(--accent)]">name</span>?
        </h2>
        <p className="text-[var(--text-secondary)] text-sm text-center">
          So everyone can see who&apos;s voting
        </p>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={30}
          autoFocus
          placeholder="Enter your name..."
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-center text-lg focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="px-8 py-3 rounded-xl font-bold bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-dim)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Let&apos;s Go
        </button>
      </form>
    </div>
  );
}
