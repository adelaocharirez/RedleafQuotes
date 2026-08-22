import { useState, useEffect } from "react";

/**
 * State that persists to localStorage.
 *
 * Every access is guarded: a corrupt entry, a full disk, or a browser with
 * storage disabled (Safari private mode throws on setItem) degrades to
 * in-memory state instead of crashing. Previously an unguarded JSON.parse in
 * the initializer would throw during first render, which means a white screen
 * with no way back short of clearing site data.
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => read(key, defaultValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // Quota exceeded, private mode, or storage disabled. The app keeps
      // working from memory; only persistence is lost.
      console.warn(`Could not save "${key}" to localStorage.`, err);
    }
  }, [key, value]);

  return [value, setValue] as const;
}

function read<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) return defaultValue;
    return JSON.parse(saved) as T;
  } catch (err) {
    console.warn(`Discarding unreadable localStorage entry "${key}".`, err);
    return defaultValue;
  }
}

/** Read once without subscribing. Returns defaultValue on any failure. */
export function readLocalStorage<T>(key: string, defaultValue: T): T {
  return read(key, defaultValue);
}

/** Remove a key. Safe to call when storage is unavailable. */
export function clearLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`Could not clear "${key}" from localStorage.`, err);
  }
}