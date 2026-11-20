/**
 * Dissolve a rectangle (the parchment) into golden particles that rush toward
 * the viewer. One-shot, self-cleaning, ~1.6s. Returns a cancel function.
 */
export function particleDissolve(canvas: HTMLCanvasElement, rect: DOMRect, opts: { count?: number; duration?: number } = {}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const mobile = W < 640;
  const count = opts.count ?? (mobile ? 280 : 560);
  const duration = opts.duration ?? 1650;
  const cx = W / 2;
  const cy = H / 2;

  let seed = 24681357;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 32;
  const sg = sprite.getContext("2d")!;
  const grad = sg.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255,246,214,1)");
  grad.addColorStop(0.3, "rgba(226,188,115,0.8)");
  grad.addColorStop(1, "rgba(196,154,74,0)");
  sg.fillStyle = grad;
  sg.fillRect(0, 0, 32, 32);

  const ps = Array.from({ length: count }, () => {
    const x = rect.left + rand() * rect.width;
    const y = rect.top + rand() * rect.height;
    // z: 1 = on the page plane; approaches 0 as it flies toward the viewer.
    return {
      x,
      y,
      z: 1,
      vz: 0.45 + rand() * 0.75,
      drift: (rand() - 0.5) * 60,
      swirl: (rand() - 0.5) * 2.2,
      size: 1 + rand() * 2.4,
      delay: ((x - rect.left) / rect.width) * 0.22 + rand() * 0.18,
    };
  });

  const start = performance.now();
  let raf = 0;
  const frame = (now: number) => {
    const t = (now - start) / duration;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (const p of ps) {
      const local = Math.max(0, Math.min(1, (t - p.delay) / (1 - p.delay)));
      if (local <= 0) continue;
      const e = local * local;
      const z = Math.max(0.08, 1 - e * p.vz);
      const ang = p.swirl * e;
      const dx = (p.x - cx) * Math.cos(ang) - (p.y - cy) * Math.sin(ang);
      const dy = (p.x - cx) * Math.sin(ang) + (p.y - cy) * Math.cos(ang);
      const sx = cx + dx / z + p.drift * e;
      const sy = cy + dy / z - 40 * e;
      const size = (p.size / z) * 3;
      ctx.globalAlpha = Math.min(1, local * 4) * (1 - local);
      ctx.drawImage(sprite, sx - size / 2, sy - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
    if (t < 1.05) raf = requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, W, H);
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}
