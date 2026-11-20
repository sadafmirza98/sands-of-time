import { useId } from "react";
import { starPoints } from "@/components/artwork/geometry";
import { cx } from "@/lib/formatting";

/** Pierced Persian brass lantern with a flickering glow. Sways from its chain. */
export function Lantern({ className, chain = 120, delay = 0 }: { className?: string; chain?: number; delay?: number }) {
  const id = useId();
  const top = chain;
  return (
    <div aria-hidden className={cx("lantern-sway pointer-events-none origin-top", className)} style={{ animationDelay: `${delay}s` }}>
      <svg viewBox={`0 0 120 ${top + 230}`} className="h-full w-auto overflow-visible">
        <defs>
          <radialGradient id={`${id}glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#FFE3A0" stopOpacity="0.75" />
            <stop offset="0.4" stopColor="#E2BC73" stopOpacity="0.25" />
            <stop offset="1" stopColor="#E2BC73" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}brass`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6e4f17" />
            <stop offset="0.45" stopColor="#E2BC73" />
            <stop offset="0.7" stopColor="#C49A4A" />
            <stop offset="1" stopColor="#5a3f12" />
          </linearGradient>
          <linearGradient id={`${id}flame`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFF6D8" />
            <stop offset="1" stopColor="#F0B95A" />
          </linearGradient>
        </defs>
        <circle cx="60" cy={top + 110} r="110" fill={`url(#${id}glow)`} className="flicker" style={{ animationDelay: `${delay * 0.7}s` }} />
        <line x1="60" y1="0" x2="60" y2={top} stroke="#8a6526" strokeWidth="2" strokeDasharray="5 3" />
        {/* cap */}
        <circle cx="60" cy={top + 4} r="5" fill="none" stroke={`url(#${id}brass)`} strokeWidth="2.5" />
        <path d={`M60 ${top + 9} C40 ${top + 26} 30 ${top + 40} 26 ${top + 52} H94 C90 ${top + 40} 80 ${top + 26} 60 ${top + 9} Z`} fill={`url(#${id}brass)`} />
        <rect x="22" y={top + 52} width="76" height="8" rx="2" fill={`url(#${id}brass)`} />
        {/* glass body with lattice */}
        <path d={`M28 ${top + 60} H92 L100 ${top + 120} L84 ${top + 178} H36 L20 ${top + 120} Z`} fill={`url(#${id}flame)`} opacity="0.9" className="flicker-slow" />
        <g stroke={`url(#${id}brass)`} strokeWidth="2.6" fill="none">
          <path d={`M28 ${top + 60} H92 L100 ${top + 120} L84 ${top + 178} H36 L20 ${top + 120} Z`} />
          <path d={`M60 ${top + 60} V${top + 178} M20 ${top + 120} H100`} />
          <polygon points={starPoints(60, top + 120, 22, 10)} />
          <polygon points={starPoints(40, top + 92, 9, 4)} />
          <polygon points={starPoints(80, top + 92, 9, 4)} />
          <polygon points={starPoints(40, top + 150, 9, 4)} />
          <polygon points={starPoints(80, top + 150, 9, 4)} />
        </g>
        {/* base */}
        <path d={`M36 ${top + 178} H84 L72 ${top + 196} H48 Z`} fill={`url(#${id}brass)`} />
        <path d={`M60 ${top + 196} V${top + 222}`} stroke={`url(#${id}brass)`} strokeWidth="3" />
        <circle cx="60" cy={top + 224} r="4" fill="#E2BC73" />
      </svg>
    </div>
  );
}
