import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { StudioEnvironment } from './StudioEnvironment';
import { useDevicePerformance } from '../../hooks/useDevicePerformance';

const MODEL_URL = '/models/implant_blender.glb';

export interface AnatomyPart {
  key: string;
  /** node name inside the GLB this part maps to */
  mesh: string;
  title: string;
  text: string;
  /** target offset once this part is fully separated (world units, pre-fit) */
  explode: [number, number, number];
  /** scroll progress (0-1) at which this part begins to lift */
  phaseStart: number;
  /** progress at which a context part (bone) becomes visible */
  revealAt?: number;
  /** which side the annotation label sits on */
  side: 'left' | 'right';
}

interface AnatomyImplantProps {
  parts: AnatomyPart[];
  /** raw scroll progress 0..1 */
  progress: number;
  /** index of the highlighted part (−1 = none) */
  active: number;
}

interface PartHandle {
  obj: THREE.Object3D;
  base: THREE.Vector3;
  materials: THREE.MeshStandardMaterial[];
  emissiveBase: THREE.Color[];
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a || 1));
  return t * t * (3 - 2 * t);
};
/** how far this part has lifted at the given progress (0..1) */
const partLift = (p: AnatomyPart, progress: number) =>
  smoothstep(p.phaseStart, p.phaseStart + 0.16, progress);

function Model({ parts, progress, active }: AnatomyImplantProps) {
  const { scene } = useGLTF(MODEL_URL);
  const rootRef = useRef<THREE.Group>(null);

  const { group, handles, fit } = useMemo(() => {
    const clone = scene.clone(true);

    // Fit to the core implant parts (exclude the big jaw-bone block)
    const coreBox = new THREE.Box3();
    ['Crown', 'Abutment', 'Screw', 'Implant', 'Gum'].forEach((n) => {
      const o = clone.getObjectByName(n);
      if (o) coreBox.expandByObject(o);
    });
    const box = coreBox.isEmpty() ? new THREE.Box3().setFromObject(clone) : coreBox;
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = 4.3 / (Math.max(size.x, size.y, size.z) || 1);
    clone.position.sub(center);

    clone.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map(
          (m) => (m as THREE.MeshStandardMaterial).clone()
        );
        mesh.material = mats.length === 1 ? mats[0] : mats;
      }
    });

    // Ghost the jaw bone so the implant reads "inside a cutaway"
    const bone = clone.getObjectByName('Bone');
    bone?.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        list.forEach((m) => {
          const mat = m as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = 0.42;
          mat.depthWrite = false;
        });
      }
    });

    const handles: Record<string, PartHandle> = {};
    for (const p of parts) {
      if (handles[p.mesh]) continue;
      const obj = clone.getObjectByName(p.mesh);
      if (!obj) continue;
      const mats: THREE.MeshStandardMaterial[] = [];
      const emissiveBase: THREE.Color[] = [];
      obj.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          list.forEach((m) => {
            const mat = m as THREE.MeshStandardMaterial;
            mats.push(mat);
            emissiveBase.push((mat.emissive || new THREE.Color(0, 0, 0)).clone());
          });
        }
      });
      handles[p.mesh] = { obj, base: obj.position.clone(), materials: mats, emissiveBase };
    }

    return { group: clone, handles, fit: scale };
  }, [scene, parts]);

  const HIGHLIGHT = useMemo(() => new THREE.Color('#2f8f79'), []);

  useFrame(() => {
    // Per-part sequential separation driven by scroll progress
    for (const p of parts) {
      const h = handles[p.mesh];
      if (!h) continue;
      const lift = partLift(p, progress);
      const tx = h.base.x + p.explode[0] * lift;
      const ty = h.base.y + p.explode[1] * lift;
      const tz = h.base.z + p.explode[2] * lift;
      h.obj.position.x += (tx - h.obj.position.x) * 0.14;
      h.obj.position.y += (ty - h.obj.position.y) * 0.14;
      h.obj.position.z += (tz - h.obj.position.z) * 0.14;
      if (p.revealAt !== undefined) h.obj.visible = progress > p.revealAt;
    }
    // Highlight the active part
    for (const p of parts) {
      const h = handles[p.mesh];
      if (!h) continue;
      const isActive = active >= 0 && parts[active] && parts[active].mesh === p.mesh;
      h.materials.forEach((m, idx) => {
        const target = isActive ? 0.3 : 0.0;
        m.emissiveIntensity = (m.emissiveIntensity ?? 0) + (target - (m.emissiveIntensity ?? 0)) * 0.15;
        if (isActive) m.emissive.copy(HIGHLIGHT);
        else m.emissive.copy(h.emissiveBase[idx]);
      });
    }
  });

  useFrame((state) => {
    if (rootRef.current) {
      rootRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.16) * 0.05;
    }
  });

  return (
    <group ref={rootRef} scale={fit}>
      <primitive object={group} />
      <ActiveLabel parts={parts} handles={handles} progress={progress} active={active} />
    </group>
  );
}

