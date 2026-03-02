"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { BOOST_TIERS } from "@/lib/boost-tiers";

interface BoostModalProps {
  billionaire: {
    id: number;
    name: string;
    photoUrl: string;
    displayElo: number;
  };
  onClose: () => void;
  onSuccess: (eloAdded: number) => void;
}

export function BoostModal({ billionaire, onClose, onSuccess }: BoostModalProps) {
  const [selectedTier, setSelectedTier] = useState(BOOST_TIERS[0].id);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [eloAdded, setEloAdded] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const tier = BOOST_TIERS.find((t) => t.id === selectedTier)!;
  const paypalReady = typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== "YOUR_SANDBOX_CLIENT_ID";

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]/85 backdrop-blur-lg px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="glass-surface flex flex-col items-center gap-5 w-full max-w-md p-6 md:p-8 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(212,168,83,0.08)] animate-modal-in relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Billionaire info */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--accent)]/50 shadow-[0_0_24px_rgba(212,168,83,0.2)]">
            <Image
              src={billionaire.photoUrl}
              alt={billionaire.name}
              fill
              className="object-cover"
              sizes="64px"
              unoptimized
            />
          </div>
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              Boost <span className="text-gradient">{billionaire.name}</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-sm mt-1">
              Current Elo: <span className="text-[var(--accent)] font-bold">{Math.round(billionaire.displayElo)}</span>
            </p>
          </div>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-gradient">+{eloAdded} Elo!</p>
              <p className="text-[var(--text-secondary)] text-sm mt-1">Boost applied successfully</p>
            </div>
            <button
              onClick={() => { onSuccess(eloAdded); onClose(); }}
              className="px-8 py-3 rounded-xl font-bold bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-bright)] transition-all duration-300"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Tier selection */}
            <div className="grid grid-cols-2 gap-2.5 w-full">
              {BOOST_TIERS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { if (status === "idle") setSelectedTier(t.id); }}
                  disabled={status === "processing"}
                  className={`relative flex flex-col items-center gap-1 p-3 md:p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedTier === t.id
                      ? "border-[var(--accent)] bg-[var(--accent)]/[0.08] shadow-[0_0_20px_rgba(212,168,83,0.12)]"
                      : "border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border)]/80 hover:bg-[var(--bg-card-hover)]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="text-lg md:text-xl font-black text-[var(--text-primary)]">{t.label}</span>
                  <span className={`text-sm font-bold ${selectedTier === t.id ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}`}>
                    {t.eloLabel}
                  </span>
                  {t.bonus && (
                    <span className="text-[10px] font-semibold text-green-400/80 uppercase tracking-wide">
                      {t.bonus}
                    </span>
                  )}
                  {selectedTier === t.id && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--accent)]" />
                  )}
                </button>
              ))}
            </div>

            {/* Error message */}
            {status === "error" && (
              <p className="text-red-400 text-sm text-center">{errorMsg || "Something went wrong. Please try again."}</p>
            )}

            {/* PayPal button */}
            <div className="w-full">
              {paypalReady ? (
                <PayPalButtons
                  key={selectedTier}
                  style={{
                    layout: "horizontal",
                    color: "gold",
                    shape: "rect",
                    label: "pay",
                    height: 45,
                    tagline: false,
                  }}
                  createOrder={async () => {
                    setStatus("processing");
                    setErrorMsg("");
                    const res = await fetch("/api/boost/create-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        billionaireId: billionaire.id,
                        tierId: selectedTier,
                      }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error);
                    return data.orderId;
                  }}
                  onApprove={async (data) => {
                    const res = await fetch("/api/boost/capture-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        orderId: data.orderID,
                        billionaireId: billionaire.id,
                        tierId: selectedTier,
                      }),
                    });
                    const result = await res.json();
                    if (!res.ok) {
                      setStatus("error");
                      setErrorMsg(result.error || "Capture failed");
                      return;
                    }
                    setEloAdded(result.eloAdded);
                    setStatus("success");
                  }}
                  onError={() => {
                    setStatus("error");
                    setErrorMsg("Payment was cancelled or failed.");
                  }}
                  onCancel={() => {
                    setStatus("idle");
                  }}
                />
              ) : (
                <div className="text-center py-4">
                  <p className="text-[var(--text-tertiary)] text-sm">
                    PayPal not configured. Add credentials to .env to enable boosts.
                  </p>
                </div>
              )}
            </div>

            {status === "processing" && (
              <p className="text-[var(--text-secondary)] text-sm animate-pulse">Processing payment...</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
