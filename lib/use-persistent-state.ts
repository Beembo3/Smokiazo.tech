"use client";

import { useEffect, useRef, useState } from "react";

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be full or blocked — the prototype keeps working in memory */
  }
}

/**
 * localStorage-backed state that is hydration-safe: the first render always
 * uses `initial`, the stored value is applied in an effect, and writes are
 * skipped until the read has happened so saved data is never clobbered.
 */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const hydrated = useRef(false);

  useEffect(() => {
    hydrated.current = false;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore malformed payloads */
    }
    hydrated.current = true;
  }, [key]);

  useEffect(() => {
    if (!hydrated.current) return;
    writeJSON(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

export const STORAGE_KEYS = {
  quote: "2go.quote-draft",
  inquiry: "2go.inquiry-draft",
  requests: "2go.requests",
  session: "2go.session",
  notifications: "2go.notification-pref",
  help: "2go.help-requests",
} as const;
