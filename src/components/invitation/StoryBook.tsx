"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { starPoints } from "@/components/artwork/geometry";
import { CornerOrnament, Flourish } from "@/components/artwork/Ornaments";
import { playSound } from "@/components/sound/soundStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cx } from "@/lib/formatting";
import type { StoryChapter } from "@/types/wedding";

/**
 * An illuminated manuscript with page-turn animation, chapter tabs, arrows,
 * swipe, ← → / Home / End keys. Used only when chapters are configured.
 */
export function StoryBook({ chapters }: { chapters: StoryChapter[] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const reduced = useReducedMotion();
  const start = useRef<number | null>(null);
  const last = chapters.length - 1;
  const chapter = chapters[index];

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(last, next));
    if (clamped === index) return;
    setDir(clamped > index ? 1 : -1);
    setIndex(clamped);
    playSound("paper");
  };

  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: last };
    if (e.key in map) {
      e.preventDefault();
      go(map[e.key]);
    }
  };
  const onDown = (e: PointerEvent) => (start.current = e.clientX);
  const onUp = (e: PointerEvent) => {
    if (start.current === null) return;
    const dx = e.clientX - start.current;
    start.current = null;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div className="relative mx-auto mt-12 max-w-5xl sm:mt-16" onKeyDown={onKey}>
      <div role="tablist" aria-label="Chapters" className="mb-6 flex flex-wrap justify-center gap-2">
        {chapters.map((c, i) => (
          <button
            key={c.numeral + c.title}
            role="tab"
            id={`chapter-tab-${i}`}
            aria-selected={i === index}
            aria-controls="chapter-panel"
            tabIndex={i === index ? 0 : -1}
            onClick={() => go(i)}
            className={cx(
              "min-h-11 rounded-full border px-4 font-display text-xs uppercase tracking-[0.25em] transition",
              i === index ? "border-gold-bright bg-gold/15 text-gold-pale" : "border-gold/30 text-sand hover:border-gold",
            )}
          >
            {c.numeral}
          </button>
        ))}
      </div>

      <div className="relative rounded-[10px] p-3 [background:linear-gradient(180deg,#4a2f12,#2c1b08)] shadow-[0_50px_100px_-30px_rgb(0_0_0/0.9)] sm:p-5">
        {/* ornamental spine */}
        <div aria-hidden className="absolute inset-y-3 left-1/2 hidden w-4 -translate-x-1/2 bg-[linear-gradient(90deg,#2c1b08,#8a6526,#2c1b08)] md:block">
          {[0.2, 0.5, 0.8].map((t) => (
            <svg key={t} viewBox="0 0 20 20" className="absolute left-1/2 size-4 -translate-x-1/2" style={{ top: `${t * 100}%` }}>
              <polygon points={starPoints(10, 10, 9, 4)} fill="#E2BC73" />
            </svg>
          ))}
        </div>
        <div
          id="chapter-panel"
          role="tabpanel"
          aria-labelledby={`chapter-tab-${index}`}
          tabIndex={0}
          onPointerDown={onDown}
          onPointerUp={onUp}
          className="relative touch-pan-y [perspective:2000px]"
        >
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              initial={reduced ? { opacity: 0 } : { rotateY: dir * 80, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { rotateY: dir * -80, opacity: 0 }}
              transition={{ duration: reduced ? 0.2 : 0.7, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformOrigin: dir > 0 ? "left center" : "right center" }}
              className="grid gap-3 md:grid-cols-2"
            >
              <div className="parchment on-parchment relative min-h-72 overflow-hidden rounded-[4px] p-6 sm:p-8">
                <CornerOrnament corner="tl" className="absolute left-1 top-1 size-12" />
                <CornerOrnament corner="br" className="absolute bottom-1 right-1 size-12" />
                {chapter.image ? (
                  <div className="relative aspect-[4/5] overflow-hidden rounded-t-[50%_30%] border-2 border-bronze/50">
                    <Image src={chapter.image.src} alt={chapter.image.alt} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover sepia-[0.2]" />
                  </div>
                ) : (
                  <svg aria-hidden viewBox="0 0 200 200" className="mx-auto size-48 text-bronze">
                    <polygon points={starPoints(100, 100, 90, 70, 8)} fill="none" stroke="currentColor" />
                    <polygon points={starPoints(100, 100, 60, 28, 8)} fill="currentColor" opacity="0.4" />
                  </svg>
                )}
              </div>
              <div className="parchment on-parchment relative rounded-[4px] p-6 sm:p-10">
                <p className="font-display text-xs font-bold uppercase tracking-[0.4em] text-turquoise-deep">Chapter {chapter.numeral}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-navy sm:text-3xl">{chapter.title}</h3>
                {chapter.date && <p className="mt-1 italic text-bronze">{chapter.date}</p>}
                <Flourish className="mt-4 h-5 w-48 text-bronze" />
                <div className="mt-4 space-y-3 text-lg leading-relaxed text-ink">
                  {chapter.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                {chapter.link && (
                  <a href={chapter.link.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.2em] text-navy underline underline-offset-4">
                    {chapter.link.label} <ExternalLink aria-hidden className="size-4" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous chapter" className="inline-flex size-12 items-center justify-center rounded-full border border-gold/50 text-gold-bright disabled:opacity-35">
          <ChevronLeft aria-hidden />
        </button>
        <p className="font-display text-xs uppercase tracking-[0.3em] text-sand" aria-live="polite">
          {index + 1} / {chapters.length}
        </p>
        <button type="button" onClick={() => go(index + 1)} disabled={index === last} aria-label="Next chapter" className="inline-flex size-12 items-center justify-center rounded-full border border-gold/50 text-gold-bright disabled:opacity-35">
          <ChevronRight aria-hidden />
        </button>
      </div>
    </div>
  );
}
