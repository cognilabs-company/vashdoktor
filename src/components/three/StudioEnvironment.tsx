import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface StudioEnvironmentProps {
  /** Global multiplier for image-based lighting (scene.environmentIntensity). */
  intensity?: number;
}

/**
 * Procedural image-based lighting.
 *
 * Builds a soft studio light-probe from three's built-in RoomEnvironment and
 * pre-filters it into a PMREM cube map assigned to `scene.environment`. This is
 * what gives the titanium fixture/abutment true metallic reflections and the
 * zirconia crown its subtle specular roll-off — MeshStandardMaterial metalness
 * looks flat/black without an environment to reflect.
 *
 * Fully procedural: no HDRI download, no network, no CSP concerns.
 */
export function StudioEnvironment({ intensity = 1 }: StudioEnvironmentProps) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();

    const roomScene = new RoomEnvironment();
    const envMap = pmrem.fromScene(roomScene, 0.04).texture;

    const prevEnv = scene.environment;
    scene.environment = envMap;
    // three r0.163+: scale IBL contribution without touching per-material envMapIntensity
    (scene as THREE.Scene & { environmentIntensity?: number }).environmentIntensity = intensity;

    // Free the transient room geometry immediately; PMREM already captured it
    roomScene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else if (mat) mat.dispose();
    });

    return () => {
      scene.environment = prevEnv;
      envMap.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, intensity]);

  return null;
}
