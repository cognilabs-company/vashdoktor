import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { CinematicImplant } from './CinematicImplant';
import { ExperienceLighting } from './ExperienceLighting';
import { view } from '../../lib/experienceState';
import { SECTIONS, ANNOTATIONS } from '../../lib/experienceContent';
import { clamp, damp, lerp, smoothstep } from '../../lib/math';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useDevicePerformance } from '../../hooks/useDevicePerformance';
import { Button } from '../ui/Button';

interface ExperienceProps {
  onOpenConsultation: () => void;
}

export function Experience({ onOpenConsultation }: ExperienceProps) {
  const reduced = useReducedMotion();
  const perf = useDevicePerformance();

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasLayerRef = useRef<HTMLDivElement>(null);
  const sectionTextRefs = useRef<Array<HTMLDivElement | null>>([]);
  const sectionElRefs = useRef<Array<HTMLElement | null>>([]);
  const annotationRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ------- scroll driver: writes to the mutable `view`, mutates DOM directly -------
  useEffect(() => {
    let raf = 0;
    let lastY = window.scrollY;

    const onPointer = (e: PointerEvent) => {
      view.pointer.rawX = (e.clientX / window.innerWidth) * 2 - 1;
      view.pointer.rawY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true });

    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;

      const root = rootRef.current;
      const vh = window.innerHeight;
      if (root) {
        const y = window.scrollY;
        const rect = root.getBoundingClientRect();
        const absTop = y + rect.top;
        const total = Math.max(1, root.offsetHeight - vh);
        const op = clamp((y - absTop) / total);

        view.scrollVelocity = y - lastY;
        lastY = y;
        view.scrollY = y;
        view.overallProgress = op;

        // ----- map overall progress to model channels -----
        const m = view.model;
        m.travelProgress = smoothstep(0.12, 0.28, op);
        const reassembly = smoothstep(0.88, 1.0, op);
        m.reassemblyProgress = reassembly;
        const inv = 1 - reassembly;
        m.crownExplode = smoothstep(0.28, 0.42, op) * inv;
        m.abutmentExplode = smoothstep(0.37, 0.52, op) * inv;
        m.implantExplode = smoothstep(0.46, 0.6, op) * inv;
        m.explodeProgress = Math.max(m.crownExplode, m.abutmentExplode, m.implantExplode);
        view.camera.frameProgress = op;
        view.annotations.opacity =
          smoothstep(0.27, 0.36, op) * (1 - smoothstep(0.84, 0.95, op));

        // ----- canvas fades out once the experience is fully scrolled past -----
        const past = (y - (absTop + total)) / vh;
        if (canvasLayerRef.current) {
          canvasLayerRef.current.style.opacity = clamp(1 - smoothstep(0.05, 0.75, past)).toFixed(3);
        }
      }

      // ----- pointer easing -----
      view.pointer.easedX = damp(view.pointer.easedX, view.pointer.rawX, 4, dt);
      view.pointer.easedY = damp(view.pointer.easedY, view.pointer.rawY, 4, dt);

      // ----- per-section text focus (entrance + exit tied to scroll) -----
      const vhNow = window.innerHeight;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = sectionElRefs.current[i];
        const txt = sectionTextRefs.current[i];
        if (!el || !txt) continue;
        const r = el.getBoundingClientRect();
        const len = Math.max(1, el.offsetHeight - vhNow);
        const p = clamp(-r.top / len);
        // hero (i===0) is visible at scroll 0 — only fade its exit
        const enter = i === 0 ? 1 : smoothstep(0, 0.14, p);
        const focus = reduced ? 1 : enter * (1 - smoothstep(0.72, 1, p));
        txt.style.opacity = focus.toFixed(3);
        txt.style.transform = `translate3d(0, ${((1 - focus) * 16).toFixed(1)}px, 0)`;
        txt.style.filter = reduced ? 'none' : `blur(${((1 - focus) * 5).toFixed(2)}px)`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [reduced]);

  const dpr = Math.min(perf.dpr, 1.6);

  return (
    <div ref={rootRef} className="relative w-full">
      {/* Persistent 3D canvas — one Canvas for the whole experience */}
      <div ref={canvasLayerRef} className="fixed inset-0 z-0 pointer-events-none">
        {/* soft studio backdrop so the light model reads against the light page */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_42%_52%,rgba(16,27,23,0.07),transparent_72%)]" />
        <Canvas
          camera={{ position: [-1.9, 1.6, 12], fov: 30, near: 0.1, far: 60 }}
          dpr={dpr}
          shadows
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.86,
          }}
        >
          <ExperienceLighting />
          <CinematicImplant reduced={reduced} annotationRefs={annotationRefs} />
        </Canvas>
      </div>

      {/* Annotation overlay — positioned by the projection loop in CinematicImplant */}
      <div className="fixed inset-0 z-10 pointer-events-none hidden lg:block">
        {ANNOTATIONS.map((a) => (
          <div
            key={a.id}
            ref={(el) => {
              annotationRefs.current[a.id] = el;
            }}
            className="absolute top-0 left-0 will-change-transform"
            style={{ opacity: 0 }}
          >
            <div className={`relative ${a.side === 'left' ? '-translate-x-full pr-6 text-right' : 'pl-6'} -translate-y-1/2`}>
              <div className={`flex items-center gap-2 ${a.side === 'left' ? 'justify-end' : ''}`}>
                <span className="h-px w-10 bg-[#3D7773]/50" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#3D7773]" />
              </div>
              <div className="mt-1.5">
                <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#17201F]">
                  {a.title}
                </div>
                <div className="text-[12px] leading-snug text-[#6F7774] max-w-[190px] mt-0.5">
                  {a.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section text blocks — sticky, so content holds while the model animates */}
      {SECTIONS.map((s, i) => (
        <section
          key={s.id}
          id={`exp-${s.id}`}
          ref={(el) => {
            sectionElRefs.current[i] = el;
          }}
          className="relative w-full"
          style={{ height: `${s.vh}vh` }}
        >
          <div className="sticky top-0 h-[100svh] flex items-center overflow-hidden">
            <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
              <div
                ref={(el) => {
                  sectionTextRefs.current[i] = el;
                }}
                className={`relative z-10 max-w-md lg:max-w-[38%] will-change-transform ${
                  s.layout === 'right'
                    ? 'lg:ml-auto lg:text-left'
                    : s.layout === 'center'
                    ? 'mx-auto text-center'
                    : 'lg:mr-auto'
                }`}
              >
                {/* readability scrim on small screens */}
                <div className="absolute -inset-6 -z-10 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(245,246,243,0.85),transparent_70%)] lg:hidden" />
                <div className="text-[11px] font-mono tracking-[0.2em] text-[#3D7773] uppercase mb-4">
                  {s.eyebrow}
                </div>
                <h2 className="text-[1.7rem] sm:text-3xl lg:text-[2.4rem] font-medium tracking-[-0.02em] leading-[1.12] text-[#17201F]">
                  {s.title.map((line, li) => (
                    <span key={li} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                <p className="mt-4 text-sm sm:text-[15px] font-light leading-relaxed text-[#6F7774] max-w-md">
                  {s.body}
                </p>

                {s.stats && (
                  <div className="mt-7 flex flex-wrap gap-8">
                    {s.stats.map((st) => (
                      <div key={st.label}>
                        <div className="text-xl sm:text-2xl font-medium text-[#17201F] tracking-tight">
                          {st.value}
                        </div>
                        <div className="text-[11px] font-mono uppercase tracking-wider text-[#6F7774] mt-1">
                          {st.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {s.cta && (
                  <div className={`mt-8 ${s.layout === 'center' ? 'flex justify-center' : ''}`}>
                    <Button variant="primary" size="lg" onClick={onOpenConsultation}>
                      {s.cta}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
