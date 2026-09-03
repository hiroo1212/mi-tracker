"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("mi-theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label="Ganti tema"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground-muted transition hover:text-foreground"
    >
      {mounted ? dark ? <Sun size={17} /> : <Moon size={17} /> : <span className="block h-[17px] w-[17px]" />}
    </button>
  );
}
