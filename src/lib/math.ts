// Frame-rate-independent math helpers for the scroll-driven 3D experience.

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const inverseLerp = (a: number, b: number, v: number) =>
  a === b ? 0 : clamp((v - a) / (b - a));

/** Map v from [inMin,inMax] to [outMin,outMax], clamped. */
export const remap = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => lerp(outMin, outMax, inverseLerp(inMin, inMax, v));

export const smoothstep = (a: number, b: number, x: number) => {
  const t = inverseLerp(a, b, x);
  return t * t * (3 - 2 * t);
};

export const smootherstep = (a: number, b: number, x: number) => {
  const t = inverseLerp(a, b, x);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/**
 * Exponential smoothing toward `target`, independent of frame rate.
 * `lambda` ~ higher = snappier. dt in seconds.
 */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));
