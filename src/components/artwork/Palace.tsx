import { useId } from "react";
import { archPath, cuspedArchPath, domePath, onionDomePath, starPoints } from "@/components/artwork/geometry";
import { cx } from "@/lib/formatting";

/**
 * Original Persian palace artwork, drawn in a 1600×1000 space with the ground at
 * y=860 and the great iwan (gate) centred at x=800, so `xMidYMax slice` keeps the
 * gate in frame from 360px phones to wide desktops.
 *
 * Layers are separate components so scenes can parallax them independently.
 */

const GROUND = 860;

interface LayerProps {
  className?: string;
  /** Draw the terrace/ground band (off when the palace sits on other terrain). */
  ground?: boolean;
  /** Slightly different lighting for the farewell scene. */
  tone?: "night" | "glow";
}

function svgProps(className?: string) {
  return {
    "aria-hidden": true as const,
    viewBox: "0 0 1600 1000",
    preserveAspectRatio: "xMidYMax slice",
    className: cx("pointer-events-none absolute inset-0 size-full", className),
  };
}

/* ── Distant mountains & far silhouettes ─────────────────────────────────── */

export function PalaceFar({ className }: LayerProps) {
  const id = useId();
  return (
    <svg {...svgProps(className)}>
      <defs>
        <linearGradient id={`${id}m1`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d3d6c" />
          <stop offset="1" stopColor="#0d2145" />
        </linearGradient>
        <linearGradient id={`${id}m2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15305a" />
          <stop offset="1" stopColor="#0a1a38" />
        </linearGradient>
        <linearGradient id={`${id}haze`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E2BC73" stopOpacity="0" />
          <stop offset="0.7" stopColor="#E2BC73" stopOpacity="0.10" />
          <stop offset="1" stopColor="#D9BD91" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <path
        d="M0 700 L90 640 L170 668 L260 600 L340 630 L430 560 L520 610 L600 585 L700 640 L800 610 L900 640 L1000 590 L1090 620 L1180 560 L1270 600 L1350 575 L1440 630 L1520 600 L1600 640 V1000 H0 Z"
        fill={`url(#${id}m1)`}
        opacity="0.75"
      />
      {/* moonlit ridge highlights */}
      <path d="M260 600 L300 615 M430 560 L470 585 M1180 560 L1220 580 M1000 590 L1040 605" stroke="#E2BC73" strokeOpacity="0.25" strokeWidth="1.5" fill="none" />
      {/* far palace silhouettes */}
      <g fill={`url(#${id}m2)`}>
        <path d={domePath(220, 700, 34)} />
        <rect x="160" y="700" width="120" height="120" />
        <rect x="140" y="610" width="10" height="210" />
        <path d={onionDomePath(145, 612, 9)} />
        <path d={domePath(1390, 690, 40)} />
        <rect x="1320" y="690" width="140" height="130" />
        <rect x="1470" y="600" width="10" height="220" />
        <path d={onionDomePath(1475, 602, 9)} />
      </g>
      <g fill="#E2BC73" opacity="0.7" className="flicker">
        <rect x="195" y="740" width="5" height="9" rx="2.5" />
        <rect x="235" y="740" width="5" height="9" rx="2.5" />
        <rect x="1360" y="730" width="5" height="9" rx="2.5" />
        <rect x="1410" y="730" width="5" height="9" rx="2.5" />
      </g>
      <path
        d="M0 760 Q200 720 420 748 T820 740 T1220 742 T1600 735 V1000 H0 Z"
        fill={`url(#${id}m2)`}
      />
      <rect x="0" y="560" width="1600" height="300" fill={`url(#${id}haze)`} />
    </svg>
  );
}

/* ── The palace ─────────────────────────────────────────────────────────── */

function Merlons({ x0, x1, y, size = 16, gap = 8 }: { x0: number; x1: number; y: number; size?: number; gap?: number }) {
  const items: string[] = [];
  for (let x = x0; x + size <= x1; x += size + gap) {
    items.push(`M${x} ${y} V${y - size * 0.6} L${x + size / 2} ${y - size} L${x + size} ${y - size * 0.6} V${y} Z`);
  }
  return <path d={items.join(" ")} />;
}

function Arcade({ x0, count, w, gap, base, spring, apex, glow, glowId, darkId }: { x0: number; count: number; w: number; gap: number; base: number; spring: number; apex: number; glow?: number[]; glowId: string; darkId: string }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const c = x0 + w / 2 + i * (w + gap);
        const lit = glow?.includes(i);
        return (
          <g key={i}>
            <path d={archPath(c, base, w, spring, apex)} fill={`url(#${darkId})`} />
            {lit && <path d={archPath(c, base, w * 0.62, spring + (base - spring) * 0.12, apex + (spring - apex) * 0.55)} fill={`url(#${glowId})`} className={i % 2 ? "flicker" : "flicker-slow"} />}
            <path d={archPath(c, base, w, spring, apex, false)} fill="none" stroke="#C49A4A" strokeOpacity="0.55" strokeWidth="1.4" />
          </g>
        );
      })}
    </g>
  );
}

