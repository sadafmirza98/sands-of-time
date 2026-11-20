"use client";

import { useEffect, useRef } from "react";
import { starPoints } from "@/components/artwork/geometry";
import { useFinePointer, useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Sands-of-Time cursor: a small golden eight-point star that eases after the
 * pointer and sheds a short trail of sparkling star-grains. Desktop (fine pointer) only; native
 * text cursor kept in editable fields; replaced by a static golden cursor image
 * when reduced motion is requested. At most 36 particles alive at once.
 */
export function SandCursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const active = fine && !reduced;

  useEffect(() => {
    const root = document.documentElement;
    if (fine && reduced) {
      root.classList.add("static-cursor");
      return () => root.classList.remove("static-cursor");
    }
    if (!active) return;
    const el = dot.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;

    root.classList.add("sand-cursor");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      cv.width = window.innerWidth * dpr;
      cv.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let tx = -100;
    let ty = -100;
    let x = tx;
    let y = ty;
    let lastSpawn = 0;
    let raf = 0;
    let running = false;
    let hovering = false;
    let seed = 13579;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const parts: { x: number; y: number; vx: number; vy: number; life: number; size: number }[] = [];

    const loop = (now: number) => {
      x += (tx - x) * 0.28;
      y += (ty - y) * 0.28;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${hovering ? 1.45 : 1})`;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life -= 0.022;
        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.025;
        ctx.globalAlpha = p.life * 0.85;
        ctx.fillStyle = p.life > 0.6 ? "#FFF1C9" : "#E2BC73";
        // tiny four-point sparkle
        const r = p.size * p.life * 1.6;
        const q = r * 0.28;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - r);
        ctx.lineTo(p.x + q, p.y - q);
        ctx.lineTo(p.x + r, p.y);
        ctx.lineTo(p.x + q, p.y + q);
        ctx.lineTo(p.x, p.y + r);
        ctx.lineTo(p.x - q, p.y + q);
        ctx.lineTo(p.x - r, p.y);
        ctx.lineTo(p.x - q, p.y - q);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      const settled = Math.abs(tx - x) < 0.3 && Math.abs(ty - y) < 0.3;
      if (parts.length === 0 && settled) {
        running = false;
        return;
      }
      void now;
      raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      const t = e.timeStamp;
      if (t - lastSpawn > 28 && parts.length < 36) {
        lastSpawn = t;
        parts.push({ x: tx, y: ty, vx: (rand() - 0.5) * 0.9, vy: (rand() - 0.7) * 0.8, life: 1, size: 1 + rand() * 1.6 });
      }
      const target = e.target as Element | null;
      const editable = target?.closest("input, textarea, select, [contenteditable='true']");
      el.style.opacity = editable ? "0" : "1";
      hovering = Boolean(target?.closest("a, button, [role='button'], summary, label"));
      wake();
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("sand-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, [active, fine, reduced]);

  if (!active) return null;
  return (
    <>
      <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-[200] size-full" />
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[201] -ml-[11px] -mt-[11px] size-[22px] opacity-0 transition-opacity duration-200">
        <svg viewBox="0 0 40 40" className="spin-slow size-full overflow-visible drop-shadow-[0_0_6px_rgb(226_188_115/0.85)]">
          <defs>
            <radialGradient id="cursor-star" cx="45%" cy="40%" r="65%">
              <stop offset="0" stopColor="#FFF8E1" />
              <stop offset="0.5" stopColor="#E2BC73" />
              <stop offset="1" stopColor="#8a6526" />
            </radialGradient>
          </defs>
          <polygon points={starPoints(20, 20, 19, 8.5)} fill="url(#cursor-star)" stroke="#07152F" strokeOpacity="0.55" strokeWidth="1.2" />
          <circle cx="20" cy="20" r="3.2" fill="#FFF8E1" />
        </svg>
      </div>
    </>
  );
}
