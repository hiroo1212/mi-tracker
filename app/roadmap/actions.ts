"use server";

import { sqlite } from "@/lib/db/client";
import { revalidatePath } from "next/cache";

export async function updateTaskStatus(taskId: number, status: string) {
  const now = new Date().toISOString();
  const completedDate = status === "Selesai" ? now : null;
  sqlite
    .prepare(
      `UPDATE tasks SET status = ?, status_changed_at = ?, completed_date = ?, updated_at = ? WHERE id = ?`
    )
    .run(status, now, completedDate, now, taskId);
  revalidatePath("/roadmap");
  revalidatePath("/");
}

export async function updateTaskNotes(taskId: number, notes: string) {
  const now = new Date().toISOString();
  sqlite.prepare(`UPDATE tasks SET notes = ?, updated_at = ? WHERE id = ?`).run(notes, now, taskId);
  revalidatePath("/roadmap");
}
