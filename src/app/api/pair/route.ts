import { NextResponse } from "next/server";
import { getDb, numberValue } from "@/lib/db";
import { getBillionaires } from "@/lib/forbes";

async function ensureBillionaires() {
  const db = getDb();
  const count = numberValue((await db.execute("SELECT COUNT(*) AS count FROM Billionaire")).rows[0]?.count);
  if (count >= 2) return;

  const data = getBillionaires();
  for (let index = 0; index < data.length; index += 100) {
    await db.batch(
      data.slice(index, index + 100).map((b) => ({
        sql: `INSERT OR IGNORE INTO Billionaire
          (forbesId, name, netWorth, country, photoUrl, source, rank, elo, eloBoost, wins, losses, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, 1400, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        args: [b.forbesId, b.name, b.netWorth, b.country, b.photoUrl, b.source, b.rank],
      })),
      "write"
    );
  }
}

export async function GET() {
  try {
    await ensureBillionaires();

    const result = await getDb().execute("SELECT * FROM Billionaire ORDER BY RANDOM() LIMIT 2");
    return NextResponse.json({ pair: result.rows });
  } catch (error) {
    console.error("Error fetching pair:", error);
    return NextResponse.json(
      { error: "Failed to fetch pair" },
      { status: 500 }
    );
  }
}