/** Elegant leader line + HTML chip on the active part only. */
function ActiveLabel({
  parts,
  handles,
  progress,
  active,
}: {
  parts: AnatomyPart[];
  handles: Record<string, PartHandle>;
  progress: number;
  active: number;
}) {
  if (active < 0 || !parts[active]) return null;
  const p = parts[active];
  const h = handles[p.mesh];
  if (!h) return null;

  const lift = partLift(p, progress);
  const x = h.base.x + p.explode[0] * lift;
  const y = h.base.y + p.explode[1] * lift;
  const z = h.base.z + p.explode[2] * lift;
  const dir = p.side === 'right' ? 1 : -1;
  const labelX = x + dir * 1.5;

  return (
    <group>
      <Line points={[[x + dir * 0.45, y, z], [labelX - dir * 0.25, y, z]]} color="#2f8f79" lineWidth={1.5} />
      <mesh position={[x + dir * 0.45, y, z]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color="#2f8f79" />
      </mesh>
      <Html position={[labelX, y, z]} center distanceFactor={9} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            transform: p.side === 'left' ? 'translateX(-100%)' : 'none',
            whiteSpace: 'nowrap',
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: '#12332c',
            background: 'rgba(255,255,255,0.9)',
            padding: '3px 9px',
            borderRadius: 8,
            border: '1px solid rgba(40,106,91,0.2)',
            boxShadow: '0 2px 10px rgba(16,27,23,0.06)',
          }}
        >
          {p.title}
        </div>
      </Html>
    </group>
  );
}

useGLTF.preload(MODEL_URL);

export function AnatomyImplant({ parts, progress, active }: AnatomyImplantProps) {
  const perf = useDevicePerformance();
  return (
    <Canvas
      camera={{ position: [0, 0.2, 12], fov: 30 }}
      dpr={Math.min(perf.dpr, 1.5)}
      shadows
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.82,
      }}
      className="pointer-events-none"
    >
      <StudioEnvironment intensity={1.3} />
      <ambientLight intensity={0.24} color="#EEF0EF" />
      <directionalLight position={[-4.6, 5.6, 5.4]} intensity={0.9} color="#FFFDF8" castShadow />
      <directionalLight position={[5.2, 2.2, 3.4]} intensity={0.3} color="#EEF2F1" />
      <directionalLight position={[0, 5, -5.6]} intensity={0.34} color="#FFFFFF" />
      <directionalLight position={[0, 0.5, 8]} intensity={0.3} color="#FDFDFB" />
      <Model parts={parts} progress={progress} active={active} />
      <ContactShadows
        position={[0, -3.4, 0]}
        scale={12}
        blur={2.6}
        far={5}
        opacity={0.28}
        color="#0d1f1a"
        resolution={512}
      />
    </Canvas>
  );
}
