import { useId } from "react";
import { starPoints } from "@/components/artwork/geometry";
import { cx } from "@/lib/formatting";

/**
 * One leaf of the palace doors (the left leaf; mirror it for the right).
 * The two leaves together form a pointed arch.
 */
export function DoorLeaf({ className, mirrored = false }: { className?: string; mirrored?: boolean }) {
  const id = useId();
  const outline = "M0 600 V190 C0 110 80 40 200 0 V600 Z";
  return (
    <svg aria-hidden viewBox="0 0 200 600" preserveAspectRatio="none" className={cx("size-full", className)} style={mirrored ? { transform: "scaleX(-1)" } : undefined}>
      <defs>
        <linearGradient id={`${id}wood`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#081633" />
          <stop offset="0.6" stopColor="#10284f" />
          <stop offset="1" stopColor="#0a1a38" />
        </linearGradient>
        <linearGradient id={`${id}gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6DB9A" />
          <stop offset="0.5" stopColor="#C49A4A" />
          <stop offset="1" stopColor="#7a5520" />
        </linearGradient>
        <pattern id={`${id}k`} width="34" height="34" patternUnits="userSpaceOnUse">
          <rect width="34" height="34" fill="#0c2a3a" />
          <polygon points={starPoints(17, 17, 14, 7)} fill="#12403f" stroke="#E2BC73" strokeOpacity="0.7" strokeWidth="1" />
          <polygon points={starPoints(17, 17, 5, 2.4)} fill="#258F91" />
          <path d="M0 0 L6 6 M34 0 L28 6 M0 34 L6 28 M34 34 L28 28" stroke="#E2BC73" strokeOpacity="0.5" />
        </pattern>
        <clipPath id={`${id}clip`}>
          <path d={outline} />
        </clipPath>
      </defs>
      <path d={outline} fill={`url(#${id}wood)`} />
      <g clipPath={`url(#${id}clip)`}>
        {/* upper arched panel */}
        <path d="M22 300 V200 C22 140 84 84 178 52 V300 Z" fill={`url(#${id}k)`} stroke={`url(#${id}gold)`} strokeWidth="2" />
        {/* middle panels */}
        <rect x="22" y="318" width="156" height="120" fill={`url(#${id}k)`} stroke={`url(#${id}gold)`} strokeWidth="2" />
        <circle cx="100" cy="378" r="36" fill="#0a1a38" stroke={`url(#${id}gold)`} strokeWidth="2" />
        <polygon points={starPoints(100, 378, 30, 14)} fill="none" stroke="#E2BC73" strokeWidth="1.4" />
        <circle cx="100" cy="378" r="7" fill="#258F91" stroke="#E2BC73" />
        {/* lower panel */}
        <rect x="22" y="456" width="156" height="124" fill="#0b1d3e" stroke={`url(#${id}gold)`} strokeWidth="2" />
        <rect x="34" y="468" width="132" height="100" fill="none" stroke="#258F91" strokeOpacity="0.8" strokeWidth="1.4" />
        {/* turquoise inlay strips */}
        <rect x="8" y="0" width="5" height="600" fill="#258F91" opacity="0.8" />
        <rect x="190" y="0" width="4" height="600" fill="#E2BC73" opacity="0.9" />
        {/* studs */}
        {[310, 448, 588].map((y) =>
          [30, 65, 100, 135, 170].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3.2" fill={`url(#${id}gold)`} />),
        )}
      </g>
      <path d={outline} fill="none" stroke={`url(#${id}gold)`} strokeWidth="3" />
      {/* ring handle near the seam */}
      <circle cx="176" cy="400" r="9" fill="#C49A4A" />
      <circle cx="176" cy="422" r="15" fill="none" stroke={`url(#${id}gold)`} strokeWidth="3.5" />
    </svg>
  );
}
