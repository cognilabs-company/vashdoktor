import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

export function ImplantLoader() {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active && progress < 100) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [active, progress]);

  if (!visible && (!active || progress >= 100)) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#F7F8F6]/90 backdrop-blur-sm transition-opacity duration-300 ${
        active && progress < 100 ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Minimal Clinical SVG Icon */}
        <div className="relative flex h-14 w-14 items-center justify-center">
          <svg className="h-full w-full animate-spin text-[#246B5B]" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.35" />
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="264"
              strokeDashoffset={264 - (264 * Math.max(0, Math.min(100, progress || 0))) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <div className="h-2 w-2 rounded-full bg-[#246B5B] animate-ping" />
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#246B5B] uppercase">
            CALIBRATING 3D MODEL
          </p>
          <p className="mt-1 text-xs text-[#68716D]">
            {Math.round(progress || 0)}% • Medical-Grade Precision
          </p>
        </div>
      </div>
    </div>
  );
}

