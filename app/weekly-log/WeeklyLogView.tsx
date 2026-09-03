"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Trash2, CalendarRange } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { getIsoWeekInfo, formatDate, formatHours } from "@/lib/utils";
import { upsertWeeklyLog, deleteWeeklyLog } from "./actions";

export type WeeklyLogRow = {
  id: number;
  week_number: number;
  start_date: string;
  focus_phase: number | null;
  target_hours: number;
  actual_hours: number;
  notes: string;
};

type Phase = { id: number; name: string };

const EMPTY_FORM = { focusPhase: "", targetHours: "9", notes: "" };

export function WeeklyLogView({ logs, phases }: { logs: WeeklyLogRow[]; phases: Phase[] }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const chartData = [...logs]
    .sort((a, b) => a.start_date.localeCompare(b.start_date))
    .map((l) => ({
      week: `M${l.week_number}`,
      Target: l.target_hours,
      Aktual: Math.round(l.actual_hours * 10) / 10,
    }));

  async function addCurrentWeek() {
    setSaving(true);
    const { weekNumber, startDate } = getIsoWeekInfo();
    await upsertWeeklyLog({
      weekNumber,
      startDate,
      focusPhase: form.focusPhase ? Number(form.focusPhase) : null,
      targetHours: Number(form.targetHours) || 9,
      notes: form.notes,
    });
    setForm(EMPTY_FORM);
    setSaving(false);
    router.refresh();
  }

  async function remove(id: number) {
    if (!confirm("Hapus log minggu ini?")) return;
    await deleteWeeklyLog(id);
    router.refresh();
  }

  function phaseName(id: number | null) {
    if (id === null) return "-";
    return phases.find((p) => p.id === id)?.name ?? "-";
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-3 font-medium">Catat / perbarui minggu berjalan</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <select
            value={form.focusPhase}
            onChange={(e) => setForm((f) => ({ ...f, focusPhase: e.target.value }))}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="">Fase fokus</option>
            {phases.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={form.targetHours}
            onChange={(e) => setForm((f) => ({ ...f, targetHours: e.target.value }))}
            placeholder="Target jam"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Catatan hambatan"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent sm:col-span-1"
          />
          <button
            onClick={addCurrentWeek}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
          >
            <Plus size={15} /> Simpan minggu ini
          </button>
        </div>
        <p className="mt-2 text-xs text-foreground-muted">Jam aktual dihitung otomatis dari sesi timer yang sudah dicatat.</p>
      </div>

      {logs.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="Belum ada log mingguan"
          description="Simpan minggu berjalan di atas untuk mulai melacak jam belajarmu."
        />
      ) : (
        <>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-3 font-medium">Jam belajar per minggu</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" stroke="var(--foreground-muted)" fontSize={12} />
                  <YAxis stroke="var(--foreground-muted)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="Target" stroke="var(--foreground-muted)" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Aktual" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-foreground-muted">
                  <th className="px-4 py-3">Minggu</th>
                  <th className="px-4 py-3">Mulai</th>
                  <th className="px-4 py-3">Fase fokus</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Aktual</th>
                  <th className="px-4 py-3">Catatan</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {[...logs]
                  .sort((a, b) => b.start_date.localeCompare(a.start_date))
                  .map((l) => (
                    <tr key={l.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">Minggu {l.week_number}</td>
                      <td className="px-4 py-3">{formatDate(l.start_date)}</td>
                      <td className="px-4 py-3">{phaseName(l.focus_phase)}</td>
                      <td className="px-4 py-3">{formatHours(l.target_hours)}</td>
                      <td className="px-4 py-3">
                        <span className={l.actual_hours >= l.target_hours ? "text-emerald-600 dark:text-emerald-400" : ""}>
                          {formatHours(l.actual_hours)}
                        </span>
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-foreground-muted">{l.notes || "-"}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => remove(l.id)} className="text-rose-600 hover:underline">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
