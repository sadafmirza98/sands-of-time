"use client";

import { useSyncExternalStore } from "react";

/**
 * A single shared one-second clock. Ticks land just after each wall-clock
 * second boundary so every subscriber flips digits together. The server snapshot is
 * `null`, so nothing time-dependent is prerendered (no hydration mismatch and
 * no `Date.now()` during prerender).
 */
const listeners = new Set<() => void>();
let current: number | null = null;
let timer: number | undefined;

function schedule() {
  const now = Date.now();
  timer = window.setTimeout(() => {
    current = Date.now();
    listeners.forEach((l) => l());
    schedule();
  }, 1000 - (now % 1000) + 5);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    current = Date.now();
    schedule();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.clearTimeout(timer);
  };
}

function getSnapshot() {
  if (current === null) current = Date.now();
  return current;
}

export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export interface Countdown {
  /** `false` until the first client tick (SSR renders placeholders). */
  ready: boolean;
  done: boolean;
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function countdownFrom(targetUtc: number, now: number): Omit<Countdown, "ready"> {
  const totalMs = Math.max(0, targetUtc - now);
  const s = Math.floor(totalMs / 1000);
  return {
    done: totalMs <= 0,
    totalMs,
    days: Math.floor(s / 86_400),
    hours: Math.floor((s % 86_400) / 3_600),
    minutes: Math.floor((s % 3_600) / 60),
    seconds: s % 60,
  };
}

/** Countdown to an absolute UTC instant — the visitor's timezone is irrelevant. */
export function useCountdown(targetUtc: number): Countdown {
  const now = useNow();
  if (now === null) return { ready: false, done: false, totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return { ready: true, ...countdownFrom(targetUtc, now) };
}
