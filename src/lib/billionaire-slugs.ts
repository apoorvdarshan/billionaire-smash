import billionairesData from "@/data/billionaires.json";
import type { StaticBillionaire } from "@/lib/forbes";

export type BillionaireProfile = StaticBillionaire;

const billionaires = billionairesData as BillionaireProfile[];

export function getBillionaires(): BillionaireProfile[] {
  return [...billionaires];
}

export function slugifyBillionaireName(name: string): string {
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || "billionaire";
}

export function getBillionaireSlug(billionaire: BillionaireProfile): string {
  return `${slugifyBillionaireName(billionaire.name)}-${billionaire.forbesId}`;
}

export function getBillionaireBySlug(
  slug: string
): BillionaireProfile | null {
  const forbesId = Number(slug.split("-").at(-1));
  if (!Number.isFinite(forbesId)) return null;

  const billionaire = billionaires.find((b) => b.forbesId === forbesId);
  if (!billionaire) return null;

  return getBillionaireSlug(billionaire) === slug ? billionaire : null;
}

export function getBillionaireProfilePath(
  billionaire: BillionaireProfile
): string {
  return `/billionaires/${getBillionaireSlug(billionaire)}`;
}
