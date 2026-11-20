"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { wedding } from "@/config/wedding";
import { Hourglass } from "@/components/artwork/Hourglass";
import { sandSwirl } from "@/components/secrets/SandSwirl";
import { playSound } from "@/components/sound/soundStore";
import { announce } from "@/components/ui/Announcer";
import { useOpeningSequence } from "@/hooks/useOpeningSequence";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Secret 1 — The Sands of Time. Every so often a tiny golden hourglass
 * materialises at the edge of the scene for a few seconds. Clicking it releases
 * a swirl of golden sand. With reduced motion it simply rests, static, in the
 * lower-left corner.
 */
const SPOTS = [
  { left: "6%", top: "72%" },
  { left: "88%", top: "34%" },
  { left: "10%", top: "28%" },
  { left: "84%", top: "78%" },
  { left: "50%", top: "86%" },
];
const FIRST_DELAY = 22_000;
const INTERVAL = 38_000;
const VISIBLE_FOR = 9_000;

export function WanderingHourglass() {
  const reduced = useReducedMotion();
  const { status } = useOpeningSequence();
  const [spot, setSpot] = useState<number | null>(null);

  useEffect(() => {
    if (reduced || status !== "done") return;
    let n = 0;
    let hideTimer: number | undefined;
    const show = () => {
      setSpot(n % SPOTS.length);
      n++;
      hideTimer = window.setTimeout(() => setSpot(null), VISIBLE_FOR);
    };
    const first = window.setTimeout(show, FIRST_DELAY);
    const loop = window.setInterval(show, INTERVAL);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(hideTimer);
      window.clearInterval(loop);
    };
  }, [reduced, status]);

  const release = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    sandSwirl(r.left + r.width / 2, r.top + r.height / 2, reduced);
    playSound("sparkle");
    playSound("whoosh");
    announce(wedding.copy.secrets.hourglassMessage);
    if (!reduced) setSpot(null);
  };

  const label = wedding.copy.secrets.hourglassLabel;

  if (status !== "done") return null;

  if (reduced) {
    return (
      <button type="button" onClick={release} aria-label={label} className="fixed bottom-4 left-4 z-40 grid size-11 place-items-center rounded-full opacity-70 hover:opacity-100">
        <Hourglass progress={0.5} flowing={false} className="h-8 w-auto" />
      </button>
    );
  }

  return (
    <AnimatePresence>
      {spot !== null && (
        <motion.button
          key={spot}
          type="button"
          onClick={release}
          aria-label={label}
          className="fixed z-40 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
          style={SPOTS[spot]}
          initial={{ opacity: 0, scale: 0.4, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: [0, -6, 0] }}
          exit={{ opacity: 0, scale: 0.6, filter: "blur(6px)" }}
          transition={{ duration: 1.2, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
        >
          <span aria-hidden className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgb(226_188_115/0.55),transparent)]" />
          <Hourglass progress={0.5} className="relative h-9 w-auto drop-shadow-[0_0_8px_rgb(226_188_115/0.8)]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
