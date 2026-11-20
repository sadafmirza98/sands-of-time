"use client";

import { animate, useMotionValue, type AnimationPlaybackControls } from "motion/react";
import { useEffect, useRef } from "react";
import { HourglassFrame } from "@/components/artwork/Hourglass";
import { cx } from "@/lib/formatting";

/**
 * An hourglass that obeys gravity.
 *
 * Each bulb's sand is drawn as a half-plane clipped by the glass and kept level
 * with the *world*, so while the glass turns the sand slides to whichever end
 * now points down. Because the frame is symmetric, at the end of a half turn
 * the rotation resets to 0° and the two bulbs swap contents — no visible jump.
 * Then the sand pours through the neck and the lower bulb fills.
 *
 * `turns` — increment to turn the glass. `initial` — sand in the top bulb (0–1).
 */

/* ── Bulb geometry: area profile of the top bulb (the bottom is its mirror) ── */

const NECK = 160; // y of the neck
const WIDE = 44; // y of the top bulb's wide end
const TOP_C = 102; // reference centre of the top bulb
const BOT_C = 320 - TOP_C; // mirror for the bottom bulb

const bez = (a: number, b: number, c: number, d: number, t: number) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;

/** Cumulative glass area from the wide end (y = 44) down to each integer y. */
const CUM: number[] = (() => {
  // Right edge of the top bulb: (146,44) → (146,104) → (108,128) → (102,160).
  const pts: [number, number][] = [];
  for (let i = 0; i <= 400; i++) {
    const t = i / 400;
    pts.push([bez(146, 146, 108, 102, t), bez(44, 104, 128, 160, t)]);
  }
  const halfWidthAt = (y: number) => {
    for (let i = 1; i < pts.length; i++) {
      if (pts[i][1] >= y) {
        const [x0, y0] = pts[i - 1];
        const [x1, y1] = pts[i];
        const k = y1 === y0 ? 0 : (y - y0) / (y1 - y0);
        return x0 + (x1 - x0) * k - 100;
      }
    }
    return 2;
  };
  const out = [0];
  for (let y = WIDE + 1; y <= NECK; y++) out.push(out[out.length - 1] + 2 * halfWidthAt(y - 0.5));
  return out;
})();
const TOTAL = CUM[CUM.length - 1];

/** y where the area between the wide end and y equals `area`. */
function yAtArea(area: number): number {
  const target = Math.max(0, Math.min(TOTAL, area));
  for (let i = 1; i < CUM.length; i++) {
    if (CUM[i] >= target) {
      const k = (target - CUM[i - 1]) / (CUM[i] - CUM[i - 1] || 1);
      return WIDE + i - 1 + k;
    }
  }
  return NECK;
}
/** Surface y when a fraction `f` rests against the wide end. */
const wideFill = (f: number) => yAtArea(f * TOTAL);
/** Surface y when a fraction `f` rests against the neck. */
const neckFill = (f: number) => yAtArea((1 - f) * TOTAL);

/**
 * Signed distance (along world-down, from the bulb centre) of the sand surface,
 * at glass angle `deg` (0 = upright, 180 = upside down), for fill `f`.
 */
function topSurface(f: number, deg: number) {
  const t0 = neckFill(f) - TOP_C; // upright: sand rests on the neck
  const t180 = TOP_C - wideFill(f); // inverted: sand rests on the wide end
  const k = (1 - Math.cos((deg * Math.PI) / 180)) / 2;
  return t0 + (t180 - t0) * k;
}
function bottomSurface(f: number, deg: number) {
  const t0 = 320 - wideFill(f) - BOT_C; // upright: sand rests on the wide end
  const t180 = BOT_C - (320 - neckFill(f)); // inverted: sand rests on the neck
  const k = (1 - Math.cos((deg * Math.PI) / 180)) / 2;
  return t0 + (t180 - t0) * k;
}

/** Seconds for a full bulb to pour through. */
const FULL_POUR = 24;

