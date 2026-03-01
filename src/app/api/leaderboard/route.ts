import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const [billionaires, total] = await Promise.all([
      prisma.billionaire.findMany({
        orderBy: { elo: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.billionaire.count(),
    ]);

    return NextResponse.json({ billionaires, total });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