export function PalaceMain({ className, tone = "night", ground = true }: LayerProps) {
  const id = useId();
  const stone = `${id}stone`;
  const stoneDark = `${id}sd`;
  const recess = `${id}rec`;
  const glow = `${id}glow`;
  const winGlow = `${id}wg`;
  const tile = `${id}tile`;
  const domeFill = `${id}dome`;
  const gold = `${id}gold`;
  const mainArch = archPath(800, GROUND, 230, 565, 372);

  return (
    <svg {...svgProps(className)}>
      <defs>
        <linearGradient id={stone} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#183463" />
          <stop offset="0.55" stopColor="#10264d" />
          <stop offset="1" stopColor="#0a1a38" />
        </linearGradient>
        <linearGradient id={stoneDark} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0c1f42" />
          <stop offset="1" stopColor="#06122a" />
        </linearGradient>
        <linearGradient id={recess} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#040b1d" />
          <stop offset="0.7" stopColor="#0b1a37" />
          <stop offset="1" stopColor="#2a2a3a" />
        </linearGradient>
        <radialGradient id={glow} cx="50%" cy="100%" r="80%">
          <stop offset="0" stopColor="#FFE6A8" stopOpacity="1" />
          <stop offset="0.35" stopColor="#E2BC73" stopOpacity={tone === "glow" ? 0.85 : 0.7} />
          <stop offset="0.75" stopColor="#C49A4A" stopOpacity="0.18" />
          <stop offset="1" stopColor="#C49A4A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={winGlow} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE7AE" />
          <stop offset="1" stopColor="#C49A4A" />
        </linearGradient>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a6526" />
          <stop offset="0.5" stopColor="#E2BC73" />
          <stop offset="1" stopColor="#8a6526" />
        </linearGradient>
        <radialGradient id={domeFill} cx="38%" cy="30%" r="80%">
          <stop offset="0" stopColor="#3cb3b2" />
          <stop offset="0.45" stopColor="#1c7476" />
          <stop offset="1" stopColor="#0a3237" />
        </radialGradient>
        <pattern id={tile} width="26" height="26" patternUnits="userSpaceOnUse">
          <rect width="26" height="26" fill="#11504f" />
          <polygon points={starPoints(13, 13, 11, 5.2)} fill="none" stroke="#E2BC73" strokeOpacity="0.55" strokeWidth="0.9" />
          <circle cx="13" cy="13" r="2" fill="#E2BC73" fillOpacity="0.65" />
          <circle cx="0" cy="0" r="2.4" fill="#258F91" />
          <circle cx="26" cy="0" r="2.4" fill="#258F91" />
          <circle cx="0" cy="26" r="2.4" fill="#258F91" />
          <circle cx="26" cy="26" r="2.4" fill="#258F91" />
        </pattern>
        <clipPath id={`${id}archclip`}>
          <path d={mainArch} />
        </clipPath>
      </defs>

      {/* outer wings */}
      <g fill={`url(#${stoneDark})`}>
        <rect x="150" y="620" width="190" height="240" />
        <rect x="1260" y="620" width="190" height="240" />
        <rect x="136" y="560" width="28" height="300" />
        <rect x="1436" y="560" width="28" height="300" />
        <path d={onionDomePath(150, 562, 18)} />
        <path d={onionDomePath(1450, 562, 18)} />
        <Merlons x0={166} x1={340} y={620} size={12} gap={6} />
        <Merlons x0={1262} x1={1436} y={620} size={12} gap={6} />
      </g>
      <Arcade x0={176} count={4} w={34} gap={10} base={GROUND} spring={790} apex={758} glow={[1, 2]} glowId={winGlow} darkId={recess} />
      <Arcade x0={1286} count={4} w={34} gap={10} base={GROUND} spring={790} apex={758} glow={[0, 3]} glowId={winGlow} darkId={recess} />

      {/* central dome on its drum */}
      <g>
        <rect x="684" y="236" width="232" height="70" fill={`url(#${stone})`} />
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={archPath(706 + i * 31.5, 296, 14, 266, 250)} fill={`url(#${winGlow})`} opacity="0.85" className={i % 3 === 0 ? "flicker" : undefined} />
        ))}
        <rect x="678" y="230" width="244" height="8" fill={`url(#${gold})`} opacity="0.8" />
        <path d={domePath(800, 232, 122, 1.52)} fill={`url(#${domeFill})`} />
        {[-0.75, -0.42, -0.14, 0.14, 0.42, 0.75].map((k) => (
          <path
            key={k}
            d={`M${800 + k * 122} 232 C${800 + k * 122} ${232 - 70} ${800 + k * 40} ${232 - 150} 800 ${232 - 185}`}
            fill="none"
            stroke="#E2BC73"
            strokeOpacity="0.35"
            strokeWidth="1.4"
          />
        ))}
        <path d={`M690 ${232 - 30} Q800 ${232 - 46} 910 ${232 - 30}`} stroke="#E2BC73" strokeOpacity="0.4" fill="none" strokeWidth="1.2" />
        <path d={`M716 ${232 - 92} Q800 ${232 - 108} 884 ${232 - 92}`} stroke="#E2BC73" strokeOpacity="0.3" fill="none" strokeWidth="1.2" />
        <line x1="800" y1="47" x2="800" y2="12" stroke={`url(#${gold})`} strokeWidth="3" />
        <circle cx="800" cy="40" r="6" fill="#E2BC73" />
        <circle cx="800" cy="26" r="4" fill="#E2BC73" />
        <path d="M793 12 A8 8 0 1 0 807 6 A6 6 0 1 1 793 12 Z" fill="#E2BC73" />
      </g>

      {/* wing domes */}
      {[470, 1130].map((cxp) => (
        <g key={cxp}>
          <rect x={cxp - 52} y="496" width="104" height="30" fill={`url(#${stone})`} />
          <rect x={cxp - 56} y="492" width="112" height="5" fill={`url(#${gold})`} opacity="0.7" />
          <path d={domePath(cxp, 494, 52, 1.45)} fill={`url(#${domeFill})`} />
          <path d={`M${cxp} ${494 - 75} V${494 - 100}`} stroke="#E2BC73" strokeWidth="2.2" />
          <circle cx={cxp} cy={494 - 86} r="3.6" fill="#E2BC73" />
          <path d={`M${cxp - 30} ${494 - 22} Q${cxp} ${494 - 32} ${cxp + 30} ${494 - 22}`} stroke="#E2BC73" strokeOpacity="0.35" fill="none" />
        </g>
      ))}

      {/* inner wings */}
      <g fill={`url(#${stone})`}>
        <rect x="330" y="526" width="276" height="334" />
        <rect x="994" y="526" width="276" height="334" />
      </g>
      <g fill={`url(#${stone})`}>
        <Merlons x0={332} x1={606} y={526} />
        <Merlons x0={996} x1={1270} y={526} />
      </g>
      <rect x="330" y="684" width="276" height="12" fill={`url(#${tile})`} />
      <rect x="994" y="684" width="276" height="12" fill={`url(#${tile})`} />
      <g stroke="#C49A4A" strokeOpacity="0.5" strokeWidth="1.2">
        <line x1="330" y1="683" x2="606" y2="683" />
        <line x1="330" y1="697" x2="606" y2="697" />
        <line x1="994" y1="683" x2="1270" y2="683" />
        <line x1="994" y1="697" x2="1270" y2="697" />
      </g>
      {/* upper windows */}
      <Arcade x0={352} count={5} w={30} gap={22} base={655} spring={612} apex={584} glow={[0, 2, 4]} glowId={winGlow} darkId={recess} />
      <Arcade x0={1016} count={5} w={30} gap={22} base={655} spring={612} apex={584} glow={[1, 3]} glowId={winGlow} darkId={recess} />
      {/* lower arcade */}
      <Arcade x0={346} count={4} w={52} gap={17} base={GROUND} spring={782} apex={730} glow={[1]} glowId={glow} darkId={recess} />
      <Arcade x0={1010} count={4} w={52} gap={17} base={GROUND} spring={782} apex={730} glow={[2]} glowId={glow} darkId={recess} />

      {/* minarets */}
      {[618, 982].map((m) => (
        <g key={m}>
          <rect x={m - 17} y="246" width="34" height={GROUND - 246} fill={`url(#${stone})`} />
          <rect x={m - 17} y="246" width="34" height={GROUND - 246} fill="none" stroke="#C49A4A" strokeOpacity="0.35" />
          {[360, 520, 700].map((y) => (
            <rect key={y} x={m - 19} y={y} width="38" height="9" fill={`url(#${tile})`} stroke="#C49A4A" strokeOpacity="0.6" strokeWidth="0.8" />
          ))}
          <path d={`M${m - 30} 252 H${m + 30} L${m + 22} 264 H${m - 22} Z`} fill={`url(#${stone})`} stroke="#C49A4A" strokeOpacity="0.6" />
          <path d={`M${m - 30} 252 H${m + 30}`} stroke="#E2BC73" strokeWidth="1.6" />
          <rect x={m - 11} y="176" width="22" height="76" fill={`url(#${stone})`} />
          <path d={archPath(m, 238, 9, 206, 194)} fill={`url(#${winGlow})`} className="flicker-slow" />
          <rect x={m - 15} y="172" width="30" height="5" fill="#C49A4A" />
          <path d={onionDomePath(m, 173, 15)} fill={`url(#${domeFill})`} />
          <line x1={m} y1={141} x2={m} y2={112} stroke="#E2BC73" strokeWidth="1.8" />
          <circle cx={m} cy={124} r="3" fill="#E2BC73" />
          <path d={archPath(m, 455, 8, 432, 420)} fill={`url(#${winGlow})`} opacity="0.75" />
          <path d={archPath(m, 625, 8, 602, 590)} fill={`url(#${winGlow})`} opacity="0.75" className="flicker" />
        </g>
      ))}

      {/* the great iwan (pishtaq) */}
      <g>
        <rect x="652" y="300" width="296" height={GROUND - 300} fill={`url(#${stone})`} />
        <Merlons x0={652} x1={948} y={300} size={14} gap={6.5} />
        <path
          fillRule="evenodd"
          d={`M664 312 H936 V${GROUND} H664 Z M682 330 H918 V${GROUND} H682 Z`}
          fill={`url(#${tile})`}
        />
        <rect x="664" y="312" width="272" height={GROUND - 312} fill="none" stroke="#E2BC73" strokeOpacity="0.75" strokeWidth="1.6" />
        <rect x="682" y="330" width="236" height={GROUND - 330} fill="none" stroke="#E2BC73" strokeOpacity="0.6" strokeWidth="1.2" />
        {/* spandrel rosettes */}
        {[712, 888].map((sx) => (
          <g key={sx}>
            <polygon points={starPoints(sx, 372, 17, 8)} fill="#0a1a38" stroke="#E2BC73" strokeOpacity="0.8" strokeWidth="1.2" />
            <circle cx={sx} cy={372} r="4" fill="#258F91" />
          </g>
        ))}
        {/* arch recess */}
        <path d={mainArch} fill={`url(#${recess})`} />
        <g clipPath={`url(#${id}archclip)`}>
          {/* muqarnas: rows of tiny pointed cells */}
          {[0, 1, 2, 3].map((row) => {
            const y = 392 + row * 34;
            const n = 3 + row * 2;
            const w = 24;
            return Array.from({ length: n }, (_, i) => {
              const c = 800 + (i - (n - 1) / 2) * w;
              return (
                <path
                  key={`${row}-${i}`}
                  d={archPath(c, y + 34, w - 2, y + 18, y)}
                  fill="none"
                  stroke="#E2BC73"
                  strokeOpacity={0.5 - row * 0.08}
                  strokeWidth="1"
                />
              );
            });
          })}
          <rect x="680" y="560" width="240" height="300" fill={`url(#${glow})`} className="breathe-slow" />
          {/* inner doorway pouring light */}
          <path d={archPath(800, GROUND, 104, 752, 676)} fill={`url(#${winGlow})`} opacity="0.95" />
          <path d={archPath(800, GROUND, 82, 760, 696)} fill="#FFF3CF" opacity="0.65" className="flicker-slow" />
          <path d={`M748 ${GROUND} L852 ${GROUND} L930 ${GROUND + 40} L670 ${GROUND + 40} Z`} fill="#FFE6A8" opacity="0.25" />
        </g>
        <path d={cuspedArchPath(800, GROUND, 214, 560, 384, 9)} fill="none" stroke="#E2BC73" strokeOpacity="0.55" strokeWidth="1.2" />
        <path d={archPath(800, GROUND, 230, 565, 372, false)} fill="none" stroke={`url(#${gold})`} strokeWidth="3" />
        <path d={archPath(800, GROUND, 244, 568, 360, false)} fill="none" stroke="#E2BC73" strokeOpacity="0.5" strokeWidth="1.2" />
      </g>

      {/* terrace & steps */}
      {ground && <rect x="0" y={GROUND} width="1600" height={1000 - GROUND} fill="#07152F" />}
      <rect x="560" y={GROUND} width="480" height="14" fill="#13284f" />
      <rect x="536" y={GROUND + 14} width="528" height="14" fill="#0f2246" />
      <rect x="512" y={GROUND + 28} width="576" height="14" fill="#0b1b3b" />
      <g stroke="#E2BC73" strokeOpacity="0.45">
        <line x1="560" y1={GROUND} x2="1040" y2={GROUND} />
        <line x1="536" y1={GROUND + 14} x2="1064" y2={GROUND + 14} />
        <line x1="512" y1={GROUND + 28} x2="1088" y2={GROUND + 28} />
      </g>
    </svg>
  );
}

