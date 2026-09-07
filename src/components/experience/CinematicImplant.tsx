import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { view } from '../../lib/experienceState';
import { ANNOTATIONS } from '../../lib/experienceContent';
import { clamp, damp, lerp, smootherstep } from '../../lib/math';

const MODEL_URL = '/models/implant_blender.glb';

// Exploded offsets in MODEL-LOCAL units (model is ~4 units tall). Derived from
// the assembled transforms captured at load — matches the reference layout:
// Crown up highest, Abutment below it, Screw out to the side, Fixture at base.
const OFFSETS: Record<string, [number, number, number]> = {
  Crown: [0, 1.7, 0],
  Abutment: [0, 0.82, 0],
  Screw: [-0.62, 0.4, 0],
  Implant: [0, -0.32, 0],
  Gum: [0, 0, 0],
  Bone: [0, 0, 0],
};

// Which explode channel drives each part
const CHANNEL: Record<string, 'crownExplode' | 'abutmentExplode' | 'implantExplode'> = {
  Crown: 'crownExplode',
  Abutment: 'abutmentExplode',
  Screw: 'abutmentExplode',
  Implant: 'implantExplode',
  Gum: 'implantExplode',
  Bone: 'implantExplode',
};

interface Handle {
  node: THREE.Object3D;
  base: THREE.Vector3;
  drift: number;
}

// camera keyframes: [progress, distance, targetY, orbitX]
const CAM: [number, number, number, number][] = [
  [0.0, 12.0, 0.2, -0.16],
  [0.22, 10.6, 0.35, 0.06],
  [0.44, 13.6, 0.7, 0.0],
  [0.58, 9.4, -0.25, 0.12],
  [0.72, 8.8, 0.5, -0.06],
  [0.84, 8.2, 1.7, -0.1],
  [0.98, 11.4, 0.4, 0.22],
];

function sampleCam(p: number) {
  let i = 0;
  while (i < CAM.length - 2 && p > CAM[i + 1][0]) i++;
  const a = CAM[i];
  const b = CAM[i + 1];
  // hold the first 14% of each segment, then ease
  const seg = (p - a[0]) / (b[0] - a[0] || 1);
  const t = smootherstep(0.14, 1, clamp(seg));
  return {
    dist: lerp(a[1], b[1], t),
    targetY: lerp(a[2], b[2], t),
    orbitX: lerp(a[3], b[3], t),
  };
}

