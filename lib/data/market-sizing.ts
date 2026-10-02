import { sqlite, ensureSeeded } from "@/lib/db/client";

export type MarketSizingCalc = {
  id: number;
  name: string;
  method: string;
  tam_value: number;
  tam_assumption: string;
  sam_value: number;
  sam_assumption: string;
  som_value: number;
  som_assumption: string;
  created_at: string;
};

export async function getMarketSizingCalcs(): Promise<MarketSizingCalc[]> {
  await ensureSeeded();
  return (await sqlite.prepare(`SELECT * FROM market_sizing_calcs ORDER BY created_at DESC`).all()) as MarketSizingCalc[];
}
