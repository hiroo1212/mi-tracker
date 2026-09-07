import {
  LayoutDashboard,
  ListChecks,
  Timer,
  NotebookText,
  Layers,
  Calculator,
  Database,
  CalendarRange,
  Settings,
  BookOpen,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "Roadmap", icon: ListChecks },
  { href: "/referensi", label: "Referensi", icon: BookOpen },
  { href: "/timer", label: "Timer", icon: Timer },
  { href: "/notes", label: "Catatan", icon: NotebookText },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/tools/market-sizing", label: "Market Sizing", icon: Calculator },
  { href: "/data-sources", label: "Sumber Data", icon: Database },
  { href: "/weekly-log", label: "Log Mingguan", icon: CalendarRange },
  { href: "/settings", label: "Pengaturan", icon: Settings },
] as const;
