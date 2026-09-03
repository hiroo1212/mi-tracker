import { NextResponse } from "next/server";
import { sqlite } from "@/lib/db/client";

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

export async function GET() {
  const tables: Record<string, unknown[]> = {};
  for (const table of TABLES) {
    tables[table] = sqlite.prepare(`SELECT * FROM ${table}`).all();
  }
  const data = { exportedAt: new Date().toISOString(), tables };

  const json = JSON.stringify(data, null, 2);
  return new NextResponse(json, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="mi-tracker-backup-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
