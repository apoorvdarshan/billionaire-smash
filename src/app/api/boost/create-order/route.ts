import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTierById, calculateCustomElo } from "@/lib/boost-tiers";
import { createOrder } from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const { billionaireId, tierId, customAmount } = await request.json();

    let price: number;
    let eloLabel: string;

    if (customAmount != null) {
      if (tierId != null) {
        return NextResponse.json({ error: "Provide tierId or customAmount, not both" }, { status: 400 });
      }
      if (typeof customAmount !== "number" || customAmount < 1) {
        return NextResponse.json({ error: "Custom amount must be at least $1" }, { status: 400 });
      }
      const { elo } = calculateCustomElo(customAmount);
      price = customAmount;
      eloLabel = `+${elo}`;
    } else {
      const tier = getTierById(tierId);
      if (!tier) {
        return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
      }
      price = tier.price;
      eloLabel = `+${tier.elo}`;
    }

    const billionaire = await prisma.billionaire.findUnique({
      where: { id: billionaireId },
    });
    if (!billionaire) {
      return NextResponse.json({ error: "Billionaire not found" }, { status: 404 });
    }

    const orderId = await createOrder(
      price,
      `${eloLabel} Elo boost for ${billionaire.name} on bsmash`
    );

    return NextResponse.json({ orderId });
  } catch (error) {
    console.error("Error creating boost order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
