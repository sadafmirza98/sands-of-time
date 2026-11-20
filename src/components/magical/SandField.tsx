"use client";

import { useEffect, useRef } from "react";
import { sandDirection } from "@/components/magical/sandTime";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cx } from "@/lib/formatting";

/**
 * Golden sand particles on a single 2D canvas.
 *
 * Modes:
 *  - drift:  wind-blown motes travelling sideways with a gentle wobble
 *  - swirl:  an elegant elliptical spiral around an origin
 *  - rise:   sand flowing upward — against the direction of time
 *
 * Performance: DPR capped at 1.5, particle count scaled by area, loop paused
 * while off-screen or in a hidden tab, one static frame for reduced motion.
 * All particles respond to the shared `sandDirection()` (Secret 4).
 */

type Mode = "drift" | "swirl" | "rise";

interface Props {
  mode?: Mode;
  /** Particles per 10 000 css px² (before caps). */
  density?: number;
  max?: number;
  /** Swirl origin as fractions of width/height. */
  origin?: [number, number];
  speed?: number;
  className?: string;
}

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  /** swirl: angle + radius */
  a: number;
  r: number;
  w: number;
}

const COLORS = ["255,236,190", "226,188,115", "217,189,145", "196,154,74"];

function makeSprite(rgb: string): HTMLCanvasElement {
  const s = document.createElement("canvas");
  s.width = s.height = 32;
  const g = s.getContext("2d")!;
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.25, `rgba(${rgb},0.65)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  return s;
}

export function SandField({ mode = "drift", density = 1.4, max = 180, origin = [0.5, 0.5], speed = 1, className }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();
  const [ox, oy] = origin;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sprites = COLORS.map(makeSprite);
    let w = 0;
    let h = 0;
    let particles: P[] = [];
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let seed = 987654321;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    const spawn = (initial: boolean): P => {
      const size = 0.6 + rand() * rand() * 2.6;
      const base: P = { x: rand() * w, y: rand() * h, vx: 0, vy: 0, size, alpha: 0.25 + rand() * 0.75, phase: rand() * Math.PI * 2, a: rand() * Math.PI * 2, r: 0, w: 0 };
      if (mode === "drift") {
        base.vx = (8 + rand() * 22) * speed;
        base.vy = (-3 + rand() * 6) * speed;
        if (!initial) base.x = -10;
      } else if (mode === "rise") {
        base.vx = (-4 + rand() * 8) * speed;
        base.vy = -(10 + rand() * 30) * speed;
        if (!initial) base.y = h + 10;
      } else {
        const maxR = Math.hypot(w, h) * 0.55;
        base.r = (initial ? 0.08 + rand() * 0.92 : 0.85 + rand() * 0.15) * maxR;
        base.w = (0.08 + rand() * 0.22) * speed * (rand() < 0.12 ? -1 : 1);
      }
      return base;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = w < 640;
      const count = Math.min(mobile ? Math.round(max * 0.55) : max, Math.max(24, Math.round(((w * h) / 10_000) * density * (mobile ? 0.7 : 1))));
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const cx0 = w * ox;
      const cy0 = h * oy;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const tw = 0.55 + 0.45 * Math.sin(t * 0.002 + p.phase);
        let x = p.x;
        let y = p.y;
        if (mode === "swirl") {
          x = cx0 + Math.cos(p.a) * p.r;
          y = cy0 + Math.sin(p.a) * p.r * 0.38 - (p.r * 0.12);
        }
        const s = p.size * 4;
        ctx.globalAlpha = p.alpha * tw;
        ctx.drawImage(sprites[i % sprites.length], x - s / 2, y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const dir = sandDirection(now);
      const maxR = Math.hypot(w, h) * 0.55;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (mode === "swirl") {
          p.a += p.w * dt * dir * (1.6 - p.r / maxR);
          p.r -= 6 * dt * dir * speed;
          if (p.r < 12 || p.r > maxR * 1.05) particles[i] = spawn(false);
          continue;
        }
        p.x += (p.vx + Math.sin(now * 0.0011 + p.phase) * 6) * dt * dir;
        p.y += (p.vy + Math.cos(now * 0.0009 + p.phase) * 4) * dt * dir;
        if (p.x > w + 12) p.x = -10;
        else if (p.x < -12) p.x = w + 10;
        if (p.y < -12) p.y = h + 10;
        else if (p.y > h + 12) p.y = -10;
      }
      draw(now);
      if (visible && !document.hidden && !covered()) raf = requestAnimationFrame(step);
    };

    // Canvases behind the opening overlay pause while it covers the page.
    const inOverlay = Boolean(canvas.closest('[role="dialog"]'));
    const covered = () => !inOverlay && document.documentElement.hasAttribute("data-opening-covered");

    const start = () => {
      cancelAnimationFrame(raf);
      if (covered()) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };

    resize();
    if (reduced) {
      draw(0);
    } else {
      start();
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduced) start();
      else cancelAnimationFrame(raf);
    });
    io.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden && visible && !reduced) start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    const mo = new MutationObserver(() => {
      if (!reduced && visible) start();
    });
    if (!inOverlay) mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-opening-covered"] });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      mo.disconnect();
    };
  }, [mode, density, max, ox, oy, speed, reduced]);

  return <canvas ref={ref} aria-hidden className={cx("pointer-events-none absolute inset-0 size-full", className)} />;
}
