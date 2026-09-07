import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = '/models/implant_showcase.glb';

/**
 * Loads a real glTF model and normalises it: recentres to the origin and
 * uniformly scales so its largest dimension fits `targetSize` world units.
 * This makes ANY dropped-in .glb render at a sane size/position regardless of
 * the units it was authored in — swap public/models/implant.glb for a better
 * (textured, high-poly) model and it just works.
 */
export function RealisticModel({ targetSize = 4.2 }: { targetSize?: number }) {
  const { scene } = useGLTF(MODEL_URL);

  const normalised = useMemo(() => {
    const root = scene.clone(true);

    // Ensure sensible material response for untextured/flat source assets.
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxDim;

    root.position.sub(center);

    const wrapper = new THREE.Group();
    wrapper.add(root);
    wrapper.scale.setScalar(scale);
    return wrapper;
  }, [scene, targetSize]);

  return <primitive object={normalised} />;
}

/**
 * The glTF tooth mesh, re-materialised with the scene's zirconia crown material
 * and normalised to fit the crown slot. Rendered inside the story's existing
 * crownGroup so the master GSAP timeline (position + opacity) still drives it,
 * while the titanium fixture / abutment / bone stay procedural and animatable.
 */
export function ToothCrown({
  material,
  targetSize = 2.1,
}: {
  material: THREE.Material;
  targetSize?: number;
}) {
  const { scene } = useGLTF(MODEL_URL);

  const obj = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = material;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxDim;

    root.position.sub(center);

    const wrapper = new THREE.Group();
    wrapper.add(root);
    wrapper.scale.setScalar(scale);
    return wrapper;
  }, [scene, material, targetSize]);

  return <primitive object={obj} />;
}

const CROWN_URL = '/models/crown.glb';

/**
 * Blender-sculpted molar crown (real cusps + fossa) for the hero story's crown
 * slot. Re-materialised with the scene's zirconia crown material so the master
 * GSAP timeline still drives its opacity, height-fit + recentred so it drops
 * into the existing crownGroup without touching the timeline.
 */
export function CrownMesh({
  material,
  height = 1.5,
}: {
  material: THREE.Material;
  height?: number;
}) {
  const { scene } = useGLTF(CROWN_URL);

  const obj = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = material;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    let box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);
    const s = height / (size.y || 1);
    root.scale.setScalar(s);
    box = new THREE.Box3().setFromObject(root);
    const center = new THREE.Vector3();
    box.getCenter(center);
    root.position.sub(center);
    return root;
  }, [scene, material, height]);

  return <primitive object={obj} />;
}

useGLTF.preload(MODEL_URL);
useGLTF.preload(CROWN_URL);

interface BoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

/** Renders the procedural fallback if the glTF fails to load (e.g. missing file). */
export class GLBErrorBoundary extends React.Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    /* swallow — fallback already rendered */
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
