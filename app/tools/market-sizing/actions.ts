"use server";

import { sqlite } from "@/lib/db/client";
import { revalidatePath } from "next/cache";

export type MarketSizingInput = {
  name: string;
  method: string;
  tamValue: number;
  tamAssumption: string;
  samValue: number;
  samAssumption: string;
  somValue: number;
  somAssumption: string;
};

export async function saveMarketSizing(input: MarketSizingInput) {
  const now = new Date().toISOString();
  sqlite
    .prepare(
      `INSERT INTO market_sizing_calcs (name, method, tam_value, tam_assumption, sam_value, sam_assumption, som_value, som_assumption, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.name,
      input.method,
      input.tamValue,
      input.tamAssumption,
      input.samValue,
      input.samAssumption,
      input.somValue,
      input.somAssumption,
      now
    );
  revalidatePath("/tools/market-sizing");
}

export async function deleteMarketSizing(id: number) {
  sqlite.prepare(`DELETE FROM market_sizing_calcs WHERE id = ?`).run(id);
  revalidatePath("/tools/market-sizing");
}
