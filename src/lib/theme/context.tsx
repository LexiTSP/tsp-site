"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import {
  theme as defaultTheme,
  mergeTheme,
  themeToCssVars,
  type DeepPartial,
  type Theme,
} from "../../../theme.config";

const STORAGE_KEY = "tsp.theme.overrides.v1";

type ThemeContextValue = {
  current: Theme;
  overrides: DeepPartial<Theme>;
  setValue: (path: string, value: string) => void;
  applyOverrides: (o: DeepPartial<Theme>) => void;
  reset: () => void;
  exportAsCode: () => string;
  isCustomized: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function deepSet(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split(".");
  const clone = JSON.parse(JSON.stringify(obj));
  let ref: Record<string, unknown> = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    if (typeof ref[keys[i]] !== "object" || ref[keys[i]] === null) ref[keys[i]] = {};
    ref = ref[keys[i]] as Record<string, unknown>;
  }
  ref[keys[keys.length - 1]] = value;
  return clone;
}

function loadOverrides(): DeepPartial<Theme> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveOverrides(o: DeepPartial<Theme>) {
  if (typeof window === "undefined") return;
  try {
    if (Object.keys(o).length === 0) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(o));
  } catch {}
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<DeepPartial<Theme>>({});

  useEffect(() => { setOverrides(loadOverrides()); }, []);

  const current = useMemo(() => mergeTheme(overrides), [overrides]);

  useEffect(() => {
    const vars = themeToCssVars(current);
    const root = document.documentElement;
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
  }, [current]);

  const setValue = useCallback((path: string, value: string) => {
    setOverrides((prev) => {
      const next = deepSet(prev as Record<string, unknown>, path, value) as DeepPartial<Theme>;
      saveOverrides(next);
      return next;
    });
  }, []);

  const applyOverrides = useCallback((o: DeepPartial<Theme>) => {
    setOverrides(o);
    saveOverrides(o);
  }, []);

  const reset = useCallback(() => {
    setOverrides({});
    saveOverrides({});
  }, []);

  const exportAsCode = useCallback(() => {
    return `export const theme = ${JSON.stringify(current, null, 2)} as const;`;
  }, [current]);

  const value: ThemeContextValue = {
    current,
    overrides,
    setValue,
    applyOverrides,
    reset,
    exportAsCode,
    isCustomized: Object.keys(overrides).length > 0,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

export { defaultTheme };
