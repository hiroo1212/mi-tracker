"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { logStudySession } from "./actions";

type Task = { id: number; title: string; topic: string };
type Mode = "focus" | "break";

function playBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {}
}

function notify(title: string, body: string) {
  try {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  } catch {}
}

export function TimerView({ tasks }: { tasks: Task[] }) {
  const [focusMin, setFocusMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [mode, setMode] = useState<Mode>("focus");
  const [totalSeconds, setTotalSeconds] = useState(focusMin * 60);
  const [secondsLeft, setSecondsLeft] = useState(focusMin * 60);
  const [running, setRunning] = useState(false);
  const [taskId, setTaskId] = useState<string>("");
  const startedAtRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  function resetFor(nextMode: Mode, minutes: number) {
    setMode(nextMode);
    setSecondsLeft(minutes * 60);
    setTotalSeconds(minutes * 60);
  }

  async function completeSession(finishedMode: Mode) {
    setRunning(false);
    playBeep();
    const isFocus = finishedMode === "focus";
    notify(
      isFocus ? "Sesi fokus selesai" : "Istirahat selesai",
      isFocus ? "Saatnya istirahat sebentar." : "Saatnya kembali fokus."
    );

    if (startedAtRef.current) {
      const endedAt = new Date().toISOString();
      const durationMinutes = isFocus ? focusMin : breakMin;
      await logStudySession({
        taskId: taskId ? Number(taskId) : null,
        startedAt: startedAtRef.current,
        endedAt,
        durationMinutes,
        mode: finishedMode,
      });
    }
    startedAtRef.current = null;

    const nextMode: Mode = isFocus ? "break" : "focus";
    resetFor(nextMode, nextMode === "focus" ? focusMin : breakMin);
  }

  const secondsLeftRef = useRef(secondsLeft);
  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      if (secondsLeftRef.current <= 1) {
        clearInterval(interval);
        completeSession(mode);
      } else {
        setSecondsLeft((s) => s - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode]);

  function start() {
    if (!running) {
      startedAtRef.current = new Date().toISOString();
    }
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    resetFor(mode, mode === "focus" ? focusMin : breakMin);
    startedAtRef.current = null;
  }

  function skip() {
    const nextMode: Mode = mode === "focus" ? "break" : "focus";
    setRunning(false);
    startedAtRef.current = null;
    resetFor(nextMode, nextMode === "focus" ? focusMin : breakMin);
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const pct = 100 - (secondsLeft / totalSeconds) * 100;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-surface p-8 lg:col-span-2">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${mode === "focus" ? "bg-accent-soft text-accent" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"}`}>
          {mode === "focus" ? "Fokus" : "Istirahat"}
        </span>

        <div className="relative flex h-56 w-56 items-center justify-center rounded-full border-8 border-surface-muted">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(var(--accent) ${pct}%, transparent ${pct}%)`,
              mask: "radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))",
              WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))",
            }}
          />
          <span className="text-5xl font-semibold tabular-nums">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {!running ? (
            <button onClick={start} className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90">
              <Play size={16} /> Mulai
            </button>
          ) : (
            <button onClick={pause} className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90">
              <Pause size={16} /> Jeda
            </button>
          )}
          <button onClick={reset} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground-muted hover:text-foreground">
            <RotateCcw size={16} /> Reset
          </button>
          <button onClick={skip} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground-muted hover:text-foreground">
            <SkipForward size={16} /> Lewati
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-medium">Pengaturan</h2>
          <div className="space-y-3">
            <label className="block text-sm">
              Durasi fokus (menit)
              <input
                type="number"
                min={1}
                value={focusMin}
                disabled={running}
                onChange={(e) => {
                  const v = Number(e.target.value) || 1;
                  setFocusMin(v);
                  if (mode === "focus") resetFor("focus", v);
                }}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent disabled:opacity-50"
              />
            </label>
            <label className="block text-sm">
              Durasi istirahat (menit)
              <input
                type="number"
                min={1}
                value={breakMin}
                disabled={running}
                onChange={(e) => {
                  const v = Number(e.target.value) || 1;
                  setBreakMin(v);
                  if (mode === "break") resetFor("break", v);
                }}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent disabled:opacity-50"
              />
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-medium">Kaitkan ke tugas</h2>
          {tasks.length === 0 ? (
            <p className="text-sm text-foreground-muted">
              Tidak ada tugas berstatus &quot;Proses&quot;. Ubah status tugas di Roadmap agar muncul di sini.
            </p>
          ) : (
            <select
              value={taskId}
              disabled={running}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent disabled:opacity-50"
            >
              <option value="">Tanpa tugas terkait</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}
