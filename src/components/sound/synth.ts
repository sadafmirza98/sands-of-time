/**
 * Synthesised sound effects (Web Audio API). No audio files, no music.
 * The AudioContext is only created after the guest switches sound on — a
 * user gesture — so nothing can ever autoplay.
 */

export type SoundName = "seal" | "paper" | "chime" | "whoosh" | "sparkle" | "door" | "rewind";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;

export function ensureAudio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 4;
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(comp).connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noise.getChannelData(0);
    // Deterministic LCG noise (no Math.random needed for a static buffer).
    let seed = 1234567;
    for (let i = 0; i < data.length; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      data[i] = (seed / 0xffffffff) * 2 - 1;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function env(g: GainNode, t: number, attack: number, peak: number, decay: number) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function noiseBurst(c: AudioContext, t: number, opts: { type: BiquadFilterType; freq: number; q?: number; peak: number; attack: number; decay: number; sweepTo?: number }) {
  if (!noise || !master) return;
  const src = c.createBufferSource();
  src.buffer = noise;
  const filter = c.createBiquadFilter();
  filter.type = opts.type;
  filter.frequency.setValueAtTime(opts.freq, t);
  if (opts.sweepTo) filter.frequency.exponentialRampToValueAtTime(opts.sweepTo, t + opts.attack + opts.decay);
  filter.Q.value = opts.q ?? 1;
  const g = c.createGain();
  env(g, t, opts.attack, opts.peak, opts.decay);
  src.connect(filter).connect(g).connect(master);
  src.start(t, Math.abs((t * 7.3) % 1.5));
  src.stop(t + opts.attack + opts.decay + 0.05);
}

function tone(c: AudioContext, t: number, freq: number, opts: { type?: OscillatorType; peak: number; attack: number; decay: number; glideTo?: number }) {
  if (!master) return;
  const osc = c.createOscillator();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(freq, t);
  if (opts.glideTo) osc.frequency.exponentialRampToValueAtTime(opts.glideTo, t + opts.attack + opts.decay);
  const g = c.createGain();
  env(g, t, opts.attack, opts.peak, opts.decay);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + opts.attack + opts.decay + 0.05);
}

const PENTATONIC = [1046.5, 1174.66, 1318.51, 1567.98, 1760, 2093, 2349.32, 2637.02];

export function playSynth(name: SoundName) {
  const c = ensureAudio();
  if (!c) return;
  const t = c.currentTime + 0.01;
  switch (name) {
    case "seal": {
      noiseBurst(c, t, { type: "bandpass", freq: 2600, q: 0.9, peak: 0.6, attack: 0.002, decay: 0.07 });
      noiseBurst(c, t + 0.045, { type: "bandpass", freq: 1800, q: 1.2, peak: 0.4, attack: 0.002, decay: 0.09 });
      noiseBurst(c, t + 0.11, { type: "highpass", freq: 3200, peak: 0.18, attack: 0.002, decay: 0.05 });
      tone(c, t, 120, { peak: 0.5, attack: 0.004, decay: 0.28, glideTo: 48 });
      break;
    }
    case "paper": {
      for (let i = 0; i < 3; i++) {
        noiseBurst(c, t + i * 0.16, { type: "highpass", freq: 1400 + i * 300, peak: 0.16, attack: 0.04, decay: 0.16, sweepTo: 4200 });
      }
      break;
    }
    case "chime": {
      [880, 1108.73, 1318.51, 1760].forEach((f, i) => {
        tone(c, t + i * 0.09, f, { peak: 0.16, attack: 0.008, decay: 1.8 });
        tone(c, t + i * 0.09, f * 2.01, { type: "triangle", peak: 0.04, attack: 0.008, decay: 1.1 });
      });
      break;
    }
    case "whoosh": {
      noiseBurst(c, t, { type: "bandpass", freq: 380, q: 1.4, peak: 0.32, attack: 0.45, decay: 0.85, sweepTo: 2600 });
      break;
    }
    case "sparkle": {
      for (let i = 0; i < 9; i++) {
        const f = PENTATONIC[(i * 5 + 3) % PENTATONIC.length] * (i % 3 === 0 ? 2 : 1);
        tone(c, t + i * 0.045, f, { peak: 0.07, attack: 0.004, decay: 0.32 });
      }
      break;
    }
    case "door": {
      if (!master) return;
      const osc = c.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(62, t);
      osc.frequency.linearRampToValueAtTime(48, t + 1.8);
      const lfo = c.createOscillator();
      lfo.frequency.value = 7;
      const lfoGain = c.createGain();
      lfoGain.gain.value = 6;
      lfo.connect(lfoGain).connect(osc.frequency);
      const lp = c.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 340;
      const g = c.createGain();
      env(g, t, 0.25, 0.22, 1.7);
      osc.connect(lp).connect(g).connect(master);
      osc.start(t);
      lfo.start(t);
      osc.stop(t + 2.1);
      lfo.stop(t + 2.1);
      noiseBurst(c, t, { type: "lowpass", freq: 220, peak: 0.35, attack: 0.3, decay: 1.6 });
      tone(c, t + 0.9, 660, { peak: 0.05, attack: 0.3, decay: 1.6 });
      break;
    }
    case "rewind": {
      tone(c, t, 220, { type: "triangle", peak: 0.14, attack: 0.55, decay: 0.12, glideTo: 1500 });
      noiseBurst(c, t, { type: "bandpass", freq: 2400, q: 2, peak: 0.16, attack: 0.55, decay: 0.15, sweepTo: 500 });
      for (let i = 0; i < 5; i++) tone(c, t + 0.6 + i * 0.05, PENTATONIC[7 - i], { peak: 0.06, attack: 0.004, decay: 0.4 });
      break;
    }
  }
}
