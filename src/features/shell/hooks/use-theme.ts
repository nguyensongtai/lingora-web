"use client";

import { useCallback, useSyncExternalStore } from "react";

import { THEME_STORAGE_KEY, type Theme } from "../theme";

/**
 * Nguồn sự thật là class trên <html> do ThemeScript đặt, không phải state của
 * React — nên theme được đọc qua useSyncExternalStore thay vì giữ bản sao trong
 * state. Server không thấy được class đó, vì vậy ảnh chụp phía server là null
 * và React tự vẽ lại sau khi hydrate xong.
 */
let listeners: Array<() => void> = [];

function subscribe(onChange: () => void): () => void {
  listeners = [...listeners, onChange];
  return () => {
    listeners = listeners.filter((listener) => listener !== onChange);
  };
}

function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function readServerTheme(): null {
  return null;
}

export function useTheme(): { theme: Theme | null; toggle: () => void } {
  const theme = useSyncExternalStore<Theme | null>(
    subscribe,
    readTheme,
    readServerTheme,
  );

  const toggle = useCallback(() => {
    const next: Theme = document.documentElement.classList.toggle("dark")
      ? "dark"
      : "light";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Chặn storage thì vẫn đổi được theme, chỉ là không nhớ qua lần tải sau.
    }
    for (const listener of listeners) {
      listener();
    }
  }, []);

  return { theme, toggle };
}
