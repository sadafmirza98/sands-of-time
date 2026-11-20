"use client";

import { animate, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { CrescentMoon } from "@/components/artwork/CrescentMoon";
import { Hourglass } from "@/components/artwork/Hourglass";
import { Lantern } from "@/components/artwork/Lantern";
import { MonogramInsignia, Mechanism } from "@/components/artwork/Ornaments";
import { Column, Dunes, PalaceFar, PalaceMain, TopArchFrame } from "@/components/artwork/Palace";
import { Starfield } from "@/components/artwork/Starfield";
import { ARRIVE_EVENT } from "@/components/invitation/OpeningOverlay";
import { SandField } from "@/components/magical/SandField";
import { HiddenPassage } from "@/components/secrets/HiddenPassage";
import { RoyalButton } from "@/components/ui/RoyalButton";
import { useFinePointer, useReducedMotion } from "@/hooks/useReducedMotion";
import { eventLongDate } from "@/lib/dates";

const { hero } = wedding.copy;
const { groom, bride, monogram } = wedding.couple;
const nextSectionId = wedding.story.length > 0 ? "story" : "journey";

/**
 * Section 2 — The Kingdom of Two Souls. A layered palace environment with scroll
 * and pointer parallax, a slow "camera" drift, flickering lanterns, a turning
 * celestial mechanism and sand spiralling around the great iwan.
 */
export function HeroSection() {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const [arrival, setArrival] = useState(0);

  // scroll parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const skyY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const farY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const mainY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const fgY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentO = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // pointer parallax (desktop only)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 18 });
  const sy = useSpring(py, { stiffness: 40, damping: 18 });
  const farX = useTransform(sx, (v) => v * -8);
  const mainX = useTransform(sx, (v) => v * -16);
  const fgX = useTransform(sx, (v) => v * -34);
  const tiltY = useTransform(sy, (v) => v * -6);

  // arrival "camera push" after the invitation dissolves
  const arrive = useMotionValue(1);
  const arriveScale = useTransform(arrive, [0, 1], [1.16, 1]);
  const arriveBlur = useTransform(arrive, (v) => (v >= 0.995 ? "none" : `blur(${((1 - v) * 6).toFixed(2)}px)`));

  useEffect(() => {
    const onArrive = () => {
      setArrival((n) => n + 1);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      arrive.set(0);
      animate(arrive, 1, { duration: 2.2, ease: [0.16, 1, 0.3, 1] });
    };
    window.addEventListener(ARRIVE_EVENT, onArrive);
    return () => window.removeEventListener(ARRIVE_EVENT, onArrive);
  }, [arrive]);

  useEffect(() => {
    if (!fine || reduced) return;
    const onMove = (e: PointerEvent) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine, reduced, px, py]);

  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 1.4, delay: delay + 0.35, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section ref={ref} id="home" aria-labelledby="hero-title" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-midnight">
      <motion.div className="absolute inset-0 origin-[50%_60%]" style={{ scale: arriveScale, filter: arriveBlur }}>
        <div className="camera-drift absolute inset-0 origin-[50%_70%]">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#040c1f_0%,#07152f_30%,#0d2145_60%,#173b69_82%,#2b3f5e_100%)]" />
          <div className="sky-shift absolute inset-0 bg-[radial-gradient(70%_45%_at_50%_78%,rgb(226_188_115/0.28),transparent_70%)]" />
          <motion.div className="absolute inset-0" style={{ y: skyY }}>
            <Starfield count={160} seed={11} />
            <CrescentMoon className="absolute right-[24%] top-[13%] hidden size-32 sm:block lg:right-[25%] lg:top-[15%] lg:size-40" />
          </motion.div>
          <motion.div className="absolute inset-0" style={{ y: farY, x: farX }}>
            <PalaceFar />
          </motion.div>
          <motion.div className="absolute inset-0" style={{ y: mainY, x: mainX, rotateX: tiltY }}>
            <PalaceMain />
          </motion.div>
          <SandField mode="swirl" origin={[0.5, 0.62]} density={1.6} max={200} speed={0.9} />
          <motion.div className="absolute inset-0" style={{ y: mainY }}>
            <Dunes />
          </motion.div>
        </div>

        {/* atmospheric haze & vignette */}
        <div className="breathe-slow pointer-events-none absolute inset-0 bg-[radial-gradient(60%_35%_at_50%_88%,rgb(217_189_145/0.18),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(75%_65%_at_50%_45%,transparent_40%,rgb(3_8_20/0.75)_100%)]" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-midnight" />

        {/* foreground architecture */}
        <motion.div className="absolute inset-0" style={{ y: fgY, x: fgX }}>
          <TopArchFrame className="hidden h-[26vh] md:block" />
          <div className="absolute bottom-0 left-0 h-[94%] -translate-x-[42%] sm:translate-x-[-12%] lg:translate-x-0">
            <Column />
            {/* Secret 3 — the hidden passage, carved into the column base */}
            <HiddenPassage className="left-1/2 top-[95.3%]" />
          </div>
          <div className="absolute bottom-0 right-0 h-[94%] translate-x-[42%] sm:translate-x-[12%] lg:translate-x-0">
            <Column mirrored />
          </div>
          <Lantern className="absolute left-[13%] top-0 h-40 sm:left-[16%] sm:h-56 lg:h-72" chain={160} />
          <Lantern className="absolute right-[13%] top-0 h-36 sm:right-[16%] sm:h-52 lg:h-64" chain={130} delay={1.3} />
          <Lantern className="absolute left-[31%] top-0 hidden h-44 lg:block" chain={60} delay={2.1} />
                  </motion.div>
      </motion.div>

      {/* content */}
      <motion.div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-5 pb-16 pt-20 text-center" style={{ y: contentY, opacity: contentO }}>
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[min(130vw,980px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(3_8_20/0.72),rgb(3_8_20/0.42)_55%,transparent)]" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(118vw,760px)] -translate-x-1/2 -translate-y-[54%] opacity-45 mix-blend-screen">
          <Mechanism className="size-full" />
        </div>

        <div key={arrival} className="pointer-events-auto relative flex flex-col items-center">
          <motion.div {...reveal(0)}>
            <MonogramInsignia monogram={monogram} className="size-16 drop-shadow-[0_0_18px_rgb(226_188_115/0.45)] sm:size-20" />
          </motion.div>
          <motion.p {...reveal(0.15)} className="text-shade mt-4 font-display text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-sand sm:text-xs sm:tracking-[0.42em]">
            {hero.eyebrow}
          </motion.p>
          {/* The occasion, so it's clear at first sight that this is the Walima */}
          <motion.p {...reveal(0.22)} className="text-shade mt-3 flex items-center gap-3 font-display text-[0.95rem] font-semibold uppercase tracking-[0.3em] text-gold-pale sm:text-lg sm:tracking-[0.4em]">
            <span aria-hidden className="h-px w-6 bg-gradient-to-r from-transparent to-gold sm:w-12" />
            {wedding.event.occasion}
            <span aria-hidden className="h-px w-6 bg-gradient-to-l from-transparent to-gold sm:w-12" />
          </motion.p>

          <h1 id="hero-title" className="mt-5 flex flex-col items-center drop-shadow-[0_6px_30px_rgb(3_8_20/0.9)]">
            <motion.span {...reveal(0.3)} className="gold-foil shimmer block font-display text-[clamp(3.1rem,15vw,8.6rem)] font-semibold leading-[0.95] tracking-[0.1em]">
              {groom.firstName}
            </motion.span>
            <motion.span {...reveal(0.55)} className="gold-foil -my-[0.18em] block font-script text-[clamp(3.6rem,15vw,8rem)] leading-none">
              <span className="sr-only"> </span>&<span className="sr-only"> </span>
            </motion.span>
            <motion.span {...reveal(0.8)} className="gold-foil shimmer block font-display text-[clamp(3.1rem,15vw,8.6rem)] font-semibold leading-[0.95] tracking-[0.1em]">
              {bride.firstName}
            </motion.span>
          </h1>

          <motion.p {...reveal(1.05)} className="text-shade mt-5 max-w-md text-[1.2rem] italic text-parchment sm:text-[1.35rem]">
            {hero.subtitle}
          </motion.p>
          <motion.p {...reveal(1.2)} className="text-shade mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-display text-[0.78rem] font-semibold uppercase tracking-[0.28em] text-gold-pale sm:text-sm">
            <span>{eventLongDate}</span>
            <span aria-hidden className="size-1.5 rotate-45 bg-gold" />
            <span>{hero.location}</span>
          </motion.p>
          <motion.div {...reveal(1.4)} className="mt-8">
            <RoyalButton
              variant="gold"
              onClick={() => document.getElementById(nextSectionId)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })}
            >
              {hero.cta}
            </RoyalButton>
          </motion.div>
        </div>
      </motion.div>

      <a
        href={`#${nextSectionId}`}
        className="text-shade absolute inset-x-0 bottom-4 z-10 mx-auto flex w-fit flex-col items-center gap-2 px-4 text-sand/90 sm:bottom-6"
      >
        <Hourglass progress={0.55} className="float-y h-9 w-auto opacity-90" />
        <span className="text-sm italic">{hero.scrollCue}</span>
        <span aria-hidden className="relative h-8 w-px overflow-hidden bg-gold/20">
          <span className="scroll-cue-line absolute inset-0 bg-gold-bright" />
        </span>
      </a>
    </section>
  );
}
