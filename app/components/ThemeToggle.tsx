"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  SEASONAL_CONFIG,
  THEME_SOURCE_KEY,
  resolveSeasonalTheme,
} from "../lib/seasonalTheme";

const MODES = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark", label: "Dark", icon: "🌙" },
  // Seasonal modes, in calendar order.
  { value: "valentine", label: "Valentine", icon: "💖" },
  { value: "easter", label: "Easter", icon: "🥚" },
  { value: "halloween", label: "Halloween", icon: "🎃" },
  { value: "christmas", label: "Christmas", icon: "🎄" },
] as const;

/** false while server-rendering, true once hydrated — no setState in an effect. */
const noopSubscribe = () => () => {};

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const active = mounted ? (theme === "system" ? resolvedTheme : theme) ?? "light" : "light";
  const current = MODES.find((m) => m.value === active) ?? MODES[0];

  // What the calendar would pick right now, for the "Auto" row's hint.
  const seasonal = mounted ? resolveSeasonalTheme(SEASONAL_CONFIG, new Date()) : null;
  const seasonalLabel =
    MODES.find((m) => m.value === seasonal)?.label ??
    (seasonal === "system" ? "System" : seasonal);

  /** `source` records whether this was the calendar's pick or the visitor's. */
  const apply = (value: string, source: "user" | "auto") => {
    try {
      window.localStorage.setItem(THEME_SOURCE_KEY, source);
    } catch {
      // Storage unavailable (private mode) — the theme still applies for
      // this session, it just won't be remembered.
    }
    setTheme(value);
    setOpen(false);
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition duration-300 hover:border-slate-300/90 hover:bg-white dark:border-slate-700/90 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-800"
        aria-label="Change color theme"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="mr-2">{current.icon}</span>
        {current.label}
        <span className="ml-2 text-[0.6rem] opacity-60" aria-hidden="true">
          ▼
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-1 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/95"
        >
          {MODES.map((mode) => {
            const isActive = mode.value === active;
            return (
              <button
                key={mode.value}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => apply(mode.value, "user")}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                  isActive
                    ? "bg-sky-600 text-white dark:bg-sky-500"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <span aria-hidden="true">{mode.icon}</span>
                {mode.label}
              </button>
            );
          })}

          <div className="my-1 border-t border-slate-200/80 dark:border-slate-700/80" />

          <button
            type="button"
            role="menuitem"
            onClick={() => apply(seasonal ?? SEASONAL_CONFIG.fallback, "auto")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span aria-hidden="true">🗓️</span>
            <span className="flex flex-col">
              Auto
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                By season · {seasonalLabel}
              </span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
