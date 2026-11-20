import { useId } from "react";
import { starPoints } from "@/components/artwork/geometry";
import { r2 } from "@/components/artwork/random";
import { cx } from "@/lib/formatting";

/** Quarter arabesque for document corners. Rotate via `corner`. */
export function CornerOrnament({ corner = "tl", className, color = "#9A7230" }: { corner?: "tl" | "tr" | "bl" | "br"; className?: string; color?: string }) {
  const rotate = { tl: 0, tr: 90, br: 180, bl: 270 }[corner];
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={cx("pointer-events-none", className)} style={{ transform: `rotate(${rotate}deg)` }}>
      <g fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round">
        <path d="M6 6 H96 M6 6 V96" strokeWidth="2" />
        <path d="M14 14 H70 M14 14 V70" />
        <path d="M14 40 C34 40 40 34 40 14" />
        <path d="M24 60 C48 60 60 48 60 24" opacity="0.7" />
        <path d="M70 14 C82 14 88 22 84 30 C80 36 72 32 74 26" />
        <path d="M14 70 C14 82 22 88 30 84 C36 80 32 72 26 74" />
        <path d="M40 40 C52 44 58 52 56 62" opacity="0.6" />
        <path d="M40 40 C44 52 52 58 62 56" opacity="0.6" />
      </g>
      <polygon points={starPoints(27, 27, 9, 4)} fill={color} />
      <circle cx="96" cy="6" r="3" fill={color} />
      <circle cx="6" cy="96" r="3" fill={color} />
      <path d="M100 6 l6 -3 l6 3 l-6 3 Z M6 100 l-3 6 l3 6 l3 -6 Z" fill={color} opacity="0.8" />
    </svg>
  );
}

/** Horizontal flourish divider with a central octagram. */
export function Flourish({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 320 28" className={cx("pointer-events-none", className)}>
      <g stroke={color} fill="none" strokeWidth="1.2" strokeLinecap="round">
        <path d="M8 14 H122" opacity="0.6" />
        <path d="M198 14 H312" opacity="0.6" />
        <path d="M100 14 C112 4 124 4 134 14 C124 24 112 24 100 14 Z" />
        <path d="M220 14 C208 4 196 4 186 14 C196 24 208 24 220 14 Z" />
      </g>
      <polygon points={starPoints(160, 14, 12, 5.5)} fill={color} />
      <circle cx="8" cy="14" r="2" fill={color} />
      <circle cx="312" cy="14" r="2" fill={color} />
      <path d="M60 14 l4 -3 l4 3 l-4 3 Z M252 14 l4 -3 l4 3 l-4 3 Z" fill={color} />
    </svg>
  );
}

/** Ornamental royal insignia with the monogram — used in the hero and nav. */
export function MonogramInsignia({ monogram, className }: { monogram: string; className?: string }) {
  const id = useId();
  return (
    <svg aria-hidden viewBox="0 0 160 160" className={cx("overflow-visible", className)}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6DB9A" />
          <stop offset="0.5" stopColor="#C49A4A" />
          <stop offset="1" stopColor="#F6DB9A" />
        </linearGradient>
      </defs>
      <g className="spin-slower origin-center" style={{ transformBox: "fill-box" }}>
        <polygon points={starPoints(80, 80, 76, 62, 16)} fill="none" stroke={`url(#${id}g)`} strokeWidth="1" opacity="0.5" />
      </g>
      <polygon points={starPoints(80, 80, 62, 50, 8)} fill="#07152F" fillOpacity="0.55" stroke={`url(#${id}g)`} strokeWidth="1.6" />
      <polygon points={starPoints(80, 80, 62, 50, 8, -Math.PI / 2 + Math.PI / 8)} fill="none" stroke={`url(#${id}g)`} strokeWidth="0.8" opacity="0.7" />
      <circle cx="80" cy="80" r="40" fill="none" stroke={`url(#${id}g)`} strokeWidth="1.2" />
      <circle cx="80" cy="80" r="36" fill="none" stroke="#258F91" strokeWidth="1" opacity="0.8" />
      <text x="80" y="82" textAnchor="middle" dominantBaseline="middle" className="font-display" fontSize="34" fontWeight="600" letterSpacing="2" fill={`url(#${id}g)`}>
        {monogram}
      </text>
    </svg>
  );
}

/**
 * Concentric astrolabe-like rings — the "ancient mechanism". Each ring is its
 * own SVG in a div that rotates with CSS, so the GPU spins the layers without
 * repainting them (rotating SVG groups forced a full repaint every frame).
 */
export function Mechanism({ className }: { className?: string }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i);
  const layer = "absolute inset-0 will-change-transform";
  return (
    <div aria-hidden className={cx("pointer-events-none relative", className)}>
      <div className={cx(layer, "spin-slow")}>
        <svg viewBox="0 0 600 600" className="size-full">
          <circle cx="300" cy="300" r="292" fill="none" stroke="#C49A4A" strokeOpacity="0.5" strokeWidth="1" />
          <circle cx="300" cy="300" r="276" fill="none" stroke="#C49A4A" strokeOpacity="0.35" strokeWidth="1" />
          {ticks.map((i) => {
            const a = (i / 72) * Math.PI * 2;
            const r0 = i % 6 === 0 ? 262 : 270;
            return <line key={i} x1={r2(300 + Math.cos(a) * r0)} y1={r2(300 + Math.sin(a) * r0)} x2={r2(300 + Math.cos(a) * 276)} y2={r2(300 + Math.sin(a) * 276)} stroke="#E2BC73" strokeOpacity="0.55" strokeWidth={i % 6 === 0 ? 1.6 : 0.8} />;
          })}
        </svg>
      </div>
      <div className={cx(layer, "spin-reverse")}>
        <svg viewBox="0 0 600 600" className="size-full">
          <circle cx="300" cy="300" r="232" fill="none" stroke="#E2BC73" strokeOpacity="0.3" strokeDasharray="2 10" strokeWidth="2" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <polygon key={i} points={starPoints(300 + Math.cos(a) * 232, 300 + Math.sin(a) * 232, 9, 4)} fill="#E2BC73" fillOpacity="0.55" />;
          })}
        </svg>
      </div>
      <div className={cx(layer, "spin-slower")}>
        <svg viewBox="0 0 600 600" className="size-full">
          <polygon points={starPoints(300, 300, 196, 150, 12)} fill="none" stroke="#258F91" strokeOpacity="0.45" strokeWidth="1" />
          <circle cx="300" cy="300" r="150" fill="none" stroke="#C49A4A" strokeOpacity="0.25" />
        </svg>
      </div>
    </div>
  );
}

/** Small diamond-and-dot rule for parchment documents. */
export function Rule({ className, color = "#9A7230" }: { className?: string; color?: string }) {
  return (
    <div aria-hidden className={cx("flex items-center justify-center gap-2", className)} style={{ color }}>
      <span className="h-px w-12 bg-current opacity-60 sm:w-20" />
      <span className="size-1.5 rotate-45 bg-current" />
      <span className="h-px w-12 bg-current opacity-60 sm:w-20" />
    </div>
  );
}