/* ── Foreground dunes ───────────────────────────────────────────────────── */

export function Dunes({ className }: LayerProps) {
  const id = useId();
  return (
    <svg {...svgProps(className)}>
      <defs>
        <linearGradient id={`${id}d1`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8d7350" />
          <stop offset="0.08" stopColor="#3f3a45" />
          <stop offset="1" stopColor="#07152F" />
        </linearGradient>
        <linearGradient id={`${id}d2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9BD91" stopOpacity="0.9" />
          <stop offset="0.05" stopColor="#5a4b47" />
          <stop offset="1" stopColor="#050f24" />
        </linearGradient>
      </defs>
      <path d="M0 905 Q260 860 520 900 T1000 905 T1600 880 V1000 H0 Z" fill={`url(#${id}d1)`} opacity="0.95" />
      <path d="M0 950 Q300 905 640 945 T1220 935 T1600 925 V1000 H0 Z" fill={`url(#${id}d2)`} />
    </svg>
  );
}

/* ── Foreground carved column (anchored to a viewport edge) ─────────────── */

export function Column({ className, mirrored = false }: { className?: string; mirrored?: boolean }) {
  const id = useId();
  return (
    <svg aria-hidden viewBox="0 0 160 1000" preserveAspectRatio="xMidYMax meet" className={cx("pointer-events-none h-full w-auto", className)} style={mirrored ? { transform: "scaleX(-1)" } : undefined}>
      <defs>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#030a1a" />
          <stop offset="0.65" stopColor="#0b1a37" />
          <stop offset="0.88" stopColor="#1b3561" />
          <stop offset="1" stopColor="#06112a" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6e4f17" />
          <stop offset="0.7" stopColor="#E2BC73" />
          <stop offset="1" stopColor="#8a6526" />
        </linearGradient>
      </defs>
      {/* capital */}
      <path d="M0 120 H160 V150 L140 170 H20 L0 150 Z" fill={`url(#${id}c)`} />
      <path d="M20 170 H140 L128 196 H32 Z" fill={`url(#${id}c)`} />
      <path d="M32 196 H128 L118 222 H42 Z" fill={`url(#${id}c)`} />
      {[150, 170, 196, 222].map((y) => (
        <line key={y} x1="10" x2="150" y1={y} y2={y} stroke={`url(#${id}g)`} strokeOpacity="0.8" strokeWidth="2" />
      ))}
      {/* shaft */}
      <rect x="44" y="222" width="72" height="660" fill={`url(#${id}c)`} />
      {[56, 68, 80, 92, 104].map((x) => (
        <line key={x} x1={x} x2={x} y1="236" y2="870" stroke="#E2BC73" strokeOpacity={x > 88 ? 0.22 : 0.08} strokeWidth="1.2" />
      ))}
      {[300, 560, 840].map((y) => (
        <g key={y}>
          <rect x="40" y={y} width="80" height="12" fill={`url(#${id}g)`} opacity="0.85" />
          <rect x="40" y={y + 14} width="80" height="4" fill="#258F91" opacity="0.7" />
        </g>
      ))}
      {/* base */}
      <path d="M36 882 H124 L140 906 H20 Z" fill={`url(#${id}c)`} />
      <rect x="10" y="906" width="140" height="94" fill={`url(#${id}c)`} />
      <rect x="18" y="914" width="124" height="78" fill="none" stroke="#E2BC73" strokeOpacity="0.5" />
      <polygon points={starPoints(80, 953, 26, 12)} fill="none" stroke="#E2BC73" strokeOpacity="0.55" />
    </svg>
  );
}

/* ── Cusped arch frame across the top of a scene ────────────────────────── */

export function TopArchFrame({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg aria-hidden viewBox="0 0 1600 300" preserveAspectRatio="xMidYMin slice" className={cx("pointer-events-none absolute inset-x-0 top-0 w-full", className)}>
      <defs>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020816" />
          <stop offset="1" stopColor="#081633" />
        </linearGradient>
      </defs>
      <path fillRule="evenodd" d={`M0 0 H1600 V300 H0 Z ${cuspedArchPath(800, 300, 1480, 250, 46, 13)}`} fill={`url(#${id}f)`} />
      <path d={cuspedArchPath(800, 300, 1480, 250, 46, 13)} fill="none" stroke="#C49A4A" strokeOpacity="0.7" strokeWidth="2" />
      <path d={cuspedArchPath(800, 300, 1500, 252, 36, 13)} fill="none" stroke="#C49A4A" strokeOpacity="0.3" strokeWidth="1" />
    </svg>
  );
}
