import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

interface ForbesRaw {
  uri: string;
  personName: string;
  finalWorth: number; // in millions
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

async function downloadPhoto(
  url: string,
  destPath: string
): Promise<boolean> {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(destPath, buffer);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log("Fetching from Forbes API...");
  const res = await fetch("https://forbes400.onrender.com/api/forbes400");
  if (!res.ok) throw new Error(`Forbes API returned ${res.status}`);

  const raw: ForbesRaw[] = await res.json();
  const valid = raw.filter(
    (b) => b.personName && b.squareImage && b.finalWorth > 0
  );

  const billionaires = valid.map((b) => ({
    forbesId: uriToId(b.uri || b.personName),
    name: b.personName,
    netWorth: Math.round((b.finalWorth / 1000) * 10) / 10,
    country: b.countryOfCitizenship,
    photoUrl: fixPhotoUrl(b.squareImage),
    source: b.source,
    rank: b.rank,
  }));

  // Download photos locally
  const photosDir = join(__dirname, "..", "public", "photos");
  mkdirSync(photosDir, { recursive: true });

  const failures: string[] = [];
  const batchSize = 10;

  for (let i = 0; i < billionaires.length; i += batchSize) {
    const batch = billionaires.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (b) => {
        const dest = join(photosDir, `${b.forbesId}.jpg`);
        const ok = await downloadPhoto(b.photoUrl, dest);
        if (!ok) failures.push(`${b.name} (${b.photoUrl})`);
        return ok;
      })
    );

    const done = Math.min(i + batchSize, billionaires.length);
    if (done % 50 === 0 || done === billionaires.length) {
      console.log(`Downloaded ${done}/${billionaires.length} photos`);
    }
  }

  // Update photoUrl to local paths
  for (const b of billionaires) {
    b.photoUrl = `/photos/${b.forbesId}.jpg`;
  }

  const outPath = join(__dirname, "..", "src", "data", "billionaires.json");
  writeFileSync(outPath, JSON.stringify(billionaires, null, 2) + "\n");
  console.log(`Wrote ${billionaires.length} billionaires to src/data/billionaires.json`);

  if (failures.length > 0) {
    console.warn(`\nFailed to download ${failures.length} photos:`);
    failures.forEach((f) => console.warn(`  - ${f}`));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
