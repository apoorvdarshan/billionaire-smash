import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBillionaires } from "@/lib/forbes";

// DEMO: serve Sam Altman vs Dario Amodei on the very first request
let servedFirstPair = false;

async function ensureBillionaires() {
  const count = await prisma.billionaire.count();
  if (count >= 2) return;

  const data = getBillionaires();
  await prisma.billionaire.createMany({
    data: data.map((b) => ({
      forbesId: b.forbesId,
      name: b.name,
      netWorth: b.netWorth,
      country: b.country,
      photoUrl: b.photoUrl,
      source: b.source,
      rank: b.rank,
      elo: 1400,
    })),
  });
}

export async function GET() {
  try {
    await ensureBillionaires();

    // DEMO: first request gets Sam Altman vs Dario Amodei
    if (!servedFirstPair) {
      servedFirstPair = true;
      const [sam, dario] = await Promise.all([
        prisma.billionaire.findUnique({ where: { id: 957 } }),
        prisma.billionaire.findUnique({ where: { id: 476 } }),
      ]);
      if (sam && dario) {
        return NextResponse.json({ pair: [sam, dario] });
      }
    }

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
