import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.billionaire.count();

    if (count < 2) {
      return NextResponse.json(
        { error: "Not enough billionaires. Please sync data first." },
        { status: 400 }
      );
    }

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
