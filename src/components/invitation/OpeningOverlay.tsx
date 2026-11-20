"use client";

import { animate, motion, useMotionValue, type MotionValue, type ValueAnimationTransition } from "motion/react";
import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { PalaceFar, PalaceMain } from "@/components/artwork/Palace";
import { Starfield } from "@/components/artwork/Starfield";
import { CrescentMoon } from "@/components/artwork/CrescentMoon";
import { EnvelopeBack, EnvelopeFlap, EnvelopePocket, EnvelopeSeal, type EnvelopeMotion } from "@/components/invitation/Envelope";
import { INK_TOTAL_MS, InvitationLetter, type LetterMotion } from "@/components/invitation/InvitationLetter";
import { particleDissolve } from "@/components/invitation/particleDissolve";
import { SandField } from "@/components/magical/SandField";
import { MusicToggle } from "@/components/sound/MusicPlayer";
import { primeMusic, startMusicIfIdle, useMusicStatus } from "@/components/sound/musicStore";
import { SoundToggle } from "@/components/sound/SoundToggle";
import { playSound } from "@/components/sound/soundStore";
import { RoyalButton } from "@/components/ui/RoyalButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { completeOpening } from "@/hooks/useOpeningSequence";
import { cx } from "@/lib/formatting";

/**
 * Section 1 — The Royal Invitation.
 *
 * Plays on its own:      1 palace emerges · 2 sand flows · 3 envelope materialises
 *                        4 seal glows and waits for the guest
 * On tap / click / Enter: 5 seal breaks (synth crack) · 6 flap opens on a 3D hinge
 *                        7 letter slides out · 8 parchment unfolds in layered 3D
 *                        9 Bismillah · 10 translation · 11 golden-ink text
 *                        12 ENTER THE KINGDOM
 *
 * Skip button, Escape, reduced-motion version, once per tab session.
 */

enum Phase {
  Dark = 0,
  Palace,
  Sand,
  Envelope,
  Await,
  Break,
  Flap,
  Slide,
  Unfold,
  Bismillah,
  Translation,
  Ink,
  Enter,
}

/** Automatic intro, ms after mount. */
const INTRO: [Phase, number][] = [
  [Phase.Palace, 120],
  [Phase.Sand, 600],
  [Phase.Envelope, 1100],
  [Phase.Await, 2200],
];

/** After the guest breaks the seal, ms after the click. */
const OPEN: [Phase, number][] = [
  [Phase.Break, 0],
  [Phase.Flap, 380],
  [Phase.Slide, 1250],
  [Phase.Unfold, 2250],
  [Phase.Bismillah, 3350],
  [Phase.Translation, 3850],
  [Phase.Ink, 4300],
  [Phase.Enter, 4300 + INK_TOTAL_MS + 250],
];

export const ARRIVE_EVENT = "royal:arrive";

type Anim = { stop: () => void };

