import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { readFileSync } from "fs";
import { join } from "path";

function buildClient(): PrismaClient {
  if (process.env.TURSO_DATABASE_URL) {
    const adapter = new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }
  return new PrismaClient();
}

const prisma = buildClient();

interface StaticBillionaire {
  forbesId: number;
  name: string;
  netWorth: number;
  country: string;
  photoUrl: string;
  source: string;
  rank: number;
}

async function main() {
  const jsonPath = join(__dirname, "..", "src", "data", "billionaires.json");
  const data: StaticBillionaire[] = JSON.parse(readFileSync(jsonPath, "utf-8"));

  console.log(`Seeding ${data.length} billionaires from static JSON...`);

  const existing = await prisma.billionaire.count();
  if (existing > 0) {
    console.log(`DB already has ${existing} billionaires, skipping seed.`);
    return;
  }

  const result = await prisma.billionaire.createMany({
    data: data.map((b) => ({
      forbesId: b.forbesId,
      name: b.name,
      netWorth: b.netWorth,
      country: b.country,
      photoUrl: b.photoUrl,
      source: b.source,
      rank: b.rank,
      elo: 1400,
    })),
  });

  console.log(`Done! Seeded ${result.count} billionaires.`);

  await prisma.siteStats.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, visitorCount: 0 },
  });
  console.log("SiteStats row ensured.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
