#!/usr/bin/env node
/**
 * Generates the original, reusable decorative artwork used by The Royal Sands.
 * Everything is procedural SVG — no stock imagery, no third-party assets.
 *
 *   npm run artwork
 *
 * Outputs (committed to the repo so builds need no generation step):
 *   public/textures/parchment-noise.svg  – fibrous paper grain
 *   public/textures/stone-noise.svg      – subtle carved-stone grain
 *   public/textures/khatam-tile.svg      – 8-point-star (khatam) lattice tile
 *   public/cursor/sand-cursor.svg        – static golden cursor (reduced motion)
 *   public/images/hourglass-emblem.svg   – emblem for error / 404 pages
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const r2 = (n) => Math.round(n * 100) / 100;

function star(cx, cy, outer, inner, n = 8, rot = -Math.PI / 2) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = rot + (i * Math.PI) / n;
    pts.push(`${r2(cx + Math.cos(a) * r)},${r2(cy + Math.sin(a) * r)}`);
  }
  return pts.join(" ");
}

const files = {
  "public/textures/parchment-noise.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="280" viewBox="0 0 280 280">
  <filter id="n" x="0" y="0">
    <feTurbulence type="fractalNoise" baseFrequency="0.9 0.55" numOctaves="3" seed="11" stitchTiles="stitch"/>
    <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.33  0 0 0 0 0.16  0 0 0 0.16 0"/>
  </filter>
  <filter id="f" x="0" y="0">
    <feTurbulence type="turbulence" baseFrequency="0.012 0.06" numOctaves="2" seed="3" stitchTiles="stitch"/>
    <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.4  0 0 0 0 0.2  0 0 0 0.07 0"/>
  </filter>
  <rect width="280" height="280" filter="url(#n)"/>
  <rect width="280" height="280" filter="url(#f)"/>
</svg>
`,
  "public/textures/stone-noise.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
  <filter id="s" x="0" y="0">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" seed="23" stitchTiles="stitch"/>
    <feColorMatrix values="0 0 0 0 0.75  0 0 0 0 0.62  0 0 0 0 0.4  0 0 0 0.07 0"/>
  </filter>
  <rect width="320" height="320" filter="url(#s)"/>
</svg>
`,
  "public/textures/khatam-tile.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72">
  <g fill="none" stroke="#C49A4A" stroke-opacity="0.22" stroke-width="1">
    <polygon points="${star(36, 36, 26, 12.5)}"/>
    <polygon points="${star(0, 0, 13, 6.2)}"/>
    <polygon points="${star(72, 0, 13, 6.2)}"/>
    <polygon points="${star(0, 72, 13, 6.2)}"/>
    <polygon points="${star(72, 72, 13, 6.2)}"/>
    <path d="M13 0 L36 10 L59 0 M13 72 L36 62 L59 72 M0 13 L10 36 L0 59 M72 13 L62 36 L72 59"/>
  </g>
  <circle cx="36" cy="36" r="2.2" fill="#258F91" fill-opacity="0.35"/>
</svg>
`,
  "public/cursor/sand-cursor.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <defs>
    <radialGradient id="g" cx="45%" cy="40%" r="65%">
      <stop offset="0" stop-color="#FFF8E1"/><stop offset="0.5" stop-color="#E2BC73"/><stop offset="1" stop-color="#8a6526"/>
    </radialGradient>
  </defs>
  <polygon points="${star(12, 12, 11, 5)}" fill="url(#g)" stroke="#07152F" stroke-width="1"/>
  <circle cx="12" cy="12" r="2" fill="#FFF8E1"/>
</svg>
`,
  "public/images/hourglass-emblem.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="320" viewBox="0 0 240 320">
  <defs>
    <linearGradient id="b" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#5a3f12"/><stop offset="0.5" stop-color="#F6DB9A"/><stop offset="1" stop-color="#5a3f12"/>
    </linearGradient>
    <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFE7AE"/><stop offset="1" stop-color="#D9A24F"/>
    </linearGradient>
    <radialGradient id="h" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#E2BC73" stop-opacity="0.35"/><stop offset="1" stop-color="#E2BC73" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="120" cy="160" rx="120" ry="160" fill="url(#h)"/>
  <polygon points="${star(120, 160, 112, 92, 16)}" fill="none" stroke="#C49A4A" stroke-opacity="0.35"/>
  <path d="M74 52 C74 112 112 136 118 160 L122 160 C128 136 166 112 166 52 Z" fill="#ffffff" fill-opacity="0.06" stroke="#F6DB9A" stroke-opacity="0.6"/>
  <path d="M118 160 C112 184 74 208 74 268 L166 268 C166 208 128 184 122 160 Z" fill="#ffffff" fill-opacity="0.06" stroke="#F6DB9A" stroke-opacity="0.6"/>
  <path d="M90 100 Q120 108 150 100 C144 124 128 140 120 156 C112 140 96 124 90 100 Z" fill="url(#s)"/>
  <path d="M76 268 Q120 210 164 268 Z" fill="url(#s)"/>
  <line x1="120" y1="158" x2="120" y2="236" stroke="#FFE7AE" stroke-width="2" stroke-dasharray="4 6"/>
  <rect x="58" y="34" width="10" height="252" fill="url(#b)"/>
  <rect x="172" y="34" width="10" height="252" fill="url(#b)"/>
  <rect x="40" y="24" width="160" height="18" rx="4" fill="url(#b)"/>
  <rect x="40" y="278" width="160" height="18" rx="4" fill="url(#b)"/>
  <rect x="50" y="29" width="140" height="8" rx="2" fill="#258F91"/>
  <rect x="50" y="283" width="140" height="8" rx="2" fill="#258F91"/>
</svg>
`,
};

for (const [rel, content] of Object.entries(files)) {
  const out = join(root, rel);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, content);
  console.log("✓", rel);
}