export function OpeningOverlay() {
  const reduced = useReducedMotion();
  const musicStatus = useMusicStatus();
  // The music card only appears when the browser needs one tap on the player.
  const musicActive = musicStatus === "blocked" || musicStatus === "error";
  const [phase, setPhase] = useState<Phase>(reduced ? Phase.Await : Phase.Dark);
  const [leaving, setLeaving] = useState<null | "skip" | "enter">(null);
  const letterRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const enterRef = useRef<HTMLButtonElement | null>(null);
  const sealRef = useRef<HTMLButtonElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const enterWrapRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);
  const anims = useRef<Anim[]>([]);
  const glowLoop = useRef<Anim | null>(null);
  const opened = useRef(false);

  const env: EnvelopeMotion = {
    y: useMotionValue(0),
    opacity: useMotionValue(reduced ? 1 : 0),
    scale: useMotionValue(reduced ? 1 : 0.86),
    flap: useMotionValue(0),
    glow: useMotionValue(reduced ? 0.8 : 0),
    split: useMotionValue(0),
  };
  const letter: LetterMotion = {
    y: useMotionValue(0),
    scale: useMotionValue(0.96),
    top: useMotionValue(-176),
    bottom: useMotionValue(176),
  };
  const palaceO = useMotionValue(reduced ? 0.9 : 0);
  const letterO = useMotionValue(0);

  const at = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  const go = useCallback((mv: MotionValue<number>, to: number | number[], opts?: ValueAnimationTransition<number>) => {
    anims.current.push(animate(mv, to as number, opts));
  }, []);

  // Stop everything on unmount.
  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      anims.current.forEach((a) => a.stop());
      glowLoop.current?.stop();
      timers.current = [];
      anims.current = [];
    },
    [],
  );

  // ── Automatic intro: palace, sand, envelope, glowing seal — then wait ──
  useEffect(() => {
    if (reduced) return;
    const local: number[] = [];
    const later = (ms: number, fn: () => void) => local.push(window.setTimeout(fn, ms));
    for (const [p, ms] of INTRO) later(ms, () => setPhase((cur) => (cur < p ? p : cur)));
    later(120, () => go(palaceO, 0.9, { duration: 2.2, ease: "easeOut" }));
    later(600, () => playSound("whoosh"));
    later(1100, () => {
      go(env.opacity, 1, { duration: 1, ease: "easeOut" });
      go(env.scale, 1, { duration: 1.3, ease: [0.22, 1, 0.36, 1] });
      go(letterO, 1, { duration: 1, ease: "easeOut" });
    });
    later(2200, () => {
      if (opened.current) return;
      // The seal breathes with light until the guest touches it.
      glowLoop.current = animate(env.glow, [0.35, 1, 0.35], { duration: 2.4, repeat: Infinity, ease: "easeInOut" });
      playSound("chime");
    });
    return () => local.forEach((t) => window.clearTimeout(t));
    // Motion values are stable for the component's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // ── Break the seal (guest action) ─────────────────────────────────────
  const openEnvelope = useCallback(() => {
    if (phase >= Phase.Break || leaving) return;
    opened.current = true;
    // Breaking the seal is the guest's "begin": start the music inside this tap.
    startMusicIfIdle();
    glowLoop.current?.stop();
    glowLoop.current = null;

    if (reduced) {
      // No motion: show the opened invitation straight away.
      env.opacity.set(0);
      letter.top.set(0);
      letter.bottom.set(0);
      letter.scale.set(1);
      letterO.set(1);
      setPhase(Phase.Enter);
      return;
    }

    // Make sure the intro has fully landed if the guest taps early.
    palaceO.set(Math.max(palaceO.get(), 0.9));
    env.opacity.set(1);
    env.scale.set(1);
    letterO.set(1);

    const ease = [0.22, 1, 0.36, 1] as const;
    for (const [p, ms] of OPEN) at(ms, () => setPhase(p));

    playSound("seal");
    go(env.glow, [env.glow.get(), 1, 0], { duration: 0.7, ease: "easeOut" });
    go(env.split, 1, { duration: 0.75, ease: [0.3, 0.7, 0.4, 1] });
    at(380, () => go(env.flap, 180, { duration: 0.9, ease: [0.55, 0.05, 0.25, 1] }));
    at(1250, () => {
      playSound("paper");
      // Slide fully clear of the pocket before the letter comes to the front.
      go(letter.y, -40, { duration: 0.95, ease });
    });
    at(2250, () => {
      go(env.y, window.innerHeight * 0.75, { duration: 1.15, ease: [0.55, 0, 0.75, 0.2] });
      go(env.opacity, 0, { duration: 0.8, delay: 0.2 });
      go(letter.y, 0, { duration: 1.1, ease });
      go(letter.scale, 1, { duration: 1.1, ease });
      go(letter.top, 0, { duration: 0.85, delay: 0.25, ease: [0.4, 0, 0.2, 1] });
      go(letter.bottom, 0, { duration: 0.85, delay: 0.65, ease: [0.4, 0, 0.2, 1] });
    });
    at(2500, () => playSound("paper"));
    at(OPEN[OPEN.length - 1][1], () => playSound("chime"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, leaving, reduced, at, go]);

  // Focus: dialog first, the seal once it can be opened, then ENTER.
  // Meanwhile, get the music player ready so the seal tap can start it instantly.
  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
    primeMusic();
  }, []);
  useEffect(() => {
    const active = document.activeElement;
    const idle = !active || active === document.body || active === rootRef.current;
    if (phase === Phase.Await && idle) sealRef.current?.focus({ preventScroll: true });
    if (phase === Phase.Enter && !leaving) {
      if (idle || active === sealRef.current) enterRef.current?.focus({ preventScroll: true });
      // With the music card showing on a phone, centre the button so the card never covers it.
      enterWrapRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: musicActive ? "center" : "nearest" });
    }
  }, [phase, leaving, reduced, musicActive]);

  const finish = useCallback(() => {
    completeOpening();
    window.setTimeout(() => {
      const h1 = document.querySelector<HTMLElement>("#home h1");
      if (h1) {
        h1.setAttribute("tabindex", "-1");
        h1.focus({ preventScroll: true });
      }
    }, 30);
  }, []);

  const skip = useCallback(() => {
    if (leaving) return;
    setLeaving("skip");
    window.dispatchEvent(new CustomEvent(ARRIVE_EVENT));
    window.setTimeout(finish, reduced ? 10 : 380);
  }, [finish, leaving, reduced]);

  const enter = useCallback(() => {
    if (leaving) return;
    setLeaving("enter");
    playSound("whoosh");
    window.dispatchEvent(new CustomEvent(ARRIVE_EVENT));
    if (reduced || !letterRef.current || !canvasRef.current) {
      window.setTimeout(finish, reduced ? 200 : 10);
      return;
    }
    particleDissolve(canvasRef.current, letterRef.current.getBoundingClientRect());
    window.setTimeout(finish, 1250);
  }, [finish, leaving, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        skip();
      }
      // Minimal focus trap.
      if (e.key === "Tab" && rootRef.current) {
        const focusables = Array.from(rootRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]")).filter((el) => el.offsetParent !== null);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === rootRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  const reached = (p: Phase) => phase >= p;
  const dissolving = leaving === "enter";
  const canOpen = reached(Phase.Envelope) && phase < Phase.Break && !leaving;
  const showEnvelope = reached(Phase.Envelope) && phase < Phase.Bismillah;
  // The letter comes in front of the pocket only once it has slid fully clear.
  const letterInFront = reached(Phase.Unfold);

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="opening-title"
      aria-describedby="opening-desc"
      tabIndex={-1}
      className="fixed inset-0 z-[100] outline-none"
    >
      <h2 id="opening-title" className="sr-only">
        The royal invitation of {wedding.couple.groom.firstName} and {wedding.couple.bride.firstName}
      </h2>
      <p id="opening-desc" className="sr-only">
        A sealed royal envelope. Activate the seal to open the invitation. Press Escape or use the Skip button at any time to enter the site.
      </p>

      {/* backdrop — static art, only opacity animates (no filters, no scaling) */}
      <motion.div
        aria-hidden
        className="absolute inset-0 overflow-hidden bg-midnight"
        initial={false}
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ duration: dissolving ? 1.2 : 0.35, delay: dissolving ? 0.15 : 0, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,#173b69_0%,#0d2145_38%,#07152f_75%)]" />
        <Starfield count={110} seed={3} className="opacity-80" />
        <CrescentMoon className="absolute right-[8%] top-[7%] size-28 opacity-90 sm:size-40" />
        <motion.div className="absolute inset-0 will-change-[opacity]" style={{ opacity: palaceO }}>
          <PalaceFar className="opacity-60" />
          <PalaceMain className="opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgb(7_21_47/0.35),rgb(7_21_47/0.88))]" />
        </motion.div>
        {reached(Phase.Sand) && <SandField mode="swirl" origin={[0.5, 0.5]} density={2.2} max={220} speed={1.2} />}
      </motion.div>

      {/* stage */}
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden overscroll-contain">
        <div
          className={cx(
            "flex min-h-full flex-col items-center justify-center px-3 pt-16 [--env-h:calc(var(--env-w)*0.72)] [--env-w:min(92vw,440px)] sm:px-4 sm:pt-20 sm:[--env-h:calc(var(--env-w)*0.66)]",
            // On phones the music card sits bottom-left; leave room to scroll the letter above it.
            musicActive ? "pb-[268px] sm:pb-20" : "pb-10 sm:pb-20",
          )}
        >
          <motion.div
            className="relative flex items-center justify-center"
            initial={false}
            animate={dissolving ? { opacity: 0, scale: 1.04, filter: "blur(8px)" } : leaving === "skip" ? { opacity: 0 } : { opacity: 1, scale: 1 }}
            transition={{ duration: dissolving ? 0.55 : 0.3, ease: "easeOut" }}
          >
            {showEnvelope && (
              <>
                <EnvelopeBack m={env} />
                <EnvelopePocket m={env} />
                <EnvelopeFlap m={env} behind={reached(Phase.Slide)} />
                <EnvelopeSeal m={env} monogram={wedding.couple.monogram} />
              </>
            )}

            {/* The whole envelope is the "break the seal" control */}
            {reached(Phase.Envelope) && phase < Phase.Break && (
              <div className="absolute left-1/2 top-1/2 z-[8] h-[var(--env-h)] w-[var(--env-w)] -translate-x-1/2 -translate-y-1/2">
                <button
                  ref={sealRef}
                  type="button"
                  onClick={openEnvelope}
                  disabled={!canOpen}
                  aria-label={wedding.copy.opening.openLabel}
                  className="group absolute inset-0 cursor-pointer rounded-md outline-offset-8"
                >
                  <span aria-hidden className="absolute left-1/2 top-[62%] aspect-square w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-gold-bright/0 transition duration-500 group-hover:scale-110 group-hover:ring-gold-bright/60" />
                </button>
                <motion.p
                  aria-hidden
                  className="text-shade pointer-events-none absolute inset-x-0 top-full mt-7 text-center font-display text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-gold-pale sm:text-xs"
                  initial={{ opacity: 0 }}
                  animate={reached(Phase.Await) ? { opacity: reduced ? 1 : [0.45, 1, 0.45] } : { opacity: 0 }}
                  transition={reached(Phase.Await) && !reduced ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
                >
                  {wedding.copy.opening.openHint}
                </motion.p>
              </div>
            )}

            <motion.div style={{ opacity: letterO, zIndex: letterInFront ? 6 : 2 }} className="relative">
              {/* soft paper shadow that grows as the letter unfolds */}
              <div
                aria-hidden
                className={cx(
                  "absolute inset-x-[4%] top-1/2 -translate-y-1/2 rounded-[50%] bg-black/60 blur-2xl transition-[height,opacity] duration-1000",
                  reached(Phase.Unfold) ? "h-[96%] opacity-70" : "h-[30%] opacity-0",
                )}
              />
              <InvitationLetter
                ref={letterRef}
                m={letter}
                flat={reached(Phase.Bismillah)}
                showBismillah={reached(Phase.Bismillah)}
                showTranslation={reached(Phase.Translation)}
                showInk={reached(Phase.Ink)}
                showSeal={reached(Phase.Enter)}
                onEnter={reached(Phase.Enter) && !leaving ? enter : undefined}
              />
            </motion.div>
          </motion.div>
          <motion.div
            ref={enterWrapRef}
            className="relative z-[7] mt-6"
            initial={false}
            animate={reached(Phase.Enter) && !leaving ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <RoyalButton
              ref={enterRef}
              variant="gold"
              icon={<Sparkles />}
              onClick={enter}
              disabled={!reached(Phase.Enter) || Boolean(leaving)}
              tabIndex={reached(Phase.Enter) ? 0 : -1}
              aria-hidden={!reached(Phase.Enter)}
              className="shadow-2xl"
            >
              {wedding.copy.opening.enter}
            </RoyalButton>
          </motion.div>
        </div>
      </div>

      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[2] size-full" />

      {/* controls */}
      <div className="fixed right-4 top-4 z-[3] flex items-center gap-2 sm:right-6 sm:top-5">
        <MusicToggle />
        <SoundToggle />
        <button
          type="button"
          onClick={skip}
          className="h-10 rounded-full border border-gold/45 bg-midnight/50 px-5 font-display text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-gold-bright backdrop-blur-sm transition hover:border-gold-bright hover:bg-midnight/80"
        >
          {wedding.copy.opening.skip}
          <span className="sr-only"> the opening animation</span>
        </button>
      </div>
    </div>
  );
}
