import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const limit = Math.min(
      Number(request.nextUrl.searchParams.get("limit") || 20),
      50
    );

    const votes = await prisma.vote.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        winner: { select: { name: true } },
        loser: { select: { name: true } },
      },
    });

    const feed = votes.map((v) => ({
      id: v.id,
      voterName: v.voterName || "Someone",
      winnerName: v.winner.name,
      loserName: v.loser.name,
      createdAt: v.createdAt.toISOString(),
    }));

    return NextResponse.json({ feed });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}
