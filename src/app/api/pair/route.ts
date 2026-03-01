import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchForbesBillionaires, fixPhotoUrl, uriToId } from "@/lib/forbes";

async function ensureBillionaires() {
  const count = await prisma.billionaire.count();
  if (count >= 2) return;

  const data = await fetchForbesBillionaires();
  for (const b of data) {
    const forbesId = uriToId(b.uri || b.personName);
    await prisma.billionaire.upsert({
      where: { forbesId },
      update: {
        name: b.personName,
        netWorth: Math.round((b.finalWorth / 1000) * 10) / 10,
        country: b.countryOfCitizenship,
        photoUrl: fixPhotoUrl(b.squareImage),
        source: b.source,
        rank: b.rank,
      },
      create: {
        forbesId,
        name: b.personName,
        netWorth: Math.round((b.finalWorth / 1000) * 10) / 10,
        country: b.countryOfCitizenship,
        photoUrl: fixPhotoUrl(b.squareImage),
        source: b.source,
        rank: b.rank,
        elo: 1400,
      },
    });
  }
}

export async function GET() {
  try {
    await ensureBillionaires();

    const count = await prisma.billionaire.count();

    // Get two random billionaires using random offset
    const skip1 = Math.floor(Math.random() * count);
    let skip2 = Math.floor(Math.random() * (count - 1));
    if (skip2 >= skip1) skip2++;

    const [b1, b2] = await Promise.all([
      prisma.billionaire.findFirst({ skip: skip1 }),
      prisma.billionaire.findFirst({ skip: skip2 }),
    ]);

    return NextResponse.json({ pair: [b1, b2] });
  } catch (error) {
    console.error("Error fetching pair:", error);
    return NextResponse.json(
      { error: "Failed to fetch pair" },
      { status: 500 }
    );
  }
}
