import * as THREE from 'three';
import {
  abutmentGeometry,
  crownGeometry,
  screwGeometry,
  threadedImplant,
} from './geometry';
import type { MaterialParams, PresetName } from './material';

export type GroupName = 'crown' | 'abutment' | 'implant';

export interface PartDef {
  id: string;
  /** assembly group this part belongs to (drives its explode value). */
  group: GroupName;
  preset: PresetName;
  build: () => THREE.BufferGeometry;
  /** assembled position on the shared vertical axis. */
  position: [number, number, number];
  rotation?: [number, number, number];
  /** offset applied at full explode, fanning outward along the part's axis. */
  explode: [number, number, number];
  /** 0..1 stagger — when in the shared "apart" window this part starts leaving. */
  delay: number;
  overrides?: Partial<MaterialParams>;
}

// ---------------------------------------------------------------------------
// Four-part implant system matching the reference diagram, top → bottom:
//   ceramic CROWN → titanium ABUTMENT (+ internal SCREW) → threaded FIXTURE.
// No gum / bone — the reference is a clean exploded product diagram.
// ---------------------------------------------------------------------------

export const PARTS: PartDef[] = [
  {
    id: 'crown',
    group: 'crown',
    preset: 'CERAMIC',
    build: () =>
      crownGeometry({
        height: 1.22,
        bellyRadius: 1.12,
        cervicalRadius: 0.68,
        ovality: 0.9,
        cuspHeight: 0.22,
      }),
    position: [0, 2.54, 0],
    explode: [0, 2.4, 0],
    delay: 0.0,
  },
  {
    id: 'abutment',
    group: 'abutment',
    preset: 'TITANIUM',
    build: () =>
      abutmentGeometry({
        height: 1.15,
        baseRadius: 0.52,
        topRadius: 0.3,
      }),
    position: [0, 1.42, 0],
    explode: [0, 1.2, 0],
    delay: 0.18,
  },
  {
    id: 'screw',
    group: 'abutment',
    preset: 'TITANIUM',
    build: () => screwGeometry({ length: 1.05, shaftRadius: 0.12, headRadius: 0.2 }),
    position: [0, 0.66, 0],
    // fans out to the side (like the SCREW in the reference), slightly up
    explode: [-1.7, 0.28, 0],
    delay: 0.36,
    overrides: { roughness: 0.2 },
  },
  {
    id: 'implant',
    group: 'implant',
    preset: 'TITANIUM',
    build: () =>
      threadedImplant({
        length: 2.85,
        topRadius: 0.5,
        apexRadius: 0.16,
        turns: 12,
        threadDepth: 0.085,
        platform: true,
      }),
    position: [0, -0.24, 0],
    explode: [0, -0.35, 0],
    delay: 0.52,
  },
];

/**
 * Focus Y (group-local, on the shared axis) the camera centres on per section.
 * These track each part's EXPLODED centre so the focus follows the separated
 * component.
 */
export const FOCUS = {
  assembled: 0.9,
  full: 1.4, // middle of the exploded column
  crown: 5.0,
  abutment: 2.62,
  screw: 0.95,
  implant: -0.55,
  threads: -1.4,
};
