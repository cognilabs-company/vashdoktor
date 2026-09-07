import React, { useState } from 'react';
import { DentalImplantScene } from './DentalImplantScene';
import { X, RotateCcw, Layers, ZoomIn, ShieldCheck, Sparkles } from 'lucide-react';

interface InteractiveViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InteractiveViewerModal({ isOpen, onClose }: InteractiveViewerModalProps) {
  const [explodeValue, setExplodeValue] = useState<number>(0.35);
  const [selectedLayer, setSelectedLayer] = useState<'crown' | 'abutment' | 'implant' | 'all'>('all');
  const [useRealModel, setUseRealModel] = useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111816]/75 backdrop-blur-md p-4 sm:p-6 transition-all duration-300">
      <div className="relative flex flex-col w-full max-w-5xl h-[88vh] max-h-[850px] bg-[#F7F8F6] rounded-2xl shadow-2xl border border-black/10 overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-4 bg-white/70 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#246B5B]/10 text-[#246B5B]">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-[#111816]">
                3D Interactive Dental Implant Inspector
              </h3>
              <p className="text-xs text-[#68716D]">
                Drag to rotate 360° • Pinch / scroll to zoom • Adjust exploded layer separation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-[#111816] hover:bg-black/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 3D Canvas Area */}
        <div className="relative flex-1 w-full bg-gradient-to-b from-[#FFFFFF] to-[#F1F3F0]">
          <DentalImplantScene
            manualExplode={explodeValue}
            isInteractiveModal={true}
            enableOrbitControls={true}
            useRealModel={useRealModel}
            className="w-full h-full"
          />

          {/* Procedural ⇄ Scanned model toggle */}
          <div className="absolute top-6 right-6 flex flex-col items-end gap-1.5">
            <div className="inline-flex items-center rounded-full bg-white/90 p-1 shadow-lg backdrop-blur-md border border-black/8 text-xs font-medium">
              <button
                onClick={() => setUseRealModel(true)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  useRealModel ? 'bg-[#173D35] text-white' : 'text-[#68716D] hover:text-[#111816]'
                }`}
              >
                Photoreal model
              </button>
              <button
                onClick={() => setUseRealModel(false)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  !useRealModel ? 'bg-[#173D35] text-white' : 'text-[#68716D] hover:text-[#111816]'
                }`}
              >
                Interactive exploded
              </button>
            </div>
            <span className="text-[10px] text-[#68716D] bg-white/70 px-2 py-0.5 rounded-md backdrop-blur-sm">
              {useRealModel
                ? 'High-poly model · drag to rotate'
                : 'Procedural · use slider to explode'}
            </span>
          </div>

          {/* Quick Component Highlights */}
          <div className="absolute top-6 left-6 flex flex-col gap-2 max-w-xs pointer-events-none sm:pointer-events-auto">
            <div className="rounded-xl bg-white/85 p-3.5 shadow-lg backdrop-blur-md border border-black/5 text-xs">
              <div className="flex items-center gap-2 text-[#246B5B] font-semibold mb-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Biomechanical Calibration</span>
              </div>
              <p className="text-[#68716D] leading-relaxed">
                Grade 5 Titanium fixture with SLA micro-textured surface roughness (Ra 1.5μm) paired with monolithic zirconia ceramic.
              </p>
            </div>
          </div>

          {/* Bottom Interactive Controls Floating Bar */}
          <div className="absolute bottom-6 inset-x-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-white/90 p-4 shadow-xl backdrop-blur-md border border-black/8">
            {/* Exploded View Slider */}
            <div className="flex items-center gap-3 w-full sm:w-80">
              <span className="text-xs font-medium text-[#111816] whitespace-nowrap">
                Layer Separation
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodeValue}
                onChange={(e) => setExplodeValue(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#246B5B]"
              />
              <span className="text-xs font-mono text-[#68716D] w-9 text-right">
                {Math.round(explodeValue * 100)}%
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExplodeValue(0)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  explodeValue === 0
                    ? 'bg-[#246B5B] text-white'
                    : 'bg-black/5 text-[#111816] hover:bg-black/10'
                }`}
              >
                Assembled
              </button>
              <button
                onClick={() => setExplodeValue(0.5)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  explodeValue === 0.5
                    ? 'bg-[#246B5B] text-white'
                    : 'bg-black/5 text-[#111816] hover:bg-black/10'
                }`}
              >
                Exploded View
              </button>
              <button
                onClick={() => setExplodeValue(1.0)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  explodeValue === 1.0
                    ? 'bg-[#246B5B] text-white'
                    : 'bg-black/5 text-[#111816] hover:bg-black/10'
                }`}
              >
                Max Spread
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
