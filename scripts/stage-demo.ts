import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Curated billionaire DB IDs and their staged Elo / records
const curated: {
  id: number;
  elo: number;
  wins: number;
  losses: number;
}[] = [
  { id: 1, elo: 1687, wins: 48, losses: 12 },   // Elon Musk
  { id: 2, elo: 1612, wins: 39, losses: 18 },    // Larry Page
  { id: 3, elo: 1589, wins: 36, losses: 20 },    // Sergey Brin
  { id: 4, elo: 1643, wins: 42, losses: 15 },    // Jeff Bezos
  { id: 5, elo: 1571, wins: 34, losses: 22 },    // Mark Zuckerberg
  { id: 6, elo: 1534, wins: 30, losses: 24 },    // Larry Ellison
  { id: 7, elo: 1498, wins: 27, losses: 27 },    // Bernard Arnault & family
  { id: 8, elo: 1621, wins: 40, losses: 17 },    // Jensen Huang
  { id: 9, elo: 1556, wins: 33, losses: 23 },    // Warren Buffett
  { id: 13, elo: 1467, wins: 24, losses: 29 },   // Michael Dell
  { id: 15, elo: 1445, wins: 22, losses: 31 },   // Carlos Slim Helu & family
  { id: 16, elo: 1512, wins: 28, losses: 25 },   // Steve Ballmer
  { id: 17, elo: 1478, wins: 26, losses: 28 },   // Michael Bloomberg
  { id: 18, elo: 1598, wins: 37, losses: 19 },   // Bill Gates
  { id: 19, elo: 1489, wins: 25, losses: 26 },   // Mukesh Ambani
  { id: 476, elo: 1523, wins: 31, losses: 25 },  // Dario Amodei
  { id: 957, elo: 1545, wins: 32, losses: 24 },  // Sam Altman
];

const curatedIds = curated.map((c) => c.id);

// Fake votes with recognizable voter names
const fakeVotes: { winnerId: number; loserId: number; voterName: string; minutesAgo: number }[] = [
  { winnerId: 1, loserId: 5, voterName: "Alex", minutesAgo: 1 },
  { winnerId: 8, loserId: 6, voterName: "Jordan", minutesAgo: 2 },
  { winnerId: 4, loserId: 7, voterName: "Priya", minutesAgo: 3 },
  { winnerId: 18, loserId: 9, voterName: "Sam", minutesAgo: 4 },
  { winnerId: 2, loserId: 16, voterName: "Mia", minutesAgo: 5 },
  { winnerId: 957, loserId: 13, voterName: "Ethan", minutesAgo: 7 },
  { winnerId: 476, loserId: 15, voterName: "Aisha", minutesAgo: 8 },
  { winnerId: 1, loserId: 18, voterName: "Ryan", minutesAgo: 10 },
  { winnerId: 5, loserId: 3, voterName: "Nina", minutesAgo: 12 },
  { winnerId: 8, loserId: 19, voterName: "Carlos", minutesAgo: 14 },
  { winnerId: 4, loserId: 17, voterName: "Jess", minutesAgo: 16 },
  { winnerId: 476, loserId: 957, voterName: "Tomasz", minutesAgo: 18 },
  { winnerId: 9, loserId: 6, voterName: "Lena", minutesAgo: 22 },
  { winnerId: 2, loserId: 13, voterName: "Derek", minutesAgo: 25 },
  { winnerId: 1, loserId: 4, voterName: "Sofia", minutesAgo: 30 },
];

async function main() {
  console.log("Staging demo data...\n");

  // 1. Delete votes referencing non-curated billionaires, then delete non-curated billionaires
  // Also delete boosts for non-curated
  console.log("Deleting non-curated boosts...");
  await prisma.boost.deleteMany({
    where: { billionaireId: { notIn: curatedIds } },
  });

  console.log("Deleting non-curated votes...");
  await prisma.vote.deleteMany({
    where: {
      OR: [
        { winnerId: { notIn: curatedIds } },
        { loserId: { notIn: curatedIds } },
      ],
    },
  });

  // Also delete any remaining votes (from previous seeding)
  await prisma.vote.deleteMany({});

  console.log("Deleting non-curated billionaires...");
  const deleted = await prisma.billionaire.deleteMany({
    where: { id: { notIn: curatedIds } },
  });
  console.log(`  Removed ${deleted.count} billionaires.`);

  const remaining = await prisma.billionaire.count();
  console.log(`  ${remaining} billionaires remaining.\n`);

  // 2. Update Elo scores and win/loss records
  console.log("Setting Elo scores and records...");
  for (const c of curated) {
    await prisma.billionaire.update({
      where: { id: c.id },
      data: { elo: c.elo, eloBoost: 0, wins: c.wins, losses: c.losses },
    });
  }
  console.log("  Done.\n");

  // 3. Insert fake votes for the live feed
  console.log("Inserting fake votes for the feed ticker...");
  const now = new Date();
  for (const v of fakeVotes) {
    const createdAt = new Date(now.getTime() - v.minutesAgo * 60 * 1000);
    await prisma.vote.create({
      data: {
        winnerId: v.winnerId,
        loserId: v.loserId,
        voterName: v.voterName,
        createdAt,
      },
    });
  }
  console.log(`  Inserted ${fakeVotes.length} votes.\n`);

  // 4. Set visitor count
  console.log("Setting visitor count to 1,247...");
  await prisma.siteStats.upsert({
    where: { id: 1 },
    update: { visitorCount: 1247 },
    create: { id: 1, visitorCount: 1247 },
  });
  console.log("  Done.\n");

  // Summary
  const billionaires = await prisma.billionaire.findMany({
    orderBy: { elo: "desc" },
    select: { id: true, name: true, elo: true, wins: true, losses: true },
  });
  console.log("Final leaderboard:");
  billionaires.forEach((b, i) => {
    console.log(
      `  ${i + 1}. ${b.name} — Elo ${b.elo} (${b.wins}W/${b.losses}L)`
    );
  });

  const voteCount = await prisma.vote.count();
  console.log(`\nTotal votes in DB: ${voteCount}`);
  console.log("\nStaging complete! Ready for screen recording.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
