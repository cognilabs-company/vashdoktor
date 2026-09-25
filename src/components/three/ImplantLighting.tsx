import React from 'react';

interface ImplantLightingProps {
  scrollProgress?: number;
  isLowEnd?: boolean;
}

export function ImplantLighting({ scrollProgress = 0, isLowEnd = false }: ImplantLightingProps) {
  // Lighting slightly adapts across scroll scenes to accentuate titanium during macro scenes
  const isTitaniumScene = scrollProgress > 0.45 && scrollProgress < 0.7;

  return (
    <>
      {/* Soft Ambient Light for balanced baseline */}
      <ambientLight intensity={0.85} color="#FFFFFF" />

      {/* Main Studio Key Light (Top-Right Front) */}
      <directionalLight
        position={[6, 8, 7]}
        intensity={isTitaniumScene ? 2.2 : 1.8}
        color="#FFFFFF"
      />

      {/* Soft Fill Light (Bottom-Left Front) */}
      <directionalLight
        position={[-5, 2, 4]}
        intensity={0.9}
        color="#EAF1EE"
      />

      {/* Rim Specular Light (Back-Top) to catch edges of titanium threads and zirconia crown */}
      {!isLowEnd && (
        <directionalLight
          position={[0, 6, -6]}
          intensity={1.4}
          color="var(--c-green-soft)"
        />
      )}

      {/* Soft subtle warm bounce from below */}
      <pointLight
        position={[0, -4, 2]}
        intensity={0.4}
        color="#F7F5EE"
        distance={10}
      />
    </>
  );
}
