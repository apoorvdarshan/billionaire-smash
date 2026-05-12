import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBillionaireBySlug,
  getBillionaireProfilePath,
  getBillionaireSlug,
  getBillionaires,
} from "@/lib/billionaire-slugs";
import { countryToFlag } from "@/lib/flags";

const SITE_URL = "https://www.bsmash.app";
const allBillionaires = getBillionaires().sort((a, b) => a.rank - b.rank);

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return allBillionaires.map((billionaire) => ({
    slug: getBillionaireSlug(billionaire),
  }));
}

function formatNetWorth(netWorth: number): string {
  return `$${netWorth.toLocaleString("en-US", {
    maximumFractionDigits: 1,
  })} billion`;
}

function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const billionaire = getBillionaireBySlug(slug);

  if (!billionaire) {
    return {
      title: "Billionaire profile not found",
      robots: { index: false, follow: false },
    };
  }

  const profileUrl = `${SITE_URL}${getBillionaireProfilePath(billionaire)}`;
  const source = billionaire.source.trim();
  const description = `${billionaire.name} is a billionaire from ${
    billionaire.country
  } with an estimated net worth of ${formatNetWorth(
    billionaire.netWorth
  )}. See their Forbes rank, source of wealth, and bsmash voting profile.`;

  return {
    title: `${billionaire.name} Net Worth, Rank & Voting Profile`,
    description,
    keywords: [
      billionaire.name,
      `${billionaire.name} net worth`,
      `${billionaire.name} billionaire`,
      `${billionaire.name} bsmash`,
      source,
      billionaire.country,
    ],
    alternates: {
      canonical: profileUrl,
    },
    openGraph: {
      title: `${billionaire.name} | bsmash Billionaire Profile`,
      description,
      url: profileUrl,
      type: "profile",
      images: [
        {
          url: absoluteUrl(billionaire.photoUrl),
          alt: billionaire.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${billionaire.name} | bsmash`,
      description,
      images: [absoluteUrl(billionaire.photoUrl)],
    },
  };
}

export default async function BillionaireProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const billionaire = getBillionaireBySlug(slug);

  if (!billionaire) notFound();

  const source = billionaire.source.trim();
  const profilePath = getBillionaireProfilePath(billionaire);
  const profileUrl = `${SITE_URL}${profilePath}`;
  const index = allBillionaires.findIndex(
    (candidate) => candidate.forbesId === billionaire.forbesId
  );
  const previous = index > 0 ? allBillionaires[index - 1] : null;
  const next =
    index >= 0 && index < allBillionaires.length - 1
      ? allBillionaires[index + 1]
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: billionaire.name,
    image: absoluteUrl(billionaire.photoUrl),
    url: profileUrl,
    nationality: billionaire.country,
    description: `${billionaire.name} is ranked #${billionaire.rank} in the bsmash billionaire directory with an estimated net worth of ${formatNetWorth(
      billionaire.netWorth
    )}.`,
    mainEntityOfPage: profileUrl,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Estimated net worth",
        value: formatNetWorth(billionaire.netWorth),
      },
      {
        "@type": "PropertyValue",
        name: "Source of wealth",
        value: source,
      },
      {
        "@type": "PropertyValue",
        name: "Forbes rank",
        value: billionaire.rank,
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-xs font-semibold text-[var(--text-tertiary)]">
        <Link href="/billionaires" className="hover:text-[var(--accent)]">
          Billionaires
        </Link>
        <span className="mx-2">/</span>
        <span>{billionaire.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:items-start">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <Image
            src={billionaire.photoUrl}
            alt={billionaire.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 340px"
            priority={billionaire.rank <= 20}
            unoptimized
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/70 to-transparent p-5">
            <span className="inline-flex rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs font-bold text-[var(--accent)]">
              Forbes rank #{billionaire.rank}
            </span>
          </div>
        </div>

        <article>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-3">
            bsmash billionaire profile
          </p>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            {billionaire.name}
          </h1>
          <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
            {billionaire.name} is a billionaire from {billionaire.country}{" "}
            with an estimated net worth of{" "}
            <span className="font-bold text-[var(--accent)]">
              {formatNetWorth(billionaire.netWorth)}
            </span>
            . Their listed source of wealth is {source}.
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                Net worth
              </dt>
              <dd className="mt-1 text-lg font-black text-[var(--accent)]">
                {formatNetWorth(billionaire.netWorth)}
              </dd>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                Country
              </dt>
              <dd className="mt-1 text-lg font-black">
                {countryToFlag(billionaire.country)} {billionaire.country}
              </dd>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                Source
              </dt>
              <dd className="mt-1 truncate text-lg font-black">{source}</dd>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                Rank
              </dt>
              <dd className="mt-1 text-lg font-black">#{billionaire.rank}</dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[var(--bg-primary)] transition-colors hover:bg-[var(--accent-bright)]"
            >
              Vote on bsmash
            </Link>
            <Link
              href="/leaderboard"
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-3 text-sm font-bold text-[var(--text-primary)] transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--bg-card-hover)]"
            >
              View leaderboard
            </Link>
          </div>
        </article>
      </div>

      {(previous || next) && (
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {previous && (
            <Link
              href={getBillionaireProfilePath(previous)}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--bg-card-hover)]"
            >
              <span className="text-xs text-[var(--text-tertiary)]">
                Previous rank
              </span>
              <span className="mt-1 block font-bold">{previous.name}</span>
            </Link>
          )}
          {next && (
            <Link
              href={getBillionaireProfilePath(next)}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--bg-card-hover)]"
            >
              <span className="text-xs text-[var(--text-tertiary)]">
                Next rank
              </span>
              <span className="mt-1 block font-bold">{next.name}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
