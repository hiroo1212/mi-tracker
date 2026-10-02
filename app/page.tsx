import Link from "next/link";
import { AlertTriangle, Flame, ListTodo } from "lucide-react";
import {
  getPhaseProgress,
  getOverallProgress,
  getTodayTasks,
  getStuckTasks,
  getWeekHours,
  getStudyHeatmap,
  getStreakDays,
} from "@/lib/data/dashboard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Heatmap } from "@/components/dashboard/Heatmap";
import { EmptyState } from "@/components/ui/EmptyState";
import { priorityBadgeClass, statusBadgeClass, formatHours, daysSince } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [overall, phases, todayTasks, stuck, week, heatmap, streak] = await Promise.all([
    getOverallProgress(),
    getPhaseProgress(),
    getTodayTasks(),
    getStuckTasks(),
    getWeekHours(),
    getStudyHeatmap(),
    getStreakDays(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-foreground-muted">Ringkasan progres belajar Market Intelligence kamu.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Progres total</p>
          <p className="mt-1 text-3xl font-semibold">{overall.pct}%</p>
          <p className="mt-1 text-xs text-foreground-muted">
            {overall.done} dari {overall.total} tugas selesai
          </p>
          <ProgressBar pct={overall.pct} className="mt-3" />
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Jam belajar minggu ini</p>
          <p className="mt-1 text-3xl font-semibold">
            {formatHours(week.actualHours)}
            <span className="text-base font-normal text-foreground-muted"> / {formatHours(week.targetHours)}</span>
          </p>
          <p className="mt-1 text-xs text-foreground-muted">Target mingguan</p>
          <ProgressBar pct={(week.actualHours / (week.targetHours || 1)) * 100} className="mt-3" />
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Streak belajar</p>
          <p className="mt-1 flex items-center gap-2 text-3xl font-semibold">
            <Flame size={24} className="text-accent" />
            {streak} hari
          </p>
          <p className="mt-1 text-xs text-foreground-muted">Berturut-turut hingga hari ini</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <ListTodo size={17} className="text-accent" />
            <h2 className="font-medium">Apa yang harus dikerjakan hari ini</h2>
          </div>
          {todayTasks.length === 0 ? (
            <EmptyState
              title="Tidak ada tugas aktif"
              description="Semua tugas Wajib sudah selesai, atau belum ada yang dimulai. Buka roadmap untuk memulai tugas berikutnya."
              actionLabel="Buka Roadmap"
              actionHref="/roadmap"
            />
          ) : (
            <ul className="divide-y divide-border">
              {todayTasks.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-foreground-muted">{t.topic}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityBadgeClass(t.priority)}`}>
                      {t.priority}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(t.status)}`}>
                      {t.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link href="/roadmap" className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
            Lihat semua roadmap &rarr;
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-medium">Aktivitas belajar</h2>
          <Heatmap data={heatmap} />
          <p className="mt-2 text-xs text-foreground-muted">{heatmap.length} hari terakhir</p>
        </div>
      </div>

      {stuck.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
          <div className="mb-2 flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <AlertTriangle size={17} />
            <h2 className="font-medium">Tugas yang mungkin macet</h2>
          </div>
          <p className="mb-3 text-sm text-amber-700/80 dark:text-amber-300/80">
            Tugas berikut berstatus &quot;Proses&quot; lebih dari 7 hari tanpa update. Coba tinjau kembali atau pecah jadi langkah lebih kecil.
          </p>
          <ul className="space-y-1.5">
            {stuck.map((t) => (
              <li key={t.id} className="flex items-center justify-between text-sm">
                <span>{t.title}</span>
                <span className="text-xs text-amber-700/70 dark:text-amber-300/70">
                  {daysSince(t.status_changed_at)} hari
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="mb-3 font-medium">Progres per fase</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {phases.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-medium">{p.name}</p>
                <span className="text-xs text-foreground-muted">{p.targetPeriod}</span>
              </div>
              <ProgressBar pct={p.pct} />
              <p className="mt-1.5 text-xs text-foreground-muted">
                {p.done}/{p.total} tugas &middot; {p.pct}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
