"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { wedding } from "@/config/wedding";
import { starPoints } from "@/components/artwork/geometry";
import { RoyalSeal } from "@/components/artwork/RoyalSeal";
import { playSound } from "@/components/sound/soundStore";
import { announce } from "@/components/ui/Announcer";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Secret 2 — The Royal Seal. The TN seal on the opened invitation hides a
 * small ornamental animation: rays unfurl, an octagram blooms and a line of
 * gilded script appears. When `onActivate` is given (the opening overlay), the
 * flourish plays briefly and then carries the guest into the kingdom.
 */
export function SealSecret({ onActivate }: { onActivate?: () => void }) {
  const [open, setOpen] = useState(0);
  const reduced = useReducedMotion();
  const { monogram } = wedding.couple;

  return (
    <div className="relative flex flex-col items-center">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((n) => n + 1);
          playSound("sparkle");
          announce(wedding.copy.opening.sealSecret);
          if (onActivate) window.setTimeout(onActivate, reduced ? 0 : 650);
        }}
        aria-label={onActivate ? `${wedding.copy.opening.sealHint} — ${wedding.copy.opening.enter}` : `${wedding.copy.opening.sealHint} — reveal its secret`}
        className="group relative size-14 rounded-full transition-transform duration-500 hover:scale-105 sm:size-[4.5rem]"
      >
        <AnimatePresence>
          {open > 0 && (
            <motion.svg
              key={open}
              aria-hidden
              viewBox="0 0 200 200"
              className="pointer-events-none absolute -inset-[90%] overflow-visible"
              initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.4, rotate: -30 }}
              animate={reduced ? { opacity: 1 } : { opacity: [0, 1, 1, 0], scale: [0.4, 1, 1.05, 1.2], rotate: [-30, 0, 8, 20] }}
              transition={{ duration: 2.6, times: [0, 0.25, 0.75, 1], ease: "easeOut" }}
            >
              {Array.from({ length: 16 }, (_, i) => (
                <line key={i} x1="100" y1="100" x2="100" y2={i % 2 ? 18 : 4} stroke="#C49A4A" strokeWidth={i % 2 ? 0.8 : 1.4} strokeLinecap="round" transform={`rotate(${i * 22.5} 100 100)`} opacity="0.75" />
              ))}
              <polygon points={starPoints(100, 100, 62, 48, 8)} fill="none" stroke="#9A7230" strokeWidth="1.2" />
              <polygon points={starPoints(100, 100, 62, 48, 8, -Math.PI / 2 + Math.PI / 8)} fill="none" stroke="#17605f" strokeWidth="0.9" />
            </motion.svg>
          )}
        </AnimatePresence>
        <RoyalSeal monogram={monogram} className="relative size-full drop-shadow-[0_4px_8px_rgb(60_40_10/0.45)] transition duration-500 group-hover:drop-shadow-[0_0_14px_rgb(226_188_115/0.9)]" />
      </button>
      <AnimatePresence>
        {open > 0 && (
          <motion.p
            key={`t${open}`}
            aria-hidden
            className="font-script pointer-events-none absolute top-full mt-0.5 whitespace-nowrap text-2xl leading-none text-bronze"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: [0, 1, 1, 0], y: 0 }}
            transition={{ duration: 3, times: [0, 0.2, 0.8, 1] }}
          >
            {wedding.copy.opening.sealSecret}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
