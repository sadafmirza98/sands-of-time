"use client";

/**
 * A one-shot swirl of golden sand from a screen point (DOM particles, no
 * canvas). Used by Secret 1. Static glow when reduced motion is requested.
 */
export function sandSwirl(x: number, y: number, reduced: boolean) {
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:0;height:0;z-index:150;pointer-events:none;`;
  document.body.appendChild(layer);

  if (reduced) {
    const glow = document.createElement("div");
    glow.style.cssText =
      "position:absolute;left:-60px;top:-60px;width:120px;height:120px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,241,201,.85),rgba(226,188,115,.35),transparent);";
    layer.appendChild(glow);
    window.setTimeout(() => layer.remove(), 1600);
    return;
  }

  const count = window.innerWidth < 640 ? 46 : 80;
  let seed = 97531;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    const size = 2 + rand() * 4;
    const turns = 0.6 + rand() * 1.1;
    const radius = 40 + rand() * 150;
    const start = rand() * 360;
    p.style.cssText = `position:absolute;left:${-size / 2}px;top:${-size / 2}px;width:${size}px;height:${size}px;border-radius:50%;background:${rand() > 0.4 ? "#FFE7AE" : "#E2BC73"};box-shadow:0 0 ${size * 2}px rgba(226,188,115,.9);`;
    layer.appendChild(p);
    const frames: Keyframe[] = [];
    const steps = 14;
    for (let s = 0; s <= steps; s++) {
      const k = s / steps;
      const a = ((start + k * turns * 360) * Math.PI) / 180;
      const r = radius * Math.sin(k * Math.PI * 0.9) + k * 20;
      frames.push({ transform: `translate(${Math.cos(a) * r}px, ${Math.sin(a) * r * 0.7 - k * 90}px) scale(${1 - k * 0.6})`, opacity: k < 0.1 ? k * 10 : 1 - k });
    }
    p.animate(frames, { duration: 1400 + rand() * 900, easing: "cubic-bezier(.2,.7,.3,1)", delay: rand() * 120, fill: "forwards" });
  }
  window.setTimeout(() => layer.remove(), 2700);
}
