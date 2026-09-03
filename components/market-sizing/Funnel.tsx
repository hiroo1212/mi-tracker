function fmt(n: number) {
  if (!isFinite(n) || n === 0) return "0";
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function Funnel({ tam, sam, som }: { tam: number; sam: number; som: number }) {
  const max = Math.max(tam, 1);
  const widths = [tam, sam, som].map((v) => Math.max(10, (v / max) * 100));
  const rows = [
    { label: "TAM", value: tam, color: "var(--accent)", opacity: 1 },
    { label: "SAM", value: sam, color: "var(--accent)", opacity: 0.65 },
    { label: "SOM", value: som, color: "var(--accent)", opacity: 0.35 },
  ];

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      {rows.map((row, i) => (
        <div key={row.label} className="flex w-full flex-col items-center gap-1">
          <div
            className="flex h-12 items-center justify-center rounded-md text-sm font-medium text-accent-foreground transition-all"
            style={{ width: `${widths[i]}%`, backgroundColor: row.color, opacity: row.opacity, minWidth: "6rem" }}
          >
            {row.label}: {fmt(row.value)}
          </div>
        </div>
      ))}
    </div>
  );
}
