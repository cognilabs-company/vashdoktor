import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FOCUS } from '../lib/parts';
import { SECTION_RANGES } from '../lib/content';
import { view, damp, lerp, smootherstep, clamp } from '../lib/state';

interface Frame {
  dist: number;
  azimuth: number; // Y-orbit angle (rad) — three-quarter view
  pitch: number; // look-down angle (rad)
  focusY: number; // group-local Y the camera centres on
}

// One shot per section (index-aligned with SECTIONS): hero → anatomy → crown →
// abutment → implant → threads → gum → bone → reassembly.
const FRAMES: Frame[] = [
  { dist: 13.6, azimuth: 0.5, pitch: 0.12, focusY: 0.85 }, // assembled — centred on the model's mass
  { dist: 16.0, azimuth: 0.34, pitch: 0.12, focusY: FOCUS.full }, // anatomy (full exploded)
  { dist: 6.4, azimuth: 0.6, pitch: 0.08, focusY: FOCUS.crown }, // crown
  { dist: 5.6, azimuth: 0.5, pitch: 0.06, focusY: FOCUS.abutment }, // abutment
  { dist: 5.6, azimuth: 0.5, pitch: 0.05, focusY: FOCUS.screw }, // screw
  { dist: 7.4, azimuth: 0.42, pitch: 0.04, focusY: FOCUS.implant }, // fixture
  { dist: 5.2, azimuth: 0.5, pitch: -0.04, focusY: FOCUS.threads }, // threads
  { dist: 13.0, azimuth: 0.52, pitch: 0.12, focusY: 0.85 }, // reassembly hero
];

const CENTERS = SECTION_RANGES.map((r) => r.center);

function sampleFrame(op: number, out: Frame): Frame {
  // clamp outside the keyframe range
  if (op <= CENTERS[0]) return Object.assign(out, FRAMES[0]);
  const last = CENTERS.length - 1;
  if (op >= CENTERS[last]) return Object.assign(out, FRAMES[last]);

  let i = 0;
  while (i < last - 1 && op > CENTERS[i + 1]) i++;
  const a = FRAMES[i];
  const b = FRAMES[i + 1];
  const seg = (op - CENTERS[i]) / (CENTERS[i + 1] - CENTERS[i] || 1);
  // hold ~15% of the segment so section text lands before the camera moves
  const t = smootherstep(0.15, 1, clamp(seg));
  out.dist = lerp(a.dist, b.dist, t);
  out.azimuth = lerp(a.azimuth, b.azimuth, t);
  out.pitch = lerp(a.pitch, b.pitch, t);
  out.focusY = lerp(a.focusY, b.focusY, t);
  return out;
}

interface Props {
  groupRef: React.MutableRefObject<THREE.Group | null>;
  reduced: boolean;
}

/**
 * Drives the camera through one framed shot per section. The camera always
 * centres on x = 0, so the assembly's own x-offset (set opposite the text)
 * places it left/right in the composition without the camera chasing it.
 */
export function CameraRig({ groupRef, reduced }: Props) {
  const camera = useThree((s) => s.camera);
  const cur = useRef<Frame>({ dist: 10, azimuth: 0.5, pitch: 0.12, focusY: FOCUS.assembled });
  const target = useRef<Frame>({ dist: 10, azimuth: 0.5, pitch: 0.12, focusY: FOCUS.assembled });
  const lookAt = useRef(new THREE.Vector3(0, FOCUS.assembled, 0));

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const g = groupRef.current;
    const tf = sampleFrame(view.camera.frameProgress, target.current);
    const lambda = reduced ? 12 : 3.6;
    cur.current.dist = damp(cur.current.dist, tf.dist, lambda, dt);
    cur.current.azimuth = damp(cur.current.azimuth, tf.azimuth, lambda, dt);
    cur.current.pitch = damp(cur.current.pitch, tf.pitch, lambda, dt);
    cur.current.focusY = damp(cur.current.focusY, tf.focusY, lambda, dt);

    const scale = g ? g.scale.x : 1;
    const swayY = g ? g.position.y : 0;
    const worldFocusY = cur.current.focusY * scale + swayY;

    const { dist, azimuth, pitch } = cur.current;
    // no pointer parallax — the cursor must not move the camera (it made the
    // projected labels shiver).
    camera.position.set(
      Math.sin(azimuth) * Math.cos(pitch) * dist,
      worldFocusY + Math.sin(pitch) * dist,
      Math.cos(azimuth) * Math.cos(pitch) * dist
    );
    lookAt.current.set(0, worldFocusY, 0);
    camera.lookAt(lookAt.current);
  });

  return null;
}
