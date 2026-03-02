import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const limit = Math.min(
      Number(request.nextUrl.searchParams.get("limit") || 20),
      50
    );

    const [votes, boosts] = await Promise.all([
      prisma.vote.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          winner: { select: { name: true } },
          loser: { select: { name: true } },
        },
      }),
      prisma.boost.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        where: { status: "completed" },
        include: {
          billionaire: { select: { name: true } },
        },
      }),
    ]);

    const feed = [
      ...votes.map((v) => ({
        id: `vote-${v.id}`,
        type: "vote" as const,
        voterName: v.voterName || "Someone",
        winnerName: v.winner.name,
        loserName: v.loser.name,
        createdAt: v.createdAt.toISOString(),
      })),
      ...boosts.map((b) => ({
        id: `boost-${b.id}`,
        type: "boost" as const,
        boosterName: b.boosterName || "Someone",
        billionaireName: b.billionaire.name,
        eloAmount: b.eloAmount,
        createdAt: b.createdAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return NextResponse.json({ feed });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}
