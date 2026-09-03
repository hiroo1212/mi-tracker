"use client";

import { useMemo, useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Search, NotebookText } from "lucide-react";
import { cn, priorityBadgeClass, statusBadgeClass, STATUS_OPTIONS, formatHours } from "@/lib/utils";
import type { RoadmapPhase, RoadmapTask } from "@/lib/data/roadmap";
import { updateTaskStatus, updateTaskNotes } from "./actions";

function NotesField({ task }: { task: RoadmapTask }) {
  const [value, setValue] = useState(task.notes ?? "");
  const [saving, setSaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onChange(v: string) {
    setValue(v);
    if (timer.current) clearTimeout(timer.current);
    setSaving(true);
    timer.current = setTimeout(async () => {
      await updateTaskNotes(task.id, v);
      setSaving(false);
    }, 700);
  }

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Catatan pribadi untuk tugas ini..."
        rows={2}
        className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <p className="mt-1 text-[11px] text-foreground-muted">{saving ? "Menyimpan..." : "Tersimpan otomatis"}</p>
    </div>
  );
}

function TaskRow({ task }: { task: RoadmapTask }) {
  const [status, setStatus] = useState(task.status);
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  function onStatusChange(next: string) {
    setStatus(next);
    startTransition(() => {
      updateTaskStatus(task.id, next);
    });
  }

  return (
    <div className="border-b border-border last:border-0">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-3 text-left min-w-[220px]"
        >
          <ChevronDown size={14} className={cn("shrink-0 text-foreground-muted transition-transform", open && "rotate-180")} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              #{task.no} {task.title}
            </p>
            <p className="truncate text-xs text-foreground-muted">{task.topic}</p>
          </div>
        </button>
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", priorityBadgeClass(task.priority))}>
          {task.priority}
        </span>
        {task.note_count > 0 && (
          <Link
            href="/notes"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-accent hover:underline"
            title="Lihat catatan terkait"
          >
            <NotebookText size={13} /> {task.note_count}
          </Link>
        )}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={cn(
            "rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none",
            statusBadgeClass(status)
          )}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      {open && (
        <div className="space-y-3 px-4 pb-4 pl-11">
          <p className="text-xs text-foreground-muted">
            Estimasi: {formatHours(task.estimated_hours)} &middot; Sumber: {task.resource_notes || "-"}
          </p>
          <NotesField task={task} />
        </div>
      )}
    </div>
  );
}

function PhaseSection({ phase }: { phase: RoadmapPhase }) {
  const [collapsed, setCollapsed] = useState(false);
  const done = phase.tasks.filter((t) => t.status === "Selesai").length;

  return (
    <div className="rounded-xl border border-border bg-surface">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <div className="text-left">
          <p className="font-medium">{phase.name}</p>
          <p className="text-xs text-foreground-muted">
            {phase.targetPeriod} &middot; {done}/{phase.tasks.length} selesai
          </p>
        </div>
        <ChevronDown size={16} className={cn("text-foreground-muted transition-transform", collapsed && "-rotate-90")} />
      </button>
      {!collapsed && <div>{phase.tasks.map((t) => <TaskRow key={t.id} task={t} />)}</div>}
    </div>
  );
}

export function RoadmapView({ phases }: { phases: RoadmapPhase[] }) {
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return phases
      .filter((p) => phaseFilter === "all" || String(p.id) === phaseFilter)
      .map((p) => ({
        ...p,
        tasks: p.tasks.filter((t) => {
          if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
          if (statusFilter !== "all" && t.status !== statusFilter) return false;
          if (q && !`${t.topic} ${t.title}`.toLowerCase().includes(q)) return false;
          return true;
        }),
      }))
      .filter((p) => p.tasks.length > 0 || (phaseFilter !== "all"));
  }, [phases, search, phaseFilter, priorityFilter, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari topik atau judul tugas..."
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
        >
          <option value="all">Semua fase</option>
          {phases.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
        >
          <option value="all">Semua prioritas</option>
          <option value="Wajib">Wajib</option>
          <option value="Penting">Penting</option>
          <option value="Opsional">Opsional</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
        >
          <option value="all">Semua status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((p) => (
          <PhaseSection key={p.id} phase={p} />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center text-sm text-foreground-muted">
            Tidak ada tugas yang cocok dengan filter.
          </div>
        )}
      </div>
    </div>
  );
}
