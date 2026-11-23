"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { starPoints } from "@/components/artwork/geometry";
import { CornerOrnament, Flourish } from "@/components/artwork/Ornaments";
import { playSound } from "@/components/sound/soundStore";
import { useMediaQuery, useReducedMotion } from "@/hooks/useReducedMotion";
import { cx } from "@/lib/formatting";
import type { StoryChapter } from "@/types/wedding";

/**
 * An illuminated manuscript whose pages really turn. On wide screens a leaf
 * lifts from the spine and flips over in 3D — its front is the page you were
 * reading, its back the next chapter's picture page — revealing the next text
 * beneath. On phones the whole page flips away. Tabs, arrows, tapping a page,
 * swipe and ← → / Home / End all turn pages; reduced motion simply switches.
 */

const TURN_MS = 900;
const EASE = [0.45, 0.05, 0.25, 1] as const;

/** The picture page (left on wide screens; top on phones). */
function PicturePage({ chapter, className }: { chapter: StoryChapter; className?: string }) {
  return (
    <div className={cx("parchment on-parchment relative h-full min-h-72 overflow-hidden rounded-[4px] p-6 sm:p-8", className)}>
      <CornerOrnament corner="tl" className="absolute left-1 top-1 size-12" />
      <CornerOrnament corner="br" className="absolute bottom-1 right-1 size-12" />
      {chapter.image ? (
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[50%_30%] border-2 border-bronze/50">
          <Image src={chapter.image.src} alt={chapter.image.alt} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover sepia-[0.2]" />
        </div>
      ) : (
        <div className="flex h-full min-h-60 flex-col items-center justify-center">
          <svg aria-hidden viewBox="0 0 200 200" className="size-44 text-bronze sm:size-48">
            <polygon points={starPoints(100, 100, 90, 70, 8)} fill="none" stroke="currentColor" />
            <polygon points={starPoints(100, 100, 60, 28, 8)} fill="currentColor" opacity="0.4" />
          </svg>
          <p aria-hidden className="mt-3 font-display text-4xl text-bronze/70">
            {chapter.numeral}
          </p>
        </div>
      )}
    </div>
  );
}

/** The text page (right on wide screens; bottom on phones). */
function TextPage({ chapter, className, curl = false }: { chapter: StoryChapter; className?: string; curl?: boolean }) {
  return (
    <div className={cx("parchment on-parchment relative h-full overflow-hidden rounded-[4px] p-6 sm:p-10", className)}>
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
        <a href={chapter.link.href} target="_blank" rel="noopener noreferrer" className="relative z-10 mt-5 inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.2em] text-navy underline underline-offset-4">
          {chapter.link.label} <ExternalLink aria-hidden className="size-4" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
      {/* a dog-eared corner: this page can be turned */}
      {curl && (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 size-9 bg-[linear-gradient(135deg,transparent_50%,#d9c08f_50%,#b8975e_100%)] shadow-[-3px_-3px_6px_-2px_rgb(0_0_0/0.35)] transition-[width,height] duration-300 group-hover:size-12"
        />
      )}
    </div>
  );
}

/** The whole chapter as one stacked page (phones). */
function FullPage({ chapter, curl = false }: { chapter: StoryChapter; curl?: boolean }) {
  return (
    <div className="grid h-full gap-3">
      <PicturePage chapter={chapter} />
      <TextPage chapter={chapter} curl={curl} />
    </div>
  );
}

/** A soft shadow sweeping across a turning leaf. */
function LeafShade({ dir }: { dir: 1 | -1 }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[4px]"
      style={{ background: `linear-gradient(${dir > 0 ? 90 : 270}deg, rgb(0 0 0 / 0.28), transparent 60%)` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.9, 0] }}
      transition={{ duration: TURN_MS / 1000, ease: "easeInOut" }}
    />
  );
}

interface Turn {
  from: number;
  to: number;
  dir: 1 | -1;
}

