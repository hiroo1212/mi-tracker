"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Upload, AlertTriangle } from "lucide-react";
import { importBackup } from "./actions";

export function SettingsView() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [busy, setBusy] = useState(false);

  function onImportClick() {
    fileRef.current?.click();
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const confirmed = confirm(
      "Import akan MENGHAPUS semua data saat ini dan menggantinya dengan isi file backup. Lanjutkan?"
    );
    if (!confirmed) return;

    setBusy(true);
    setStatus(null);
    const text = await file.text();
    const result = await importBackup(text);
    setStatus(result);
    setBusy(false);
    if (result.ok) router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-2 font-medium">Export data</h2>
        <p className="mb-3 text-sm text-foreground-muted">
          Unduh seluruh data (roadmap, catatan, flashcards, log, dsb) sebagai satu file JSON untuk backup manual.
        </p>
        <a
          href="/api/export"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Download size={16} /> Export ke JSON
        </a>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-2 font-medium">Import data</h2>
        <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          Import akan mengganti seluruh data yang ada saat ini dengan isi file backup (clear-and-replace).
        </div>
        <button
          onClick={onImportClick}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface-muted disabled:opacity-50"
        >
          <Upload size={16} /> {busy ? "Mengimpor..." : "Pilih file backup (.json)"}
        </button>
        <input ref={fileRef} type="file" accept="application/json" onChange={onFileChange} className="hidden" />
        {status && (
          <p className={`mt-3 text-sm ${status.ok ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {status.message}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-2 font-medium">Lokasi data</h2>
        <p className="text-sm text-foreground-muted">
          Data disimpan secara lokal di file SQLite <code className="rounded bg-surface-muted px-1.5 py-0.5">data/mi.db</code> di
          root proyek. Untuk backup manual tambahan, kamu juga bisa langsung menyalin file tersebut.
        </p>
      </div>
    </div>
  );
}
