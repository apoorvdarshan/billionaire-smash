import { NextResponse } from "next/server";
import { getDb, numberValue } from "@/lib/db";

export async function GET() {
  try {
    const result = await getDb().execute("SELECT visitorCount FROM SiteStats WHERE id = 1");
    return NextResponse.json({ count: numberValue(result.rows[0]?.visitorCount) });
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return NextResponse.json({ count: 0 });
  }
}

export async function POST() {
  try {
    const result = await getDb().execute({
      sql: `INSERT INTO SiteStats (id, visitorCount, updatedAt) VALUES (1, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET visitorCount = visitorCount + 1, updatedAt = CURRENT_TIMESTAMP
        RETURNING visitorCount`,
      args: [],
    });
    return NextResponse.json({ count: numberValue(result.rows[0]?.visitorCount) });
  } catch (error) {
    console.error("Error incrementing visitor count:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
