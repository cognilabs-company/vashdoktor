import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ImplantModel } from './ImplantModel';
import { ImplantLighting } from './ImplantLighting';
import { WebGLFallback } from './WebGLFallback';
import { useDevicePerformance } from '../../hooks/useDevicePerformance';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ImplantCanvasProps {
  scrollProgress: number;
  className?: string;
  onOpenConsultation?: () => void;
}

export function ImplantCanvas({
  scrollProgress = 0,
  className = '',
  onOpenConsultation,
}: ImplantCanvasProps) {
  const perf = useDevicePerformance();
  const prefersReducedMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Desktop subtle mouse parallax
  useEffect(() => {
    if (!perf.enableParallax || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [perf.enableParallax, prefersReducedMotion]);

  if (!hasWebGL) {
    return <WebGLFallback onOpenConsultation={onOpenConsultation} />;
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 7.8], fov: 38 }}
        dpr={perf.dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        className="pointer-events-none"
      >
        <Suspense fallback={null}>
          <ImplantLighting scrollProgress={scrollProgress} isLowEnd={perf.isLowEnd} />
          <ImplantModel
            scrollProgress={scrollProgress}
            mousePos={mousePos}
            isMobile={perf.isMobile}
            isTablet={perf.isTablet}
            enableParallax={perf.enableParallax && !prefersReducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
