"use client";

import { motion, type MotionValue, useTransform } from "motion/react";
import { forwardRef, type CSSProperties } from "react";
import { wedding } from "@/config/wedding";
import { Rule } from "@/components/artwork/Ornaments";
import { starPoints } from "@/components/artwork/geometry";
import { SealSecret } from "@/components/secrets/SealSecret";
import { eventFullDate } from "@/lib/dates";
import { cx } from "@/lib/formatting";

export interface LetterMotion {
  /** Percent of the letter's own height. */
  y: MotionValue<number>;
  scale: MotionValue<number>;
  /** Fold angles: top -178 → 0, bottom 178 → 0. */
  top: MotionValue<number>;
  bottom: MotionValue<number>;
}

const { copy } = wedding;
const city = wedding.venue.city.split(",")[0];

/** Invitation lines revealed in "golden ink", in order. */
const LINES: { text: string; className: string; ink?: string }[] = [
  { text: copy.opening.blessingLead, className: "text-[0.95rem] italic sm:text-[1.12rem]" },
  { text: copy.opening.request, className: "text-[0.95rem] leading-snug sm:text-[1.12rem]" },
  { text: wedding.event.occasion.toUpperCase(), className: "mt-1.5 font-display text-[0.98rem] font-semibold tracking-[0.2em] sm:mt-2 sm:text-[1.35rem] sm:tracking-[0.3em]", ink: "#17605f" },
  { text: copy.opening.connector, className: "text-[0.92rem] italic leading-tight sm:text-[0.98rem]" },
  { text: wedding.couple.groom.fullName, className: "font-script text-[2.05rem] leading-[1.05] sm:text-[2.7rem]", ink: "#6e4f17" },
  { text: copy.opening.and, className: "text-[0.92rem] italic leading-tight sm:text-[0.98rem]" },
  { text: wedding.couple.bride.fullName, className: "font-script text-[2.05rem] leading-[1.05] sm:text-[2.7rem]", ink: "#6e4f17" },
  { text: eventFullDate, className: "mt-2 font-display text-[0.68rem] font-semibold tracking-[0.1em] uppercase sm:mt-3 sm:text-[0.8rem] sm:tracking-[0.2em]" },
  { text: wedding.event.timeDisplay, className: "font-display text-[0.68rem] font-semibold tracking-[0.1em] uppercase sm:text-[0.8rem] sm:tracking-[0.2em]" },
  { text: wedding.venue.name, className: "mt-1.5 font-display text-[0.74rem] font-bold tracking-[0.1em] uppercase sm:mt-2 sm:text-[0.88rem] sm:tracking-[0.16em]" },
  { text: `${wedding.venue.area}, ${city}`, className: "text-[0.92rem] italic sm:text-[0.98rem]" },
];

export const INK_STEP = 0.17;
export const INK_DURATION = 0.95;
export const INK_TOTAL_MS = Math.round(((LINES.length - 1) * INK_STEP + INK_DURATION) * 1000);

/* ── Pointed-dome geometry (shared by the paper clip and the gold frame) ──── */

/** Where the dome meets the sides, as % of the top/bottom fold panel's height. */
const SHOULDER = 44;
/** Dome height as % of the whole letter (each fold panel is 33.4% tall). */
const DOME = (SHOULDER * 33.4) / 100;

/** Point on one cubic Bézier. */
const bez = (p0: number, p1: number, p2: number, p3: number, t: number) =>
  (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3;

/**
 * Unit dome outline from the left shoulder (0,1) up to the pointed apex
 * (0.5,0) and down to the right shoulder (1,1): full and round at the
 * shoulders, drawing to a sharp point like a Persian dome.
 */
function unitDome(steps = 22): [number, number][] {
  const left: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    left.push([bez(0, 0, 0.42, 0.5, t), bez(1, 0.35, 0.32, 0, t)]);
  }
  const right = left.slice(0, -1).reverse().map(([x, y]) => [1 - x, y] as [number, number]);
  return [...left, ...right];
}
const DOME_PTS = unitDome();
const pct = (n: number) => `${Math.round(n * 100) / 100}%`;

