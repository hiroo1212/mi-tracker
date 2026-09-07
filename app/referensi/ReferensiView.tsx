"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderMarkdown } from "@/lib/markdown";
import type { ReferenceGroup } from "@/lib/data/reference";

function SectionCard({ title, body, defaultOpen }: { title: string; body: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-border bg-background">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-sm font-medium">{title}</span>
        <ChevronDown size={15} className={cn("shrink-0 text-foreground-muted transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          className="prose-note border-t border-border px-4 py-3 text-sm"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
        />
      )}
    </div>
  );
}

function PhaseGroup({ group, forceOpenAll }: { group: ReferenceGroup; forceOpenAll: boolean }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-surface">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <div className="text-left">
          <p className="font-medium">{group.phaseName}</p>
          <p className="mt-0.5 max-w-2xl text-xs text-foreground-muted">{group.intro}</p>
        </div>
        <ChevronDown size={16} className={cn("shrink-0 text-foreground-muted transition-transform", collapsed && "-rotate-90")} />
      </button>
      {!collapsed && (
        <div className="flex flex-col gap-2 px-4 pb-4">
          {group.sections.map((s, i) => (
            <SectionCard
              key={`${s.slug}-${forceOpenAll}`}
              title={s.title}
              body={s.body}
              defaultOpen={forceOpenAll || (i === 0 && group.sections.length === 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ReferensiView({ groups }: { groups: ReferenceGroup[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        sections: g.sections.filter(
          (s) => s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.sections.length > 0);
  }, [groups, search]);

  const isSearching = search.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari istilah, mis. 'CAGR', 'Five Forces', 'JOIN'..."
          className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-accent sm:max-w-md"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-surface p-10 text-center">
          <BookOpen size={22} className="text-foreground-muted" />
          <p className="text-sm font-medium">Tidak ada topik yang cocok</p>
          <p className="text-xs text-foreground-muted">Coba kata kunci lain, atau hapus pencarian untuk lihat semua topik.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((g) => (
            <PhaseGroup key={g.phaseNo} group={g} forceOpenAll={isSearching} />
          ))}
        </div>
      )}
    </div>
  );
}
