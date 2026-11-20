import { useId, type ReactNode } from "react";
import { starPoints } from "@/components/artwork/geometry";
import { cx } from "@/lib/formatting";

/** Glass bulbs in the 200×320 hourglass space; the neck is at (100, 160). */
export const TOP_BULB = "M54 44 C54 104 92 128 98 160 L102 160 C108 128 146 104 146 44 Z";
export const BOTTOM_BULB = "M98 160 C92 192 54 216 54 276 L146 276 C146 216 108 192 102 160 Z";

export interface HourglassIds {
  sand: string;
  topClip: string;
  bottomClip: string;
}

/**
 * The ornate frame (brass pillars, turquoise plates, glass) with a slot for the
 * sand. The frame is symmetric under a 180° turn, so a turning hourglass can
 * reset its rotation after each turn without any visible jump.
 */
export function HourglassFrame({ className, children }: { className?: string; children: (ids: HourglassIds) => ReactNode }) {
  const id = useId();
  const ids: HourglassIds = { sand: `${id}sand`, topClip: `${id}top`, bottomClip: `${id}bot` };
  return (
    <svg aria-hidden viewBox="0 0 200 320" className={cx("overflow-visible", className)}>
      <defs>
        <radialGradient id={`${id}halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#E2BC73" stopOpacity="0.45" />
          <stop offset="1" stopColor="#E2BC73" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}brass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5a3f12" />
          <stop offset="0.28" stopColor="#C49A4A" />
          <stop offset="0.5" stopColor="#F6DB9A" />
          <stop offset="0.72" stopColor="#C49A4A" />
          <stop offset="1" stopColor="#5a3f12" />
        </linearGradient>
        <linearGradient id={ids.sand} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE7AE" />
          <stop offset="1" stopColor="#D9A24F" />
        </linearGradient>
        <linearGradient id={`${id}glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="0.3" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="0.7" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.12" />
        </linearGradient>
        <clipPath id={ids.topClip}>
          <path d={TOP_BULB} />
        </clipPath>
        <clipPath id={ids.bottomClip}>
          <path d={BOTTOM_BULB} />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="160" rx="120" ry="150" fill={`url(#${id}halo)`} />

      {/* back pillar */}
      <rect x="97" y="34" width="6" height="252" fill="#3d2b0c" opacity="0.18" />

      {/* glass */}
      <path d={TOP_BULB} fill={`url(#${id}glass)`} />
      <path d={BOTTOM_BULB} fill={`url(#${id}glass)`} />

      {children(ids)}

      <path d={TOP_BULB} fill="none" stroke="#F6DB9A" strokeOpacity="0.55" strokeWidth="1.4" />
      <path d={BOTTOM_BULB} fill="none" stroke="#F6DB9A" strokeOpacity="0.55" strokeWidth="1.4" />
      {/* glints, mirrored so a half turn looks identical */}
      <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <path d="M64 58 C64 96 84 116 92 136" strokeOpacity="0.35" />
        <path d="M136 262 C136 224 116 204 108 184" strokeOpacity="0.35" />
        <path d="M64 262 C64 226 80 206 90 190" strokeOpacity="0.2" />
        <path d="M136 58 C136 94 120 114 110 130" strokeOpacity="0.2" />
      </g>

      {/* turned pillars */}
      {[34, 166].map((x) => (
        <g key={x}>
          <rect x={x - 5} y="34" width="10" height="252" fill={`url(#${id}brass)`} />
          {[70, 120, 160, 200, 250].map((y) => (
            <ellipse key={y} cx={x} cy={y} rx="8.5" ry="4.5" fill={`url(#${id}brass)`} />
          ))}
        </g>
      ))}

      {/* plates */}
      {[16, 286].map((y) => (
        <g key={y}>
          <rect x="16" y={y} width="168" height="18" rx="4" fill={`url(#${id}brass)`} />
          <rect x="26" y={y + 5} width="148" height="8" rx="2" fill="#258F91" opacity="0.85" />
          {[46, 73, 100, 127, 154].map((x) => (
            <polygon key={x} points={starPoints(x, y + 9, 5, 2.4)} fill="#F6DB9A" />
          ))}
          <path d={`M10 ${y + 9} h-6 M190 ${y + 9} h6`} stroke="#C49A4A" strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
      {/* finials at both ends */}
      <path d="M92 16 Q100 2 108 16 Z" fill={`url(#${id}brass)`} />
      <circle cx="100" cy="4" r="4" fill="#F6DB9A" />
      <path d="M92 304 Q100 318 108 304 Z" fill={`url(#${id}brass)`} />
      <circle cx="100" cy="316" r="4" fill="#F6DB9A" />
    </svg>
  );
}

/**
 * Ornate Persian hourglass (static). `progress` is the fraction of sand still in
 * the top bulb (1 = full). `reversed` makes the falling stream flow upward.
 */
export function Hourglass({
  progress = 0.6,
  reversed = false,
  flowing = true,
  className,
}: {
  progress?: number;
  reversed?: boolean;
  flowing?: boolean;
  className?: string;
}) {
  const p = Math.min(1, Math.max(0, progress));
  const topSurface = 48 + (1 - p) * 104; // y of sand surface in top bulb
  const pile = 8 + (1 - p) * 86; // height of the bottom mound

  return (
    <HourglassFrame className={className}>
      {(ids) => (
        <>
          <g clipPath={`url(#${ids.topClip})`}>
            <rect x="40" y={topSurface} width="120" height={170 - topSurface} fill={`url(#${ids.sand})`} />
            <ellipse cx="100" cy={topSurface} rx="46" ry="4" fill="#FFF1C9" opacity="0.6" />
          </g>
          <g clipPath={`url(#${ids.bottomClip})`}>
            <path d={`M40 280 L54 276 Q100 ${276 - pile * 2} 146 276 L160 280 Z`} fill={`url(#${ids.sand})`} />
          </g>
          {flowing && p > 0 && (
            <line
              x1="100"
              y1="158"
              x2="100"
              y2={276 - pile}
              stroke="#FFE7AE"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="4 6"
              className={reversed ? "sand-stream sand-stream-reverse" : "sand-stream"}
            />
          )}
        </>
      )}
    </HourglassFrame>
  );
}
