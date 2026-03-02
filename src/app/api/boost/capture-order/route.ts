import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTierById, calculateCustomElo } from "@/lib/boost-tiers";
import { captureOrder } from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const { orderId, billionaireId, tierId, customAmount, boosterName } = await request.json();

    let expectedPrice: number;
    let eloToAdd: number;

    if (customAmount != null) {
      if (tierId != null) {
        return NextResponse.json({ error: "Provide tierId or customAmount, not both" }, { status: 400 });
      }
      if (typeof customAmount !== "number" || customAmount < 1) {
        return NextResponse.json({ error: "Custom amount must be at least $1" }, { status: 400 });
      }
      const { elo } = calculateCustomElo(customAmount);
      expectedPrice = customAmount;
      eloToAdd = elo;
    } else {
      const tier = getTierById(tierId);
      if (!tier) {
        return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
      }
      expectedPrice = tier.price;
      eloToAdd = tier.elo;
    }

    // Idempotency check
    const existing = await prisma.boost.findUnique({
      where: { paypalOrderId: orderId },
    });
    if (existing) {
      return NextResponse.json({ success: true, eloAdded: existing.eloAmount });
    }

    // Capture payment
    const capture = await captureOrder(orderId);
    if (capture.status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // Verify amount matches expected
    if (capture.amountUsd < expectedPrice) {
      return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
    }

    // Transaction: create boost + increment eloBoost
    await prisma.$transaction([
      prisma.boost.create({
        data: {
          billionaireId,
          amountUsd: expectedPrice,
          eloAmount: eloToAdd,
          paypalOrderId: orderId,
          paypalPayerId: capture.payerId,
          boosterName: boosterName || null,
        },
      }),
      prisma.billionaire.update({
        where: { id: billionaireId },
        data: { eloBoost: { increment: eloToAdd } },
      }),
    ]);

    return NextResponse.json({ success: true, eloAdded: eloToAdd });
  } catch (error) {
    console.error("Error capturing boost order:", error);
    return NextResponse.json({ error: "Failed to capture order" }, { status: 500 });
  }
}