export function CinematicImplant({
  reduced,
  annotationRefs,
}: {
  reduced: boolean;
  annotationRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const { camera, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Clone once, fit + centre, capture assembled transforms
  const { model, handles, fit } = useMemo(() => {
    const clone = scene.clone(true);
    const coreBox = new THREE.Box3();
    ['Crown', 'Abutment', 'Screw', 'Implant', 'Gum'].forEach((n) => {
      const o = clone.getObjectByName(n);
      if (o) coreBox.expandByObject(o);
    });
    const box = coreBox.isEmpty() ? new THREE.Box3().setFromObject(clone) : coreBox;
    const size3 = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size3);
    box.getCenter(center);
    const scale = 4.4 / (Math.max(size3.x, size3.y, size3.z) || 1);
    clone.position.sub(center);

    // clone materials per-mesh (isolate edits) + ensure they respond to the studio IBL
    clone.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
        const list = (Array.isArray(m.material) ? m.material : [m.material]).filter(Boolean);
        const mats = list.map((mm) => {
          const mat = (mm as THREE.MeshStandardMaterial).clone();
          mat.envMapIntensity = 1.7; // GLB bakes 0 → metals go black without this
          mat.needsUpdate = true;
          return mat;
        });
        if (mats.length) m.material = mats.length === 1 ? mats[0] : mats;
      }
    });
    // tame the ceramic crown so it keeps form instead of blowing out to white
    clone.getObjectByName('Crown')?.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        const list = Array.isArray(m.material) ? m.material : [m.material];
        list.forEach((mm) => {
          const mat = mm as THREE.MeshStandardMaterial;
          mat.color.multiplyScalar(0.88);
          mat.envMapIntensity = 0.45;
          mat.roughness = Math.min(1, Math.max(mat.roughness ?? 0.4, 0.42));
          mat.metalness = 0;
        });
      }
    });
    // ghost the bone so the fixture reads inside the jaw cutaway
    clone.getObjectByName('Bone')?.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        const list = Array.isArray(m.material) ? m.material : [m.material];
        list.forEach((mm) => {
          const mat = mm as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = 0.3;
          mat.depthWrite = false;
          mat.envMapIntensity = 0.4;
        });
      }
    });

    const handles: Handle[] = [];
    Object.keys(OFFSETS).forEach((name, idx) => {
      const node = clone.getObjectByName(name);
      if (node) handles.push({ node, base: node.position.clone(), drift: idx * 1.7 });
    });
    return { model: clone, handles, fit: scale };
  }, [scene]);

  // reusable temporaries — no per-frame allocation
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const tmpTarget = useMemo(() => new THREE.Vector3(), []);
  const curTargetY = useRef(0.2);
  const curDist = useRef(12);
  const curOrbitX = useRef(-0.16);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const m = view.model;
    const g = groupRef.current;
    if (!g) return;

    // ---- whole-model travel (left -> right), subtle scale + rotation ----
    const travel = m.travelProgress;
    const targetX = lerp(-1.5, 1.15, travel);
    const targetScale = fit * lerp(0.94, 1.06, travel);
    g.position.x = damp(g.position.x, targetX, 6, dt);
    g.position.y = damp(g.position.y, reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.5) * 0.03, 6, dt);
    const s = damp(g.scale.x, targetScale, 6, dt);
    g.scale.setScalar(s);
    const idleRot = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.22) * 0.012;
    const pointerRot = reduced ? 0 : view.pointer.easedX * 0.06;
    g.rotation.y = damp(g.rotation.y, lerp(0.28, 0.62, travel) + idleRot + pointerRot, 5, dt);
    g.rotation.x = damp(g.rotation.x, 0.04 + (reduced ? 0 : view.pointer.easedY * 0.04), 5, dt);

    // ---- per-part explode (staggered) ----
    for (const h of handles) {
      const name = h.node.name;
      const off = OFFSETS[name];
      const amt = m[CHANNEL[name] ?? 'implantExplode'];
      let dx = off[0] * amt;
      let dy = off[1] * amt;
      let dz = off[2] * amt;
      if (!reduced && amt > 0.02) {
        // tiny independent float proportional to how exploded the part is
        const f = amt * 0.03;
        dy += Math.sin(state.clock.elapsedTime * 0.9 + h.drift) * f;
      }
      h.node.position.x = damp(h.node.position.x, h.base.x + dx, 8, dt);
      h.node.position.y = damp(h.node.position.y, h.base.y + dy, 8, dt);
      h.node.position.z = damp(h.node.position.z, h.base.z + dz, 8, dt);
      // the jaw-bone block only appears once the model opens (reference has none)
      if (name === 'Bone') h.node.visible = m.explodeProgress > 0.25;
    }

    // ---- camera rig ----
    const c = sampleCam(view.camera.frameProgress);
    curDist.current = damp(curDist.current, c.dist, 4, dt);
    curTargetY.current = damp(curTargetY.current, c.targetY, 4, dt);
    curOrbitX.current = damp(curOrbitX.current, c.orbitX, 4, dt);
    const px = reduced ? 0 : view.pointer.easedX * 0.25;
    const py = reduced ? 0 : view.pointer.easedY * 0.2;
    camera.position.set(
      curOrbitX.current * curDist.current + px,
      curTargetY.current + 1.4 + py,
      curDist.current
    );
    tmpTarget.set(0, curTargetY.current, 0);
    camera.lookAt(tmpTarget);

    // ---- project annotation anchors to DOM (no React state) ----
    const aOpacity = view.annotations.opacity;
    for (const a of ANNOTATIONS) {
      const el = annotationRefs.current[a.id];
      if (!el) continue;
      const node = handles.find((h) => h.node.name === a.node)?.node;
      if (!node) continue;
      tmp.set(a.anchor[0], a.anchor[1], a.anchor[2]);
      node.localToWorld(tmp);
      tmp.project(camera);
      const behind = tmp.z > 1;
      const gate = (m as unknown as Record<string, number>)[a.gate] ?? 0;
      const vis = aOpacity * clamp(gate * 1.4) * (behind ? 0 : 1) * (size.width < 900 ? 0 : 1);
      const sx = (tmp.x * 0.5 + 0.5) * size.width;
      const sy = (-tmp.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`;
      el.style.opacity = vis.toFixed(3);
      el.style.visibility = vis < 0.01 ? 'hidden' : 'visible';
    }
  });

  return (
    <group ref={groupRef} scale={fit}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