export function StoryBook({ chapters }: { chapters: StoryChapter[] }) {
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 768px)");
  const start = useRef<number | null>(null);
  const swiped = useRef(false);
  const last = chapters.length - 1;

  const go = (next: number) => {
    if (turn) return;
    const to = Math.max(0, Math.min(last, next));
    if (to === index) return;
    playSound("paper");
    if (reduced) {
      setIndex(to);
      return;
    }
    setTurn({ from: index, to, dir: to > index ? 1 : -1 });
  };
  const finishTurn = () => {
    if (!turn) return;
    setIndex(turn.to);
    setTurn(null);
  };

  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: last };
    if (e.key in map) {
      e.preventDefault();
      go(map[e.key]);
    }
  };
  const onDown = (e: PointerEvent) => {
    start.current = e.clientX;
    swiped.current = false;
  };
  const onUp = (e: PointerEvent) => {
    if (start.current === null) return;
    const dx = e.clientX - start.current;
    start.current = null;
    if (Math.abs(dx) > 50) {
      swiped.current = true;
      go(index + (dx < 0 ? 1 : -1));
    }
  };
  /** Tapping a page turns it (but not right after a swipe). */
  const tapTurn = (delta: number) => () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    go(index + delta);
  };

  const shown = chapters[turn ? turn.to : index];
  const from = turn ? chapters[turn.from] : null;
  const leafSpin = { duration: TURN_MS / 1000, ease: EASE };

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
            <span>{c.numeral}</span>
            <span className="ml-2 hidden sm:inline">{c.title}</span>
          </button>
        ))}
      </div>

      <div className="relative rounded-[10px] p-3 [background:linear-gradient(180deg,#4a2f12,#2c1b08)] shadow-[0_50px_100px_-30px_rgb(0_0_0/0.9)] sm:p-5">
        {/* ornamental spine */}
        <div aria-hidden className="absolute inset-y-3 left-1/2 z-20 hidden w-4 -translate-x-1/2 bg-[linear-gradient(90deg,#2c1b08,#8a6526,#2c1b08)] md:block">
          {[0.2, 0.5, 0.8].map((t) => (
            <svg key={t} viewBox="0 0 20 20" className="absolute left-1/2 size-4 -translate-x-1/2" style={{ top: `${t * 100}%` }}>
              <polygon points={starPoints(10, 10, 9, 4)} fill="#E2BC73" />
            </svg>
          ))}
        </div>

        <div
          id="chapter-panel"
          role="tabpanel"
          aria-labelledby={`chapter-tab-${turn ? turn.to : index}`}
          aria-live="polite"
          tabIndex={0}
          onPointerDown={onDown}
          onPointerUp={onUp}
          className="relative touch-pan-y [perspective:2200px]"
        >
          {wide ? (
            /* ── Two-page spread with a leaf turning over the spine ── */
            <div className="relative grid gap-3 md:grid-cols-2">
              {/* left page: the old one stays until the leaf lands on it */}
              <div role="presentation" onClick={tapTurn(-1)} className={cx("h-full", index > 0 && "cursor-pointer")}>
                <PicturePage chapter={turn && turn.dir > 0 && from ? from : shown} />
              </div>
              {/* right page: the new text is revealed as the leaf lifts */}
              <div role="presentation" onClick={tapTurn(1)} className={cx("group h-full", index < last && "cursor-pointer")}>
                <TextPage chapter={turn && turn.dir < 0 && from ? from : shown} curl={!turn && index < last} />
              </div>

              {turn && from && (
                <motion.div
                  key={`${turn.from}-${turn.to}`}
                  aria-hidden
                  className={cx("pointer-events-none absolute inset-y-0 z-10 w-[calc(50%-0.375rem)]", turn.dir > 0 ? "right-0" : "left-0")}
                  style={{ transformStyle: "preserve-3d", transformPerspective: 1800, transformOrigin: turn.dir > 0 ? "-0.375rem 50%" : "calc(100% + 0.375rem) 50%" }}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: turn.dir > 0 ? -180 : 180 }}
                  transition={leafSpin}
                  onAnimationComplete={finishTurn}
                >
                  {/* front: the page being turned */}
                  <div className="absolute inset-0 [backface-visibility:hidden]">
                    {turn.dir > 0 ? <TextPage chapter={from} /> : <PicturePage chapter={from} />}
                    <LeafShade dir={turn.dir} />
                  </div>
                  {/* back: the page it becomes on the other side */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    {turn.dir > 0 ? <PicturePage chapter={shown} /> : <TextPage chapter={shown} />}
                    <LeafShade dir={turn.dir === 1 ? -1 : 1} />
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            /* ── Phones: the whole page flips away ── */
            <div className="relative">
              <div role="presentation" onClick={tapTurn(1)} className={cx("group", index < last && "cursor-pointer")}>
                <FullPage chapter={turn && turn.dir < 0 && from ? from : shown} curl={!turn && index < last} />
              </div>
              {turn && from && (
                <motion.div
                  key={`${turn.from}-${turn.to}`}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
                  style={{ transformOrigin: "0% 50%", transformPerspective: 1400 }}
                  // The page stays solid while it swings; it only fades once nearly edge-on.
                  initial={turn.dir > 0 ? { rotateY: 0, opacity: 1 } : { rotateY: -100, opacity: 0 }}
                  animate={turn.dir > 0 ? { rotateY: -100, opacity: [1, 1, 0] } : { rotateY: 0, opacity: [0, 1, 1] }}
                  transition={{ ...leafSpin, opacity: { duration: TURN_MS / 1000, times: turn.dir > 0 ? [0, 0.7, 1] : [0, 0.3, 1] } }}
                  onAnimationComplete={finishTurn}
                >
                  <FullPage chapter={turn.dir > 0 ? from : shown} />
                  <LeafShade dir={1} />
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous chapter" className="inline-flex size-12 items-center justify-center rounded-full border border-gold/50 text-gold-bright disabled:opacity-35">
          <ChevronLeft aria-hidden />
        </button>
        <p className="font-display text-xs uppercase tracking-[0.3em] text-sand">
          {index + 1} / {chapters.length}
        </p>
        <button type="button" onClick={() => go(index + 1)} disabled={index === last} aria-label="Next chapter" className="inline-flex size-12 items-center justify-center rounded-full border border-gold/50 text-gold-bright disabled:opacity-35">
          <ChevronRight aria-hidden />
        </button>
      </div>
      {chapters.length > 1 && <p className="mt-3 text-center font-display text-[0.65rem] uppercase tracking-[0.3em] text-sand/70">Tap a page or swipe to turn it</p>}
    </div>
  );
}
