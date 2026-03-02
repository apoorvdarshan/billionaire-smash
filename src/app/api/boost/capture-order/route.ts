import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTierById } from "@/lib/boost-tiers";
import { captureOrder } from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const { orderId, billionaireId, tierId, boosterName } = await request.json();

    const tier = getTierById(tierId);
    if (!tier) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
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

    // Verify amount matches tier
    if (capture.amountUsd < tier.price) {
      return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
    }

    // Transaction: create boost + increment eloBoost
    await prisma.$transaction([
      prisma.boost.create({
        data: {
          billionaireId,
          amountUsd: tier.price,
          eloAmount: tier.elo,
          paypalOrderId: orderId,
          paypalPayerId: capture.payerId,
          boosterName: boosterName || null,
        },
      }),
      prisma.billionaire.update({
        where: { id: billionaireId },
        data: { eloBoost: { increment: tier.elo } },
      }),
    ]);

    return NextResponse.json({ success: true, eloAdded: tier.elo });
  } catch (error) {
    console.error("Error capturing boost order:", error);
    return NextResponse.json({ error: "Failed to capture order" }, { status: 500 });
  }
}
