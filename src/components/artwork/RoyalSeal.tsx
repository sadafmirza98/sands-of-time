import { useId } from "react";
import { starPoints } from "@/components/artwork/geometry";
import { r2, seeded } from "@/components/artwork/random";
import { cx } from "@/lib/formatting";

/** Irregular molten edge for the seal, deterministic. */
function sealEdge(): string {
  const rnd = seeded(42);
  const n = 28;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = 54 + (rnd() - 0.5) * 5;
    return [60 + Math.cos(a) * r, 60 + Math.sin(a) * r] as const;
  });
  let d = `M${r2((pts[0][0] + pts[n - 1][0]) / 2)} ${r2((pts[0][1] + pts[n - 1][1]) / 2)}`;
  for (let i = 0; i < n; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[(i + 1) % n];
    d += ` Q${r2(x)} ${r2(y)} ${r2((x + nx) / 2)} ${r2((y + ny) / 2)}`;
  }
  return d + " Z";
}

const EDGE = sealEdge();
/** Jagged crack line used to split the seal in two. */
const CRACK = "60,0 54,18 64,32 52,50 66,66 55,84 63,102 58,120";

/**
 * The TN royal seal — gilded wax with an octagram frame and beaded ring.
 * `half` clips to one side of the crack so a broken seal can be animated.
 */
export function RoyalSeal({ monogram, half, className }: { monogram: string; half?: "left" | "right"; className?: string }) {
  const id = useId();
  const clip = half === "left" ? `0,0 ${CRACK} 0,120` : half === "right" ? `${CRACK} 120,120 120,0` : null;
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={cx("overflow-visible", className)}>
      <defs>
        <radialGradient id={`${id}wax`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#FCE7B0" />
          <stop offset="0.35" stopColor="#E2BC73" />
          <stop offset="0.75" stopColor="#B4873A" />
          <stop offset="1" stopColor="#7a5520" />
        </radialGradient>
        <linearGradient id={`${id}rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF0C4" />
          <stop offset="1" stopColor="#6e4f17" />
        </linearGradient>
        {clip && (
          <clipPath id={`${id}clip`}>
            <polygon points={clip} />
          </clipPath>
        )}
      </defs>
      <g clipPath={clip ? `url(#${id}clip)` : undefined}>
        <path d={EDGE} fill={`url(#${id}wax)`} />
        <path d={EDGE} fill="none" stroke="#6e4f17" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="60" cy="60" r="44" fill="none" stroke={`url(#${id}rim)`} strokeWidth="3" />
        <circle cx="60" cy="60" r="40" fill="#C49A4A" fillOpacity="0.35" />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return <circle key={i} cx={r2(60 + Math.cos(a) * 48.5)} cy={r2(60 + Math.sin(a) * 48.5)} r="1.5" fill="#FFF0C4" fillOpacity="0.85" />;
        })}
        <polygon points={starPoints(60, 60, 38, 31, 8)} fill="none" stroke="#7a5520" strokeOpacity="0.7" strokeWidth="1.4" />
        <polygon points={starPoints(60, 60, 38, 31, 8, -Math.PI / 2 + Math.PI / 8)} fill="none" stroke="#FFF0C4" strokeOpacity="0.4" strokeWidth="0.8" />
        <text x="60" y="61.5" textAnchor="middle" dominantBaseline="middle" className="font-display" fontSize="30" fontWeight="700" letterSpacing="1" fill="#FFF0C4" fillOpacity="0.55" transform="translate(-0.8 -0.8)">
          {monogram}
        </text>
        <text x="60" y="61.5" textAnchor="middle" dominantBaseline="middle" className="font-display" fontSize="30" fontWeight="700" letterSpacing="1" fill="#5a3f12">
          {monogram}
        </text>
      </g>
    </svg>
  );
}
