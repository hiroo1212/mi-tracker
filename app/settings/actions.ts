"use server";

import { sqlite } from "@/lib/db/client";
import { revalidatePath } from "next/cache";

const TABLES = [
  "phases",
  "tasks",
  "weekly_logs",
  "study_sessions",
  "notes",
  "flashcards",
  "market_sizing_calcs",
  "data_sources",
] as const;

export async function importBackup(jsonText: string): Promise<{ ok: boolean; message: string }> {
  let parsed: { tables?: Record<string, Record<string, unknown>[]> };
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return { ok: false, message: "File bukan JSON yang valid." };
  }

  const tables = parsed.tables;
  if (!tables || typeof tables !== "object") {
    return { ok: false, message: "Format backup tidak dikenali (field 'tables' tidak ditemukan)." };
  }

  try {
    const tx = sqlite.transaction(() => {
      // Delete children before parents-ish order doesn't matter much without FK constraints, but reverse order is safer.
      for (const table of [...TABLES].reverse()) {
        sqlite.prepare(`DELETE FROM ${table}`).run();
      }
      for (const table of TABLES) {
        const rows = tables[table];
        if (!Array.isArray(rows) || rows.length === 0) continue;
        const columns = Object.keys(rows[0]);
        const placeholders = columns.map(() => "?").join(", ");
        const stmt = sqlite.prepare(
          `INSERT INTO ${table} (${columns.map((c) => `"${c}"`).join(", ")}) VALUES (${placeholders})`
        );
        for (const row of rows) {
          stmt.run(...columns.map((c) => row[c] as never));
        }
      }
    });
    tx();
  } catch (err) {
    return { ok: false, message: `Gagal mengimpor: ${(err as Error).message}` };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: "Backup berhasil diimpor." };
}
