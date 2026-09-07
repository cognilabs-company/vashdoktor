import React, { useRef } from 'react';
import * as THREE from 'three';

export function ImplantLights() {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  return (
    <>
      {/* Studio Ambient Bounce */}
      <ambientLight intensity={0.65} color="#F7FBF9" />

      {/* Main Studio Key Light (Upper Left / Front) */}
      <directionalLight
        ref={dirLightRef}
        position={[4, 6, 5]}
        intensity={2.0}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* Medical Mint Soft Fill Light (Right Side) */}
      <directionalLight
        position={[-5, 2, 4]}
        intensity={0.9}
        color="#E1F2ED"
      />

      {/* Titanium Specular Rim Light (Back & Top) */}
      <directionalLight
        position={[0, 5, -6]}
        intensity={1.8}
        color="#F0F8F6"
      />

      {/* Bottom Sub-Bounce for realistic anatomical under-fill */}
      <directionalLight
        position={[0, -5, 2]}
        intensity={0.4}
        color="#DCEDE7"
      />

      {/* Point light for metallic thread micro-highlights */}
      <pointLight position={[2, 0, 3]} intensity={0.8} color="#FFFFFF" distance={8} />
    </>
  );
}
