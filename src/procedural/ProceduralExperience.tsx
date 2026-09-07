import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ImplantModel } from './components/ImplantModel';
import { CameraRig } from './components/CameraRig';
import { Backdrop } from './components/Backdrop';
import { AnnotationRig } from './components/AnnotationRig';
import { Effects } from './components/Effects';
import { ScrollEngine } from './components/ScrollEngine';
import { SectionBlock } from './components/SectionBlock';
import { ProgressRail } from './components/ProgressRail';
import { SECTIONS } from './lib/content';
import { ANNOTATIONS } from './lib/annotations';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useDevicePerformance } from '../hooks/useDevicePerformance';

interface Props {
  onOpenConsultation: () => void;
}

/** true if the browser can actually create a WebGL context (fails when hardware
 * acceleration is off / GPU blocklisted → r3f would otherwise render black). */
function supportsWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Scroll-driven, procedurally-modelled dental-implant showcase. One persistent
 * Canvas renders the whole experience; the object begins assembled on the left,
 * travels across the composition, explodes into labelled components section by
 * section, and reassembles into a final hero shot. All heavy state lives in the
 * mutable `view` (see lib/state) — this component only wires refs together.
 */
export function ProceduralExperience({ onOpenConsultation }: Props) {
  const reduced = useReducedMotion();
  const perf = useDevicePerformance();
  const [webgl] = useState(supportsWebGL);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasLayerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const annotationRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  const dpr = Math.min(perf.dpr, 1.35);
  const full = !perf.isLowEnd && !perf.isMobile;

  return (
    <div className="relative w-full">
      <ProgressRail progressRef={progressRef} containerRef={railRef} />

      <ScrollEngine
        rootRef={rootRef}
        panelRefs={panelRefs}
        progressRef={progressRef}
        canvasLayerRef={canvasLayerRef}
        railRef={railRef}
        reduced={reduced}
      />

      {/* persistent 3D layer (fixed, fades out once scrolled past). Dark base so
          there is no light flash before WebGL paints. */}
      <div ref={canvasLayerRef} className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_38%_50%,#0e2536_0%,#0a141d_58%,#070f17_100%)]">
        {webgl ? (
          <Canvas
            dpr={dpr}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              toneMapping: THREE.NoToneMapping,
            }}
            camera={{ fov: 30, near: 0.1, far: 100, position: [5, 2, 11] }}
          >
            <Backdrop reduced={reduced} />
            <ImplantModel groupRef={modelGroupRef} reduced={reduced} />
            <CameraRig groupRef={modelGroupRef} reduced={reduced} />
            <AnnotationRig groupRef={modelGroupRef} annotationRefs={annotationRefs} />
            {!reduced && <Effects full={full} />}
          </Canvas>
        ) : null}
      </div>

      {/* leader-line annotations (desktop) — positioned by AnnotationRig */}
      <div className="fixed inset-0 z-10 pointer-events-none hidden lg:block">
        {ANNOTATIONS.map((a) => (
          <div
            key={a.id}
            ref={(el) => {
              annotationRefs.current[a.id] = el;
            }}
            className="absolute top-0 left-0 will-change-transform"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <div
              className={`relative -translate-y-1/2 [text-shadow:0_1px_10px_rgba(3,10,16,0.95)] drop-shadow-[0_2px_10px_rgba(3,10,16,0.9)] ${
                a.side === 'left' ? '-translate-x-full pr-6 text-right' : 'pl-6'
              }`}
            >
              <div className={`flex items-center gap-2 ${a.side === 'left' ? 'justify-end' : ''}`}>
                <span className="h-px w-12 bg-[#9fd4e0]/70" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#a9d8e4] ring-4 ring-[#03101c]/40" />
              </div>
              <div className="mt-2">
                <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white">
                  {a.title}
                </div>
                <div className="mt-1 max-w-[210px] text-[12px] leading-snug text-[#c3d6dd]">
                  {a.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* pinned section content (the scroll length lives here) */}
      <div ref={rootRef} className="relative z-10">
        {SECTIONS.map((s, i) => (
          <SectionBlock
            key={s.id}
            section={s}
            index={i}
            panelRefs={panelRefs}
            reduced={reduced}
            onOpenConsultation={onOpenConsultation}
          />
        ))}
      </div>
    </div>
  );
}
