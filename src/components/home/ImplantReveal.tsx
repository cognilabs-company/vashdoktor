import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ImplantShowcase, SHOWCASE_VH } from '../../procedural/ImplantShowcase';
import { SequenceCanvas, type SequenceCanvasHandle } from '../procedure/SequenceCanvas';
import {
  getFrameSrc as getJawFrameSrc,
  PRIORITY_FRAMES as JAW_PRIORITY,
  TOTAL_FRAMES as JAW_FRAMES,
} from '../../lib/dentalSequence';
import { SECTIONS, SECTION_RANGES } from '../../procedural/lib/content';
import { Button } from '../ui/Button';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { FLOW } from '../../lib/flow';

const clampN = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** where the opening shot puts the implant, measured off the baked frames */
const MODEL_AT = '37% 46%';

// The finale: the implant we just built goes into a jaw. The footage is the
// clinic's own procedure sequence; frame 120 is the drilled socket with no tool
// in shot, and 240 is the finished jaw. Measured on the 1280x720 frame, the
// socket sits at (635, 423) and a seated fixture is 70 x 236 px.
const FINALE_VH = 250;
const JAW_OPEN = 118; // socket drilled, nothing above it yet
// Where in the finale the jaw falls. Wide on purpose — 0.30 of 250vh is about
// 75vh of scrolling, long enough to watch it come down. It starts while the
// implant is still on its way out of the bottom of the frame: left until the
// implant had gone there was a dead beat with nothing on the stage at all, and
// the two never meet anyway, the implant being low by then and the jaw high.
const JAW_FALL_FROM = 0.22;
const JAW_FALL_TO = 0.52;
/** share of the pinned scroll the implant sequence itself owns */
const SHOW_SHARE = (SHOWCASE_VH - 100) / (SHOWCASE_VH + FINALE_VH - 100);
const smoothstep = (a: number, b: number, x: number) => {
  const t = clampN((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

interface Props {
  onOpen3DViewer: () => void;
  onOpenConsultation: () => void;
}

/**
 * The handover out of the flight: the fog the camera ended in is still on
 * screen and the implant comes out of it. From there the whole implant
 * sequence plays inside one pinned stage — assembled, apart, a shot per part,
 * then back together — with each shot's words opposite the model.
 */
export function ImplantReveal(props: Props) {
  const wide = useMediaQuery('(min-width: 768px) and (min-height: 600px)');
  const reduced = useReducedMotion();
  if (!wide || reduced) return <ImplantStill {...props} />;
  return <Reveal {...props} />;
}

/* -------------------------------------------------------------------------- */

function Reveal({ onOpen3DViewer, onOpenConsultation }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const fogRef = useRef<HTMLDivElement | null>(null);
  const fogFlatRef = useRef<HTMLDivElement | null>(null);
  const bloomRef = useRef<HTMLDivElement | null>(null);
  const jawRef = useRef<HTMLDivElement | null>(null);
  const jawCanvasRef = useRef<SequenceCanvasHandle | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  // the showcase reads this every frame — no React state on the scroll path
  const showcaseProgress = useRef(0);
  // world units the assembly is pushed down by as it leaves the frame
  const showcaseExit = useRef(0);
  const [live, setLive] = useState(false); // draw only while in view
  const [mounted, setMounted] = useState(false); // build the WebGL context just before

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    let raf = 0;
    let lastPhase = '';
    let wasLive = false;
    let wasMounted = false;
    let lastRadius = -1; // a full-viewport gradient is expensive to restyle
    let lastJawFrame = -1;
    const setPin = (phase: string, top: string, bottom: string) => {
      if (phase === lastPhase) return;
      lastPhase = phase;
      stage.style.position = phase === 'pinned' ? 'fixed' : 'absolute';
      stage.style.top = top;
      stage.style.bottom = bottom;
    };

    const tick = () => {
      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const total = Math.max(1, section.offsetHeight - vh);
      const p = clampN(-rect.top / total);

      if (rect.top > 0) setPin('before', '0px', 'auto');
      else if (-rect.top < total) setPin('pinned', '0px', 'auto');
      else setPin('after', 'auto', '0px');

      // Build the scene the moment the visitor scrolls at all. Compiling the
      // shaders and uploading the geometry takes long enough that starting any
      // later means arriving at a stage that is still coming up; the whole
      // flight in front of it is what buys that time. Nothing is built while
      // the page is merely sitting at the top, so first paint is untouched.
      if (!wasMounted && (window.scrollY > 4 || rect.top < vh * 7)) {
        wasMounted = true;
        setMounted(true);
      }
      // ...but only start drawing every frame once it is nearly on screen
      const near = rect.top < vh * 1.5 && rect.bottom > -vh * 0.2;
      if (near !== wasLive) {
        wasLive = near;
        setLive(near);
      }

      // the implant sequence owns the first part of the stage, the finale the rest
      const op = clampN((clampN(p / SHOW_SHARE) - 0.02) / 0.96);
      showcaseProgress.current = op;
      const q = clampN((p - SHOW_SHARE) / (1 - SHOW_SHARE));

      // FINALE — the implant sinks out of the bottom of the frame and the jaw
      // comes down from above into the space it left, and the footage carries
      // it from there to a finished tooth.
      // The jaw drops IN, it does not rise up. Scrolling down is a downward
      // gesture; a jaw climbing up to meet it ran against the hand doing the
      // scrolling, and the two crossing in opposite directions read as two
      // separate things happening rather than one handing over to the other.
      // Now both move the way the page does. It comes forward as it comes
      // down — a little smaller at the top of its fall — so it arrives in
      // front rather than just sliding into place.
      if (jawRef.current) {
        // Eased out, not smoothstepped: it should carry its own weight down
        // and then take its time settling, the way something landing does.
        const t = clampN((q - JAW_FALL_FROM) / (JAW_FALL_TO - JAW_FALL_FROM));
        const land = 1 - Math.pow(1 - t, 3);
        // opacity leads the travel, so it is already there to watch fall
        const fade = smoothstep(JAW_FALL_FROM, JAW_FALL_FROM + 0.1, q);
        jawRef.current.style.opacity = fade.toFixed(3);
        jawRef.current.style.visibility = fade < 0.01 ? 'hidden' : 'visible';
        jawRef.current.style.transform =
          `translate3d(11vw, ${(2 - (1 - land) * 30).toFixed(1)}vh, 0) scale(${(0.8 - (1 - land) * 0.08).toFixed(3)})`;
      }
      if (endRef.current) {
        const t = smoothstep(0.84, 0.95, q);
        endRef.current.style.opacity = t.toFixed(3);
        endRef.current.style.transform = `translate3d(0, ${((1 - t) * 20).toFixed(1)}px, 0)`;
        endRef.current.style.pointerEvents = t > 0.7 ? 'auto' : 'none';
      }
      if (jawCanvasRef.current) {
        // hold on the open socket while the implant is still on its way down,
        // then play through to the finished jaw
        const f = Math.round(JAW_OPEN + smoothstep(JAW_FALL_TO + 0.04, 1, q) * (JAW_FRAMES - JAW_OPEN));
        if (f !== lastJawFrame) {
          lastJawFrame = f;
          jawCanvasRef.current.draw(f);
        }
      }

      // Coming out of the flight's cloud the mist does not just fade: it opens
      // around the implant first, so the eye lands on the model and the rest of
      // the frame follows. MODEL_AT is where the opening shot puts it.
      // A flat sheet carries the handover from the flight — the opening must
      // never show as a speck on the seam — and lifts once the gap behind it is
      // already wide and soft.
      if (fogFlatRef.current) {
        const flat = 1 - smoothstep(0, 0.022, p);
        fogFlatRef.current.style.visibility = flat < 0.01 ? 'hidden' : 'visible';
        fogFlatRef.current.style.opacity = flat.toFixed(3);
      }
      if (fogRef.current) {
        // rewriting a full-screen radial gradient costs a style recalc and a
        // repaint, so only when the opening has actually moved
        const r = Math.round(smoothstep(0, 0.06, p) * 1600) / 10;
        if (r !== lastRadius) {
          lastRadius = r;
          fogRef.current.style.background = `radial-gradient(circle at ${MODEL_AT}, rgba(219,231,239,0) ${(r * 0.45).toFixed(1)}%, rgba(219,231,239,1) ${r.toFixed(1)}%)`;
        }
        fogRef.current.style.opacity = (1 - smoothstep(0.05, 0.085, p)).toFixed(3);
      }
      if (modelRef.current) {
        // In out of the mist at the start. At the end it sinks out of the
        // bottom of the frame — moved inside the scene, so the backdrop behind
        // it stays put instead of sliding away and leaving a seam.
        const sc = 1.05 - smoothstep(0, 0.075, p) * 0.05;
        modelRef.current.style.opacity = smoothstep(0.008, 0.045, p).toFixed(3);
        modelRef.current.style.transform = `scale(${sc.toFixed(4)})`;
      }
      // 8 world units clears the frame at this camera distance
      showcaseExit.current = smoothstep(0.02, 0.28, q) * 8;
      // light blooms where the mist parts, then goes
      if (bloomRef.current) {
        const bloom = Math.sin(Math.PI * clampN(p / 0.085)) * 0.6;
        // a mix-blend layer is composited even at zero opacity, so take it out
        // of painting entirely outside its moment
        bloomRef.current.style.visibility = bloom < 0.01 ? 'hidden' : 'visible';
        bloomRef.current.style.opacity = bloom.toFixed(3);
      }

      // one block of words per shot, in and out on its own window
      for (let i = 0; i < SECTION_RANGES.length; i++) {
        const el = panelRefs.current[i];
        if (!el) continue;
        const r = SECTION_RANGES[i];
        const pad = Math.min(0.035, (r.end - r.start) * 0.3);
        const last = i === SECTION_RANGES.length - 1;
        // The closing words stay exactly where they are while the implant sinks
        // out of frame — the tooth is what moves, not the text. They only hand
        // over once the jaw has started to come down in its place.
        const o =
          clampN(Math.min((op - r.start) / pad, last ? 1 : (r.end - op) / pad)) *
          (last ? 1 - smoothstep(JAW_FALL_FROM + 0.02, JAW_FALL_FROM + 0.16, q) : 1);
        el.style.opacity = o.toFixed(3);
        // no drift on the closing block: it holds its position until it goes
        el.style.transform = last ? 'none' : `translate3d(0, ${((1 - o) * 18).toFixed(1)}px, 0)`;
        el.style.pointerEvents = o > 0.6 ? 'auto' : 'none';
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      ref={sectionRef}
      data-bg={FLOW.base}
      className="relative w-full"
      style={{ height: `${SHOWCASE_VH + FINALE_VH}vh`, backgroundColor: 'var(--c-bg)' }}
    >
      <div
        ref={stageRef}
        className="left-0 h-[100svh] w-full overflow-hidden"
        style={{ position: 'absolute', top: 0 }}
      >
        {/* the jaw the implant lands in */}
        <div
          ref={jawRef}
          // above the 3D canvas: its backdrop is opaque and stays put once the
          // implant has sunk through it, so the jaw arrives in the same space
          className="absolute inset-0 z-10"
          // kept to its own side of the stage, so the words never sit on it
          style={{ opacity: 0, visibility: 'hidden', transform: 'translate3d(11vw, -28vh, 0) scale(0.72)' }}
        >
          <SequenceCanvas
            ref={jawCanvasRef}
            className="absolute inset-0 block h-full w-full"
            src={getJawFrameSrc}
            total={JAW_FRAMES}
            priority={JAW_PRIORITY}
            fit="contain"
          />
        </div>

        <div ref={modelRef} className="absolute inset-0" style={{ opacity: 0 }}>
          {mounted && (
            <ImplantShowcase
              className="absolute inset-0 h-full w-full"
              progressRef={showcaseProgress}
              exitRef={showcaseExit}
              active={live}
            />
          )}
        </div>

        {/* the fog the flight ended in, still filling the frame — it opens here */}
        <div
          ref={fogRef}
          className="pointer-events-none absolute inset-0 z-20"
          style={{ opacity: 1, background: 'var(--c-fog)' }}
        />
        <div
          ref={fogFlatRef}
          className="pointer-events-none absolute inset-0 z-[21] bg-[var(--c-fog)]"
          style={{ opacity: 1 }}
        />
        {/* the light that comes through the opening */}
        <div
          ref={bloomRef}
          className="pointer-events-none absolute inset-0 z-[25] mix-blend-screen"
          style={{
            opacity: 0,
            visibility: 'hidden',
            background: `radial-gradient(40% 46% at ${MODEL_AT}, rgba(169,216,228,0.55), transparent 70%)`,
          }}
        />

        {/* each shot's words, always on the side the model is not */}
        {SECTIONS.map((s, i) => {
          // the model always keeps a side, so the words always take the other
          const centred = false;
          const onRight = s.layout === 'right';
          return (
            <div
              key={s.id}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              style={{ opacity: 0 }}
              className={
                centred
                  ? 'absolute inset-x-0 bottom-[7vh] z-30 flex flex-col items-center px-6 text-center'
                  : `absolute top-1/2 z-30 w-[min(38vw,460px)] -translate-y-1/2 ${
                      onRight ? 'right-6 lg:right-14' : 'left-6 lg:left-14'
                    }`
              }
            >
              <div className="mb-5 inline-flex items-center gap-3 text-[13px] text-[var(--c-accent)]">
                <span className="h-px w-7 bg-[var(--c-accent)]/60" />
                {s.eyebrow}
              </div>
              <h2 className="font-serif text-[clamp(1.7rem,3.4vw,2.9rem)] font-medium leading-[1.05] tracking-tight text-white">
                {s.title[0]}
                <br />
                <span className="text-[var(--c-accent)]">{s.title[1]}</span>
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#b9cfd7]">{s.body}</p>

              {s.stats && (
                <div className={`mt-7 flex gap-8 ${centred ? 'justify-center' : ''}`}>
                  {s.stats.map((st) => (
                    <div key={st.label}>
                      <div className="font-serif text-2xl font-medium leading-none text-white">{st.value}</div>
                      <div className="mt-1.5 text-[12px] text-[var(--c-text-3)]">{st.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {s.cta && (
                <div className={`mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 ${centred ? 'justify-center' : ''}`}>
                  <Button
                    variant="white"
                    size="lg"
                    onClick={s.id === 'hero' ? onOpenConsultation : onOpen3DViewer}
                    icon={<ArrowUpRight className="h-4 w-4" />}
                  >
                    {s.id === 'hero' ? s.cta : '3D modelni aylantirish'}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {/* the last word, once the tooth is in and the jaw is whole */}
        <div
          ref={endRef}
          className="absolute left-6 top-1/2 z-30 w-[min(30vw,380px)] -translate-y-1/2 lg:left-14"
          style={{ opacity: 0 }}
        >
          <div className="mb-5 inline-flex items-center gap-3 text-[13px] text-[var(--c-accent)]">
            <span className="h-px w-7 bg-[var(--c-accent)]/60" />
            Va joyida
          </div>
          <h2 className="font-serif text-[clamp(1.8rem,3.6vw,2.9rem)] font-medium leading-[1.05] tracking-tight text-white">
            O‘z tishingizdan <span className="text-[var(--c-accent)]">farq qilmaydi.</span>
          </h2>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button variant="white" size="lg" onClick={onOpenConsultation} icon={<ArrowUpRight className="h-4 w-4" />}>
              Konsultatsiyaga yozilish
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/** Phones / reduced motion: no WebGL — the same story as a short read. */
function ImplantStill({ onOpen3DViewer, onOpenConsultation }: Props) {
  return (
    <section data-bg={FLOW.base} className="relative w-full px-6 py-20">
      <div className="mb-5 inline-flex items-center gap-3 text-[13px] text-[var(--c-accent)]">
        <span className="h-px w-7 bg-[var(--c-accent)]/60" />
        {SECTIONS[1].eyebrow}
      </div>
      <h2 className="font-serif text-[clamp(1.9rem,7vw,2.6rem)] font-medium leading-[1.06] tracking-tight text-white">
        {SECTIONS[1].title[0]} <span className="text-[var(--c-accent)]">{SECTIONS[1].title[1]}</span>
      </h2>
      <ul className="mt-7">
        {SECTIONS.slice(2, 7).map((s, i) => (
          <li
            key={s.id}
            className="flex items-baseline gap-4 border-t border-white/10 py-3.5 last:border-b last:border-white/10"
          >
            <span className="w-5 shrink-0 font-serif text-[15px] text-[var(--c-accent)]">{i + 1}</span>
            <span className="text-[15px] font-medium text-white">{s.eyebrow.split('— ')[1] ?? s.eyebrow}</span>
            <span className="ml-auto max-w-[55%] text-right text-[13px] text-[var(--c-text-3)]">{s.title.join(' ')}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button variant="white" size="lg" onClick={onOpenConsultation} icon={<ArrowUpRight className="h-4 w-4" />}>
          {SECTIONS[0].cta}
        </Button>
        <button
          onClick={onOpen3DViewer}
          className="group inline-flex items-center gap-1.5 text-sm text-[var(--c-text)] underline decoration-white/25 underline-offset-[6px] transition-colors hover:text-white"
        >
          3D modelni aylantirish
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
