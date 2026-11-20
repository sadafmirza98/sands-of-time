import { r2, seeded } from "@/components/artwork/random";
import { cx } from "@/lib/formatting";

interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
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
      k: Math.floor(rnd() * 3),
    };
  });
}

const FLARE = "M0 -7 L0.7 -0.7 L7 0 L0.7 0.7 L0 7 L-0.7 0.7 L-7 0 L-0.7 -0.7 Z";

/**
 * Deterministic twinkling starfield.
 *
 * Performance: stars are split into three static SVG layers and each *layer*
 * twinkles (opacity on a wrapper div — composited by the GPU). Animating each
 * star individually forced a style recalc + repaint of the whole SVG every
 * frame, which made phones stutter.
 */
export function Starfield({ count = 140, seed = 7, className }: { count?: number; seed?: number; className?: string }) {
  const stars = makeStars(count, seed);
  return (
    <div aria-hidden className={cx("pointer-events-none absolute inset-0", className)}>
      {[0, 1, 2].map((k) => (
        <div key={k} className={`twinkle-layer twinkle-layer-${k} absolute inset-0`}>
          <svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" className="size-full">
            <g fill="#FFF3D6">
              {stars
                .filter((s) => s.k === k)
                .map((s, i) => (
                  <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={s.o} />
                ))}
            </g>
            <g fill="#FFE7B0">
              {stars
                .filter((s) => s.k === k && s.r > 1.6)
                .map((s, i) => (
                  <path key={i} d={FLARE} transform={`translate(${s.x} ${s.y})`} opacity={r2(s.o * 0.8)} />
                ))}
            </g>
          </svg>
        </div>
      ))}
    </div>
  );
}