/** clip-path for the top panel (dome on top) or bottom panel (inverted dome). */
const TOP_CLIP = `polygon(${[...DOME_PTS.map(([x, y]) => `${pct(x * 100)} ${pct(y * SHOULDER)}`), "100% 100%", "0% 100%"].join(", ")})`;
const BOTTOM_CLIP = `polygon(0% 0%, 100% 0%, ${[...DOME_PTS].reverse().map(([x, y]) => `${pct(x * 100)} ${pct(100 - y * SHOULDER)}`).join(", ")})`;

/** Frame path in a 100×100 box stretched over the whole letter, inset by (ix, iy). */
function framePath(ix: number, iy: number): string {
  const w = 100 - 2 * ix;
  const hd = DOME - iy;
  const f = (n: number) => Math.round(n * 100) / 100;
  const top = `M${f(ix)} ${f(100 - DOME)} L${f(ix)} ${f(DOME)} C${f(ix)} ${f(iy + 0.35 * hd)} ${f(ix + 0.42 * w)} ${f(iy + 0.32 * hd)} 50 ${f(iy)} C${f(100 - ix - 0.42 * w)} ${f(iy + 0.32 * hd)} ${f(100 - ix)} ${f(iy + 0.35 * hd)} ${f(100 - ix)} ${f(DOME)}`;
  const bottom = `L${f(100 - ix)} ${f(100 - DOME)} C${f(100 - ix)} ${f(100 - iy - 0.35 * hd)} ${f(100 - ix - 0.42 * w)} ${f(100 - iy - 0.32 * hd)} 50 ${f(100 - iy)} C${f(ix + 0.42 * w)} ${f(100 - iy - 0.32 * hd)} ${f(ix)} ${f(100 - iy - 0.35 * hd)} ${f(ix)} ${f(100 - DOME)} Z`;
  return `${top} ${bottom}`;
}

/** Gold double frame following the domes, with finials at the points and shoulders. */
function DomeFrame({ visible }: { visible: boolean }) {
  return (
    <div aria-hidden className={cx("pointer-events-none absolute inset-0 transition-opacity duration-700", visible ? "opacity-100" : "opacity-0")}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
        <path d={framePath(3.2, 1.8)} fill="none" stroke="#9A7230" strokeOpacity="0.75" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
        <path d={framePath(5, 2.9)} fill="none" stroke="#9A7230" strokeOpacity="0.4" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* finials at the dome points */}
      {(["top", "bottom"] as const).map((pos) => (
        <svg key={pos} viewBox="0 0 20 20" className={cx("absolute left-1/2 size-4 -translate-x-1/2 sm:size-5", pos === "top" ? "top-[3.6%]" : "bottom-[3.6%]")}>
          <polygon points={starPoints(10, 10, 9.5, 4.4)} fill="#9A7230" />
        </svg>
      ))}
      {/* small diamonds where the domes meet the sides */}
      {[DOME, 100 - DOME].map((y) =>
        [3.2, 96.8].map((x) => (
          <span key={`${x}-${y}`} className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#9A7230]" style={{ left: `${x}%`, top: `${y}%` }} />
        )),
      )}
    </div>
  );
}

function FlatPanel() {
  return <div className="parchment absolute inset-x-0 top-1/3 h-[33.4%] [transform:translateZ(-1px)]" />;
}

