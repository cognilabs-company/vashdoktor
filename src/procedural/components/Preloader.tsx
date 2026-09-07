import { useEffect, useState } from 'react';

interface Props {
  ready: boolean;
}

/**
 * Blocks first paint with a calm brand screen until the scene's first frame is
 * ready, then fades away. A hard timeout guarantees it can never trap the page.
 */
export function Preloader({ ready }: Props) {
  const [gone, setGone] = useState(false);
  const [forceHide, setForceHide] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setForceHide(true), 3500);
    return () => window.clearTimeout(t);
  }, []);

  const done = ready || forceHide;

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setGone(true), 700);
    return () => window.clearTimeout(t);
  }, [done]);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#eef0ec] transition-opacity duration-700 ease-out"
      style={{ opacity: done ? 0 : 1, pointerEvents: done ? 'none' : 'auto' }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="text-[13px] font-mono tracking-[0.34em] uppercase text-[#3D7773]">
          Implant System
        </div>
        <div className="h-px w-40 overflow-hidden bg-[#141c1a]/10">
          <div className={`h-full bg-[#173D35] ${done ? 'w-full' : 'animate-[preload_1.4s_ease-in-out_infinite]'}`} />
        </div>
      </div>
      <style>{`
        @keyframes preload {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
