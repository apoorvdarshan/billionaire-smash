import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateElo } from "@/lib/elo";

export async function POST(request: NextRequest) {
  try {
    const { winnerId, loserId } = await request.json();

    if (!winnerId || !loserId || winnerId === loserId) {
      return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
    }

    const [winner, loser] = await Promise.all([
      prisma.billionaire.findUnique({ where: { id: winnerId } }),
      prisma.billionaire.findUnique({ where: { id: loserId } }),
    ]);

    if (!winner || !loser) {
      return NextResponse.json(
        { error: "Billionaire not found" },
        { status: 404 }
      );
    }

    const { newWinnerElo, newLoserElo } = calculateElo(winner.elo, loser.elo);

    await prisma.$transaction([
      prisma.billionaire.update({
        where: { id: winnerId },
        data: { elo: newWinnerElo, wins: { increment: 1 } },
      }),
      prisma.billionaire.update({
        where: { id: loserId },
        data: { elo: newLoserElo, losses: { increment: 1 } },
      }),
      prisma.vote.create({
        data: { winnerId, loserId },
      }),
    ]);

    return NextResponse.json({
      winner: { id: winnerId, elo: newWinnerElo },
      loser: { id: loserId, elo: newLoserElo },
    });
  } catch (error) {
    console.error("Error recording vote:", error);
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 }
    );
  }
}
