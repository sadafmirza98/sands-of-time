"use client";

import { useSyncExternalStore } from "react";

/**
 * Opening-sequence state, shared by the overlay, the TN monogram in the nav and
 * the "open the invitation again" action.
 *
 * - "pending": server render / pre-hydration. The overlay renders as a dark
 *   cover unless the inline head script already marked <html data-opening="skip">.
 * - "playing": the envelope sequence is running.
 * - "done": the guest has entered the kingdom.
 *
 * The sequence plays once per browser tab session (sessionStorage) and is
 * bypassed entirely with `?open=1`.
 */
export type OpeningStatus = "pending" | "playing" | "done";

export const OPENING_STORAGE_KEY = "royal-sands:opened";

/** Runs in <head> before first paint so returning guests never see a flash. */
export const OPENING_HEAD_SCRIPT = `(function(){try{var q=new URLSearchParams(location.search);if(q.get("open")==="1"||sessionStorage.getItem("${OPENING_STORAGE_KEY}")==="1"){document.documentElement.setAttribute("data-opening","skip")}}catch(e){}})()`;

let status: OpeningStatus | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function resolveInitial(): OpeningStatus {
  try {
    if (new URLSearchParams(window.location.search).get("open") === "1") return "done";
    if (window.sessionStorage.getItem(OPENING_STORAGE_KEY) === "1") return "done";
  } catch {
    /* storage blocked — just play */
  }
  return "playing";
}

const store = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): OpeningStatus {
    if (status === null) status = resolveInitial();
    return status;
  },
  getServerSnapshot(): OpeningStatus {
    return "pending";
  },
};

export function completeOpening() {
  status = "done";
  try {
    window.sessionStorage.setItem(OPENING_STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
  document.documentElement.setAttribute("data-opening", "skip");
  emit();
}

export function replayOpening() {
  document.documentElement.removeAttribute("data-opening");
  window.scrollTo({ top: 0, behavior: "instant" });
  status = "playing";
  emit();
}

export function useOpeningSequence() {
  const current = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { status: current, complete: completeOpening, replay: replayOpening };
}
