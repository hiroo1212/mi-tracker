"use server";

import { sqlite } from "@/lib/db/client";
import { getIsoWeekInfo } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function logStudySession(input: {
  taskId: number | null;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  mode: "focus" | "break";
}) {
  const now = new Date().toISOString();
  sqlite
    .prepare(
      `INSERT INTO study_sessions (task_id, started_at, ended_at, duration_minutes, mode, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(input.taskId, input.startedAt, input.endedAt, input.durationMinutes, input.mode, now);

  if (input.mode === "focus") {
    const { weekNumber, startDate } = getIsoWeekInfo(input.startedAt);
    const hours = input.durationMinutes / 60;
    const existing = sqlite
      .prepare(`SELECT id, actual_hours as actualHours FROM weekly_logs WHERE week_number = ? AND start_date = ?`)
      .get(weekNumber, startDate) as { id: number; actualHours: number } | undefined;

    if (existing) {
      sqlite
        .prepare(`UPDATE weekly_logs SET actual_hours = ?, updated_at = ? WHERE id = ?`)
        .run(existing.actualHours + hours, now, existing.id);
    } else {
      sqlite
        .prepare(
          `INSERT INTO weekly_logs (week_number, start_date, target_hours, actual_hours, notes, created_at, updated_at)
           VALUES (?, ?, 9, ?, '', ?, ?)`
        )
        .run(weekNumber, startDate, hours, now, now);
    }
  }

  revalidatePath("/");
  revalidatePath("/weekly-log");
  revalidatePath("/timer");
}

export async function getInProgressTasks() {
  return sqlite
    .prepare(`SELECT id, title, topic FROM tasks WHERE status = 'Proses' ORDER BY no ASC`)
    .all() as { id: number; title: string; topic: string }[];
}
