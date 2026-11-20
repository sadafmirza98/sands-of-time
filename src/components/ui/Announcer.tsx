"use client";

import { useSyncExternalStore } from "react";

/** One polite live region for the whole page. Call `announce()` from anywhere. */
let message = "";
const listeners = new Set<() => void>();

export function announce(text: string) {
  // Clear first so repeating the same message is still announced.
  message = "";
  listeners.forEach((l) => l());
  window.setTimeout(() => {
    message = text;
    listeners.forEach((l) => l());
  }, 60);
}

export function Announcer() {
  const text = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => message,
    () => "",
  );
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {text}
    </div>
  );
}
