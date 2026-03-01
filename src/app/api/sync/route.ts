import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchForbesBillionaires, fixPhotoUrl } from "@/lib/forbes";

export async function POST() {
  try {
    const data = await fetchForbesBillionaires();

    let synced = 0;

    for (const b of data) {
      const forbesId = parseInt(b.uri?.replace(/\D/g, "") || "0") || b.rank;
      const photoUrl = fixPhotoUrl(b.squareImage);

      await prisma.billionaire.upsert({
        where: { forbesId },
        update: {
          name: b.personName,
          netWorth: Math.round((b.finalWorth / 1000) * 10) / 10,
          country: b.countryOfCitizenship,
          photoUrl,
          source: b.source,
          rank: b.rank,
        },
        create: {
          forbesId,
          name: b.personName,
          netWorth: Math.round((b.finalWorth / 1000) * 10) / 10,
          country: b.countryOfCitizenship,
          photoUrl,
          source: b.source,
          rank: b.rank,
          elo: 1400,
        },
      });
      synced++;
    }

    return NextResponse.json({
      message: `Synced ${synced} billionaires`,
      count: synced,
    });
  } catch (error) {
    console.error("Error syncing Forbes data:", error);
    return NextResponse.json(
      { error: "Failed to sync Forbes data" },
      { status: 500 }
    );
  }
}
