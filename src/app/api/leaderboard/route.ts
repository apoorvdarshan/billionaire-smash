import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const [billionaires, total] = await Promise.all([
      prisma.$queryRaw<
        {
          id: number;
          forbesId: number;
          name: string;
          netWorth: number;
          country: string;
          photoUrl: string;
          source: string;
          rank: number;
          elo: number;
          eloBoost: number;
          wins: number;
          losses: number;
        }[]
      >`SELECT id, forbesId, name, netWorth, country, photoUrl, source, rank, elo, eloBoost, wins, losses
        FROM Billionaire
        ORDER BY (elo + eloBoost) DESC
        LIMIT ${limit} OFFSET ${offset}`,
      prisma.billionaire.count(),
    ]);

    const result = billionaires.map((b) => ({
      ...b,
      displayElo: b.elo + b.eloBoost,
    }));

    return NextResponse.json({ billionaires: result, total });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
