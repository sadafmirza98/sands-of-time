"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { wedding } from "@/config/wedding";
import { TurningHourglass } from "@/components/artwork/TurningHourglass";
import { Mechanism } from "@/components/artwork/Ornaments";
import { Starfield } from "@/components/artwork/Starfield";
import { SandField } from "@/components/magical/SandField";
import { reverseSands } from "@/components/magical/sandTime";
import { playSound } from "@/components/sound/soundStore";
import { announce } from "@/components/ui/Announcer";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useCountdown } from "@/hooks/useCountdown";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { eventFullDate, eventStartUtc } from "@/lib/dates";
import { pad2, pluralise } from "@/lib/formatting";

const { countdown } = wedding.copy;
/** Visual scale for the hourglass: full top bulb = 120 days or more to go. */
const SCALE_MS = 120 * 86_400_000;

function Digits({ value, reduced }: { value: string; reduced: boolean }) {
  return (
    <span className="relative inline-flex h-[1.1em] overflow-hidden" aria-hidden>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="gold-foil block tabular-nums"
          initial={reduced ? false : { y: "-70%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={reduced ? { opacity: 0 } : { y: "70%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Tile({ value, label, ready, reduced }: { value: number; label: string; ready: boolean; reduced: boolean }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative grid aspect-square w-full max-w-[9.5rem] place-items-center p-[2px] [clip-path:polygon(30%_0,70%_0,100%_30%,100%_70%,70%_100%,30%_100%,0_70%,0_30%)] [background:linear-gradient(135deg,#8a6526,#f6db9a_40%,#c49a4a_60%,#7a5520)]">
        <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_50%_30%,#173b69,#07152f_75%)] [clip-path:polygon(30%_0,70%_0,100%_30%,100%_70%,70%_100%,30%_100%,0_70%,0_30%)]">
          <div aria-hidden className="khatam-bg absolute inset-0 opacity-40" />
          <span className="relative font-display text-[clamp(2.1rem,9vw,3.6rem)] font-semibold leading-none">
            {ready ? <Digits value={pad2(value)} reduced={reduced} /> : <span className="gold-foil" aria-hidden>––</span>}
          </span>
        </div>
      </div>
      <span className="mt-3 font-display text-[0.66rem] font-semibold uppercase tracking-[0.38em] text-sand sm:text-xs">{label}</span>
    </div>
  );
}

/** Section 6 — The Hourglass of Destiny. Counts to 19 Dec 2026, 19:00 Asia/Kolkata. */
export function CountdownSection() {
  const c = useCountdown(eventStartUtc);
  const reduced = useReducedMotion();
  const [turns, setTurns] = useState(0);
  const progress = c.ready ? Math.min(1, c.totalMs / SCALE_MS) : 0.6;

  // Screen-reader summary changes at most once per minute.
  const minuteSummary = !c.ready
    ? ""
    : c.done
      ? countdown.complete
      : `${pluralise(c.days, countdown.units.days)}, ${pluralise(c.hours, countdown.units.hours)} and ${pluralise(c.minutes, countdown.units.minutes)} remaining until ${eventFullDate}.`;

  return (
    <section id="countdown" aria-labelledby="countdown-title" className="relative overflow-hidden bg-midnight px-4 py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,#173b69_0%,#0d2145_45%,#07152f_80%)]" />
      <Starfield count={90} seed={51} className="opacity-70" />
      <SandField mode="drift" density={0.8} max={90} speed={0.7} />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(140vw,980px)] -translate-x-1/2 -translate-y-1/2 opacity-40">
        <Mechanism className="size-full" />
      </div>

      <div className="relative">
        <SectionHeading id="countdown-title" eyebrow={countdown.eyebrow} title={countdown.title} />

        <div className="mx-auto mt-12 grid max-w-5xl items-center gap-12 lg:mt-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <Reveal className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => {
                setTurns((t) => t + 1);
                reverseSands();
                playSound("rewind");
                announce(wedding.copy.secrets.reverseMessage);
              }}
              aria-label={`${countdown.hourglassHint} — reverse the sands`}
              className="group relative rounded-[40%] p-2"
            >
              <span aria-hidden className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgb(226_188_115/0.25),transparent)] opacity-0 transition duration-700 group-hover:opacity-100" />
              <TurningHourglass turns={turns} initial={progress} reduced={reduced} className="h-64 sm:h-80" />
            </button>
            <p className="mt-3 text-sm italic text-sand/80" aria-hidden>
              {countdown.hourglassHint}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            {c.done ? (
              <div className="text-center">
                <p className="gold-foil shimmer font-display text-[clamp(1.8rem,6vw,3rem)] font-semibold uppercase tracking-[0.12em]">{countdown.complete}</p>
                <p className="mx-auto mt-4 max-w-md text-xl italic text-parchment">{countdown.completeSub}</p>
              </div>
            ) : (
              <div role="timer" aria-label={`Time remaining until ${eventFullDate}, ${wedding.event.timeDisplay} ${wedding.event.timeZoneLabel}`} className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4 sm:gap-x-6">
                <Tile value={c.days} label={countdown.units.days} ready={c.ready} reduced={reduced} />
                <Tile value={c.hours} label={countdown.units.hours} ready={c.ready} reduced={reduced} />
                <Tile value={c.minutes} label={countdown.units.minutes} ready={c.ready} reduced={reduced} />
                <Tile value={c.seconds} label={countdown.units.seconds} ready={c.ready} reduced={reduced} />
              </div>
            )}
            <p className="mt-8 text-center font-display text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-sand/90 sm:text-xs">
              {eventFullDate} · {wedding.event.timeDisplay} {wedding.event.timeZoneLabel}
            </p>
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {minuteSummary}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
