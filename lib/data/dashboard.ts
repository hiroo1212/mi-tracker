import { sqlite, ensureSeeded } from "@/lib/db/client";
import { getIsoWeekInfo, daysSince } from "@/lib/utils";
import dayjs from "dayjs";

export type PhaseProgress = {
  id: number;
  name: string;
  targetPeriod: string;
  order: number;
  total: number;
  done: number;
  pct: number;
};

export type TaskRow = {
  id: number;
  no: number;
  phase_id: number;
  topic: string;
  title: string;
  priority: string;
  status: string;
  status_changed_at: string | null;
  estimated_hours: number;
};

export async function getPhaseProgress(): Promise<PhaseProgress[]> {
  await ensureSeeded();
  const phases = (await sqlite
    .prepare(`SELECT id, name, target_period as targetPeriod, "order" as "order" FROM phases ORDER BY "order" ASC`)
    .all()) as { id: number; name: string; targetPeriod: string; order: number }[];

  const counts = (await sqlite
    .prepare(
      `SELECT phase_id, COUNT(*) as total, SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as done
       FROM tasks GROUP BY phase_id`
    )
    .all()) as { phase_id: number; total: number; done: number }[];

  const countMap = new Map(counts.map((c) => [c.phase_id, c]));

  return phases.map((p) => {
    const c = countMap.get(p.id) ?? { total: 0, done: 0 };
    const total = Number(c.total || 0);
    const done = Number(c.done || 0);
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { ...p, total, done, pct };
  });
}

export async function getOverallProgress() {
  const row = (await sqlite
    .prepare(
      `SELECT COUNT(*) as total, SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as done FROM tasks`
    )
    .get()) as { total: number | string; done: number | string };
  const total = Number(row?.total || 0);
  const done = Number(row?.done || 0);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}

export async function getTodayTasks(): Promise<TaskRow[]> {
  const inProgress = (await sqlite
    .prepare(
      `SELECT t.id, t.no, t.phase_id, t.topic, t.title, t.priority, t.status, t.status_changed_at, t.estimated_hours
       FROM tasks t
       JOIN phases p ON p.id = t.phase_id
       WHERE t.status = 'Proses'
       ORDER BY p."order" ASC, t.no ASC`
    )
    .all()) as TaskRow[];

  const nextWajib = (await sqlite
    .prepare(
      `SELECT t.id, t.no, t.phase_id, t.topic, t.title, t.priority, t.status, t.status_changed_at, t.estimated_hours
       FROM tasks t
       JOIN phases p ON p.id = t.phase_id
       WHERE t.status = 'Belum' AND t.priority = 'Wajib'
       ORDER BY p."order" ASC, t.no ASC
       LIMIT 1`
    )
    .all()) as TaskRow[];

  return [...inProgress, ...nextWajib];
}

export async function getStuckTasks(): Promise<TaskRow[]> {
  const rows = (await sqlite
    .prepare(
      `SELECT t.id, t.no, t.phase_id, t.topic, t.title, t.priority, t.status, t.status_changed_at, t.estimated_hours
       FROM tasks t
       WHERE t.status = 'Proses'`
    )
    .all()) as TaskRow[];
  return rows.filter((r) => daysSince(r.status_changed_at) > 7);
}

export async function getWeekHours() {
  await ensureSeeded();
  const { weekNumber, startDate } = getIsoWeekInfo();
  const row = (await sqlite
    .prepare(`SELECT target_hours as targetHours, actual_hours as actualHours FROM weekly_logs WHERE week_number = ? AND start_date = ?`)
    .get(weekNumber, startDate)) as { targetHours: number; actualHours: number } | undefined;

  if (row) return { targetHours: row.targetHours, actualHours: row.actualHours, weekNumber, startDate };
  return { targetHours: 9, actualHours: 0, weekNumber, startDate };
}

export async function getStudyHeatmap(days = 84) {
  const since = dayjs().subtract(days, "day").startOf("day").toISOString();
  const rows = (await sqlite
    .prepare(
      `SELECT started_at, duration_minutes FROM study_sessions WHERE started_at >= ? AND mode = 'focus'`
    )
    .all(since)) as { started_at: string; duration_minutes: number }[];

  const byDay = new Map<string, number>();
  for (const r of rows) {
    const d = dayjs(r.started_at).format("YYYY-MM-DD");
    byDay.set(d, (byDay.get(d) ?? 0) + r.duration_minutes);
  }

  const result: { date: string; minutes: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = dayjs().subtract(i, "day").format("YYYY-MM-DD");
    result.push({ date: d, minutes: byDay.get(d) ?? 0 });
  }
  return result;
}

export async function getStreakDays() {
  const heatmap = await getStudyHeatmap(365);
  let streak = 0;
  for (let i = heatmap.length - 1; i >= 0; i--) {
    if (heatmap[i].minutes > 0) streak++;
    else break;
  }
  return streak;
}
