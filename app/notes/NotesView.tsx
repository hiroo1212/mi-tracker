"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, NotebookText } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { createNote, updateNote, deleteNote } from "./actions";
import type { NoteRow } from "@/lib/data/notes";
import { formatDateTime } from "@/lib/utils";

type Task = { id: number; title: string };

const EMPTY_FORM = { title: "", content: "", tags: "", relatedTaskId: "" as string };

export function NotesView({ notes, tasks }: { notes: NoteRow[]; tasks: Task[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | "new" | null>(notes[0]?.id ?? null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.toLowerCase().includes(q)
    );
  }, [notes, search]);

  const selected = selectedId === "new" ? null : notes.find((n) => n.id === selectedId) ?? null;

  function openNote(n: NoteRow) {
    setSelectedId(n.id);
    setForm({ title: n.title, content: n.content, tags: n.tags, relatedTaskId: n.related_task_id ? String(n.related_task_id) : "" });
  }

  function openNew() {
    setSelectedId("new");
    setForm(EMPTY_FORM);
  }

  async function save() {
    if (!form.title.trim()) return;
    setSaving(true);
    const payload = {
      title: form.title,
      content: form.content,
      tags: form.tags,
      relatedTaskId: form.relatedTaskId ? Number(form.relatedTaskId) : null,
    };
    if (selectedId === "new") {
      const id = await createNote(payload);
      setSelectedId(id);
    } else if (selectedId) {
      await updateNote(selectedId, payload);
    }
    setSaving(false);
    router.refresh();
  }

  async function remove(id: number) {
    if (!confirm("Hapus catatan ini?")) return;
    await deleteNote(id);
    setSelectedId(null);
    setForm(EMPTY_FORM);
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-3 lg:col-span-1">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari catatan..."
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <button onClick={openNew} className="flex items-center gap-1 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90">
            <Plus size={16} />
          </button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={NotebookText}
            title="Belum ada catatan"
            description="Buat catatan pertama dari materi yang sedang dipelajari."
            actionLabel="Buat catatan"
            onAction={openNew}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((n) => (
              <button
                key={n.id}
                onClick={() => openNote(n)}
                className={`rounded-xl border p-3 text-left transition ${
                  selectedId === n.id ? "border-accent bg-accent-soft" : "border-border bg-surface hover:bg-surface-muted"
                }`}
              >
                <p className="truncate text-sm font-medium">{n.title}</p>
                <p className="mt-0.5 truncate text-xs text-foreground-muted">{n.content.slice(0, 60) || "Tidak ada isi"}</p>
                <p className="mt-1 text-[11px] text-foreground-muted">{formatDateTime(n.updated_at)}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 lg:col-span-2">
        {selectedId === null ? (
          <div className="flex h-full items-center justify-center py-16 text-sm text-foreground-muted">
            Pilih catatan di sebelah kiri, atau buat catatan baru.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Judul catatan"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-lg font-medium outline-none focus:border-accent"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="Tag, pisahkan dengan koma"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <select
                value={form.relatedTaskId}
                onChange={(e) => setForm((f) => ({ ...f, relatedTaskId: e.target.value }))}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              >
                <option value="">Tidak terkait tugas</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Tulis catatan dengan markdown (heading #, **bold**, - list, `code`)..."
                rows={14}
                className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-accent"
              />
              <div
                className="prose-note max-h-[22rem] overflow-y-auto rounded-lg border border-border bg-background px-3 py-2 text-sm"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(form.content) || "<p class='text-foreground-muted'>Preview akan tampil di sini...</p>" }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={save}
                  disabled={saving || !form.title.trim()}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
              {selectedId !== "new" && selected && (
                <button
                  onClick={() => remove(selected.id)}
                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
