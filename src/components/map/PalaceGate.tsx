"use client";

import { motion } from "motion/react";
import { KeyRound } from "lucide-react";
import { wedding } from "@/config/wedding";
import { archPath } from "@/components/artwork/geometry";
import { DoorLeaf } from "@/components/artwork/DoorLeaf";
import { RoyalSeal } from "@/components/artwork/RoyalSeal";
import { RoyalButton } from "@/components/ui/RoyalButton";
import { cx } from "@/lib/formatting";

/**
 * The palace doors in front of the map. When `open`, the leaves swing away on
 * vertical 3D hinges and the light behind them blooms.
 */
export function PalaceGate({ open, onOpen, reduced }: { open: boolean; onOpen: () => void; reduced: boolean }) {
  const t = { duration: reduced ? 0 : 1.9, ease: [0.65, 0, 0.25, 1] as const };
  return (
    <div
      className={cx("absolute inset-0 z-10 [perspective:1600px]", open ? "pointer-events-none" : "cursor-pointer")}
      // Tapping anywhere on the doors opens them (keyboard: the Reveal button).
      onClick={open ? undefined : onOpen}
    >
      {/* light spilling through the seam */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(40%_60%_at_50%_55%,rgb(255_241_201/0.9),rgb(226_188_115/0.35)_45%,transparent_75%)] mix-blend-screen"
        initial={false}
        animate={{ opacity: open ? [0, 1, 0] : 0 }}
        transition={{ duration: reduced ? 0 : 2.4, times: [0, 0.35, 1] }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1/2 origin-left [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: open ? -104 : 0, opacity: open ? 0 : 1 }}
        transition={{ rotateY: t, opacity: { duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 1.4 } }}
      >
        <DoorLeaf />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute inset-y-0 right-0 w-1/2 origin-right [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: open ? 104 : 0, opacity: open ? 0 : 1 }}
        transition={{ rotateY: t, opacity: { duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 1.4 } }}
      >
        <DoorLeaf mirrored />
      </motion.div>

      <motion.div
        className="pointer-events-auto absolute inset-x-0 bottom-[12%] flex flex-col items-center gap-5 px-4"
        initial={false}
        animate={{ opacity: open ? 0 : 1, y: open ? 20 : 0 }}
        transition={{ duration: reduced ? 0 : 0.5 }}
        style={{ visibility: open ? "hidden" : "visible" }}
      >
        <div aria-hidden className="relative size-24 sm:size-28">
          <div className="breathe absolute -inset-6 rounded-full bg-[radial-gradient(closest-side,rgb(226_188_115/0.65),transparent)]" />
          <RoyalSeal monogram={wedding.couple.monogram} className="relative size-full drop-shadow-[0_6px_10px_rgb(0_0_0/0.6)]" />
        </div>
        <RoyalButton
          variant="gold"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          icon={<KeyRound />}
          aria-expanded={open}
          aria-controls="venue-map-panel"
        >
          {wedding.copy.map.reveal}
        </RoyalButton>
      </motion.div>

      {/* arch frame over the doorway */}
      <svg aria-hidden viewBox="0 0 400 600" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <path d={`M0 0 H400 V600 H0 Z ${archPath(200, 600, 400, 190, 0)}`} fillRule="evenodd" fill="#07152f" />
      </svg>
    </div>
  );
}
