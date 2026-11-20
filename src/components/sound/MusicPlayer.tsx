"use client";

import { AnimatePresence, motion } from "motion/react";
import { Music2, Pause, X } from "lucide-react";
import { useCallback, useEffect } from "react";
import { wedding } from "@/config/wedding";
import { preloadMusic, primeMusic, registerMusicHost, stopMusic, toggleMusic, useMusicStatus } from "@/components/sound/musicStore";
import { cx } from "@/lib/formatting";

/**
 * Music toggle button. Renders nothing when `wedding.music` is null.
 * Used in the navigation and in the opening overlay (one shared player).
 */
export function MusicToggle({ className }: { className?: string }) {
  const status = useMusicStatus();
  if (!wedding.music) return null;
  const on = status === "playing" || status === "loading";
  return (
    <button
      type="button"
      onClick={toggleMusic}
      onPointerEnter={preloadMusic}
      onFocus={preloadMusic}
      aria-pressed={on}
      aria-label={on ? `Pause music: ${wedding.music.title}` : `Play music: ${wedding.music.title}`}
      title={on ? "Pause music" : "Play music"}
      className={cx(
        "relative inline-flex size-10 items-center justify-center rounded-full border border-gold/40 bg-midnight/75 text-gold-bright transition hover:border-gold-bright hover:bg-midnight/70",
        on && "border-gold-bright/80 shadow-[0_0_14px_rgb(226_188_115/0.45)]",
        className,
      )}
    >
      {on ? <Pause aria-hidden className="size-[18px]" /> : <Music2 aria-hidden className="size-[18px]" />}
      {status === "loading" && <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-gold/40" />}
    </button>
  );
}

/**
 * Hosts the YouTube player. Audio only: the player is mounted but fully
 * transparent and non-interactive. The card is shown ONLY if the browser refuses
 * to start sound from a tap on the page (some iPhones) — the guest taps ▶ once
 * and the card hides again as soon as the music plays — or if the video fails.
 */
export function MusicHost() {
  const status = useMusicStatus();
  const hostRef = useCallback((el: HTMLDivElement | null) => registerMusicHost(el), []);
  useEffect(() => {
    const t = window.setTimeout(primeMusic, 2500);
    return () => window.clearTimeout(t);
  }, []);
  if (!wedding.music || wedding.music.kind !== "youtube") return null;
  const visible = status === "blocked" || status === "error";

  return (
    <motion.aside
      aria-label="Music"
      aria-hidden={!visible}
      inert={!visible}
      className={cx(
        "fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 z-[110] w-[218px] rounded-2xl p-[1.5px] sm:bottom-4 sm:left-4 sm:w-[232px] [background:linear-gradient(140deg,#8a6526,#f6db9a_45%,#c49a4a_70%,#7a5520)] shadow-[0_20px_50px_-12px_rgb(0_0_0/0.8)]",
        !visible && "pointer-events-none",
      )}
      initial={false}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="stone rounded-[14.5px] p-2 sm:p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="truncate font-display text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-gold-pale">{wedding.music.title}</p>
          <button
            type="button"
            onClick={stopMusic}
            aria-label="Dismiss music"
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-bright hover:border-gold-bright"
          >
            <X aria-hidden className="size-3.5" />
          </button>
        </div>
        {/* YouTube mounts its iframe in here. */}
        <div ref={hostRef} className="size-[200px] overflow-hidden rounded-lg bg-black/60 [&>iframe]:size-full" />
        <AnimatePresence>
          {status === "blocked" && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2 text-center text-sm italic text-sand">
              Tap ▶ once to start the music.
            </motion.p>
          )}
          {status === "error" && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2 text-center text-sm italic text-sand">
              This music can’t be played right now.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
