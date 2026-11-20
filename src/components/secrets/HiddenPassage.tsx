"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { archPath, starPoints } from "@/components/artwork/geometry";
import { playSound } from "@/components/sound/soundStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cx } from "@/lib/formatting";

/**
 * Secret 3 — The Hidden Passage. A small carved rosette in the hero's column
 * base opens a native <dialog>: a stone door slides away to reveal a passage
 * filled with mysterious golden light.
 */
export function HiddenPassage({ className }: { className?: string }) {
  const dialog = useRef<HTMLDialogElement | null>(null);
  const [openCount, setOpenCount] = useState(0);
  const reduced = useReducedMotion();
  const { secrets } = wedding.copy;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpenCount((n) => n + 1);
          dialog.current?.showModal();
          playSound("door");
        }}
        aria-label={secrets.passageLabel}
        className={cx("group absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full", className)}
      >
        <svg aria-hidden viewBox="0 0 40 40" className="size-6 opacity-70 transition duration-500 group-hover:rotate-45 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgb(226_188_115/0.9)] group-focus-visible:opacity-100">
          <polygon points={starPoints(20, 20, 18, 8)} fill="#0a1a38" stroke="#E2BC73" strokeWidth="1.4" />
          <circle cx="20" cy="20" r="4" fill="#258F91" className="flicker-slow" />
        </svg>
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="passage-title"
        className="m-auto w-[min(26rem,92vw)] overflow-visible bg-transparent p-0 text-parchment backdrop:bg-black/80"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="stone relative overflow-hidden rounded-t-[50%_28%] border border-gold/50 px-6 pb-8 pt-10 text-center shadow-[0_0_80px_-10px_rgb(226_188_115/0.5)]">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close the hidden passage"
            className="absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full border border-gold/40 text-gold-bright"
          >
            <X aria-hidden className="size-4" />
          </button>

          <div key={openCount} className="relative mx-auto aspect-[3/4] w-48">
            <svg aria-hidden viewBox="0 0 240 320" className="absolute inset-0 size-full">
              <defs>
                <radialGradient id="passage-light" cx="50%" cy="85%" r="75%">
                  <stop offset="0" stopColor="#FFF6D8" />
                  <stop offset="0.35" stopColor="#E2BC73" />
                  <stop offset="1" stopColor="#3a2608" />
                </radialGradient>
                <clipPath id="passage-clip">
                  <path d={archPath(120, 320, 180, 140, 28)} />
                </clipPath>
              </defs>
              <path d={archPath(120, 320, 180, 140, 28)} fill="url(#passage-light)" />
              <g clipPath="url(#passage-clip)">
                {/* receding steps of light */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <path key={i} d={archPath(120, 320 - i * 6, 150 - i * 26, 160 + i * 18, 60 + i * 30, false)} fill="none" stroke="#FFF1C9" strokeOpacity={0.5 - i * 0.08} />
                ))}
                <motion.rect
                  x="20"
                  y="0"
                  width="200"
                  height="320"
                  fill="#0b1d3e"
                  stroke="#C49A4A"
                  initial={{ y: 0 }}
                  animate={{ y: reduced ? -330 : [-0, -0, -330] }}
                  transition={{ duration: reduced ? 0 : 2.2, times: [0, 0.2, 1], ease: [0.6, 0, 0.3, 1] }}
                />
              </g>
              <path d={archPath(120, 320, 180, 140, 28, false)} fill="none" stroke="#E2BC73" strokeWidth="3" />
              <path d={archPath(120, 320, 200, 136, 14, false)} fill="none" stroke="#C49A4A" strokeOpacity="0.5" />
            </svg>
            {!reduced && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-6 bottom-0 top-1/4 rounded-t-full bg-[radial-gradient(closest-side,rgb(255_241_201/0.9),transparent)] mix-blend-screen"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0, 1, 0.6], scale: [0.6, 0.6, 1.2, 1] }}
                transition={{ duration: 3, times: [0, 0.4, 0.75, 1] }}
              />
            )}
          </div>

          <h2 id="passage-title" className="mt-6 font-display text-xl tracking-[0.2em] text-gold-pale">
            {secrets.passageTitle}
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-parchment/90">{secrets.passageText}</p>
        </div>
      </dialog>
    </>
  );
}
