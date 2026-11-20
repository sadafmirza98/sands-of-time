"use client";

import { motion, type MotionValue, useMotionValue, useScroll, useTransform } from "motion/react";
import { useId, useRef } from "react";
import { wedding } from "@/config/wedding";
import { CrescentMoon } from "@/components/artwork/CrescentMoon";
import { archPath, starPoints } from "@/components/artwork/geometry";
import { Hourglass } from "@/components/artwork/Hourglass";
import { PalaceMain } from "@/components/artwork/Palace";
import { Starfield } from "@/components/artwork/Starfield";
import { RoyalTicket } from "@/components/events/RoyalTicket";
import { SandField } from "@/components/magical/SandField";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const { journey } = wedding.copy;

/* ── artwork local to the journey ───────────────────────────────────────── */

function DuneBand({ fill, highlight, d }: { fill: string; highlight: string; d: string }) {
  const id = useId();
  return (
    <svg aria-hidden viewBox="0 0 3000 300" preserveAspectRatio="none" className="size-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={highlight} />
          <stop offset="0.12" stopColor={fill} />
          <stop offset="1" stopColor="#050f24" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id})`} />
    </svg>
  );
}

const FAR_DUNES = "M0 120 Q150 60 320 110 T700 100 T1050 90 T1400 115 T1750 85 T2100 110 T2450 95 T2800 105 T3000 100 V300 H0 Z";
const NEAR_DUNES = "M0 150 Q250 60 520 140 T1050 120 T1600 150 T2150 110 T2700 140 T3000 120 V300 H0 Z";

function RuinedGate({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg aria-hidden viewBox="0 0 300 420" className={className}>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0a1a38" />
          <stop offset="0.7" stopColor="#173b69" />
          <stop offset="1" stopColor="#0d2145" />
        </linearGradient>
      </defs>
      <path d={`${archPath(150, 420, 260, 190, 40)} ${archPath(150, 420, 180, 210, 90)}`} fillRule="evenodd" fill={`url(#${id}s)`} />
      {/* broken crown */}
      <path d="M150 40 L176 52 L168 70 L188 78 L170 96 L150 90 Z" fill="#07152f" />
      <path d={archPath(150, 420, 260, 190, 40, false)} fill="none" stroke="#C49A4A" strokeOpacity="0.7" strokeWidth="2" />
      <path d={archPath(150, 420, 180, 210, 90, false)} fill="none" stroke="#E2BC73" strokeOpacity="0.55" strokeWidth="1.5" />
      <rect x="20" y="250" width="40" height="10" fill="#258F91" opacity="0.7" />
      <rect x="240" y="300" width="40" height="10" fill="#258F91" opacity="0.5" />
      <polygon points={starPoints(52, 150, 12, 5)} fill="none" stroke="#E2BC73" strokeOpacity="0.6" />
      <path d="M0 400 Q80 370 150 395 T300 385 V420 H0 Z" fill="#8d7350" opacity="0.75" />
    </svg>
  );
}

/* ── the scene, driven by a 0→1 progress value ───────────────────────────── */

function Caption({ p, range, text, index }: { p: MotionValue<number>; range: [number, number]; text: string; index: number }) {
  const [a, b] = range;
  const opacity = useTransform(p, [a, a + 0.05, b - 0.05, b], [0, 1, 1, 0]);
  const y = useTransform(p, [a, b], [24, -24]);
  return (
    <motion.p style={{ opacity, y }} className="text-shade absolute inset-x-0 top-[15%] mx-auto max-w-xl rounded-full bg-[radial-gradient(closest-side,rgb(3_8_20/0.65),transparent)] px-8 py-6 text-center text-[1.45rem] italic leading-snug text-parchment sm:top-[16%] sm:text-[1.9rem]">
      <span aria-hidden className="mb-3 block font-display text-[0.65rem] not-italic tracking-[0.5em] text-gold">
        {["I", "II", "III", "IV", "V", "VI"][index]}
      </span>
      {text}
    </motion.p>
  );
}

