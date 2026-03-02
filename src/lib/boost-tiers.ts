export interface BoostTier {
  id: string;
  price: number;
  elo: number;
  label: string;
  eloLabel: string;
  bonus?: string;
}

export const BOOST_TIERS: BoostTier[] = [
  { id: "tier1", price: 1, elo: 10, label: "$1", eloLabel: "+10 Elo" },
  { id: "tier2", price: 5, elo: 60, label: "$5", eloLabel: "+60 Elo", bonus: "20% bonus" },
  { id: "tier3", price: 10, elo: 150, label: "$10", eloLabel: "+150 Elo", bonus: "50% bonus" },
  { id: "tier4", price: 25, elo: 400, label: "$25", eloLabel: "+400 Elo", bonus: "60% bonus" },
];

export function getTierById(id: string): BoostTier | undefined {
  return BOOST_TIERS.find((t) => t.id === id);
}
