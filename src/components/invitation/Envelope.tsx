"use client";

import { motion, type MotionValue, useTransform } from "motion/react";
import { RoyalSeal } from "@/components/artwork/RoyalSeal";
import { starPoints } from "@/components/artwork/geometry";

/**
 * The envelope is drawn as separate layers (back, pocket, flap, seal) so the
 * letter can sit *between* the back and the pocket while it slides out. Every
 * layer shares the same motion values so they move as one object.
 */

export interface EnvelopeMotion {
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  flap: MotionValue<number>;
  glow: MotionValue<number>;
  split: MotionValue<number>;
}

const layer = "absolute left-1/2 top-1/2 w-[var(--env-w)] h-[var(--env-h)] -translate-x-1/2 -translate-y-1/2";

export function EnvelopeBack({ m }: { m: EnvelopeMotion }) {
  return (
    <motion.div aria-hidden className={layer} style={{ y: m.y, opacity: m.opacity, scale: m.scale, zIndex: 1 }}>
      <div className="absolute inset-0 overflow-hidden rounded-[6px] shadow-[0_40px_80px_-20px_rgb(0_0_0/0.8)]" style={{ background: "linear-gradient(180deg,#cfb084,#b8925c)" }}>
        {/* luxurious liner, visible once the flap opens */}
        <svg viewBox="0 0 100 66" preserveAspectRatio="none" className="absolute inset-0 size-full">
          <defs>
            <pattern id="env-liner" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="#0d2145" />
              <polygon points={starPoints(4, 4, 3.4, 1.6)} fill="none" stroke="#C49A4A" strokeWidth="0.3" />
              <circle cx="4" cy="4" r="0.6" fill="#258F91" />
            </pattern>
          </defs>
          <path d="M3 3 H97 L50 38 Z" fill="url(#env-liner)" />
        </svg>
      </div>
    </motion.div>
  );
}

export function EnvelopePocket({ m }: { m: EnvelopeMotion }) {
  return (
    <motion.div aria-hidden className={layer} style={{ y: m.y, opacity: m.opacity, scale: m.scale, zIndex: 3 }}>
      <svg viewBox="0 0 100 66" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
        <defs>
          <linearGradient id="env-pocket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#efdfbf" />
            <stop offset="1" stopColor="#dcc398" />
          </linearGradient>
        </defs>
        <path d="M0 0 L50 37 L100 0 V66 H0 Z" fill="url(#env-pocket)" />
        <path d="M0 66 L44 33 M100 66 L56 33" stroke="#a88758" strokeOpacity="0.35" vectorEffect="non-scaling-stroke" fill="none" />
        <path d="M0 0 L50 37 L100 0" stroke="#fff6e0" strokeOpacity="0.6" vectorEffect="non-scaling-stroke" fill="none" />
        <rect x="3" y="3" width="94" height="60" fill="none" stroke="#C49A4A" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
        <rect x="4.6" y="5" width="90.8" height="56" fill="none" stroke="#C49A4A" strokeOpacity="0.55" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* engraved corner stars */}
      {["left-[6%] bottom-[9%]", "right-[6%] bottom-[9%]"].map((pos) => (
        <svg key={pos} viewBox="0 0 20 20" className={`absolute size-[7%] ${pos}`}>
          <polygon points={starPoints(10, 10, 9, 4.2)} fill="none" stroke="#9A7230" strokeWidth="0.9" />
        </svg>
      ))}
    </motion.div>
  );
}

