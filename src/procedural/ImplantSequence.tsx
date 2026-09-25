import { useLayoutEffect, useRef } from 'react';
import { SequenceCanvas, type SequenceCanvasHandle } from '../components/procedure/SequenceCanvas';
import { ANNOTATIONS } from './lib/annotations';
import {
  IMPLANT_SEQ_ASPECT,
  IMPLANT_SEQ_FRAMES,
  IMPLANT_SEQ_PRIORITY,
  LABEL_TRACK,
  getImplantFrameSrc,
} from '../lib/implantSequence';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

interface Props {
  /** read the same 0..1 scroll value the WebGL version is driven by */
  getProgress: () => number;
  /** world units the assembly is pushed down by, matched to the WebGL scene */
  getExit?: () => number;
  className?: string;
}

/**
 * The implant sequence for browsers that cannot give us a WebGL context.
 *
 * Not a poster and not a diagram: these are frames of the real 3D scene, baked
 * off the live page, scrubbed by the same scroll value — so the model still
 * comes apart part by part and goes back together. The leader lines are real
 * DOM text placed from the positions recorded alongside each frame, so they
 * stay crisp and readable instead of being flattened into the picture.
 *
 * The frames are only ever requested when this component mounts, so a browser
 * that does have WebGL never downloads them.
 */
export function ImplantSequence({ getProgress, getExit, className = '' }: Props) {
  const canvasRef = useRef<SequenceCanvasHandle | null>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    let raf = 0;
    let lastFrame = -1;
    const last = LABEL_TRACK.length - 1;

    const tick = () => {
      const t = clamp01(getProgress()) * last;
      const i = Math.min(last, Math.floor(t));
      const f = t - i;

      const frame = Math.round(t) + 1;
      if (frame !== lastFrame) {
        canvasRef.current?.draw(frame);
        lastFrame = frame;
      }

      // slide between the two recorded poses so the labels track the model
      // as smoothly as the picture does
      const a = LABEL_TRACK[i];
      const b = LABEL_TRACK[Math.min(last, i + 1)];
      for (let k = 0; k < a.length; k++) {
        const el = labelRefs.current[k];
        if (!el) continue;
        const o = a[k][2] + (b[k][2] - a[k][2]) * f;
        if (o < 0.01) {
          if (el.style.visibility !== 'hidden') el.style.visibility = 'hidden';
        } else {
          el.style.visibility = 'visible';
          el.style.left = `${(a[k][0] + (b[k][0] - a[k][0]) * f).toFixed(2)}%`;
          el.style.top = `${(a[k][1] + (b[k][1] - a[k][1]) * f).toFixed(2)}%`;
          el.style.opacity = o.toFixed(3);
        }
      }
      // Each baked frame carries the scene's backdrop with it, so sliding the
      // picture down would drag the backdrop off too and leave a hard edge
      // across the stage. It sinks AND fades instead — no edge, same reading.
      if (boxRef.current && getExit) {
        const e = clamp01(getExit() / 8);
        boxRef.current.style.transform = e > 0.001 ? `translate3d(0, ${(e * 42).toFixed(2)}%, 0)` : '';
        boxRef.current.style.opacity = e > 0.001 ? (1 - e).toFixed(3) : '';
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [getProgress, getExit]);

  return (
    <div className={className}>
      <div className="absolute inset-0 flex items-center justify-center">
        {/* the baked frame's own aspect, so a recorded label always lands on
            the part it belongs to whatever the viewport is */}
        <div
          ref={boxRef}
          className="relative w-full"
          style={{ aspectRatio: `${IMPLANT_SEQ_ASPECT}`, maxHeight: '100%' }}
        >
          <SequenceCanvas
            ref={canvasRef}
            className="absolute inset-0 block h-full w-full"
            src={getImplantFrameSrc}
            total={IMPLANT_SEQ_FRAMES}
            priority={IMPLANT_SEQ_PRIORITY}
            fit="contain"
          />

          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            {ANNOTATIONS.map((a, i) => (
              <div
                key={a.id}
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className="absolute will-change-transform"
                style={{ left: 0, top: 0, opacity: 0, visibility: 'hidden' }}
              >
                <div
                  className={`relative -translate-y-1/2 [text-shadow:0_1px_10px_rgba(3,10,16,0.95)] drop-shadow-[0_2px_10px_rgba(3,10,16,0.9)] ${
                    a.side === 'left' ? '-translate-x-full pr-6 text-right' : 'pl-6'
                  }`}
                >
                  <div className={`flex items-center gap-2 ${a.side === 'left' ? 'justify-end' : ''}`}>
                    <span className="h-px w-12 bg-[var(--c-accent-3)]/70" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--c-accent-2)] ring-4 ring-[#03101c]/40" />
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
      </div>
    </div>
  );
}
