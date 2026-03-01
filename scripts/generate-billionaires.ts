import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

interface ForbesRTBPerson {
  uri: string;
  personName: string;
  finalWorth: number; // in millions
  countryOfCitizenship: string;
  squareImage?: string;
  source: string;
  rank: number;
  industries?: string[];
}

interface ForbesRTBResponse {
  personList: {
    personsLists: ForbesRTBPerson[];
  };
}

function fixPhotoUrl(url: string): string {
  if (!url) return "";
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
    if (buffer.length < 100) return false; // skip tiny/empty responses
    writeFileSync(destPath, buffer);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const FORBES_RTB_URL =
    "https://www.forbes.com/forbesapi/person/rtb/0/position/true.json?fields=personName,uri,rank,finalWorth,countryOfCitizenship,source,squareImage,industries&limit=3200";

  console.log("Fetching from Forbes Real-Time Billionaires API...");
  const res = await fetch(FORBES_RTB_URL);
  if (!res.ok) throw new Error(`Forbes RTB API returned ${res.status}`);

  const json: ForbesRTBResponse = await res.json();
  const raw = json.personList.personsLists;
  console.log(`Got ${raw.length} entries from API`);

  const valid = raw.filter(
    (b) => b.personName && b.finalWorth > 0
  );
  console.log(`${valid.length} valid billionaires (have name + net worth > 0)`);

  const billionaires = valid.map((b) => ({
    forbesId: uriToId(b.uri || b.personName),
    name: b.personName,
    netWorth: Math.round((b.finalWorth / 1000) * 10) / 10,
    country: b.countryOfCitizenship || "Unknown",
    photoUrl: fixPhotoUrl(b.squareImage || ""),
    source: b.source || (b.industries?.[0] ?? "Unknown"),
    rank: b.rank,
  }));

  // Download photos locally
  const photosDir = join(__dirname, "..", "public", "photos");
  mkdirSync(photosDir, { recursive: true });

  const withPhoto = billionaires.filter((b) => b.photoUrl);
  const noPhoto = billionaires.filter((b) => !b.photoUrl);
  console.log(`\n${withPhoto.length} have photos, ${noPhoto.length} have no photo (will use placeholder)`);

  const failures: string[] = [];
  const batchSize = 15;

  for (let i = 0; i < withPhoto.length; i += batchSize) {
    const batch = withPhoto.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (b) => {
        const dest = join(photosDir, `${b.forbesId}.jpg`);
        const ok = await downloadPhoto(b.photoUrl, dest);
        if (!ok) failures.push(b.name);
      })
    );

    const done = Math.min(i + batchSize, withPhoto.length);
    if (done % 100 === 0 || done === withPhoto.length) {
      console.log(`Downloaded ${done}/${withPhoto.length} photos`);
    }
  }

  // Set local paths — use placeholder for missing photos
  for (const b of billionaires) {
    if (b.photoUrl && !failures.includes(b.name)) {
      b.photoUrl = `/photos/${b.forbesId}.jpg`;
    } else {
      b.photoUrl = `/photos/placeholder.svg`;
    }
  }

  const outPath = join(__dirname, "..", "src", "data", "billionaires.json");
  writeFileSync(outPath, JSON.stringify(billionaires, null, 2) + "\n");
  console.log(`\nWrote ${billionaires.length} billionaires to src/data/billionaires.json`);

  if (failures.length > 0) {
    console.warn(`\nFailed to download ${failures.length} photos (using placeholder):`);
    failures.slice(0, 20).forEach((f) => console.warn(`  - ${f}`));
    if (failures.length > 20) console.warn(`  ... and ${failures.length - 20} more`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
