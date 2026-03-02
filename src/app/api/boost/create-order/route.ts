import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTierById } from "@/lib/boost-tiers";
import { createOrder } from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const { billionaireId, tierId } = await request.json();

    const tier = getTierById(tierId);
    if (!tier) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const billionaire = await prisma.billionaire.findUnique({
      where: { id: billionaireId },
    });
    if (!billionaire) {
      return NextResponse.json({ error: "Billionaire not found" }, { status: 404 });
    }

    const orderId = await createOrder(
      tier.price,
      `+${tier.elo} Elo boost for ${billionaire.name} on bsmash`
    );

    return NextResponse.json({ orderId });
  } catch (error) {
    console.error("Error creating boost order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
