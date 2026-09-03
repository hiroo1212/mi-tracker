import { cn } from "@/lib/utils";

function levelFor(minutes: number) {
  if (minutes <= 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 60) return 2;
  if (minutes < 120) return 3;
  return 4;
}

const LEVEL_CLASS = [
  "bg-surface-muted",
  "bg-accent/20",
  "bg-accent/45",
  "bg-accent/70",
  "bg-accent",
];

export function Heatmap({ data }: { data: { date: string; minutes: number }[] }) {
  // group into weeks (columns), each column 7 days, Sunday-first alignment approximation
  const weeks: { date: string; minutes: number }[][] = [];
  let current: { date: string; minutes: number }[] = [];
  for (const d of data) {
    current.push(d);
    if (current.length === 7) {
      weeks.push(current);
      current = [];
    }
  }
  if (current.length) weeks.push(current);

  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((day) => (
            <div
              key={day.date}
              title={`${day.date}: ${Math.round(day.minutes)} menit`}
              className={cn("h-3 w-3 rounded-sm", LEVEL_CLASS[levelFor(day.minutes)])}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
