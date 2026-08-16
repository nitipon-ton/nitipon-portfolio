"use client";

import { ThemeProvider } from "next-themes";
import { SEASONAL_CONFIG, THEME_STORAGE_KEY } from "./lib/seasonalTheme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      // The seasonal default is seeded into storage by the bootstrap script in
      // layout.tsx; this is only the last resort if storage is unavailable.
      defaultTheme={SEASONAL_CONFIG.fallback}
      storageKey={THEME_STORAGE_KEY}
      enableSystem
      themes={["light", "dark", "valentine", "easter", "halloween", "christmas"]}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
