"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator, Trash2, Scale } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Funnel } from "@/components/market-sizing/Funnel";
import { saveMarketSizing, deleteMarketSizing } from "./actions";
import type { MarketSizingCalc } from "@/lib/data/market-sizing";
import { formatDate } from "@/lib/utils";

const EMPTY_FORM = {
  name: "",
  method: "top-down",
  tamValue: "",
  tamAssumption: "",
  samValue: "",
  samAssumption: "",
  somValue: "",
  somAssumption: "",
};

export function MarketSizingView({ calcs }: { calcs: MarketSizingCalc[] }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [compareIds, setCompareIds] = useState<number[]>([]);

  const previewTam = Number(form.tamValue) || 0;
  const previewSam = Number(form.samValue) || 0;
  const previewSom = Number(form.somValue) || 0;

  const canSave =
    form.name.trim() &&
    form.tamAssumption.trim() &&
    form.samAssumption.trim() &&
    form.somAssumption.trim() &&
    form.tamValue !== "" &&
    form.samValue !== "" &&
    form.somValue !== "";

  async function save() {
    if (!canSave) return;
    setSaving(true);
    await saveMarketSizing({
      name: form.name,
      method: form.method,
      tamValue: previewTam,
      tamAssumption: form.tamAssumption,
      samValue: previewSam,
      samAssumption: form.samAssumption,
      somValue: previewSom,
      somAssumption: form.somAssumption,
    });
    setForm(EMPTY_FORM);
    setSaving(false);
    router.refresh();
  }

  async function remove(id: number) {
    if (!confirm("Hapus perhitungan ini?")) return;
    await deleteMarketSizing(id);
    setCompareIds((ids) => ids.filter((i) => i !== id));
    router.refresh();
  }

  function toggleCompare(id: number) {
    setCompareIds((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]));
  }

  const compareList = useMemo(() => calcs.filter((c) => compareIds.includes(c.id)), [calcs, compareIds]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <Calculator size={17} className="text-accent" />
            <h2 className="font-medium">Hitung TAM / SAM / SOM baru</h2>
          </div>

          <div className="flex flex-col gap-3">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Nama perhitungan (mis. Pasar kopi kemasan RTD Indonesia)"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <div className="flex gap-3 text-sm">
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  checked={form.method === "top-down"}
                  onChange={() => setForm((f) => ({ ...f, method: "top-down" }))}
                />
                Top-down (makro ke segmen)
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  checked={form.method === "bottom-up"}
                  onChange={() => setForm((f) => ({ ...f, method: "bottom-up" }))}
                />
                Bottom-up (pelanggan x frekuensi x harga)
              </label>
            </div>

            {[
              { key: "tam", label: "TAM — Total Addressable Market" },
              { key: "sam", label: "SAM — Serviceable Addressable Market" },
              { key: "som", label: "SOM — Serviceable Obtainable Market" },
            ].map(({ key, label }) => (
              <div key={key} className="rounded-lg border border-border p-3">
                <p className="mb-2 text-sm font-medium">{label}</p>
                <input
                  type="number"
                  value={(form as Record<string, string>)[`${key}Value`]}
                  onChange={(e) => setForm((f) => ({ ...f, [`${key}Value`]: e.target.value }))}
                  placeholder="Nilai (Rp)"
                  className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
                <textarea
                  value={(form as Record<string, string>)[`${key}Assumption`]}
                  onChange={(e) => setForm((f) => ({ ...f, [`${key}Assumption`]: e.target.value }))}
                  placeholder="Asumsi & cara hitung (wajib diisi agar bisa diaudit)"
                  rows={2}
                  className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
            ))}

            <button
              onClick={save}
              disabled={!canSave || saving}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan perhitungan"}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-medium">Visualisasi funnel</h2>
          <Funnel tam={previewTam} sam={previewSam} som={previewSom} />
          <p className="mt-2 text-xs text-foreground-muted">
            Funnel diperbarui otomatis mengikuti isian form di sebelah kiri.
          </p>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium">Riwayat perhitungan</h2>
          {compareIds.length >= 2 && (
            <span className="flex items-center gap-1 text-xs text-accent">
              <Scale size={13} /> Membandingkan {compareIds.length} perhitungan
            </span>
          )}
        </div>

        {calcs.length === 0 ? (
          <EmptyState
            icon={Calculator}
            title="Belum ada perhitungan tersimpan"
            description="Isi form di atas dan simpan untuk mulai membangun riwayat market sizing kamu."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {calcs.map((c) => (
              <div key={c.id} className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-foreground-muted">
                      {c.method === "top-down" ? "Top-down" : "Bottom-up"} &middot; {formatDate(c.created_at)}
                    </p>
                  </div>
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={compareIds.includes(c.id)} onChange={() => toggleCompare(c.id)} />
                    Bandingkan
                  </label>
                </div>
                <Funnel tam={c.tam_value} sam={c.sam_value} som={c.som_value} />
                <button onClick={() => remove(c.id)} className="flex items-center gap-1 self-start text-xs text-rose-600 hover:underline">
                  <Trash2 size={12} /> Hapus
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {compareList.length >= 2 && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-medium">Perbandingan side-by-side</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-foreground-muted">
                  <th className="py-2 pr-4">Metrik</th>
                  {compareList.map((c) => (
                    <th key={c.id} className="py-2 pr-4">{c.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(["tam", "sam", "som"] as const).map((k) => (
                  <tr key={k} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4 font-medium uppercase">{k}</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="py-2 pr-4">
                        {(c[`${k}_value` as keyof MarketSizingCalc] as number).toLocaleString("id-ID")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
