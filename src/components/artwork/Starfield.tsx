import { r2, seeded } from "@/components/artwork/random";
import { cx } from "@/lib/formatting";

interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
  d: number;
  k: number;
}

function makeStars(count: number, seed: number): Star[] {
  const rnd = seeded(seed);
  return Array.from({ length: count }, () => {
    const big = rnd() < 0.08;
    return {
      x: r2(rnd() * 1000),
      y: r2(Math.pow(rnd(), 1.4) * 620),
      r: r2(big ? 1.4 + rnd() * 1.2 : 0.4 + rnd() * 0.9),
      o: r2(0.35 + rnd() * 0.65),
      d: r2(rnd() * 6),
      k: Math.floor(rnd() * 3),
    };
  });
}

/** Deterministic, twinkling SVG starfield (pure CSS animation). */
export function Starfield({ count = 140, seed = 7, className }: { count?: number; seed?: number; className?: string }) {
  const stars = makeStars(count, seed);
  return (
    <svg aria-hidden viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" className={cx("pointer-events-none absolute inset-0 size-full", className)}>
      <g fill="#FFF3D6">
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            opacity={s.o}
            className={`twinkle twinkle-${s.k}`}
            style={{ animationDelay: `${s.d}s` }}
          />
        ))}
      </g>
      {stars
        .filter((s) => s.r > 1.6)
        .map((s, i) => (
          <g key={`f${i}`} transform={`translate(${s.x} ${s.y})`} opacity={s.o * 0.8} className="twinkle twinkle-1" style={{ animationDelay: `${s.d}s` }}>
            <path d="M0 -7 L0.7 -0.7 L7 0 L0.7 0.7 L0 7 L-0.7 0.7 L-7 0 L-0.7 -0.7 Z" fill="#FFE7B0" />
          </g>
        ))}
    </svg>
  );
}
