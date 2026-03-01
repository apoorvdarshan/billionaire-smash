import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
