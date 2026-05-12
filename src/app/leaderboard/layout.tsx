import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billionaire Elo Leaderboard",
  description:
    "Live bsmash Elo leaderboard ranking billionaires by community votes. See win rates, search by name, country, or source of wealth, and boost your favorite billionaire.",
  keywords: [
    "billionaire leaderboard",
    "elo ranking billionaires",
    "forbes 400 elo",
    "billionaire rankings",
    "richest people ranked by votes",
    "billionaire win rate",
    "top rated billionaires",
  ],
  alternates: {
    canonical: "https://www.bsmash.app/leaderboard",
  },
  openGraph: {
    title: "Billionaire Elo Leaderboard | bsmash",
    description:
      "Live bsmash Elo leaderboard ranking billionaires by community votes.",
    url: "https://www.bsmash.app/leaderboard",
  },
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
