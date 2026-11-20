"use client";

import { useSyncExternalStore } from "react";
import { ensureAudio, playSynth, type SoundName } from "@/components/sound/synth";

/**
 * Sound is OFF by default and never autoplays. The guest's choice is kept for
 * this tab session only.
 */
const KEY = "royal-sands:sound";
let enabled: boolean | null = null;
const listeners = new Set<() => void>();

function read(): boolean {
  if (enabled === null) {
    try {
      enabled = window.sessionStorage.getItem(KEY) === "on";
    } catch {
      enabled = false;
    }
  }
  return enabled;
}

export function setSoundEnabled(next: boolean) {
  enabled = next;
  try {
    window.sessionStorage.setItem(KEY, next ? "on" : "off");
  } catch {
    /* ignore */
  }
  if (next) {
    ensureAudio();
    playSynth("chime");
  }
  listeners.forEach((l) => l());
}

/** Play a synthesised effect if (and only if) the guest has enabled sound. */
export function playSound(name: SoundName) {
  if (typeof window === "undefined" || !read()) return;
  playSynth(name);
}

export function useSoundEnabled(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => false,
  );
}