export function EnvelopeFlap({ m, behind }: { m: EnvelopeMotion; behind: boolean }) {
  // Paper catches less light as it turns edge-on (90°), then the lined inside faces us.
  const frontShade = useTransform(m.flap, [0, 90], [0, 0.4]);
  const backShade = useTransform(m.flap, [90, 180], [0.45, 0]);
  return (
    <motion.div aria-hidden className={layer} style={{ y: m.y, opacity: m.opacity, scale: m.scale, zIndex: behind ? 0 : 4 }}>
      {/* Hinged on the envelope's top edge; swings toward the viewer and up over the top. */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[62%] origin-top [transform-style:preserve-3d]"
        style={{ rotateX: m.flap, transformPerspective: 1100 }}
      >
        {/* outside of the flap (seen while closed) */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <svg viewBox="0 0 100 41" preserveAspectRatio="none" className="absolute inset-0 size-full">
            <defs>
              <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f6ead0" />
                <stop offset="1" stopColor="#e5cfa5" />
              </linearGradient>
            </defs>
            <path d="M0 0 H100 L50 41 Z" fill="url(#env-flap)" />
            {/* soft edge shading instead of a drop-shadow filter (filters + 3D flicker on iOS) */}
            <path d="M0 0 L50 41 L100 0" fill="none" stroke="#8a6a3a" strokeOpacity="0.45" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            <path d="M4 2.4 H96 L50 37.6 Z" fill="none" stroke="#C49A4A" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
            <path d="M8 4.6 H92 L50 34.6 Z" fill="none" stroke="#C49A4A" strokeOpacity="0.5" vectorEffect="non-scaling-stroke" />
          </svg>
          <motion.div className="absolute inset-0 bg-[#3a2608] [clip-path:polygon(0_0,100%_0,50%_100%)]" style={{ opacity: frontShade }} />
        </div>
        {/* inside of the flap (seen once open). This face is turned over with the
            flap, so it is drawn tip-at-top: after the 180° swing the wide edge
            stays on the hinge and the point rises above the envelope. */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]">
          <svg viewBox="0 0 100 41" preserveAspectRatio="none" className="absolute inset-0 size-full">
            <path d="M0 41 H100 L50 0 Z" fill="#e3cc9f" />
            <path d="M5 38.6 H95 L50 4.2 Z" fill="url(#env-liner)" />
            <path d="M5 38.6 H95 L50 4.2 Z" fill="none" stroke="#C49A4A" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <path d="M0 41 H100" stroke="#a88758" strokeOpacity="0.6" vectorEffect="non-scaling-stroke" />
          </svg>
          <motion.div className="absolute inset-0 bg-[#1a1004] [clip-path:polygon(0_100%,100%_100%,50%_0)]" style={{ opacity: backShade }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function EnvelopeSeal({ m, monogram, pulsing }: { m: EnvelopeMotion; monogram: string; pulsing: boolean }) {
  const leftX = useTransform(m.split, (v) => `${-v * 46}%`);
  const rightX = useTransform(m.split, (v) => `${v * 46}%`);
  const leftR = useTransform(m.split, (v) => -v * 28);
  const rightR = useTransform(m.split, (v) => v * 24);
  const halvesO = useTransform(m.split, [0, 0.6, 1], [1, 1, 0]);
  const halvesY = useTransform(m.split, (v) => `${v * v * 60}%`);
  const glowScale = useTransform(m.glow, [0, 1], [0.6, 1.4]);
  return (
    <motion.div
      aria-hidden
      className="absolute left-1/2 top-1/2 h-[var(--env-h)] w-[var(--env-w)] -translate-x-1/2 -translate-y-1/2"
      style={{ y: m.y, opacity: m.opacity, scale: m.scale, zIndex: 5 }}
    >
      <div className="absolute left-1/2 top-[62%] aspect-square w-[23%] -translate-x-1/2 -translate-y-1/2">
        {/* waiting: a pure-CSS pulse (GPU); the break flash uses the motion value */}
        {pulsing && <div className="seal-pulse absolute -inset-[70%] rounded-full bg-[radial-gradient(circle,rgb(255_236_180/0.85),rgb(226_188_115/0.35)_35%,transparent_68%)]" />}
        <motion.div
          className="absolute -inset-[70%] rounded-full will-change-[opacity,transform]"
          style={{ opacity: m.glow, scale: glowScale, background: "radial-gradient(circle, rgb(255 236 180 / 0.85), rgb(226 188 115 / 0.35) 35%, transparent 68%)" }}
        />
        <motion.div className="absolute inset-0" style={{ x: leftX, y: halvesY, rotate: leftR, opacity: halvesO }}>
          <RoyalSeal monogram={monogram} half="left" className="size-full drop-shadow-[0_4px_6px_rgb(40_25_5/0.5)]" />
        </motion.div>
        <motion.div className="absolute inset-0" style={{ x: rightX, y: halvesY, rotate: rightR, opacity: halvesO }}>
          <RoyalSeal monogram={monogram} half="right" className="size-full drop-shadow-[0_4px_6px_rgb(40_25_5/0.5)]" />
        </motion.div>
      </div>
    </motion.div>
  );
}
