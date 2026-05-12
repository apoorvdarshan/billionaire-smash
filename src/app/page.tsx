import type { Metadata } from "next";
import { VotingArena } from "@/components/VotingArena";

export const metadata: Metadata = {
  title: {
    absolute: "bsmash - Billionaire Smash Voting Game",
  },
  description:
    "Play bsmash, the billionaire voting game. Pick between famous billionaires, watch Elo rankings update live, and browse the billionaire leaderboard.",
  alternates: {
    canonical: "https://www.bsmash.app",
  },
  openGraph: {
    title: "bsmash - Billionaire Smash Voting Game",
    description:
      "Pick between famous billionaires and watch bsmash Elo rankings update live.",
    url: "https://www.bsmash.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "bsmash - Billionaire Smash Voting Game",
    description:
      "Pick between famous billionaires and watch bsmash Elo rankings update live.",
  },
};

export default function Home() {
  return <VotingArena />;
}
