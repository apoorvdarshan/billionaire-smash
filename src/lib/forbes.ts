export interface ForbesBillionaire {
  uri: string;
  personName: string;
  finalWorth: number; // in millions
  countryOfCitizenship: string;
  squareImage: string;
  source: string;
  rank: number;
}

export function fixPhotoUrl(url: string): string {
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}

export async function fetchForbesBillionaires(): Promise<ForbesBillionaire[]> {
  const res = await fetch("https://forbes400.onrender.com/api/forbes400", {
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Forbes API returned ${res.status}`);
  }

  const data: ForbesBillionaire[] = await res.json();
  return data.filter(
    (b) => b.personName && b.squareImage && b.finalWorth > 0
  );
}
