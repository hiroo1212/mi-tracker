"use server";

import { sqlite } from "@/lib/db/client";
import { getIsoWeekInfo } from "@/lib/utils";
import { revalidatePath } from "next/cache";

function recomputeActualHours(weekNumber: number, startDate: string) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);
  const row = sqlite
    .prepare(
      `SELECT COALESCE(SUM(duration_minutes), 0) as minutes FROM study_sessions
       WHERE mode = 'focus' AND started_at >= ? AND started_at < ?`
    )
    .get(new Date(startDate).toISOString(), endDate.toISOString()) as { minutes: number };
  return row.minutes / 60;
}

export async function upsertWeeklyLog(input: {
  weekNumber: number;
  startDate: string;
  focusPhase: number | null;
  targetHours: number;
  notes: string;
}) {
  const now = new Date().toISOString();
  const actualHours = recomputeActualHours(input.weekNumber, input.startDate);
  const existing = sqlite
    .prepare(`SELECT id FROM weekly_logs WHERE week_number = ? AND start_date = ?`)
    .get(input.weekNumber, input.startDate) as { id: number } | undefined;

  if (existing) {
    sqlite
      .prepare(
        `UPDATE weekly_logs SET focus_phase = ?, target_hours = ?, actual_hours = ?, notes = ?, updated_at = ? WHERE id = ?`
      )
      .run(input.focusPhase, input.targetHours, actualHours, input.notes, now, existing.id);
  } else {
    sqlite
      .prepare(
        `INSERT INTO weekly_logs (week_number, start_date, focus_phase, target_hours, actual_hours, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(input.weekNumber, input.startDate, input.focusPhase, input.targetHours, actualHours, input.notes, now, now);
  }
  revalidatePath("/weekly-log");
}

export async function ensureCurrentWeekLog() {
  const { weekNumber, startDate } = getIsoWeekInfo();
  const existing = sqlite
    .prepare(`SELECT id FROM weekly_logs WHERE week_number = ? AND start_date = ?`)
    .get(weekNumber, startDate) as { id: number } | undefined;
  if (!existing) {
    await upsertWeeklyLog({ weekNumber, startDate, focusPhase: null, targetHours: 9, notes: "" });
  }
}

export async function deleteWeeklyLog(id: number) {
  sqlite.prepare(`DELETE FROM weekly_logs WHERE id = ?`).run(id);
  revalidatePath("/weekly-log");
}
