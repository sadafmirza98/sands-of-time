import { r2 } from "@/components/artwork/random";

/**
 * Path builders for original Persian architectural forms.
 * All return SVG path data in the caller's coordinate space.
 */

/** Four-centred Persian pointed arch, open at the bottom (for windows/doors use `closed`). */
export function archPath(cx: number, base: number, width: number, spring: number, apex: number, closed = true): string {
  const h = width / 2;
  const rise = spring - apex;
  const d = [
    `M${r2(cx - h)} ${r2(base)}`,
    `L${r2(cx - h)} ${r2(spring)}`,
    `C${r2(cx - h)} ${r2(spring - rise * 0.58)} ${r2(cx - h * 0.34)} ${r2(apex + rise * 0.22)} ${r2(cx)} ${r2(apex)}`,
    `C${r2(cx + h * 0.34)} ${r2(apex + rise * 0.22)} ${r2(cx + h)} ${r2(spring - rise * 0.58)} ${r2(cx + h)} ${r2(spring)}`,
    `L${r2(cx + h)} ${r2(base)}`,
  ];
  return d.join(" ") + (closed ? " Z" : "");
}

/** Slightly pointed Persian dome on a base line. */
export function domePath(cx: number, base: number, r: number, height = 1.5): string {
  return [
    `M${r2(cx - r)} ${r2(base)}`,
    `C${r2(cx - r)} ${r2(base - r * 1.05)} ${r2(cx - r * 0.25)} ${r2(base - r * height * 0.88)} ${r2(cx)} ${r2(base - r * height)}`,
    `C${r2(cx + r * 0.25)} ${r2(base - r * height * 0.88)} ${r2(cx + r)} ${r2(base - r * 1.05)} ${r2(cx + r)} ${r2(base)}`,
    "Z",
  ].join(" ");
}

/** Bulbous onion dome. */
export function onionDomePath(cx: number, base: number, r: number): string {
  return [
    `M${r2(cx - r * 0.82)} ${r2(base)}`,
    `C${r2(cx - r * 1.45)} ${r2(base - r * 0.8)} ${r2(cx - r * 0.3)} ${r2(base - r * 1.45)} ${r2(cx)} ${r2(base - r * 2.15)}`,
    `C${r2(cx + r * 0.3)} ${r2(base - r * 1.45)} ${r2(cx + r * 1.45)} ${r2(base - r * 0.8)} ${r2(cx + r * 0.82)} ${r2(base)}`,
    "Z",
  ].join(" ");
}

/** n-pointed star polygon points. */
export function starPoints(cx: number, cy: number, outer: number, inner: number, n = 8, rotation = -Math.PI / 2): string {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = rotation + (i * Math.PI) / n;
    pts.push(`${r2(cx + Math.cos(a) * r)},${r2(cy + Math.sin(a) * r)}`);
  }
  return pts.join(" ");
}

/** Cusped (multifoil) arch — a row of small lobes along a pointed arch. */
export function cuspedArchPath(cx: number, base: number, width: number, spring: number, apex: number, lobes = 7): string {
  const h = width / 2;
  const pts: [number, number][] = [];
  const rise = spring - apex;
  // sample the arch curve
  const samples = lobes * 2;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const side = t < 0.5 ? -1 : 1;
    const u = t < 0.5 ? t * 2 : (1 - t) * 2; // 0 at springers → 1 at apex
    const x = cx + side * h * (1 - Math.pow(u, 1.6) * 1);
    const y = spring - rise * Math.sin((u * Math.PI) / 2);
    pts.push([x, y]);
  }
  let d = `M${r2(cx - h)} ${r2(base)} L${r2(pts[0][0])} ${r2(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    const nx = -(y1 - y0);
    const ny = x1 - x0;
    const len = Math.hypot(nx, ny) || 1;
    const bulge = 0.35 * Math.hypot(x1 - x0, y1 - y0);
    d += ` Q${r2(mx + (nx / len) * bulge)} ${r2(my + (ny / len) * bulge)} ${r2(x1)} ${r2(y1)}`;
  }
  d += ` L${r2(cx + h)} ${r2(base)} Z`;
  return d;
}
