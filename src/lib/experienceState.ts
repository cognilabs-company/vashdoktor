// ONE mutable view object shared across the experience. High-frequency scroll +
// 3D transforms are written here every frame — NEVER into React state.

export interface ExperienceView {
  scrollY: number;
  sectionIndex: number;
  sectionProgress: number; // 0..1 within the active section
  overallProgress: number; // 0..1 across the whole experience
  scrollVelocity: number;

  pointer: { rawX: number; rawY: number; easedX: number; easedY: number };

  model: {
    travelProgress: number; // left -> right hero move
    explodeProgress: number; // overall explode 0..1
    crownExplode: number;
    abutmentExplode: number;
    implantExplode: number;
    reassemblyProgress: number;
  };

  camera: { frameProgress: number };

  annotations: { opacity: number };
}

export const view: ExperienceView = {
  scrollY: 0,
  sectionIndex: 0,
  sectionProgress: 0,
  overallProgress: 0,
  scrollVelocity: 0,
  pointer: { rawX: 0, rawY: 0, easedX: 0, easedY: 0 },
  model: {
    travelProgress: 0,
    explodeProgress: 0,
    crownExplode: 0,
    abutmentExplode: 0,
    implantExplode: 0,
    reassemblyProgress: 0,
  },
  camera: { frameProgress: 0 },
  annotations: { opacity: 0 },
};
