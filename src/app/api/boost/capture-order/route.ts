import { NextRequest, NextResponse } from "next/server";
import { getDb, numberValue } from "@/lib/db";
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
    const db = getDb();
    const existingResult = await db.execute({
      sql: "SELECT eloAmount FROM Boost WHERE paypalOrderId = ?",
      args: [orderId],
    });
    const existing = existingResult.rows[0];
    if (existing) {
      return NextResponse.json({ success: true, eloAdded: numberValue(existing.eloAmount) });
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
    await db.batch([
      {
        sql: `INSERT INTO Boost
          (billionaireId, amountUsd, eloAmount, paypalOrderId, paypalPayerId, boosterName, status, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, 'completed', CURRENT_TIMESTAMP)`,
        args: [billionaireId, expectedPrice, eloToAdd, orderId, capture.payerId, boosterName || null],
      },
      {
        sql: "UPDATE Billionaire SET eloBoost = eloBoost + ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
        args: [eloToAdd, billionaireId],
      },
    ], "write");

    return NextResponse.json({ success: true, eloAdded: eloToAdd });
  } catch (error) {
    console.error("Error capturing boost order:", error);
    return NextResponse.json({ error: "Failed to capture order" }, { status: 500 });
  }
}
