// The hero "flight": a drone shot through the fjord (240 frames, 24 fps) played
// by scroll. The camera passes a headland on each side and holds at each one
// while that direction's service card breaks out of the rock face. It ends in
// thick fog, which is handed over — still white — to the implant section below.
//
// Part 1 of the footage holds two headlands: the granite cliff on the right
// (frames ~53-145) and the snow dome on the left (frames ~150-205). When part 2
// is cut in, add its two stops to STOP_SPEC — everything below derives from it.

import { SERVICE_CATEGORIES, SERVICES, type ServiceCategory } from './services';

export const TOTAL_FRAMES = 240;

/** The camera stops dead once it is deep in the fog: measured frame-to-frame,
 * motion runs at full speed into frame 213 and then drops to nothing — frames
 * 214-240 are the same still image. Playing them would spend a screenful of
 * scroll on a frozen picture and show that hard stop, so the flight ends on the
 * last frame that still moves and the fog overlay carries it from there. */
export const LAST_FRAME = 213;

/** /hero_flight/frame-060.webp for frame 60 */
export const getFrameSrc = (frame: number) =>
  `/hero_flight/frame-${String(Math.min(TOTAL_FRAMES, Math.max(1, Math.round(frame)))).padStart(3, '0')}.webp`;

export interface Stop {
  frame: number; // where the flight holds
  side: 'left' | 'right'; // which half the card sits in (the open one)
  category: (typeof SERVICE_CATEGORIES)[number];
  items: string[]; // the services in that direction
}

/** Each stop sits on a frame where one half of the picture is open water. */
const STOP_SPEC: { frame: number; side: 'left' | 'right'; key: ServiceCategory }[] = [
  { frame: 70, side: 'left', key: 'profilaktika' }, // granite cliff fills the right
  { frame: 182, side: 'right', key: 'davolash' }, // snow dome fills the left
];

export const STOPS: Stop[] = STOP_SPEC.map(({ frame, side, key }) => {
  const category = SERVICE_CATEGORIES.find((c) => c.key === key)!;
  return { frame, side, category, items: SERVICES.filter((s) => s.category === key).map((s) => s.title) };
});

// Scroll is divided into weighted segments: an opening hold on the first frame,
// then travel → hold at each stop, then the run into the fog and a last hold.
// Travel weight is proportional to the frames it covers, so the footage plays at
// one steady rate however many stops there are.
const TRAVEL_PER_FRAME = 0.03;
const HOLD_WEIGHT = 1.2;

const SEGMENTS: { frames: [number, number]; weight: number; stop?: number }[] = (() => {
  const out: { frames: [number, number]; weight: number; stop?: number }[] = [
    { frames: [1, 1], weight: 0.7 }, // headline on the opening frame
  ];
  let from = 1;
  STOPS.forEach((stop, i) => {
    out.push({ frames: [from, stop.frame], weight: (stop.frame - from) * TRAVEL_PER_FRAME });
    out.push({ frames: [stop.frame, stop.frame], weight: HOLD_WEIGHT, stop: i });
    from = stop.frame;
  });
  out.push({ frames: [from, LAST_FRAME], weight: (LAST_FRAME - from) * TRAVEL_PER_FRAME });
  out.push({ frames: [LAST_FRAME, LAST_FRAME], weight: 0.28 }); // a short beat of white
  return out;
})();

const TOTAL_WEIGHT = SEGMENTS.reduce((s, x) => s + x.weight, 0);
/** how tall the pinned section is, in viewport heights — the flight is meant to
 * be unhurried: roughly 17 px of scroll per frame while it is travelling */
export const FLIGHT_VH = Math.round(TOTAL_WEIGHT * 70) + 100;

const BOUNDS = (() => {
  const out: { start: number; end: number; frames: [number, number]; stop?: number }[] = [];
  let acc = 0;
  for (const seg of SEGMENTS) {
    const start = acc / TOTAL_WEIGHT;
    acc += seg.weight;
    out.push({ start, end: acc / TOTAL_WEIGHT, frames: seg.frames, stop: seg.stop });
  }
  return out;
})();

/** scroll progress (0..1) → frame number */
export function progressToFrame(p: number): number {
  const q = Math.min(1, Math.max(0, p));
  for (const b of BOUNDS) {
    if (q <= b.end || b === BOUNDS[BOUNDS.length - 1]) {
      const t = b.end === b.start ? 1 : (q - b.start) / (b.end - b.start);
      const [a, z] = b.frames;
      return a + (z - a) * Math.min(1, Math.max(0, t));
    }
  }
  return LAST_FRAME;
}

/** 0..1 visibility of each stop's card at this progress (fades in/out around its hold) */
export function stopOpacities(p: number): number[] {
  const out = STOPS.map(() => 0);
  for (const b of BOUNDS) {
    if (b.stop === undefined) continue;
    const pad = (b.end - b.start) * 0.55; // fade in before / out after the hold
    const a = b.start - pad;
    const z = b.end + pad;
    if (p <= a || p >= z) continue;
    const inFade = Math.min(1, (p - a) / pad);
    const outFade = Math.min(1, (z - p) / pad);
    out[b.stop] = Math.min(inFade, outFade);
  }
  return out;
}

/** 0..1 visibility of the opening headline (fades out as the flight starts) */
export const headlineOpacity = (p: number) => 1 - Math.min(1, Math.max(0, (p - BOUNDS[0].end * 0.55) / (BOUNDS[1].end * 0.5)));

/** frames worth fetching first: every stop, the ends, and a coarse ladder */
export const PRIORITY_FRAMES = [
  1, LAST_FRAME,
  ...STOPS.map((s) => s.frame),
  ...Array.from({ length: 27 }, (_, i) => 1 + i * 8),
];
