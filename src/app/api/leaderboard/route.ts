import { NextRequest, NextResponse } from "next/server";
import { getDb, numberValue } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "30");
    const offset = parseInt(searchParams.get("offset") || "0");

    const db = getDb();
    const [rows, countResult] = await Promise.all([
      db.execute({
        sql: `SELECT id, forbesId, name, netWorth, country, photoUrl, source, rank, elo, eloBoost, wins, losses
          FROM Billionaire ORDER BY (elo + eloBoost) DESC LIMIT ? OFFSET ?`,
        args: [limit, offset],
      }),
      db.execute("SELECT COUNT(*) AS count FROM Billionaire"),
    ]);

    const result = rows.rows.map((b) => ({
      ...b,
      displayElo: numberValue(b.elo) + numberValue(b.eloBoost),
    }));

    return NextResponse.json({
      billionaires: result,
      total: numberValue(countResult.rows[0]?.count),
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
