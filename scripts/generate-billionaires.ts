import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

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
  destPath: string,
  headers?: Record<string, string>
): Promise<boolean> {
  try {
    const res = await fetch(url, headers ? { headers } : undefined);
    if (!res.ok) return false;
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 100) return false; // skip tiny/empty responses
    writeFileSync(destPath, buffer);
    return true;
  } catch {
    return false;
  }
}

// --- Wikidata / Wikimedia Commons helpers ---

const WIKI_UA = "BSmashBot/1.0 (https://bsmash.app)";
const WIKI_HEADERS = { "User-Agent": WIKI_UA };

function cleanNameForSearch(name: string): string {
  return name.replace(/\s*&\s*family$/i, "").trim();
}

async function wikiFetch(url: string): Promise<any> {
  const res = await fetch(url, { headers: WIKI_HEADERS });
  if (!res.ok) return null;
  return res.json();
}

function commonsThumbUrl(filename: string, width = 416): string {
  const normalized = filename.replace(/ /g, "_");
  const md5 = createHash("md5").update(normalized).digest("hex");
  const a = md5[0];
  const ab = md5.slice(0, 2);
  const encoded = encodeURIComponent(normalized);
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${a}/${ab}/${encoded}/${width}px-${encoded}`;
}

async function searchWikidata(name: string): Promise<string | null> {
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&limit=5&format=json`;
  const data = await wikiFetch(url);
  if (!data?.search?.length) return null;

  // Prefer results whose description contains business-related keywords
  const bizKeywords = [
    "business", "entrepreneur", "investor", "billionaire", "founder",
    "executive", "magnate", "tycoon", "chairman", "ceo", "philanthropist",
    "industrialist", "banker", "financier",
  ];

  for (const result of data.search) {
    const desc = (result.description || "").toLowerCase();
    if (bizKeywords.some((kw) => desc.includes(kw))) {
      return result.id as string;
    }
  }
  // Fallback: return first result if it's a human (we'll verify via P18)
  return data.search[0].id as string;
}

async function getWikidataImage(qid: string): Promise<string | null> {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${qid}&property=P18&format=json`;
  const data = await wikiFetch(url);
  const claims = data?.claims?.P18;
  if (!claims?.length) return null;
  const filename = claims[0]?.mainsnak?.datavalue?.value;
  return filename || null;
}

async function findWikidataPhoto(name: string): Promise<string | null> {
  const cleaned = cleanNameForSearch(name);
  const qid = await searchWikidata(cleaned);
  if (!qid) return null;
  const filename = await getWikidataImage(qid);
  if (!filename) return null;
  return commonsThumbUrl(filename);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  // --- Wikidata second pass: fill missing photos ---
  const missing = billionaires.filter((b) => b.photoUrl === "/photos/placeholder.svg");
  console.log(`\nWikidata pass: attempting to find photos for ${missing.length} billionaires...`);

  let wikiFound = 0;
  let wikiErrors = 0;
  const wikiBatchSize = 5;

  for (let i = 0; i < missing.length; i += wikiBatchSize) {
    const batch = missing.slice(i, i + wikiBatchSize);
    await Promise.all(
      batch.map(async (b) => {
        try {
          const thumbUrl = await findWikidataPhoto(b.name);
          if (!thumbUrl) return;

          const dest = join(photosDir, `${b.forbesId}.jpg`);
          const ok = await downloadPhoto(thumbUrl, dest, WIKI_HEADERS);
          if (ok) {
            b.photoUrl = `/photos/${b.forbesId}.jpg`;
            wikiFound++;
          }
        } catch {
          wikiErrors++;
        }
      })
    );

    const done = Math.min(i + wikiBatchSize, missing.length);
    if (done % 50 === 0 || done === missing.length) {
      console.log(`Wikidata: checked ${done}/${missing.length} (found ${wikiFound} so far)`);
    }

    await sleep(200);
  }

  const stillMissing = billionaires.filter((b) => b.photoUrl === "/photos/placeholder.svg").length;
  console.log(`\nWikidata pass complete: found ${wikiFound} photos, ${stillMissing} still missing`);
  if (wikiErrors > 0) console.warn(`Wikidata errors: ${wikiErrors}`);

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
