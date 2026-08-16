/**
 * Picks the DEFAULT theme based on the time of year.
 *
 * ─────────────────────────────────────────────────────────────
 *  This only ever decides the default. The moment a visitor picks
 *  a theme themselves, their choice is remembered and the calendar
 *  stops overriding it (they can opt back in via "Auto" in the
 *  theme menu).
 *
 *  TO CHANGE THE OFF-SEASON DEFAULT: edit `fallback` below.
 *  TO CHANGE THE DATES: edit `fixed` below. Windows are inclusive
 *  and may wrap the new year (e.g. from "12-20" to "01-05").
 * ─────────────────────────────────────────────────────────────
 */

export type SeasonalConfig = {
  /** Used whenever today falls outside every window below. */
  fallback: string;
  /** Fixed calendar windows, "MM-DD" to "MM-DD", first match wins. */
  fixed: { theme: string; from: string; to: string }[];
  /** Easter moves every year, so its window is relative to Easter Sunday. */
  easter: { theme: string; daysBefore: number; daysAfter: number } | null;
};

export const THEME_STORAGE_KEY = "theme";
/** Records whether the stored theme was calendar-assigned or hand-picked. */
export const THEME_SOURCE_KEY = "theme-source";

export const SEASONAL_CONFIG: SeasonalConfig = {
  // "system" follows the visitor's OS setting. Change to "light",
  // "dark", or any theme name to pin the off-season default.
  fallback: "dark",

  fixed: [
    { theme: "valentine", from: "02-07", to: "02-15" },
    { theme: "halloween", from: "10-24", to: "11-02" },
    { theme: "christmas", from: "12-01", to: "12-31" },
  ],

  // Palm Sunday through Easter Monday.
  easter: { theme: "easter", daysBefore: 7, daysAfter: 1 },
};

/**
 * Resolves the theme for a given date.
 *
 * IMPORTANT: this runs in two places — normally as a module import, and
 * also stringified via `.toString()` into the pre-paint bootstrap script
 * in layout.tsx. So it must stay completely self-contained: no imports and
 * no references to anything outside its own body. Avoid syntax the compiler
 * lowers into helper calls (async/await, generators, object spread) — those
 * would reference identifiers that do not exist inside the inlined script.
 */
export function resolveSeasonalTheme(cfg: SeasonalConfig, now: Date): string {
  const year = now.getFullYear();

  if (cfg.easter) {
    // Easter Sunday, anonymous Gregorian computus.
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    // Date normalises the overflow when a window crosses a month boundary.
    const start = new Date(year, month - 1, day - cfg.easter.daysBefore).getTime();
    const end = new Date(year, month - 1, day + cfg.easter.daysAfter).getTime();
    const today = new Date(year, now.getMonth(), now.getDate()).getTime();

    if (today >= start && today <= end) return cfg.easter.theme;
  }

  // Compare as MMDD integers so windows are just numeric ranges.
  const stamp = (now.getMonth() + 1) * 100 + now.getDate();

  for (let n = 0; n < cfg.fixed.length; n++) {
    const w = cfg.fixed[n];
    const from = parseInt(w.from.replace("-", ""), 10);
    const to = parseInt(w.to.replace("-", ""), 10);
    // from > to means the window wraps the new year.
    const hit = from <= to ? stamp >= from && stamp <= to : stamp >= from || stamp <= to;
    if (hit) return w.theme;
  }

  return cfg.fallback;
}

/**
 * Blocking script for the top of <body>. Runs before next-themes' own
 * script, so whatever it writes to storage is what gets painted — no flash.
 */
export function seasonalBootstrapScript(): string {
  return (
    "(function(){try{" +
    "var cfg=" +
    JSON.stringify(SEASONAL_CONFIG) +
    ";var resolve=" +
    resolveSeasonalTheme.toString() +
    ";var stored=localStorage.getItem(" +
    JSON.stringify(THEME_STORAGE_KEY) +
    ");" +
    // A theme the visitor chose themselves is never overridden.
    "if(stored&&localStorage.getItem(" +
    JSON.stringify(THEME_SOURCE_KEY) +
    ')!=="auto")return;' +
    "localStorage.setItem(" +
    JSON.stringify(THEME_STORAGE_KEY) +
    ",resolve(cfg,new Date()));localStorage.setItem(" +
    JSON.stringify(THEME_SOURCE_KEY) +
    ',"auto");}catch(e){}})();'
  );
}
