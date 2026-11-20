import { useId } from "react";
import { cx } from "@/lib/formatting";

/** Luminous crescent moon with soft halo. */
export function CrescentMoon({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg aria-hidden viewBox="0 0 200 200" className={cx("pointer-events-none", className)}>
      <defs>
        <radialGradient id={`${id}h`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE9B8" stopOpacity="0.38" />
          <stop offset="45%" stopColor="#E2BC73" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#E2BC73" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF7DF" />
          <stop offset="60%" stopColor="#F3DDA6" />
          <stop offset="100%" stopColor="#D9B26A" />
        </linearGradient>
        <mask id={`${id}c`}>
          <rect width="200" height="200" fill="#000" />
          <circle cx="100" cy="100" r="34" fill="#fff" />
          <circle cx="116" cy="88" r="30" fill="#000" />
        </mask>
      </defs>
      <circle cx="100" cy="100" r="100" fill={`url(#${id}h)`} className="breathe" />
      <rect width="200" height="200" fill={`url(#${id}m)`} mask={`url(#${id}c)`} />
    </svg>
  );
}
