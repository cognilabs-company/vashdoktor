// Frame-sequence config for the scroll-driven dental procedure footage — the
// jaw the implant lands in at the end of the home page's implant story.
// Frames come from the supplied video (Dental_implant_3D_animation_process…mp4,
// 240 frames @ 24fps), keyed to alpha and served as transparent WebP from
// /public/dental_seq/. The canvas draws them directly (clearRect + drawImage),
// no runtime processing.
//
// The key left a hard 0-or-255 alpha, which showed as a stair-stepped outline
// once the jaw was drawn large, so the alpha is feathered by a pixel. WebP at
// q80 carries the same picture (2/255 mean difference where the jaw actually
// is, alpha bit-exact) for a twenty-first of the weight: 672 KB a frame as PNG
// against 32 KB.

export const TOTAL_FRAMES = 240;

/** /dental_seq/frame-052.webp for frame 52 (zero-padded to 3 digits). */
export function getFrameSrc(frame: number): string {
  const n = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(frame)));
  return `/dental_seq/frame-${String(n).padStart(3, '0')}.webp`;
}

export type PhaseId = 'skanlash' | 'rejalash' | 'davolash';

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
// 01 SKANLASH (scan) 1-65 · 02 REJALASH (plan) 66-110 · 03 DAVOLASH 111-240
// The footage is an implant, but the copy frames the three steps as the path
// EVERY treatment in the clinic takes — the implant is the worked example.
export const PHASES: Phase[] = [
  {
    id: 'skanlash',
    index: '01 / 03',
    step: '01',
    title: 'SKANLASH',
    body: 'Jag‘ va tishlar 3D skanerda o‘qiladi — aniq raqamli model. Har qanday davolash shu yerdan boshlanadi.',
    start: 1,
    end: 65,
    poster: 45,
  },
  {
    id: 'rejalash',
    index: '02 / 03',
    step: '02',
    title: 'REJALASH',
    body: 'Shifokor davolashni shu modelda rejalashtiradi. Reja va narx — oldindan.',
    start: 66,
    end: 110,
    poster: 90,
  },
  {
    id: 'davolash',
    index: '03 / 03',
    step: '03',
    title: 'DAVOLASH',
    body: 'Reja aniq — davolash. Implant misolida: aniq joyga, keramik tish bilan.',
    start: 111,
    end: 240,
    poster: 236,
  },
];

/** active phase index (0-2) from the FRAME number — the single source of truth. */
export const phaseIndexFromFrame = (frame: number): number =>
  frame <= PHASES[0].end ? 0 : frame <= PHASES[1].end ? 1 : 2;

// Optional secondary copy for the DAVOLASH sub-stages (frame-driven).
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
