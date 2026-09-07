import { useLayoutEffect, useRef, useState } from 'react';
import { SequenceCanvas, type SequenceCanvasHandle } from './SequenceCanvas';
import { ProcedureContent } from './ProcedureContent';
import { ProcedureProgress } from './ProcedureProgress';
import { getFrameSrc, PHASES, phaseIndexFromFrame, subCopyForFrame } from '../../lib/dentalSequence';
import { TechnicalBadge } from '../ui/TechnicalBadge';

const clampN = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clampN((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// crossfade windows (frame numbers) around the video phase boundaries (65 / 110)
const SK_REJ = [62, 68] as const;
const REJ_ORN = [107, 113] as const;

// Reserve the last 8% of scroll to HOLD the final frame so the completed crown
// is clearly visible before the section releases.
//   progress 0.00 – 0.92 → frames 1 … 300 (animation)
//   progress 0.92 – 1.00 → frame 300 (hold)   [section still pinned]
const ANIMATION_END = 0.92;
const progressToFrame = (p: number): number =>
  p < ANIMATION_END
    ? Math.min(300, Math.max(1, Math.round(1 + (p / ANIMATION_END) * 299)))
    : 300;

// Light damping so a fast mouse-wheel spike doesn't skip frames, while reverse
// scrolling stays responsive (small factor → short catch-up, ~0.13s).
const DAMP = 0.14;

// Per-phase composition of the WHOLE transparent canvas (CSS transform only —
// the object is never repositioned inside a frame). Kept biased toward the
// right/centre so the model never slides under the left text column.
type Key = { f: number; x: number; s: number };
// Transform applied to the canvas CELL only (its own grid column on desktop /
// top box on mobile). The cell clips (overflow-hidden) so scale never bleeds
// into the text column. Small shift + growing scale = "larger + central" by O'RNATISH.
const KF_WIDE: Key[] = [
  { f: 36, x: 4, s: 0.95 }, // 01 SKANLASH
  { f: 100, x: 0, s: 1.0 }, // 02 REJALASH
  { f: 200, x: 0, s: 1.08 }, // 03 O'RNATISH — larger
];
const KF_MOBILE: Key[] = [
  { f: 36, x: 0, s: 0.98 },
  { f: 100, x: 0, s: 1.02 },
  { f: 200, x: 0, s: 1.06 },
];

function interpKeys(kf: Key[], frame: number): { x: number; s: number } {
  if (frame <= kf[0].f) return { x: kf[0].x, s: kf[0].s };
  if (frame >= kf[kf.length - 1].f) return { x: kf[kf.length - 1].x, s: kf[kf.length - 1].s };
  for (let i = 0; i < kf.length - 1; i++) {
    const a = kf[i];
    const b = kf[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const t = smoothstep(a.f, b.f, frame);
      return { x: lerp(a.x, b.x, t), s: lerp(a.s, b.s, t) };
    }
  }
  return { x: kf[kf.length - 1].x, s: kf[kf.length - 1].s };
}

/**
 * One continuous scroll-driven dental procedure section (3 phases), built as
 * separate compositing LAYERS — never a flattened video:
 *   background (CSS) → large low-contrast typography → transparent frame canvas
 *   → foreground text / progress.
 * The whole canvas repositions/scales per phase via CSS transform while the
 * frame sequence stays continuous. Scroll (relative to THIS section) is the
 * single source of truth. Manual pin (CSS sticky broken here by the root's
 * overflow-x-hidden), same pattern as VideoText. The section stays pinned until
 * progress === 1 (frame 300 held), so the next section can't enter early.
 */
export function ProcedureSequence() {
  const [reduced, setReduced] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<SequenceCanvasHandle | null>(null);
  const canvasBoxRef = useRef<HTMLDivElement | null>(null);
  const blocksRef = useRef<(HTMLDivElement | null)[]>([]);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const fillRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      return;
    }

    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!section || !stage || !canvas) return;

    const wideMq = window.matchMedia('(min-width: 768px)');
    let wide = wideMq.matches;
    const onMq = () => {
      wide = wideMq.matches;
      lastFrame = -1; // force a re-layout on breakpoint change
    };
    wideMq.addEventListener('change', onMq);

    let raf = 0;
    let lastFrame = -1;
    let lastActive = -1;
    let lastP = -1;
    let lastPhaseName = '';
    let rendered = -1; // eased progress the canvas actually shows

    const setPin = (name: string, top: string, bottom: string) => {
      if (name === lastPhaseName) return;
      lastPhaseName = name;
      stage.style.position = name === 'pinned' ? 'fixed' : 'absolute';
      stage.style.top = top;
      stage.style.bottom = bottom;
    };

    // each phase slides in from its own SIDE (dx/dy = hidden-state offset in px);
    // v = visibility (0 hidden → 1 fully in place). Motion is eased (v is smoothstep).
    const DIST = 56;
    const write = (el: HTMLDivElement | null, v: number, dx: number, dy: number) => {
      if (!el) return;
      const k = 1 - v; // how far from home
      el.style.opacity = String(v);
      el.style.transform = `translate3d(${dx * k}px, ${dy * k}px, 0)`;
      el.style.filter = k > 0.02 ? `blur(${(4 * k).toFixed(2)}px)` : 'none';
      el.style.visibility = v < 0.01 ? 'hidden' : 'visible';
    };

    // text blocks appear from different sides of the tooth
    const applyContent = (frame: number) => {
      const b = blocksRef.current;
      const sIn = smoothstep(SK_REJ[0], SK_REJ[1], frame);
      const sOut = smoothstep(REJ_ORN[0], REJ_ORN[1], frame);

      // 01 SKANLASH ← from LEFT · 02 REJALASH → from RIGHT · 03 O'RNATISH ↑ from BOTTOM
      write(b[0], 1 - sIn, -DIST, 0);
      write(b[1], sIn * (1 - sOut), DIST, 0);
      write(b[2], sOut, 0, DIST);
    };

    const applyLayout = (frame: number) => {
      const box = canvasBoxRef.current;
      if (!box) return;
      const { x, s } = interpKeys(wide ? KF_WIDE : KF_MOBILE, frame);
      box.style.transform = `translate3d(${x}%,0,0) scale(${s})`;
    };

    const applyPhase = (frame: number) => {
      const active = phaseIndexFromFrame(frame);
      if (active === lastActive) return;
      lastActive = active;
      stepsRef.current.forEach((el, i) => {
        if (el) el.style.color = i === active ? '#a9d8e4' : '#5c7580';
      });
    };

    // O'RNATISH sub-stage line — frame-driven text with a gentle manual fade-in
    let subText = '';
    let subFade = 1;
    const applySub = (frame: number) => {
      const el = subRef.current;
      if (!el) return;
      const txt = subCopyForFrame(frame);
      if (txt !== subText) {
        subText = txt;
        el.textContent = txt;
        subFade = 0; // restart fade
      }
    };

    applyContent(1);
    applyLayout(1);
    applyPhase(1);
    applySub(1);
    canvas.draw(1);

    const tick = () => {
      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      // TARGET progress relative to THIS section: 0 = section top at viewport
      // top, 1 = bottom of the pinned range. total = full scrollable distance.
      const total = Math.max(1, section.offsetHeight - vh);
      const target = clampN(-rect.top / total);

      // ease rendered → target (smooths wheel spikes; snaps when settled so the
      // sequence stops on an exact frame)
      if (rendered < 0) rendered = target;
      rendered += (target - rendered) * DAMP;
      if (Math.abs(target - rendered) < 0.0004) rendered = target;

      const frame = progressToFrame(rendered);

      // Pin (from ACTUAL scroll) until progress === 1 (frame 300 held). Only then
      // release so the next section is pushed below (normal pin spacing).
      if (rect.top > 0) setPin('before', '0px', 'auto');
      else if (-rect.top < total) setPin('pinned', '0px', 'auto');
      else setPin('after', 'auto', '0px');

      if (frame !== lastFrame) {
        canvas.draw(frame); // exact nearest frame — never crossfaded/blended
        applyContent(frame);
        applyLayout(frame);
        applyPhase(frame);
        applySub(frame);
        lastFrame = frame;
      }
      // gentle fade-in of the sub-stage line after a text change
      if (subFade < 1 && subRef.current) {
        subFade = Math.min(1, subFade + 0.08);
        subRef.current.style.opacity = String(subFade);
      }
      if (Math.abs(rendered - lastP) > 0.001) {
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${rendered})`;
        lastP = rendered;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      wideMq.removeEventListener('change', onMq);
    };
  }, []);

  if (reduced) return <ProcedureReduced />;

  return (
    <section
      id="jarayon"
      ref={sectionRef}
      className="relative w-full bg-[#0a141d] h-[560vh] md:h-[600vh] lg:h-[760vh]"
    >
      <div
        ref={stageRef}
        className="left-0 h-[100svh] w-full overflow-hidden"
        style={{ position: 'absolute', top: 0 }}
      >
        {/* LAYER 0 — background depth (CSS) */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_42%,#0e2536_0%,#0a141d_60%,#070f17_100%)]" />

        {/* LAYER 2 — two safe columns (never overlap): text | canvas.
            Mobile: stacked flex-col (canvas top 58vh, text below). */}
        <div className="absolute inset-0 z-20 mx-auto flex h-full max-w-[1600px] flex-col md:grid md:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.4fr)] md:items-center md:gap-6 md:px-[clamp(24px,5vw,96px)]">
          {/* CANVAS cell (dental model only) — clipped so scale can't bleed into text */}
          <div
            ref={canvasBoxRef}
            className="relative z-0 h-[58vh] w-full min-w-0 shrink-0 overflow-hidden will-change-transform md:order-2 md:h-full"
            style={{ transformOrigin: 'center center' }}
          >
            <SequenceCanvas ref={canvasRef} className="block h-full w-full" />
          </div>

          {/* TEXT cell — vertically centred, bounded */}
          <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-20 md:order-1 md:flex-none md:px-0 md:pb-0">
            <ProcedureContent blocksRef={blocksRef} subRef={subRef} />
          </div>
        </div>

        {/* LAYER 2.5 — soft bottom scrim (mobile canvas→text blend + progress legibility) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-[46vh] bg-gradient-to-t from-[#0a141d] via-[#0a141d]/45 to-transparent md:h-[26vh]" />

        {/* LAYER 3 — eyebrow + progress (aligned to the same container) */}
        <div className="pointer-events-none absolute inset-0 z-30">
          <div className="absolute inset-x-0 top-20 mx-auto max-w-[1600px] px-6 md:top-24 md:px-[clamp(24px,5vw,96px)]">
            <TechnicalBadge label="Klinik jarayon" variant="dark" />
          </div>

          <h2 className="sr-only">
            Implant o‘rnatish jarayoni — skanlash, rejalash, o‘rnatish
          </h2>

          <div className="absolute inset-x-0 bottom-6 mx-auto max-w-[1600px] px-6 md:bottom-8 md:px-[clamp(24px,5vw,96px)]">
            <div className="md:w-[360px]">
              <ProcedureProgress stepsRef={stepsRef} fillRef={fillRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** prefers-reduced-motion: three static representative frames + text, no scrub. */
function ProcedureReduced() {
  return (
    <section id="jarayon" className="relative w-full bg-[#0a141d] py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="mb-14">
          <TechnicalBadge label="Klinik jarayon" variant="dark" />
          <h2 className="mt-6 font-serif text-[clamp(2rem,5vw,3.25rem)] font-medium leading-tight tracking-tight text-white">
            Implant o‘rnatish jarayoni
          </h2>
        </div>

        <div className="space-y-16">
          {PHASES.map((phase) => (
            <article key={phase.id} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_50%_45%,#0e2536,#0a141d)]">
                <img
                  src={getFrameSrc(phase.poster)}
                  alt={`${phase.title} bosqichi`}
                  className="aspect-video w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div>
                <TechnicalBadge code={phase.index} label="Bosqich" variant="dark" />
                <h3 className="mt-5 font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.0] tracking-tight text-white">
                  {phase.title}
                </h3>
                <p className="mt-4 max-w-md text-[clamp(0.875rem,1.1vw,1.0625rem)] leading-[1.55] text-[#a7c2cb]">
                  {phase.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
