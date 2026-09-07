import React from 'react';
import { Html } from '@react-three/drei';

interface ImplantLabelsProps {
  scrollProgress: number;
  isMobile?: boolean;
}

export function ImplantLabels({ scrollProgress, isMobile = false }: ImplantLabelsProps) {
  // Only show exploded view labels in scenes 03 & 04 (0.28 - 0.48) on desktop/tablet
  const showExplodedLabels = !isMobile && scrollProgress >= 0.28 && scrollProgress <= 0.48;

  // Digital planning overlay labels during scene 08 (0.76 - 0.86)
  const showPlanningLabels = !isMobile && scrollProgress >= 0.76 && scrollProgress <= 0.86;

  if (!showExplodedLabels && !showPlanningLabels) return null;

  return (
    <group>
      {showExplodedLabels && (
        <>
          {/* Label 1: Ceramic Crown */}
          <Html position={[1.4, 2.7, 0]} center distanceFactor={10}>
            <div className="pointer-events-none flex items-center gap-3 transition-opacity duration-300">
              <div className="h-[1px] w-8 bg-[#173D35]/40" />
              <div className="rounded-lg bg-white/95 px-3 py-1.5 shadow-md border border-black/8 backdrop-blur-md">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#286A5B]">
                  01 / RESTORATION
                </div>
                <div className="text-xs font-semibold text-[#101715]">
                  Monolithic Zirconia Crown
                </div>
              </div>
            </div>
          </Html>

          {/* Label 2: Abutment */}
          <Html position={[1.4, 1.4, 0]} center distanceFactor={10}>
            <div className="pointer-events-none flex items-center gap-3 transition-opacity duration-300">
              <div className="h-[1px] w-8 bg-[#173D35]/40" />
              <div className="rounded-lg bg-white/95 px-3 py-1.5 shadow-md border border-black/8 backdrop-blur-md">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#286A5B]">
                  02 / CONNECTOR
                </div>
                <div className="text-xs font-semibold text-[#101715]">
                  Conical Morse Taper Abutment
                </div>
              </div>
            </div>
          </Html>

          {/* Label 3: Titanium Root Fixture */}
          <Html position={[1.4, -0.9, 0]} center distanceFactor={10}>
            <div className="pointer-events-none flex items-center gap-3 transition-opacity duration-300">
              <div className="h-[1px] w-8 bg-[#173D35]/40" />
              <div className="rounded-lg bg-white/95 px-3 py-1.5 shadow-md border border-black/8 backdrop-blur-md">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#286A5B]">
                  03 / FOUNDATION
                </div>
                <div className="text-xs font-semibold text-[#101715]">
                  Grade 5 SLA Titanium Fixture
                </div>
              </div>
            </div>
          </Html>
        </>
      )}

      {showPlanningLabels && (
        <Html position={[1.3, 0.2, 0]} center distanceFactor={10}>
          <div className="pointer-events-none flex flex-col gap-2 rounded-xl bg-white/90 p-3 shadow-lg border border-black/8 backdrop-blur-md text-left transition-opacity duration-300">
            <div className="text-[9px] font-mono uppercase tracking-widest text-[#286A5B] flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#286A5B] animate-pulse" />
              <span>3D GUIDED TRAJECTORY</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs pt-1 border-t border-black/5">
              <div>
                <span className="text-[10px] text-[#747D79] block">ANGLE</span>
                <span className="font-semibold text-[#101715]">12.0° Planned</span>
              </div>
              <div>
                <span className="text-[10px] text-[#747D79] block">DEPTH</span>
                <span className="font-semibold text-[#101715]">10.5 mm</span>
              </div>
            </div>
            <div className="text-[9px] text-[#747D79] italic mt-0.5">
              * Demo surgical trajectory values
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
