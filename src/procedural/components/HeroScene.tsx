import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { crownGeometry, latheProfile } from '../lib/geometry';
import { makeMaterial } from '../lib/material';

/**
 * Static hero centerpiece: a single ceramic tooth floating above a glossy
 * podium, turning gently. No scroll, no explode — the calm "product on a
 * pedestal" shot from the reference. Materials are self-lit (analytic lights in
 * the shader), so it reads bright on the transparent canvas over the dark scene.
 */
export function HeroScene({ reduced }: { reduced: boolean }) {
  const spin = useRef<THREE.Group>(null);

  const { tooth, podium } = useMemo(() => {
    const toothGeo = crownGeometry({
      height: 1.6,
      bellyRadius: 1.02,
      cervicalRadius: 0.64,
      ovality: 0.9,
      cuspHeight: 0.16,
    });
    const toothMat = makeMaterial('CERAMIC', {
      baseColor: '#f3f1ec',
      roughness: 0.2,
      exposure: 1.1,
      translucency: 0.42,
    });
    const toothMesh = new THREE.Mesh(toothGeo, toothMat);
    toothMesh.position.y = 0.55;

    // wide, low, bevelled glossy pedestal
    const podGeo = latheProfile(
      [
        [0, -0.2],
        [1.55, -0.2],
        [1.68, -0.08],
        [1.68, 0.06],
        [1.5, 0.16],
        [1.2, 0.18],
        [0, 0.18],
      ],
      120
    );
    const podMat = makeMaterial('CERAMIC', {
      baseColor: '#c9d0d5',
      roughness: 0.09,
      translucency: 0,
      exposure: 1.0,
    });
    const podMesh = new THREE.Mesh(podGeo, podMat);
    podMesh.position.y = -1.2;

    return { tooth: toothMesh, podium: podMesh };
  }, []);

  useFrame((state, delta) => {
    state.camera.lookAt(0, 0.15, 0);
    if (spin.current && !reduced) spin.current.rotation.y += Math.min(delta, 0.05) * 0.22;
  });

  return (
    <group>
      {/* tooth turns; podium stays put (it's radially symmetric anyway) */}
      <group ref={spin}>
        <primitive object={tooth} />
      </group>
      <primitive object={podium} />
    </group>
  );
}
