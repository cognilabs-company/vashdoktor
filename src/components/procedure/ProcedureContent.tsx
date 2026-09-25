import type { MutableRefObject } from 'react';
import { PHASES } from '../../lib/dentalSequence';
import { TechnicalBadge } from '../ui/TechnicalBadge';

const clsx = (...c: (string | false)[]) => c.filter(Boolean).join(' ');

/**
 * One fixed-size text container holding all three phase blocks stacked
 * (position: absolute; inset: 0) so switching phases never changes layout
 * dimensions or shifts the surrounding grid. The parent's rAF writes
 * opacity / translateY / blur onto each INNER ref (no React re-render). Type is
 * kept compact and bounded — this section is about the animation, not giant
 * typography — so copy always fits inside the viewport.
 */
export function ProcedureContent({
  blocksRef,
  subRef,
}: {
  blocksRef: MutableRefObject<(HTMLDivElement | null)[]>;
  subRef: MutableRefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div className="phase-copy relative w-full max-w-[380px] min-h-[210px] max-h-[65vh]">
      {PHASES.map((phase, i) => (
        <div
          key={phase.id}
          ref={(el) => {
            blocksRef.current[i] = el;
          }}
          className="absolute inset-0 will-change-[opacity,transform]"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <TechnicalBadge code={phase.index} label="Bosqich" variant="dark" />
          <h3 className="mt-4 font-serif text-[clamp(2rem,3.5vw,3.5rem)] font-medium leading-[1.0] tracking-tight text-white">
            {phase.title}
          </h3>
          <p className="mt-3.5 text-[clamp(0.875rem,1.1vw,1.0625rem)] leading-[1.55] text-[var(--c-text-2)]">
            {phase.body}
          </p>
          {/* O'RNATISH sub-stage line — frame-driven, filled by the parent's rAF */}
          <p
            ref={i === 2 ? subRef : undefined}
            className={clsx(
              'mt-3 text-[clamp(0.75rem,0.95vw,0.875rem)] font-medium leading-[1.5] text-[var(--c-accent)] will-change-[opacity]',
              i !== 2 && 'hidden'
            )}
            style={{ opacity: 0 }}
          />
        </div>
      ))}
    </div>
  );
}
