"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_THEME_MODE, getThemeByTime, type AppTheme, type ThemeMode } from "@/lib/themeByTime";

interface ThemeContextValue { theme: AppTheme; mode: ThemeMode }

const ThemeContext = createContext<ThemeContextValue>({ theme: "light", mode: DEFAULT_THEME_MODE });

function readInitialTheme(): AppTheme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>(readInitialTheme);
  const mode = DEFAULT_THEME_MODE;

  useEffect(() => {
    const refreshTheme = () => {
      const next = mode === "auto" ? getThemeByTime() : mode;
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(next);
      document.documentElement.style.colorScheme = next;
      setTheme((current) => current === next ? current : next);
    };
    refreshTheme();
    const interval = window.setInterval(refreshTheme, 60_000);
    return () => window.clearInterval(interval);
  }, [mode]);

  return <ThemeContext.Provider value={{ theme, mode }}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
