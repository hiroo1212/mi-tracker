"use server";

import { sqlite } from "@/lib/db/client";
import { revalidatePath } from "next/cache";

export async function createNote(input: { title: string; content: string; tags: string; relatedTaskId: number | null }) {
  const now = new Date().toISOString();
  const result = sqlite
    .prepare(
      `INSERT INTO notes (title, content, tags, related_task_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(input.title, input.content, input.tags, input.relatedTaskId, now, now);
  revalidatePath("/notes");
  revalidatePath("/roadmap");
  return result.lastInsertRowid as number;
}

export async function updateNote(id: number, input: { title: string; content: string; tags: string; relatedTaskId: number | null }) {
  const now = new Date().toISOString();
  sqlite
    .prepare(
      `UPDATE notes SET title = ?, content = ?, tags = ?, related_task_id = ?, updated_at = ? WHERE id = ?`
    )
    .run(input.title, input.content, input.tags, input.relatedTaskId, now, id);
  revalidatePath("/notes");
  revalidatePath("/roadmap");
}

export async function deleteNote(id: number) {
  sqlite.prepare(`DELETE FROM notes WHERE id = ?`).run(id);
  revalidatePath("/notes");
  revalidatePath("/roadmap");
}
