// Frame-sequence config for the scroll-driven dental procedure section.
// Frames come from the supplied video (Dental_implant_3D_animation_process…mp4,
// 240 frames @ 24fps): each frame extracted and keyed to alpha (checkerboard
// backdrop removed) → served VERBATIM as transparent RGBA PNG from
// /public/dental_video_rgba/. Canvas draws them directly (clearRect + drawImage),
// no runtime processing.

export const TOTAL_FRAMES = 240;

/** /dental_video_rgba/ezgif-frame-052.png for frame 52 (zero-padded to 3 digits). */
export function getFrameSrc(frame: number): string {
  const n = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(frame)));
  return `/dental_video_rgba/ezgif-frame-${String(n).padStart(3, '0')}.png`;
}

export type PhaseId = 'skanlash' | 'rejalash' | 'ornatish';

export interface Phase {
  id: PhaseId;
  index: string; // "01 / 03"
  step: string; // "01"
  title: string;
  body: string;
  /** inclusive frame range [start, end] this phase owns. */
  start: number;
  end: number;
  /** representative frame for reduced-motion / posters. */
  poster: number;
}

// Phase boundaries mapped to the video's pacing (240 frames):
// 01 SKANLASH (scan) 1-65 · 02 REJALASH (implant plan) 66-110 · 03 O'RNATISH 111-240
export const PHASES: Phase[] = [
  {
    id: 'skanlash',
    index: '01 / 03',
    step: '01',
    title: 'SKANLASH',
    body: '3D skanlash orqali jag‘ va tishlarning aniq raqamli modeli yaratiladi.',
    start: 1,
    end: 65,
    poster: 45,
  },
  {
    id: 'rejalash',
    index: '02 / 03',
    step: '02',
    title: 'REJALASH',
    body: 'Implantning joylashuvi, burchagi va chuqurligi oldindan aniq rejalashtiriladi.',
    start: 66,
    end: 110,
    poster: 90,
  },
  {
    id: 'ornatish',
    index: '03 / 03',
    step: '03',
    title: 'O‘RNATISH',
    body: 'Implant rejalashtirilgan pozitsiyaga o‘rnatiladi va tabiiy ko‘rinishdagi crown bilan yakunlanadi.',
    start: 111,
    end: 240,
    poster: 236,
  },
];

/** active phase index (0-2) from the FRAME number — the single source of truth. */
export const phaseIndexFromFrame = (frame: number): number =>
  frame <= PHASES[0].end ? 0 : frame <= PHASES[1].end ? 1 : 2;

// Optional secondary copy for the O'RNATISH sub-stages (frame-driven).
export const subCopyForFrame = (frame: number): string => {
  if (frame <= 110) return '';
  if (frame <= 135) return 'Rejalashtirilgan joy tayyorlanadi.';
  if (frame <= 175) return 'Implant rejalashtirilgan pozitsiyaga aniq o‘rnatiladi.';
  if (frame <= 215) return 'Yakuniy keramika tish tabiiy shaklga moslashtiriladi.';
  return 'Tabiiy ko‘rinish. To‘liq tiklangan tabassum.';
};

// last 8% of scroll holds the final frame (see ProcedureSequence)
export const ANIMATION_END = 0.92;

/** frames worth loading first: first, phase + sub-stage boundaries, last. */
export const PRIORITY_FRAMES = [1, 65, 66, 110, 111, 135, 175, 215, 216, 240];
