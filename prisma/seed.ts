import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ForbesBillionaire {
  uri: string;
  personName: string;
  finalWorth: number;
  countryOfCitizenship: string;
  squareImage: string;
  source: string;
  rank: number;
}

function fixPhotoUrl(url: string): string {
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}

function uriToId(uri: string): number {
  let hash = 5381;
  for (let i = 0; i < uri.length; i++) {
    hash = ((hash << 5) + hash + uri.charCodeAt(i)) & 0x7fffffff;
  }
  return hash;
}

async function main() {
  console.log("Fetching Forbes billionaires data...");

  const res = await fetch("https://forbes400.onrender.com/api/forbes400");
  if (!res.ok) throw new Error(`Forbes API returned ${res.status}`);

  const data: ForbesBillionaire[] = await res.json();
  const valid = data.filter(
    (b) => b.personName && b.squareImage && b.finalWorth > 0
  );

  console.log(`Found ${valid.length} billionaires with photos. Seeding...`);

  let count = 0;
  for (const b of valid) {
    const forbesId = uriToId(b.uri || b.personName);
    const photoUrl = fixPhotoUrl(b.squareImage);

    await prisma.billionaire.upsert({
      where: { forbesId },
      update: {
        name: b.personName,
        netWorth: Math.round((b.finalWorth / 1000) * 10) / 10,
        country: b.countryOfCitizenship,
        photoUrl,
        source: b.source,
        rank: b.rank,
      },
      create: {
        forbesId,
        name: b.personName,
        netWorth: Math.round((b.finalWorth / 1000) * 10) / 10,
        country: b.countryOfCitizenship,
        photoUrl,
        source: b.source,
        rank: b.rank,
        elo: 1400,
      },
    });
    count++;

    if (count % 50 === 0) {
      console.log(`  Seeded ${count}/${valid.length}...`);
    }
  }

  console.log(`Done! Seeded ${count} billionaires.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
