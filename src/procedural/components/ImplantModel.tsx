import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PARTS } from '../lib/parts';
import { makeMaterial } from '../lib/material';
import { view, explodeAmount, damp, lerp } from '../lib/state';

interface Built {
  id: string;
  group: PartsGroup;
  delay: number;
  base: THREE.Vector3;
  explode: THREE.Vector3;
  mesh: THREE.Mesh;
  phase: number;
}
type PartsGroup = (typeof PARTS)[number]['group'];

interface Props {
  groupRef: React.MutableRefObject<THREE.Group | null>;
  reduced: boolean;
  onReady?: () => void;
}

/**
 * Builds the procedural implant from PARTS and animates it every frame:
 * whole-assembly travel/rotation/scale + pointer parallax, and per-part explode
 * along each part's precomputed direction with idle drift that scales with how
 * separated the part currently is. Writes each part's live explode amount to
 * `view.explodeById` for the annotation rig. No React state per frame.
 */
export function ImplantModel({ groupRef, reduced, onReady }: Props) {
  const built = useMemo<Built[]>(() => {
    return PARTS.map((def, i) => {
      const geometry = def.build();
      const material = makeMaterial(def.preset, def.overrides);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = def.id; // annotation rig looks parts up by id
      mesh.position.set(def.position[0], def.position[1], def.position[2]);
      if (def.rotation) mesh.rotation.set(def.rotation[0], def.rotation[1], def.rotation[2]);
      mesh.frustumCulled = false;
      return {
        id: def.id,
        group: def.group,
        delay: def.delay,
        base: new THREE.Vector3(...def.position),
        explode: new THREE.Vector3(...def.explode),
        mesh,
        phase: i * 1.7,
      };
    });
  }, []);

  useEffect(() => {
    onReady?.();
    return () => {
      built.forEach((b) => {
        b.mesh.geometry.dispose();
        (b.mesh.material as THREE.Material).dispose();
      });
    };
  }, [built, onReady]);

  // damped display state
  const rotY = useRef(0.4);
  const rotX = useRef(0.05);
  const curX = useRef(-1.75);
  const curScale = useRef(1);

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.05);
    const g = groupRef.current;
    if (!g) return;
    const op = view.overallProgress;
    const m = view.model;
    const travelReduce = reduced ? 0.62 : 1; // reduced-motion: shorter travel

    // ---- whole-assembly placement ----
    curX.current = damp(curX.current, m.objectX, 3.2, dt);
    curScale.current = damp(curScale.current, m.objectScale, 4, dt);
    g.position.x = curX.current;
    // NO idle bob/drift — any continuous micro-motion makes the projected DOM
    // annotation labels shiver. Motion comes only from scroll + gentle pointer.
    // The one exception is the exit: the assembly sinks out of the bottom of
    // the frame while the backdrop behind it stays where it is.
    g.position.y = -m.exitY;
    g.position.z = 0;
    g.scale.setScalar(curScale.current);

    // no pointer parallax — cursor must not rotate the model (caused label shiver)
    rotY.current = damp(rotY.current, lerp(0.32, 0.58, m.travel), 4.5, dt);
    rotX.current = damp(rotX.current, 0.05, 4.5, dt);
    g.rotation.y = rotY.current;
    g.rotation.x = rotX.current;

    // ---- per-part explode (no idle float — keeps labels rock-steady) ----
    for (const b of built) {
      const amt = explodeAmount(op, b.delay, b.group) * travelReduce;
      const p = b.mesh.position;
      p.x = damp(p.x, b.base.x + b.explode.x * amt, 7, dt);
      p.y = damp(p.y, b.base.y + b.explode.y * amt, 7, dt);
      p.z = damp(p.z, b.base.z + b.explode.z * amt, 7, dt);
      view.explodeById[b.id] = amt;
    }
  });

  return (
    <group ref={groupRef}>
      {built.map((b) => (
        <primitive key={b.id} object={b.mesh} />
      ))}
    </group>
  );
}
