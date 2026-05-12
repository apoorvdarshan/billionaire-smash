import type { MetadataRoute } from "next";
import {
  getBillionaireProfilePath,
  getBillionaires,
} from "@/lib/billionaire-slugs";

const SITE_URL = "https://bsmash.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/leaderboard`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/billionaires`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...getBillionaires().map((billionaire) => ({
      url: `${SITE_URL}${getBillionaireProfilePath(billionaire)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: billionaire.rank <= 100 ? 0.8 : 0.6,
    })),
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/tos`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
