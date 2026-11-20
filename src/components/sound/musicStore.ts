"use client";

import { useSyncExternalStore } from "react";
import { wedding } from "@/config/wedding";

/**
 * Background music — strictly user-initiated, with fade in / fade out.
 *
 * One shared player for the whole page, so the toggle in the opening overlay
 * and the one in the navigation control the same music.
 *
 * - `youtube`: YouTube IFrame Player API. The player stays VISIBLE in a small
 *   "music box" card while active (YouTube's policies don't allow hidden,
 *   audio-only playback).
 * - `audio`: a plain HTMLAudioElement.
 */

export type MusicStatus = "idle" | "loading" | "playing" | "paused" | "blocked" | "error";

const FADE_MS = 1600;
const music = wedding.music;

let status: MusicStatus = "idle";
const listeners = new Set<() => void>();
const set = (next: MusicStatus) => {
  status = next;
  listeners.forEach((l) => l());
};

/* ── YouTube plumbing ────────────────────────────────────────────────────── */

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  setVolume(v: number): void;
  getVolume(): number;
  destroy(): void;
}
interface YTEvent {
  data: number;
}
interface YTNamespace {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      width: number;
      height: number;
      playerVars: Record<string, number | string>;
      events: { onReady: () => void; onStateChange: (e: YTEvent) => void; onError: () => void };
    },
  ) => YTPlayer;
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let api: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
  if (api) return api;
  api = new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (window.YT) resolve(window.YT);
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  });
  return api;
}

let host: HTMLElement | null = null;
let yt: YTPlayer | null = null;
let ytReady: Promise<YTPlayer> | null = null;
let audio: HTMLAudioElement | null = null;
let fadeRaf = 0;
let blockedTimer: number | undefined;

/** The music-box card registers the element the YouTube iframe is mounted into. */
export function registerMusicHost(el: HTMLElement | null) {
  host = el;
}

function fade(from: number, to: number, apply: (v: number) => void, done?: () => void) {
  cancelAnimationFrame(fadeRaf);
  const start = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - start) / FADE_MS);
    apply(from + (to - from) * k);
    if (k < 1) fadeRaf = requestAnimationFrame(step);
    else done?.();
  };
  fadeRaf = requestAnimationFrame(step);
}

function ensureYouTube(videoId: string): Promise<YTPlayer> {
  if (ytReady) return ytReady;
  ytReady = loadYouTubeApi().then(
    (YT) =>
      new Promise<YTPlayer>((resolve) => {
        const mount = document.createElement("div");
        host?.replaceChildren(mount);
        const player = new YT.Player(mount, {
          videoId,
          width: 200,
          height: 200,
          // Created paused ahead of time; playback starts only from a guest's tap.
          playerVars: { autoplay: 0, playsinline: 1, rel: 0, loop: 1, playlist: videoId, controls: 1 },
          events: {
            onReady: () => {
              yt = player;
              resolve(player);
            },
            onStateChange: (e) => {
              if (e.data === 1) {
                window.clearTimeout(blockedTimer);
                if (status !== "idle") set("playing");
              } else if (e.data === 2 && status === "playing") {
                set("paused");
              }
            },
            onError: () => set("error"),
          },
        });
      }),
  );
  return ytReady;
}

/**
 * Build the (paused, hidden) player ahead of time. Browsers — Safari/iOS in
 * particular — only allow sound when `playVideo()` runs *inside* the guest's
 * tap, which is impossible if the tap first has to download the player.
 */
export function primeMusic() {
  if (music?.kind === "youtube" && host) void ensureYouTube(music.videoId);
}
/** @deprecated alias kept for the toggle's hover/focus warm-up. */
export const preloadMusic = primeMusic;

function startYouTube(player: YTPlayer, target: number) {
  player.setVolume(0);
  player.playVideo();
  fade(0, target * 100, (v) => player.setVolume(v));
  // Some mobile browsers still refuse until the player itself is tapped.
  window.clearTimeout(blockedTimer);
  blockedTimer = window.setTimeout(() => {
    if (status === "loading") set("blocked");
  }, 3500);
}

export async function playMusic() {
  if (!music) return;
  const target = music.volume;
  if (music.kind === "audio") {
    audio ??= Object.assign(new Audio(music.src), { loop: true, volume: 0 });
    try {
      await audio.play();
      const a = audio;
      fade(a.volume, target, (v) => (a.volume = v));
      set("playing");
    } catch {
      set("blocked");
    }
    return;
  }
  set("loading");
  if (yt) {
    // Ready: start synchronously, still inside the tap.
    startYouTube(yt, target);
    return;
  }
  const player = await ensureYouTube(music.videoId);
  startYouTube(player, target);
}

/** Start the music from a guest gesture unless they've already played or closed it. */
export function startMusicIfIdle() {
  if (status === "idle") void playMusic();
}

export function pauseMusic(next: MusicStatus = "paused") {
  window.clearTimeout(blockedTimer);
  if (music?.kind === "audio" && audio) {
    const a = audio;
    fade(a.volume, 0, (v) => (a.volume = v), () => a.pause());
  } else if (yt) {
    const p = yt;
    fade(p.getVolume(), 0, (v) => p.setVolume(v), () => p.pauseVideo());
  }
  set(next);
}

/** Close the music box entirely. */
export function stopMusic() {
  pauseMusic("idle");
}

export function toggleMusic() {
  if (status === "playing" || status === "loading") pauseMusic();
  else void playMusic();
}

export function useMusicStatus(): MusicStatus {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => status,
    () => "idle",
  );
}
