"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil, GraduationCap, Layers, ThumbsUp, ThumbsDown, RotateCw } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { createFlashcard, updateFlashcard, deleteFlashcard, reviewFlashcard } from "./actions";
import type { FlashcardRow } from "@/lib/data/flashcards";

const EMPTY_FORM = { term: "", definition: "", category: "" };

function ConfidenceDots({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i < level ? "bg-accent" : "bg-surface-muted"}`}
        />
      ))}
    </div>
  );
}

function StudyMode({ queue, onExit }: { queue: FlashcardRow[]; onExit: () => void }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const card = queue[index];

  async function mark(understood: boolean) {
    await reviewFlashcard(card.id, understood);
    router.refresh();
    if (index + 1 < queue.length) {
      setIndex((i) => i + 1);
      setRevealed(false);
    } else {
      onExit();
    }
  }

  if (!card) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="Sesi belajar selesai"
        description="Semua kartu pada antrean sudah direview."
        actionLabel="Kembali"
        onAction={onExit}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-xs text-foreground-muted">
        Kartu {index + 1} dari {queue.length}
      </p>
      <button
        onClick={() => setRevealed((r) => !r)}
        className="flex min-h-[220px] w-full max-w-lg flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center shadow-sm transition hover:border-accent"
      >
        <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">{card.category || "Umum"}</span>
        {!revealed ? (
          <p className="text-2xl font-semibold">{card.term}</p>
        ) : (
          <p className="text-base leading-relaxed text-foreground-muted">{card.definition}</p>
        )}
        <span className="mt-2 flex items-center gap-1 text-xs text-foreground-muted">
          <RotateCw size={12} /> {revealed ? "Klik untuk lihat istilah" : "Klik untuk lihat definisi"}
        </span>
      </button>

      {revealed && (
        <div className="flex gap-3">
          <button
            onClick={() => mark(false)}
            className="flex items-center gap-2 rounded-lg border border-rose-300 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/30"
          >
            <ThumbsDown size={15} /> Masih bingung
          </button>
          <button
            onClick={() => mark(true)}
            className="flex items-center gap-2 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900 dark:hover:bg-emerald-950/30"
          >
            <ThumbsUp size={15} /> Sudah paham
          </button>
        </div>
      )}
      <button onClick={onExit} className="text-xs text-foreground-muted hover:underline">
        Keluar dari mode belajar
      </button>
    </div>
  );
}

export function FlashcardsView({ cards, queue }: { cards: FlashcardRow[]; queue: FlashcardRow[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<"manage" | "study">("manage");
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const categories = useMemo(() => Array.from(new Set(cards.map((c) => c.category || "Umum"))), [cards]);

  function openEdit(c: FlashcardRow) {
    setEditingId(c.id);
    setForm({ term: c.term, definition: c.definition, category: c.category });
  }

  function openNew() {
    setEditingId("new");
    setForm(EMPTY_FORM);
  }

  async function save() {
    if (!form.term.trim() || !form.definition.trim()) return;
    if (editingId === "new") {
      await createFlashcard(form);
    } else if (editingId) {
      await updateFlashcard(editingId, form);
    }
    setEditingId(null);
    setForm(EMPTY_FORM);
    router.refresh();
  }

  async function remove(id: number) {
    if (!confirm("Hapus flashcard ini?")) return;
    await deleteFlashcard(id);
    router.refresh();
  }

  if (mode === "study") {
    return <StudyMode queue={queue} onExit={() => setMode("manage")} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-foreground-muted">
          {cards.length} kartu &middot; {categories.length} kategori
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("study")}
            disabled={cards.length === 0}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
          >
            <GraduationCap size={16} /> Mulai belajar
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface-muted"
          >
            <Plus size={16} /> Tambah kartu
          </button>
        </div>
      </div>

      {editingId !== null && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              value={form.term}
              onChange={(e) => setForm((f) => ({ ...f, term: e.target.value }))}
              placeholder="Istilah"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <input
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="Kategori"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90">
                Simpan
              </button>
              <button onClick={() => setEditingId(null)} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-muted">
                Batal
              </button>
            </div>
          </div>
          <textarea
            value={form.definition}
            onChange={(e) => setForm((f) => ({ ...f, definition: e.target.value }))}
            placeholder="Definisi"
            rows={3}
            className="mt-3 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
      )}

      {cards.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="Belum ada flashcard"
          description="Tambahkan istilah Market Intelligence pertamamu untuk mulai berlatih."
          actionLabel="Tambah kartu"
          onAction={openNew}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <div key={c.id} className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                  {c.category || "Umum"}
                </span>
                <ConfidenceDots level={c.confidence_level} />
              </div>
              <p className="font-medium">{c.term}</p>
              <p className="line-clamp-3 text-sm text-foreground-muted">{c.definition}</p>
              <div className="mt-1 flex gap-2">
                <button onClick={() => openEdit(c)} className="flex items-center gap-1 text-xs text-foreground-muted hover:text-foreground">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => remove(c.id)} className="flex items-center gap-1 text-xs text-rose-600 hover:underline">
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
