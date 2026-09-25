// ONE mutable view object, written every animation frame — NEVER React state.
// The scroll engine writes scroll-derived values here; the R3F frame loop and
// the DOM-projection rigs read them. Nothing in this module triggers a render.

import { clamp, damp, lerp, smoothstep, smootherstep } from '../../lib/math';

export { clamp, damp, lerp, smoothstep, smootherstep };

export type GroupKey = 'crown' | 'abutment' | 'implant' | 'gum' | 'bone';

export interface View {
  scrollY: number;
  sectionIndex: number;
  sectionProgress: number; // 0..1 within the active section
  overallProgress: number; // 0..1 across the whole experience
  scrollVelocity: number;

  pointer: { rawX: number; rawY: number; easedX: number; easedY: number };

  model: {
    travel: number; // left → right hero move, 0..1
    reassembly: number; // overall reassembly, 0..1
    homes: Record<GroupKey, number>; // per-group return, 0..1
    objectX: number; // target world-x of the whole assembly (opposite the text)
    objectScale: number; // target fit-scale (narrow viewports shrink the object)
    /** world-y the assembly is pushed DOWN by — it leaves the frame this way at
     * the end of the home page's story, and the backdrop stays put behind it. */
    exitY: number;
  };

  /** live explode amount per part id, written by the model each frame. */
  explodeById: Record<string, number>;

  camera: { frameProgress: number };
  annotations: { opacity: number };
}

export const view: View = {
  scrollY: 0,
  sectionIndex: 0,
  sectionProgress: 0,
  overallProgress: 0,
  scrollVelocity: 0,
  pointer: { rawX: 0, rawY: 0, easedX: 0, easedY: 0 },
  model: {
    travel: 0,
    reassembly: 0,
    homes: { crown: 0, abutment: 0, implant: 0, gum: 0, bone: 0 },
    objectX: -1.75,
    objectScale: 1,
    exitY: 0,
  },
  explodeById: {},
  camera: { frameProgress: 0 },
  annotations: { opacity: 0 },
};

// ---------------------------------------------------------------------------
// Scroll → state mapping
// ---------------------------------------------------------------------------

/**
 * Shared "apart" ramp for a part, staggered by its delay so the assembly peels
 * apart in sequence rather than leaving all at once.
 */
export function apartAt(op: number, delay: number): number {
  const start = 0.19 + delay * 0.13;
  return smoothstep(start, 0.4 + delay * 0.13, op);
}

/**
 * Per-group "home" windows, cascaded near the end so the parts reassemble in
 * reverse order (bone first … crown last) into the final hero shot.
 */
function homeFor(op: number): Record<GroupKey, number> {
  return {
    bone: smoothstep(0.85, 0.92, op),
    gum: smoothstep(0.86, 0.93, op),
    implant: smoothstep(0.87, 0.94, op),
    abutment: smoothstep(0.885, 0.95, op),
    crown: smoothstep(0.9, 0.965, op),
  };
}

/**
 * Final per-part explode amount = apart(delay) × (1 − home(group)).
 * Kept as a pure helper so the model, annotations and camera agree exactly.
 */
export function explodeAmount(op: number, delay: number, group: GroupKey): number {
  return apartAt(op, delay) * (1 - view.model.homes[group]);
}

/** Write all scroll-derived model state from the overall progress. */
export function applySectionScroll(op: number): void {
  const m = view.model;
  m.travel = smoothstep(0.05, 0.19, op);
  m.homes = homeFor(op);
  m.reassembly = smoothstep(0.86, 1.0, op);
  view.camera.frameProgress = op;
  view.annotations.opacity =
    smoothstep(0.28, 0.4, op) * (1 - smoothstep(0.85, 0.95, op));
}
