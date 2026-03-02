import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const stats = await prisma.siteStats.findUnique({ where: { id: 1 } });
    return NextResponse.json({ count: stats?.visitorCount ?? 0 });
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return NextResponse.json({ count: 0 });
  }
}

export async function POST() {
  try {
    const stats = await prisma.siteStats.upsert({
      where: { id: 1 },
      update: { visitorCount: { increment: 1 } },
      create: { id: 1, visitorCount: 1 },
    });
    return NextResponse.json({ count: stats.visitorCount });
  } catch (error) {
    console.error("Error incrementing visitor count:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
