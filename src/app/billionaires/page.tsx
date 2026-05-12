import type { Metadata } from "next";
import Link from "next/link";
import {
  getBillionaireProfilePath,
  getBillionaires,
} from "@/lib/billionaire-slugs";
import { countryToFlag } from "@/lib/flags";

const SITE_URL = "https://bsmash.app";
const billionaires = getBillionaires().sort((a, b) => a.rank - b.rank);
const topRankedBillionaires = billionaires.slice(0, 250);
const analyticsPriorityNames = new Set(["Carrie Perrodo & family"]);
const featuredBillionaires = [
  ...topRankedBillionaires,
  ...billionaires.filter(
    (billionaire) =>
      analyticsPriorityNames.has(billionaire.name) &&
      !topRankedBillionaires.some(
        (topRanked) => topRanked.forbesId === billionaire.forbesId
      )
  ),
];

export const metadata: Metadata = {
  title: "Billionaire Directory",
  description:
    "Browse bsmash profiles for the world's billionaires by name, country, net worth, source of wealth, and Forbes rank.",
  alternates: {
    canonical: `${SITE_URL}/billionaires`,
  },
  openGraph: {
    title: "Billionaire Directory | bsmash",
    description:
      "Browse indexable billionaire profiles with net worth, country, source of wealth, rank, and links to vote on bsmash.",
    url: `${SITE_URL}/billionaires`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Billionaire Directory | bsmash",
    description:
      "Browse billionaire profiles with net worth, country, source of wealth, rank, and bsmash voting links.",
  },
};

function formatNetWorth(netWorth: number): string {
  return `$${netWorth.toLocaleString("en-US", {
    maximumFractionDigits: 1,
  })}B`;
}

export default function BillionairesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 md:mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-3">
          bsmash profiles
        </p>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">
          Billionaire <span className="text-gradient">Directory</span>
        </h1>
        <p className="text-[var(--text-secondary)] mt-3 max-w-2xl text-sm md:text-base leading-relaxed">
          Browse {billionaires.length.toLocaleString("en-US")} billionaire
          profiles with net worth, country, source of wealth, Forbes rank, and
          links into the live bsmash voting game.
        </p>
      </div>

      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-lg md:text-2xl font-black tracking-tight">
          Top ranked profiles
        </h2>
        <span className="text-xs font-semibold text-[var(--text-tertiary)]">
          Showing {featuredBillionaires.length.toLocaleString("en-US")}
        </span>
      </div>

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {featuredBillionaires.map((billionaire) => (
          <Link
            key={billionaire.forbesId}
            href={getBillionaireProfilePath(billionaire)}
            className="group flex min-w-0 items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-3 transition-all duration-300 hover:border-[var(--accent)]/50 hover:bg-[var(--bg-card-hover)]"
          >
            <span className="w-10 shrink-0 text-right text-xs font-bold text-[var(--text-tertiary)]">
              #{billionaire.rank}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                {billionaire.name}
              </span>
              <span className="mt-0.5 block truncate text-xs text-[var(--text-tertiary)]">
                {countryToFlag(billionaire.country)} {billionaire.country} -
                {" "}
                {formatNetWorth(billionaire.netWorth)} -{" "}
                {billionaire.source.trim()}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
