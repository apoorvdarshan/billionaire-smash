"use client";

import Image from "next/image";
import { countryToFlag } from "@/lib/flags";

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
      className={`card-hover group relative flex flex-col items-center w-full max-w-sm rounded-2xl border border-[var(--border)] bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-primary)] overflow-hidden cursor-pointer disabled:cursor-default shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] ${animationClass} ${resultClass || ""}`}
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[var(--bg-card-hover)]">
        <Image
          src={billionaire.photoUrl}
          alt={billionaire.name}
          fill
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.08]"
          sizes="(max-width: 768px) 45vw, 350px"
          unoptimized
        />
        {/* Multi-stop gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-[var(--bg-card)]/20 via-40% to-transparent" />
        {/* Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.3)]" />
      </div>

      <div className="w-full p-5 space-y-3">
        {/* Gold accent divider */}
        <div className="w-10 h-0.5 bg-gradient-to-r from-[var(--accent)] to-transparent rounded-full" />

        <h2 className="text-xl font-bold leading-tight truncate tracking-tight">
          {billionaire.name}
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
            ${billionaire.netWorth}B
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border border-[var(--border)]">
            <span>{countryToFlag(billionaire.country)}</span>
            {billionaire.country}
          </span>
        </div>

        <p className="text-xs text-[var(--text-tertiary)] truncate">
          {billionaire.source}
        </p>
      </div>

      {/* PICK overlay — bottom sweep */}
      {!disabled && (
        <div className="absolute inset-0 flex items-end justify-center pb-28 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent)]/20 via-transparent to-transparent" />
          <span className="vs-badge relative px-6 py-3 rounded-xl text-lg shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
            PICK
          </span>
        </div>
      )}
    </button>
  );
}
