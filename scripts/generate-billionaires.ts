import { writeFileSync } from "fs";
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

  const outPath = join(__dirname, "..", "src", "data", "billionaires.json");
  writeFileSync(outPath, JSON.stringify(billionaires, null, 2) + "\n");
  console.log(`Wrote ${billionaires.length} billionaires to src/data/billionaires.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
