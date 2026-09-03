"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil, ExternalLink, Database } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { createDataSource, updateDataSource, deleteDataSource } from "./actions";

export type DataSourceRow = {
  id: number;
  name: string;
  url: string;
  category: string;
  personal_note: string;
};

const EMPTY_FORM = { name: "", url: "", category: "", personalNote: "" };

export function DataSourcesView({ sources }: { sources: DataSourceRow[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  function openEdit(s: DataSourceRow) {
    setEditingId(s.id);
    setForm({ name: s.name, url: s.url, category: s.category, personalNote: s.personal_note });
  }

  function openNew() {
    setEditingId("new");
    setForm(EMPTY_FORM);
  }

  async function save() {
    if (!form.name.trim()) return;
    if (editingId === "new") await createDataSource(form);
    else if (editingId) await updateDataSource(editingId, form);
    setEditingId(null);
    setForm(EMPTY_FORM);
    router.refresh();
  }

  async function remove(id: number) {
    if (!confirm("Hapus sumber data ini?")) return;
    await deleteDataSource(id);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground-muted">{sources.length} sumber data tersimpan</p>
        <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90">
          <Plus size={16} /> Tambah sumber
        </button>
      </div>

      {editingId !== null && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Nama sumber"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <input
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="URL"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <input
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="Kategori"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <input
              value={form.personalNote}
              onChange={(e) => setForm((f) => ({ ...f, personalNote: e.target.value }))}
              placeholder="Catatan personal (pernah dipakai untuk apa)"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={save} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90">
              Simpan
            </button>
            <button onClick={() => setEditingId(null)} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-muted">
              Batal
            </button>
          </div>
        </div>
      )}

      {sources.length === 0 ? (
        <EmptyState
          icon={Database}
          title="Belum ada sumber data"
          description="Tambahkan sumber data riset pertamamu, mis. BPS atau Katadata."
          actionLabel="Tambah sumber"
          onAction={openNew}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((s) => (
            <div key={s.id} className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{s.name}</p>
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">{s.category || "Umum"}</span>
              </div>
              {s.url && (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-accent hover:underline">
                  <ExternalLink size={12} /> {s.url}
                </a>
              )}
              {s.personal_note && <p className="text-sm text-foreground-muted">{s.personal_note}</p>}
              <div className="mt-1 flex gap-2">
                <button onClick={() => openEdit(s)} className="flex items-center gap-1 text-xs text-foreground-muted hover:text-foreground">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => remove(s.id)} className="flex items-center gap-1 text-xs text-rose-600 hover:underline">
                  <Trash2 size={12} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
