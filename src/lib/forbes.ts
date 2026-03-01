import billionairesData from "@/data/billionaires.json";

export interface StaticBillionaire {
  forbesId: number;
  name: string;
  netWorth: number;
  country: string;
  photoUrl: string;
  source: string;
  rank: number;
}

export function getBillionaires(): StaticBillionaire[] {
  return billionairesData;
}
