import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Nav } from "@/components/Nav";
import { LiveFeed } from "@/components/LiveFeed";
import { Footer } from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "bsmash — Billionaire Smash",
  description: "Who's more smash-worthy? Vote on billionaires, Elo-ranked by the crowd.",
  metadataBase: new URL("https://bsmash.app"),
  openGraph: {
    title: "bsmash — Billionaire Smash",
    description: "Who's more smash-worthy? Vote on billionaires, Elo-ranked by the crowd.",
    url: "https://bsmash.app",
    siteName: "bsmash",
    images: [
      {
        url: "/og.png",
        width: 1203,
        height: 630,
        type: "image/png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "bsmash — Billionaire Smash",
    description: "Who's more smash-worthy? Vote on billionaires, Elo-ranked by the crowd.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable}`}>
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
        {/* Film grain overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.018]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative min-h-screen flex flex-col z-10">
          <Nav />
          <LiveFeed />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
