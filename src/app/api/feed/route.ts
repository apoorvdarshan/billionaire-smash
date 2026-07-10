import { NextRequest, NextResponse } from "next/server";
import { getDb, numberValue } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const limit = Math.min(
      Number(request.nextUrl.searchParams.get("limit") || 20),
      50
    );

    const db = getDb();
    const [votes, boosts] = await Promise.all([
      db.execute({
        sql: `SELECT v.id, v.voterName, v.createdAt, w.name AS winnerName, l.name AS loserName
          FROM Vote v JOIN Billionaire w ON w.id = v.winnerId JOIN Billionaire l ON l.id = v.loserId
          ORDER BY v.createdAt DESC LIMIT ?`,
        args: [limit],
      }),
      db.execute({
        sql: `SELECT b.id, b.boosterName, b.eloAmount, b.createdAt, p.name AS billionaireName
          FROM Boost b JOIN Billionaire p ON p.id = b.billionaireId
          WHERE b.status = 'completed' ORDER BY b.createdAt DESC LIMIT ?`,
        args: [limit],
      }),
    ]);

    const feed = [
      ...votes.rows.map((v) => ({
        id: `vote-${v.id}`,
        type: "vote" as const,
        voterName: v.voterName || "Someone",
        winnerName: v.winnerName,
        loserName: v.loserName,
        createdAt: String(v.createdAt),
      })),
      ...boosts.rows.map((b) => ({
        id: `boost-${b.id}`,
        type: "boost" as const,
        boosterName: b.boosterName || "Someone",
        billionaireName: b.billionaireName,
        eloAmount: numberValue(b.eloAmount),
        createdAt: String(b.createdAt),
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
