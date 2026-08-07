"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? theme ?? resolvedTheme : "light";
  const isDark = activeTheme === "dark" || activeTheme === "theme-dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition duration-300 hover:border-slate-300/90 hover:bg-white dark:border-slate-700/90 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-800"
      aria-label="Toggle color theme"
    >
      <span className="mr-2">{isDark ? "🌙" : "☀️"}</span>
      {isDark ? "Dark" : "Light"}
    </button>
  );
}
