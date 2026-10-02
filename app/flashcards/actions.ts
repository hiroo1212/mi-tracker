"use server";

import { sqlite } from "@/lib/db/client";
import { revalidatePath } from "next/cache";

export async function createFlashcard(input: { term: string; definition: string; category: string }) {
  const now = new Date().toISOString();
  await sqlite
    .prepare(
      `INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES (?, ?, ?, 1, ?, ?)`
    )
    .run(input.term, input.definition, input.category, now, now);
  revalidatePath("/flashcards");
}

export async function updateFlashcard(id: number, input: { term: string; definition: string; category: string }) {
  const now = new Date().toISOString();
  await sqlite
    .prepare(`UPDATE flashcards SET term = ?, definition = ?, category = ?, updated_at = ? WHERE id = ?`)
    .run(input.term, input.definition, input.category, now, id);
  revalidatePath("/flashcards");
}

export async function deleteFlashcard(id: number) {
  await sqlite.prepare(`DELETE FROM flashcards WHERE id = ?`).run(id);
  revalidatePath("/flashcards");
}

export async function reviewFlashcard(id: number, understood: boolean) {
  const now = new Date().toISOString();
  const row = (await sqlite.prepare(`SELECT confidence_level as level FROM flashcards WHERE id = ?`).get(id)) as
    | { level: number }
    | undefined;
  const current = row?.level ?? 1;
  const next = understood ? Math.min(5, current + 1) : Math.max(1, current - 1);
  await sqlite
    .prepare(`UPDATE flashcards SET confidence_level = ?, last_reviewed_at = ?, updated_at = ? WHERE id = ?`)
    .run(next, now, now, id);
  revalidatePath("/flashcards");
}
