import { sqlite, ensureSeeded } from "@/lib/db/client";
import { WeeklyLogView, type WeeklyLogRow } from "./WeeklyLogView";

export const dynamic = "force-dynamic";

export default async function WeeklyLogPage() {
  await ensureSeeded();
  const logs = (await sqlite.prepare(`SELECT * FROM weekly_logs ORDER BY start_date DESC`).all()) as WeeklyLogRow[];
  const phases = (await sqlite.prepare(`SELECT id, name FROM phases ORDER BY "order" ASC`).all()) as { id: number; name: string }[];
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Log Mingguan</h1>
        <p className="text-sm text-foreground-muted">Bandingkan target vs jam belajar aktual tiap minggu.</p>
      </div>
      <WeeklyLogView logs={logs} phases={phases} />
    </div>
  );
}
