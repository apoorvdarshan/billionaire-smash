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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-md px-4">
      <form
        onSubmit={handleSubmit}
        className="glass-surface flex flex-col items-center gap-6 w-full max-w-sm p-8 rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.5)] animate-fade-in"
      >
        <span className="text-3xl">&#x1F451;</span>
        <h2 className="text-2xl md:text-3xl font-black text-center tracking-tight">
          What&apos;s your <span className="text-gradient">name</span>?
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
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] text-center text-lg focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(212,168,83,0.15)] transition-all duration-300"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="w-full px-8 py-3 rounded-xl font-bold bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-bright)] hover:shadow-[0_0_24px_rgba(212,168,83,0.3)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Let&apos;s Go
        </button>
      </form>
    </div>
  );
}
