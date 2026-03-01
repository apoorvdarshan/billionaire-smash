"use client";

import Image from "next/image";

interface Billionaire {
  id: number;
  name: string;
  netWorth: number;
  country: string;
  photoUrl: string;
  source: string;
  elo: number;
}

interface BillionaireCardProps {
  billionaire: Billionaire;
  onClick: () => void;
  animationClass: string;
  resultClass?: string;
  disabled: boolean;
}

export function BillionaireCard({
  billionaire,
  onClick,
  animationClass,
  resultClass,
  disabled,
}: BillionaireCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`card-hover group relative flex flex-col items-center w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden cursor-pointer disabled:cursor-default ${animationClass} ${resultClass || ""}`}
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[var(--bg-card-hover)]">
        <Image
          src={billionaire.photoUrl}
          alt={billionaire.name}
          fill
          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 45vw, 350px"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent" />
      </div>

      <div className="w-full p-5 space-y-3">
        <h2 className="text-xl font-bold leading-tight truncate">
          {billionaire.name}
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
            ${billionaire.netWorth}B
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border border-[var(--border)]">
            {billionaire.country}
          </span>
        </div>

        <p className="text-xs text-[var(--text-secondary)] truncate">
          {billionaire.source}
        </p>
      </div>

      {!disabled && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--accent)]/10 backdrop-blur-[2px]">
          <span className="vs-badge px-6 py-3 rounded-xl text-lg shadow-lg">
            PICK
          </span>
        </div>
      )}
    </button>
  );
}
