import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Returns { weekNumber, startDate (ISO, Monday) } for the ISO week containing `date`. */
export function getIsoWeekInfo(date: dayjs.Dayjs | Date | string = new Date()) {
  const d = dayjs(date);
  const weekNumber = d.isoWeek();
  const startDate = d.startOf("isoWeek").format("YYYY-MM-DD");
  return { weekNumber, startDate };
}

export function formatDate(date?: string | null) {
  if (!date) return "-";
  return dayjs(date).format("DD MMM YYYY");
}

export function formatDateTime(date?: string | null) {
  if (!date) return "-";
  return dayjs(date).format("DD MMM YYYY HH:mm");
}

export function daysSince(date?: string | null) {
  if (!date) return Infinity;
  return dayjs().diff(dayjs(date), "day");
}

export const STATUS_OPTIONS = ["Belum", "Proses", "Selesai"] as const;
export type TaskStatus = (typeof STATUS_OPTIONS)[number];

export const PRIORITY_OPTIONS = ["Wajib", "Penting", "Opsional"] as const;
export type TaskPriority = (typeof PRIORITY_OPTIONS)[number];

export function priorityBadgeClass(priority: string) {
  switch (priority) {
    case "Wajib":
      return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300";
    case "Penting":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  }
}

export function statusBadgeClass(status: string) {
  switch (status) {
    case "Selesai":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
    case "Proses":
      return "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  }
}

export function formatHours(h: number) {
  return `${Math.round(h * 10) / 10} jam`;
}
