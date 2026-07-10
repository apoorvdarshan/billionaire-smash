import { NextRequest, NextResponse } from "next/server";
import { getDb, numberValue } from "@/lib/db";
import { calculateElo } from "@/lib/elo";

export async function POST(request: NextRequest) {
  try {
    const { winnerId, loserId, voterName } = await request.json();

    if (!winnerId || !loserId || winnerId === loserId) {
      return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
    }

    const db = getDb();
    const players = await db.execute({
      sql: "SELECT id, elo FROM Billionaire WHERE id IN (?, ?)",
      args: [winnerId, loserId],
    });
    const winner = players.rows.find((row) => numberValue(row.id) === winnerId);
    const loser = players.rows.find((row) => numberValue(row.id) === loserId);

    if (!winner || !loser) {
      return NextResponse.json(
        { error: "Billionaire not found" },
        { status: 404 }
      );
    }

    const { newWinnerElo, newLoserElo } = calculateElo(numberValue(winner.elo), numberValue(loser.elo));

    await db.batch([
      { sql: "UPDATE Billionaire SET elo = ?, wins = wins + 1, updatedAt = CURRENT_TIMESTAMP WHERE id = ?", args: [newWinnerElo, winnerId] },
      { sql: "UPDATE Billionaire SET elo = ?, losses = losses + 1, updatedAt = CURRENT_TIMESTAMP WHERE id = ?", args: [newLoserElo, loserId] },
      { sql: "INSERT INTO Vote (winnerId, loserId, voterName, createdAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP)", args: [winnerId, loserId, typeof voterName === "string" ? voterName.slice(0, 30) : null] },
    ], "write");

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
