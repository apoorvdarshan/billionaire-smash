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
  title: {
    default: "bsmash - Billionaire Smash Voting Game",
    template: "%s | bsmash",
  },
  description:
    "Play bsmash, the billionaire voting game. Vote head-to-head on famous billionaires, browse profiles, and watch Elo rankings update in real time.",
  keywords: [
    "billionaire smash",
    "bsmash",
    "vote on billionaires",
    "forbes 400 ranking",
    "billionaire ranking",
    "hot or not billionaires",
    "facemash billionaires",
    "elo ranking billionaires",
    "richest people vote",
    "billionaire leaderboard",
    "smash or pass billionaires",
    "billionaire attractiveness",
    "forbes billionaire list",
    "who is the hottest billionaire",
    "billionaire comparison",
    "rate billionaires",
    "billionaire voting game",
    "richest people in the world",
  ],
  metadataBase: new URL("https://www.bsmash.app"),
  alternates: {
    canonical: "https://www.bsmash.app",
  },
  openGraph: {
    title: "bsmash - Billionaire Smash Voting Game",
    description:
      "Two billionaires appear. You pick one. Elo rankings update live on bsmash.",
    url: "https://www.bsmash.app",
    siteName: "Billionaire Smash",
    images: [
      {
        url: "/og.png",
        width: 1203,
        height: 630,
        type: "image/png",
        alt: "Billionaire Smash — Vote on Forbes 400 billionaires",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "bsmash - Billionaire Smash Voting Game",
    description:
      "Two billionaires appear. You pick one. Elo rankings update live on bsmash.",
    images: ["/og.png"],
    creator: "@apoorvdarshan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "entertainment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable}`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1910432677832151"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Billionaire Smash",
              alternateName: ["bsmash", "Billionaire Smash"],
              url: "https://www.bsmash.app",
              description:
                "Play bsmash, the billionaire voting game. Vote head-to-head on famous billionaires, browse profiles, and watch Elo rankings update in real time.",
              applicationCategory: "Entertainment",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              author: {
                "@type": "Person",
                name: "Apoorv Darshan",
                url: "https://x.com/apoorvdarshan",
              },
            }),
          }}
        />
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
