import { useEffect, useState } from 'react';
import { SECTIONS } from '../lib/content';

interface Props {
  progressRef: React.MutableRefObject<HTMLDivElement | null>;
  /** outer container — the engine fades this so the rail only shows during the experience. */
  containerRef?: React.MutableRefObject<HTMLDivElement | null>;
}

/**
 * Vertical progress line with a marker per section. The fill is scaleY-driven by
 * the scroll engine; the active marker updates on the low-frequency
 * `section:active` event (not per frame).
 */
export function ProgressRail({ progressRef, containerRef }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onActive = (e: Event) => setActive((e as CustomEvent).detail.index);
    window.addEventListener('section:active', onActive);
    return () => window.removeEventListener('section:active', onActive);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center pointer-events-none"
      style={{ opacity: 0 }}
    >
      <div className="relative h-56 w-px bg-white/15">
        <div
          ref={progressRef}
          className="absolute inset-x-0 top-0 h-full origin-top bg-[#a9d8e4]"
          style={{ transform: 'scaleY(0)' }}
        />
        {SECTIONS.map((s, i) => (
          <span
            key={s.id}
            className={`absolute -left-[3px] h-[7px] w-[7px] rounded-full transition-all duration-300 ${
              i <= active ? 'bg-[#a9d8e4] scale-100' : 'bg-white/25 scale-90'
            }`}
            style={{ top: `${(i / (SECTIONS.length - 1)) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
