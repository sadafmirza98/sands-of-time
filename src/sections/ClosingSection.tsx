"use client";

import { ArrowUp, MailOpen } from "lucide-react";
import { wedding } from "@/config/wedding";
import { CrescentMoon } from "@/components/artwork/CrescentMoon";
import { Hourglass } from "@/components/artwork/Hourglass";
import { Lantern } from "@/components/artwork/Lantern";
import { Flourish } from "@/components/artwork/Ornaments";
import { Dunes, PalaceFar, PalaceMain } from "@/components/artwork/Palace";
import { Starfield } from "@/components/artwork/Starfield";
import { SandField } from "@/components/magical/SandField";
import { Reveal } from "@/components/ui/Reveal";
import { RoyalButton } from "@/components/ui/RoyalButton";
import { replayOpening } from "@/hooks/useOpeningSequence";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const { closing } = wedding;

/** Section 10 — The Kingdom Remembers. */
export function ClosingSection() {
  const reduced = useReducedMotion();
  return (
    <section id="farewell" aria-labelledby="farewell-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-midnight">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#07152f_0%,#040c1f_25%,#0d2145_65%,#173b69_85%,#2b3f5e_100%)]" />
        <Starfield count={170} seed={77} />
        <CrescentMoon className="absolute right-[24%] top-[12%] hidden size-32 sm:block lg:size-40" />
        <PalaceFar className="opacity-80" />
        <PalaceMain tone="glow" className="opacity-95" />
        <SandField mode="drift" density={1.1} max={120} speed={0.5} />
        <Dunes />
        <Lantern className="absolute left-[8%] top-0 h-44 sm:left-[14%] sm:h-60" chain={120} />
        <Lantern className="absolute right-[8%] top-0 h-40 sm:right-[14%] sm:h-56" chain={100} delay={1.1} />
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_42%,rgb(3_8_20/0.72),rgb(3_8_20/0.25)_70%,transparent)]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-10 pt-28 text-center">
        <Reveal className="flex flex-col items-center">
          <Hourglass progress={0.08} className="h-16 w-auto opacity-90" />
          <h2 id="farewell-title" className="text-shade mt-5 font-display text-xs font-semibold uppercase tracking-[0.45em] text-sand">
            {closing.eyebrow}
          </h2>
          <Flourish className="mt-5 h-6 w-60 text-gold" />
          <blockquote className="text-shade mt-6 max-w-2xl text-[clamp(1.45rem,4.6vw,2.2rem)] italic leading-snug text-ivory">
            <p>“{closing.message}”</p>
          </blockquote>
          {closing.blessing && <p className="mt-4 text-lg italic text-sand">{closing.blessing}</p>}
          <p className="text-shade mt-8 text-xl italic text-parchment">{closing.signOff}</p>
          <p className="gold-foil shimmer mt-1 font-display text-[clamp(1.6rem,6vw,2.6rem)] font-semibold uppercase tracking-[0.22em]">{closing.signature}</p>
        </Reveal>
        <Reveal delay={0.2} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <RoyalButton icon={<ArrowUp />} onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })}>
            {wedding.copy.closing.back}
          </RoyalButton>
          <RoyalButton variant="gold" icon={<MailOpen />} onClick={replayOpening}>
            {wedding.copy.closing.replay}
          </RoyalButton>
        </Reveal>
      </div>
    </section>
  );
}
