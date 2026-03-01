import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

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
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
