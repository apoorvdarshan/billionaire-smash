import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { LiveFeedTicker } from "@/components/LiveFeedTicker";

export const metadata: Metadata = {
  title: "Billionaire Smash",
  description: "Vote on your favorite billionaires — Facemash for Forbes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {/* Ambient gold glow */}
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,168,83,0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="relative min-h-screen flex flex-col z-10">
          <Nav />
          <LiveFeedTicker />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