function Scene({ p, interactive }: { p: MotionValue<number>; interactive: boolean }) {
  const farX = useTransform(p, [0, 1], ["0%", "-30%"]);
  const nearX = useTransform(p, [0, 1], ["0%", "-55%"]);
  const moonX = useTransform(p, [0, 1], ["-6vw", "10vw"]);
  const palaceScale = useTransform(p, [0.35, 0.85], [0.42, 0.82]);
  const palaceO = useTransform(p, [0.4, 0.62], [0, 1]);
  const pathLen = useTransform(p, [0.02, 0.8], [0.04, 1]);
  const hourglassR = useTransform(p, [0, 1], [0, 180]);
  const hourglassO = useTransform(p, [0, 0.2, 0.75, 0.95], [0.12, 0.26, 0.26, 0.1]);
  const gate1Scale = useTransform(p, [0.04, 0.42], [0.35, 2.4]);
  const gate1X = useTransform(p, [0.04, 0.42], ["-10%", "-120%"]);
  const gate1O = useTransform(p, [0.04, 0.12, 0.32, 0.42], [0, 1, 1, 0]);
  const gate2Scale = useTransform(p, [0.3, 0.7], [0.35, 2.4]);
  const gate2X = useTransform(p, [0.3, 0.7], ["10%", "120%"]);
  const gate2O = useTransform(p, [0.3, 0.38, 0.6, 0.7], [0, 1, 1, 0]);
  const ticketO = useTransform(p, [0.8, 0.9], [0, 1]);
  const ticketS = useTransform(p, [0.8, 0.95], [0.86, 1]);
  const ticketY = useTransform(p, [0.8, 0.95], [50, 0]);
  const ticketEvents = useTransform(p, (v) => (v > 0.82 ? "auto" : "none"));
  const captionsO = useTransform(p, [0.78, 0.84], [1, 0]);

  const n = journey.captions.length;
  const span = 0.78 / n;

  return (
    <div className="relative size-full overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#040c1f_0%,#07152f_40%,#0d2145_62%,#2a3a58_70%,#07152f_100%)]" />
      <Starfield count={120} seed={29} className="h-[70%]" />
      <motion.div className="absolute right-[12%] top-[9%]" style={{ x: moonX }}>
        <CrescentMoon className="size-24 sm:size-32" />
      </motion.div>
      <div className="absolute inset-x-0 top-[52%] h-[22%] bg-[radial-gradient(60%_100%_at_50%_100%,rgb(226_188_115/0.32),transparent_70%)]" />

      {/* enormous hourglass apparition — flips as time runs */}
      <motion.div className="absolute left-1/2 top-[8%] h-[38%] -translate-x-1/2 sm:top-[4%] sm:h-[56%]" style={{ rotate: hourglassR, opacity: hourglassO }}>
        <Hourglass progress={0.5} reversed className="h-full w-auto" />
      </motion.div>

      {/* distant palace on the horizon */}
      <motion.div className="absolute bottom-[27%] left-1/2 aspect-[1.6] w-[150vh] max-w-[220vw] -translate-x-1/2 origin-bottom" style={{ scale: palaceScale, opacity: palaceO }}>
        <PalaceMain tone="glow" ground={false} />
      </motion.div>

      <motion.div className="absolute bottom-0 left-0 h-[46%] w-[300%]" style={{ x: farX }}>
        <DuneBand d={FAR_DUNES} fill="#1a2c4c" highlight="#6b5a48" />
      </motion.div>

      {/* sand flowing upward — against the direction of time */}
      <SandField mode="rise" density={1.2} max={150} speed={0.8} />

      {/* ruined gates we pass through */}
      <motion.div className="absolute bottom-[18%] left-1/2 h-[34%] origin-bottom" style={{ scale: gate1Scale, x: gate1X, opacity: gate1O }}>
        <RuinedGate className="h-full w-auto -translate-x-1/2" />
      </motion.div>
      <motion.div className="absolute bottom-[18%] left-1/2 h-[30%] origin-bottom" style={{ scale: gate2Scale, x: gate2X, opacity: gate2O }}>
        <RuinedGate className="h-full w-auto -translate-x-1/2" />
      </motion.div>

      {/* the luminous path */}
      <svg aria-hidden viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[48%] w-full">
        <defs>
          <linearGradient id="journey-path" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#FFF1C9" />
            <stop offset="1" stopColor="#E2BC73" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <motion.path
          d="M200 300 C120 270 300 240 220 210 C160 188 250 170 200 150"
          fill="none"
          stroke="#E2BC73"
          strokeOpacity="0.22"
          strokeWidth="22"
          strokeLinecap="round"
          style={{ pathLength: pathLen }}
        />
        <motion.path
          d="M200 300 C120 270 300 240 220 210 C160 188 250 170 200 150"
          fill="none"
          stroke="url(#journey-path)"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ pathLength: pathLen }}
        />
      </svg>

      <motion.div className="absolute bottom-0 left-0 h-[24%] w-[300%]" style={{ x: nearX }}>
        <DuneBand d={NEAR_DUNES} fill="#2a2638" highlight="#D9BD91" />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_45%,transparent_45%,rgb(3_8_20/0.7)_100%)]" />

      {interactive && (
        <motion.div style={{ opacity: captionsO }} className="absolute inset-0">
          {journey.captions.map((text, i) => (
            <Caption key={i} p={p} index={i} text={text} range={[i * span + 0.01, (i + 1) * span + 0.02]} />
          ))}
        </motion.div>
      )}

      <motion.div className="absolute inset-0 flex items-center justify-center px-4" style={{ opacity: ticketO, scale: ticketS, y: ticketY, pointerEvents: ticketEvents }}>
        <RoyalTicket />
      </motion.div>
    </div>
  );
}

/** Section 4 — Through the Sands of Time. */
export function JourneySection() {
  const reduced = useReducedMotion();
  const track = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const still = useMotionValue(0.95);

  return (
    <section id="journey" aria-labelledby="journey-title" className="relative bg-midnight">
      <div className="relative px-5 pb-6 pt-24 sm:pt-32">
        <SectionHeading id="journey-title" eyebrow={journey.eyebrow} title={journey.title} />
      </div>

      {reduced ? (
        <div className="relative">
          <div className="relative h-[85svh] min-h-[560px]">
            <Scene p={still} interactive={false} />
          </div>
          <ol className="mx-auto max-w-xl space-y-4 px-6 py-12 text-center text-xl italic text-parchment">
            {journey.captions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </div>
      ) : (
        <div ref={track} className="relative h-[360vh]">
          <div className="sticky top-0 h-[100svh] min-h-[560px]">
            <Scene p={scrollYProgress} interactive />
          </div>
          {/* Captions for assistive tech, in reading order */}
          <ol className="sr-only">
            {journey.captions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
