import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ImplantModel } from './ImplantModel';
import { ImplantLights } from './ImplantLights';
import { ImplantLoader } from './ImplantLoader';
import { StudioEnvironment } from './StudioEnvironment';
import { RealisticModel, GLBErrorBoundary } from './RealisticModel';

interface DentalImplantSceneProps {
  scrollProgress?: number;
  manualExplode?: number;
  isInteractiveModal?: boolean;
  enableOrbitControls?: boolean;
  useRealModel?: boolean;
  className?: string;
}

export function DentalImplantScene({
  scrollProgress = 0,
  manualExplode = 0,
  isInteractiveModal = false,
  enableOrbitControls = false,
  useRealModel = false,
  className = "w-full h-full",
}: DentalImplantSceneProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <ImplantLoader />

      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{
          position: [0, 0.4, 7.5],
          fov: 28, // Medical macro perspective without wide distortion
          near: 0.1,
          far: 50,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          powerPreference: "high-performance",
          alpha: true,
        }}
        className="touch-none"
      >
        <Suspense fallback={null}>
          <StudioEnvironment intensity={0.95} />
          <ImplantLights />

          {(() => {
            const procedural = (
              <Center position={[0, 0, 0]}>
                <ImplantModel
                  scrollProgress={prefersReducedMotion ? 0 : scrollProgress}
                  manualExplode={manualExplode}
                  mousePos={mousePos}
                  isInteractiveModal={isInteractiveModal}
                />
              </Center>
            );
            if (!useRealModel) return procedural;
            return (
              <GLBErrorBoundary fallback={procedural}>
                <Suspense fallback={procedural}>
                  <Center position={[0, 0, 0]}>
                    <RealisticModel />
                  </Center>
                </Suspense>
              </GLBErrorBoundary>
            );
          })()}

          {/* Soft grounding shadow beneath the inspected fixture */}
          <ContactShadows
            position={[0, -2.6, 0]}
            scale={11}
            blur={2.8}
            far={5}
            opacity={0.32}
            color="#0d1f1a"
            resolution={512}
          />

          {enableOrbitControls && (
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={3.5}
              maxDistance={12}
              maxPolarAngle={Math.PI / 1.6}
              minPolarAngle={Math.PI / 6}
              autoRotate={false}
              dampingFactor={0.05}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
