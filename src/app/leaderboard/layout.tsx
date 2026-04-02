import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elo Leaderboard — Forbes 400 Billionaire Rankings",
  description:
    "Live Elo leaderboard ranking all Forbes 400 billionaires by community votes. See win rates, search by name or country, and boost your favorite billionaire.",
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
    canonical: "https://bsmash.app/leaderboard",
  },
  openGraph: {
    title: "Elo Leaderboard — Forbes 400 Billionaire Rankings",
    description:
      "Live Elo leaderboard ranking all Forbes 400 billionaires by community votes. Who's #1?",
    url: "https://bsmash.app/leaderboard",
  },
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