function FoldPanel({ position, angle }: { position: "top" | "bottom"; angle: MotionValue<number> }) {
  const shade = useTransform(angle, (a) => Math.min(0.2, Math.abs(a) / 900));
  return (
    <motion.div
      className={cx("parchment absolute inset-x-0 h-[33.4%]", position === "top" ? "top-0 origin-bottom" : "top-2/3 origin-top")}
      style={{ rotateX: angle, clipPath: position === "top" ? TOP_CLIP : BOTTOM_CLIP }}
    >
      <motion.div className="absolute inset-0 bg-gradient-to-b from-[#6b4a1a] to-[#3a2608]" style={{ opacity: shade }} />
      <div className={cx("absolute inset-x-0 h-3 from-[#8a6a3a]/25 to-transparent", position === "top" ? "bottom-0 bg-gradient-to-t" : "top-0 bg-gradient-to-b")} />
    </motion.div>
  );
}

/**
 * The tri-fold parchment letter. Paper panels (behind) fold in 3D; the text
 * layer (in front) is revealed only after the letter is fully open.
 */
export const InvitationLetter = forwardRef<
  HTMLDivElement,
  { m: LetterMotion; showBismillah: boolean; showTranslation: boolean; showInk: boolean; showSeal: boolean; flat: boolean; onEnter?: () => void }
>(function InvitationLetter({ m, showBismillah, showTranslation, showInk, showSeal, flat, onEnter }, ref) {
    const y = useTransform(m.y, (v) => `${v}%`);
    return (
      <motion.div
        ref={ref}
        className={cx("on-parchment relative w-[calc(var(--env-w)*0.92)]", flat ? "" : "[perspective:1400px] [transform-style:preserve-3d]", onEnter && "cursor-pointer")}
        style={{ y, scale: m.scale }}
        // Once open, tapping anywhere on the invitation enters the kingdom (keyboard: the Enter button).
        onClick={onEnter}
      >
        <div aria-hidden className={cx("pointer-events-none absolute inset-0", flat ? "" : "[transform-style:preserve-3d]")}>
          <FlatPanel />
          <FoldPanel position="bottom" angle={m.bottom} />
          <FoldPanel position="top" angle={m.top} />
        </div>

        <div className="relative px-5 pb-[19%] pt-[21%] text-center text-ink [transform:translateZ(2px)] sm:px-10 sm:pb-[17%] sm:pt-[19%]" style={{ ["--ink" as string]: "#0d2145" } as CSSProperties}>
          <DomeFrame visible={showBismillah} />

          <motion.p
            lang="ar"
            dir="rtl"
            className="font-arabic text-[1.35rem] leading-[1.8] text-navy sm:text-[1.85rem] sm:leading-[1.9]"
            initial={false}
            animate={showBismillah ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 0, filter: "blur(8px)", y: 6 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {wedding.opening.arabic}
          </motion.p>
          <motion.p
            className="text-[0.85rem] italic leading-snug text-ink/80 sm:mt-1 sm:text-base"
            initial={false}
            animate={{ opacity: showTranslation ? 1 : 0 }}
            transition={{ duration: 1 }}
          >
            {wedding.opening.translation}
          </motion.p>
          <Rule className={cx("my-3 sm:my-4 transition-opacity duration-700", showTranslation ? "opacity-100" : "opacity-0")} />

          <div className="flex flex-col items-center">
            {LINES.map((line, i) => (
              <p key={i} className={cx("max-w-full", line.className)}>
                {showInk ? (
                  <span
                    className="ink-line px-[0.18em] py-[0.06em]"
                    style={{ ["--ink-delay" as string]: `${i * INK_STEP}s`, ["--ink-dur" as string]: `${INK_DURATION}s`, ...(line.ink ? { ["--ink" as string]: line.ink } : {}) } as CSSProperties}
                  >
                    {line.text}
                  </span>
                ) : (
                  <span className="invisible px-[0.18em]">{line.text}</span>
                )}
              </p>
            ))}
          </div>

          <div className={cx("mt-3 flex justify-center transition-opacity sm:mt-5 duration-700", showSeal ? "opacity-100" : "pointer-events-none opacity-0")}>
            <SealSecret onActivate={onEnter} />
          </div>
        </div>
      </motion.div>
    );
});
