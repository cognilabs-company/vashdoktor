import type { MutableRefObject } from 'react';
import { PHASES } from '../../lib/dentalSequence';

/**
 * Restrained 3-step indicator (01 SKANLASH · 02 REJALASH · 03 DAVOLASH).
 * The parent writes the active step (colour) and the fill bar's scaleX from its
 * rAF — no React state per scroll frame. Accent = the site teal, no neon.
 */
export function ProcedureProgress({
  stepsRef,
  fillRef,
}: {
  stepsRef: MutableRefObject<(HTMLDivElement | null)[]>;
  fillRef: MutableRefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="w-full max-w-md">
      {/* rail */}
      <div className="relative h-px w-full bg-white/12">
        <div
          ref={fillRef}
          className="absolute left-0 top-0 h-px w-full origin-left bg-gradient-to-r from-[var(--c-accent)] to-[var(--c-accent-2)]"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* labels */}
      <div className="mt-4 flex items-start justify-between gap-4">
        {PHASES.map((phase, i) => (
          <div
            key={phase.id}
            ref={(el) => {
              stepsRef.current[i] = el;
            }}
            className="flex min-w-0 flex-col gap-1 transition-colors duration-300"
            style={{ color: i === 0 ? 'var(--c-accent-2)' : 'var(--c-text-5)' }}
          >
            <span className="font-mono text-[11px] tracking-[0.2em]">{phase.step}</span>
            <span className="truncate text-[10px] font-medium uppercase tracking-[0.18em] sm:text-[11px]">
              {phase.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
