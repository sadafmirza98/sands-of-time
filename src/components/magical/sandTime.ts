/**
 * The direction in which the sands of time flow, shared by every SandField.
 * `reverseSands()` (Secret 4) eases the flow to -1, holds, then eases back.
 * Read by animation loops directly — no React re-renders.
 */

let direction = 1;
let target = 1;
let holdUntil = 0;
const listeners = new Set<(reversed: boolean) => void>();

export function reverseSands(durationMs = 2600) {
  target = -1;
  holdUntil = performance.now() + durationMs;
  listeners.forEach((l) => l(true));
}

/** Called once per frame by animation loops; returns the eased direction. */
export function sandDirection(now: number): number {
  if (target === -1 && now > holdUntil) {
    target = 1;
    listeners.forEach((l) => l(false));
  }
  direction += (target - direction) * 0.06;
  return direction;
}

export function onSandsReversed(listener: (reversed: boolean) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
