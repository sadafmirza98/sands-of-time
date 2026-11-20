"use client";

import { useSyncExternalStore } from "react";

function mediaStore(query: string) {
  return {
    subscribe(callback: () => void) {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    getSnapshot: () => window.matchMedia(query).matches,
  };
}

const stores = new Map<string, ReturnType<typeof mediaStore>>();

/** Subscribe to a media query. Returns `serverValue` during SSR / hydration. */
export function useMediaQuery(query: string, serverValue = false): boolean {
  let store = stores.get(query);
  if (!store) {
    store = mediaStore(query);
    stores.set(query, store);
  }
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => serverValue);
}

/** `true` when the visitor asked the OS to minimise motion. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Desktop-class pointer (mouse / trackpad) that can hover. */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/** Touch-first device. */
export function useCoarsePointer(): boolean {
  return useMediaQuery("(pointer: coarse)");
}
