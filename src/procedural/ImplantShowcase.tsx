import { useCallback, useEffect, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ImplantModel } from './components/ImplantModel';
import { CameraRig } from './components/CameraRig';
import { Backdrop } from './components/Backdrop';
import { AnnotationRig } from './components/AnnotationRig';
import { Effects } from './components/Effects';
import { ANNOTATIONS } from './lib/annotations';
import { view, applySectionScroll, clamp } from './lib/state';
import { SECTION_RANGES, TOTAL_VH, layoutToObjectX } from './lib/content';
import { ImplantSequence } from './ImplantSequence';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useDevicePerformance } from '../hooks/useDevicePerformance';
import { useWebGL } from '../hooks/useWebGL';

/** How tall a host section must be for the sequence to play at its own pace:
 * the experience's own scroll length plus the pinned viewport. */
export const SHOWCASE_VH = TOTAL_VH + 100;

/**
 * R3F stops its global render loop whenever a root on 'demand' has no frames
 * left to draw. Flipping the frameloop prop to 'always' only writes the store
 * value — `setFrameloop` does not restart the loop — so the scene sits frozen
 * on its last drawn frame until something invalidates it, and a single mouse
 * click was enough to make it spring to life. Nudge it when the switch lands.
 */
function Waker({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!active) return;
    let id = 0;
    let n = 0;
    // across a few frames, so at least one lands after the prop has been applied
    const step = () => {
      invalidate();
      if (++n < 3) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [active, invalidate]);
  return null;
}

/** Writes the shared view from our own scroll value, before anything reads it —
 * the same mapping the full experience's scroll engine uses, so the camera
 * walks every shot: assembled → apart → crown → abutment → screw → fixture →
 * threads → back together. */
function Driver({
  progressRef,
  exitRef,
}: {
  progressRef: MutableRefObject<number>;
  exitRef?: MutableRefObject<number>;
}) {
  useFrame(() => {
    const op = clamp(progressRef.current);
    view.overallProgress = op;
    applySectionScroll(op);

    // object side follows the active shot's layout, as on /implantatsiya
    const w = window.innerWidth;
    if (w < 1024) {
      view.model.objectX = 0;
      view.model.objectScale = w < 640 ? 0.62 : 0.82;
      return;
    }
    view.model.objectScale = 1;
    // `op < r.end` never matches the last range at op === 1, so start from the
    // closing shot and walk back — otherwise the model snaps across the screen
    // on the very last frame
    let layout = SECTION_RANGES[SECTION_RANGES.length - 1].layout;
    for (const r of SECTION_RANGES) {
      if (op < r.end) {
        layout = r.layout;
        break;
      }
    }
    // the page centres the closing shot behind centred text; in one pinned
    // stage that lands the words on the model, so it keeps a side here too
    view.model.objectX = layoutToObjectX(layout === 'right' ? 'right' : 'left');
    view.model.exitY = exitRef ? exitRef.current : 0;
  }, -1);
  return null;
}

interface Props {
  /** 0 = assembled … 1 = back together, across the whole sequence */
  progressRef: MutableRefObject<number>;
  /** world units the assembly is pushed down by, to leave the frame */
  exitRef?: MutableRefObject<number>;
  active?: boolean;
  className?: string;
}

/**
 * The implant from /implantatsiya, as one self-contained block: the same
 * procedural model, camera framing and leader-line labels, but driven by a
 * scroll value the caller owns instead of the page-long scroll engine.
 */
export function ImplantShowcase({ progressRef, exitRef, active = true, className = '' }: Props) {
  const reduced = useReducedMotion();
  const perf = useDevicePerformance();
  const webgl = useWebGL();
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const annotationRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const readProgress = useCallback(() => progressRef.current, [progressRef]);

  const dpr = Math.min(perf.dpr, 1.35);
  const full = !perf.isLowEnd && !perf.isMobile;

  // no WebGL context to be had — play the baked scrub of the same scene
  if (!webgl)
    return <ImplantSequence className={className} getProgress={readProgress} getExit={() => (exitRef ? exitRef.current : 0)} />;

  return (
    <div className={className}>
      {(
        <Canvas
          // mounted early so the scene is compiled and warm; 'demand' renders
          // it once and then idles until the section is actually on screen
          // mounted early so the scene is compiled and warm; 'demand' renders
          // it once and then idles until the section is actually on screen
          frameloop={active ? 'always' : 'demand'}
          dpr={dpr}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.NoToneMapping,
          }}
          camera={{ fov: 30, near: 0.1, far: 100, position: [5, 2, 11] }}
        >
          <Driver progressRef={progressRef} exitRef={exitRef} />
          <Waker active={active} />
          <Backdrop reduced={reduced} />
          <ImplantModel groupRef={modelGroupRef} reduced={reduced} />
          <CameraRig groupRef={modelGroupRef} reduced={reduced} />
          <AnnotationRig groupRef={modelGroupRef} annotationRefs={annotationRefs} />
          {!reduced && <Effects full={full} />}
        </Canvas>
      )}

      {/* leader-line labels, placed by AnnotationRig */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        {ANNOTATIONS.map((a) => (
          <div
            key={a.id}
            ref={(el) => {
              annotationRefs.current[a.id] = el;
            }}
            className="absolute left-0 top-0 will-change-transform"
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
                <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white">{a.title}</div>
                <div className="mt-1 max-w-[210px] text-[12px] leading-snug text-[#c3d6dd]">{a.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
