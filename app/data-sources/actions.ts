"use server";

import { sqlite } from "@/lib/db/client";
import { revalidatePath } from "next/cache";

export type DataSourceInput = { name: string; url: string; category: string; personalNote: string };

export async function createDataSource(input: DataSourceInput) {
  const now = new Date().toISOString();
  sqlite
    .prepare(`INSERT INTO data_sources (name, url, category, personal_note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(input.name, input.url, input.category, input.personalNote, now, now);
  revalidatePath("/data-sources");
}

export async function updateDataSource(id: number, input: DataSourceInput) {
  const now = new Date().toISOString();
  sqlite
    .prepare(`UPDATE data_sources SET name = ?, url = ?, category = ?, personal_note = ?, updated_at = ? WHERE id = ?`)
    .run(input.name, input.url, input.category, input.personalNote, now, id);
  revalidatePath("/data-sources");
}

export async function deleteDataSource(id: number) {
  sqlite.prepare(`DELETE FROM data_sources WHERE id = ?`).run(id);
  revalidatePath("/data-sources");
}
