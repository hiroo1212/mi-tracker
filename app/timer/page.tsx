import { sqlite, ensureSeeded } from "@/lib/db/client";
import { TimerView } from "./TimerView";

export const dynamic = "force-dynamic";

export default async function TimerPage() {
  await ensureSeeded();
  const tasks = (await sqlite
    .prepare(`SELECT id, title, topic FROM tasks WHERE status = 'Proses' ORDER BY no ASC`)
    .all()) as { id: number; title: string; topic: string }[];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Timer Belajar</h1>
        <p className="text-sm text-foreground-muted">Pomodoro untuk sesi fokus, otomatis tercatat ke log mingguan.</p>
      </div>
      <TimerView tasks={tasks} />
    </div>
  );
}
