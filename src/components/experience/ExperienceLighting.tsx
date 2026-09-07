import React from 'react';
import { StudioEnvironment } from '../three/StudioEnvironment';

/** Controlled studio rig — preserves the GLB PBR materials, no generic shader. */
export function ExperienceLighting() {
  return (
    <>
      {/* Neutral studio IBL for believable metal reflections */}
      <StudioEnvironment intensity={1.35} />

      {/* broad soft key — upper front-left */}
      <directionalLight position={[-5, 6, 6]} intensity={1.15} color="#FFFDF8" castShadow />
      {/* gentle fill — right-front */}
      <directionalLight position={[5.5, 2, 5]} intensity={0.32} color="#EEF2F1" />
      {/* front fill — brightens faces toward camera */}
      <directionalLight position={[0, 1, 8]} intensity={0.32} color="#FDFDFB" />
      {/* narrow rim — upper back */}
      <directionalLight position={[0.5, 6, -6]} intensity={0.34} color="#FFFFFF" />
      <hemisphereLight args={['#FFFFFF', '#E7E2D6', 0.22]} />
      <ambientLight intensity={0.18} color="#EEF0EF" />
    </>
  );
}