export function TurningHourglass({ turns, initial, reduced, className }: { turns: number; initial: number; reduced: boolean; className?: string }) {
  const angle = useMotionValue(0);
  const top = useMotionValue(Math.min(1, Math.max(0, initial)));
  const wrap = useRef<HTMLDivElement | null>(null);
  const topG = useRef<SVGGElement | null>(null);
  const botG = useRef<SVGGElement | null>(null);
  const stream = useRef<SVGLineElement | null>(null);
  const pour = useRef<AnimationPlaybackControls | null>(null);
  const spin = useRef<AnimationPlaybackControls | null>(null);
  const lastTurns = useRef(turns);

  // Draw from motion values without re-rendering React.
  useEffect(() => {
    const draw = () => {
      const deg = angle.get();
      const ft = top.get();
      const fb = 1 - ft;
      if (wrap.current) wrap.current.style.transform = `rotate(${deg}deg)`;
      topG.current?.setAttribute("transform", `translate(100 ${TOP_C}) rotate(${-deg}) translate(0 ${topSurface(ft, deg).toFixed(2)})`);
      botG.current?.setAttribute("transform", `translate(100 ${BOT_C}) rotate(${-deg}) translate(0 ${bottomSurface(fb, deg).toFixed(2)})`);
      if (stream.current) {
        const upright = deg < 0.5;
        stream.current.setAttribute("y2", (320 - wideFill(fb)).toFixed(2));
        stream.current.style.opacity = upright && ft > 0.004 && !reduced ? "1" : "0";
      }
    };
    draw();
    const a = angle.on("change", draw);
    const b = top.on("change", draw);
    return () => {
      a();
      b();
    };
  }, [angle, top, reduced]);

  // Turn the glass whenever `turns` increases.
  useEffect(() => {
    if (turns === lastTurns.current) return;
    lastTurns.current = turns;
    pour.current?.stop();
    spin.current?.stop();

    const swapAndPour = () => {
      angle.set(0);
      top.set(1 - top.get());
      if (reduced) return;
      const f = top.get();
      pour.current = animate(top, 0, { duration: f * FULL_POUR, ease: "linear" });
    };

    if (reduced) {
      swapAndPour();
      return;
    }
    spin.current = animate(angle, 180, { duration: 1.15, ease: [0.65, 0, 0.35, 1], onComplete: swapAndPour });
  }, [turns, reduced, angle, top]);

  // Until the guest first turns it, the sand level follows the countdown.
  useEffect(() => {
    if (lastTurns.current === 0) top.set(Math.min(1, Math.max(0, initial)));
  }, [initial, top]);

  useEffect(
    () => () => {
      pour.current?.stop();
      spin.current?.stop();
    },
    [],
  );

  return (
    <div ref={wrap} className={cx("w-fit will-change-transform", className)}>
      <HourglassFrame className="block h-full w-auto">
        {(ids) => (
          <>
            <g clipPath={`url(#${ids.topClip})`}>
              <g ref={topG}>
                <rect x="-170" y="0" width="340" height="340" fill={`url(#${ids.sand})`} />
                <line x1="-170" x2="170" y1="0.6" y2="0.6" stroke="#FFF1C9" strokeOpacity="0.7" strokeWidth="1.6" />
              </g>
            </g>
            <g clipPath={`url(#${ids.bottomClip})`}>
              <g ref={botG}>
                <rect x="-170" y="0" width="340" height="340" fill={`url(#${ids.sand})`} />
                <line x1="-170" x2="170" y1="0.6" y2="0.6" stroke="#FFF1C9" strokeOpacity="0.7" strokeWidth="1.6" />
              </g>
            </g>
            <line
              ref={stream}
              x1="100"
              y1="158"
              x2="100"
              y2="270"
              stroke="#FFE7AE"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="4 6"
              className="sand-stream transition-opacity duration-300"
            />
          </>
        )}
      </HourglassFrame>
    </div>
  );
}
