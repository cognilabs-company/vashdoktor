import { useState } from 'react';

/**
 * Can this browser actually give us a WebGL context?
 *
 * Not the same question as "is the code running in a modern browser": hardware
 * acceleration can be off, the GPU can be blocklisted, or the driver can refuse
 * — and in all of those cases react-three-fiber renders nothing at all. Every
 * 3D block on the site asks this once and shows its baked image sequence
 * instead when the answer is no.
 */
export function detectWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl =
      c.getContext('webgl2') ||
      c.getContext('webgl') ||
      (c.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return false;
    // some software stacks hand back a context that cannot compile anything
    const ok = !!gl.getParameter(gl.VERSION);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

/** Stable for the life of the component — the answer cannot change mid-session. */
export function useWebGL(): boolean {
  const [ok] = useState(detectWebGL);
  return ok;
}
