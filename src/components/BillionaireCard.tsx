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
      className={`card-hover group relative h-full w-full flex flex-col max-w-sm rounded-2xl border border-[var(--border)] bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-primary)] overflow-hidden cursor-pointer disabled:cursor-default shadow-[0_4px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.03)] ${animationClass} ${resultClass || ""}`}
    >
      <div className="relative w-full flex-1 min-h-0 overflow-hidden bg-[var(--bg-card-hover)]">
        <Image
          src={billionaire.photoUrl}
          alt={billionaire.name}
          fill
          className="object-contain md:object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 768px) 45vw, 350px"
          unoptimized
        />
        {/* Multi-stop gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-[var(--bg-card)]/30 via-35% to-transparent" />
        {/* Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.35)]" />
      </div>

      <div className="shrink-0 w-full p-2.5 sm:p-3 md:p-4 space-y-1.5 sm:space-y-2">
        <h2 className="text-sm sm:text-base md:text-lg font-bold leading-tight truncate tracking-tight">
          {billionaire.name}
        </h2>

        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-[var(--accent)]/12 text-[var(--accent)] border border-[var(--accent)]/20">
            ${billionaire.netWorth}B
          </span>
          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-white/[0.03] text-[var(--text-secondary)] border border-[var(--border)]">
            <span>{countryToFlag(billionaire.country)}</span>
            <span className="hidden sm:inline">{billionaire.country}</span>
          </span>
        </div>

        <p className="text-[10px] sm:text-xs text-[var(--text-tertiary)] truncate">
          {billionaire.source}
        </p>
      </div>

      {/* PICK overlay */}
      {!disabled && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute inset-0 bg-[var(--accent)]/[0.06] backdrop-blur-[2px]" />
          <span className="vs-badge relative px-5 py-2 md:px-7 md:py-3 rounded-xl text-base md:text-lg shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300 ease-out">
            PICK
          </span>
        </div>
      )}
    </button>
  );
}
