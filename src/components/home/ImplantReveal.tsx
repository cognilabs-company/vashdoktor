import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImplantShowcase, SHOWCASE_VH } from '../../procedural/ImplantShowcase';
import { SECTIONS, SECTION_RANGES } from '../../procedural/lib/content';
import { Button } from '../ui/Button';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { FLOW } from '../../lib/flow';

const clampN = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** where the opening shot puts the implant, measured off the baked frames */
const MODEL_AT = '37% 46%';
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
 * screen and the implant comes out of it. From there the whole /implantatsiya
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
  const modelRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  // the showcase reads this every frame — no React state on the scroll path
  const showcaseProgress = useRef(0);
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

      // Build the scene while the flight is still in its opening seconds —
      // compiling shaders and uploading geometry takes long enough that doing
      // it just before the section arrives means scrolling into a blank stage.
      // The hero flight is ~7.8 viewports tall, so this lands a moment after
      // the first frames of the video.
      if (!wasMounted && rect.top < vh * 7) {
        wasMounted = true;
        setMounted(true);
      }
      // ...but only start drawing every frame once it is nearly on screen
      const near = rect.top < vh * 1.5 && rect.bottom > -vh * 0.2;
      if (near !== wasLive) {
        wasLive = near;
        setLive(near);
      }

      // the whole sequence, played inside this one pinned stage
      const op = clampN((p - 0.02) / 0.96);
      showcaseProgress.current = op;

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
        modelRef.current.style.opacity = smoothstep(0.008, 0.045, p).toFixed(3);
        // a breath of settle, so it arrives rather than simply appears
        modelRef.current.style.transform = `scale(${(1.05 - smoothstep(0, 0.075, p) * 0.05).toFixed(4)})`;
      }
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
        const last = i === SECTION_RANGES.length - 1; // the closing words stay up
        const o = clampN(Math.min((op - r.start) / pad, last ? 1 : (r.end - op) / pad));
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - o) * 18).toFixed(1)}px, 0)`;
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
      style={{ height: `${SHOWCASE_VH}vh`, backgroundColor: FLOW.base }}
    >
      <div
        ref={stageRef}
        className="left-0 h-[100svh] w-full overflow-hidden"
        style={{ position: 'absolute', top: 0 }}
      >
        <div ref={modelRef} className="absolute inset-0" style={{ opacity: 0 }}>
          {mounted && (
            <ImplantShowcase className="absolute inset-0 h-full w-full" progressRef={showcaseProgress} active={live} />
          )}
        </div>

        {/* the fog the flight ended in, still filling the frame — it opens here */}
        <div
          ref={fogRef}
          className="pointer-events-none absolute inset-0 z-20"
          style={{ opacity: 1, background: '#dbe7ef' }}
        />
        <div
          ref={fogFlatRef}
          className="pointer-events-none absolute inset-0 z-[21] bg-[#dbe7ef]"
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
              <div className="mb-5 inline-flex items-center gap-3 text-[13px] text-[#8fc7d4]">
                <span className="h-px w-7 bg-[#8fc7d4]/60" />
                {s.eyebrow}
              </div>
              <h2 className="font-serif text-[clamp(1.7rem,3.4vw,2.9rem)] font-medium leading-[1.05] tracking-tight text-white">
                {s.title[0]}
                <br />
                <span className="text-[#8fc7d4]">{s.title[1]}</span>
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#b9cfd7]">{s.body}</p>

              {s.stats && (
                <div className={`mt-7 flex gap-8 ${centred ? 'justify-center' : ''}`}>
                  {s.stats.map((st) => (
                    <div key={st.label}>
                      <div className="font-serif text-2xl font-medium leading-none text-white">{st.value}</div>
                      <div className="mt-1.5 text-[12px] text-[#8fb0ba]">{st.label}</div>
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
                  <Link
                    to="/implantatsiya"
                    className="group inline-flex items-center gap-1.5 text-sm text-[#c6dbe1] underline decoration-white/25 underline-offset-[6px] transition-colors hover:text-white hover:decoration-[#8fc7d4]"
                  >
                    Implantatsiya sahifasi
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/** Phones / reduced motion: no WebGL — the same story as a short read. */
function ImplantStill({ onOpen3DViewer, onOpenConsultation }: Props) {
  return (
    <section data-bg={FLOW.base} className="relative w-full px-6 py-20">
      <div className="mb-5 inline-flex items-center gap-3 text-[13px] text-[#8fc7d4]">
        <span className="h-px w-7 bg-[#8fc7d4]/60" />
        {SECTIONS[1].eyebrow}
      </div>
      <h2 className="font-serif text-[clamp(1.9rem,7vw,2.6rem)] font-medium leading-[1.06] tracking-tight text-white">
        {SECTIONS[1].title[0]} <span className="text-[#8fc7d4]">{SECTIONS[1].title[1]}</span>
      </h2>
      <ul className="mt-7">
        {SECTIONS.slice(2, 7).map((s, i) => (
          <li
            key={s.id}
            className="flex items-baseline gap-4 border-t border-white/10 py-3.5 last:border-b last:border-white/10"
          >
            <span className="w-5 shrink-0 font-serif text-[15px] text-[#8fc7d4]">{i + 1}</span>
            <span className="text-[15px] font-medium text-white">{s.eyebrow.split('— ')[1] ?? s.eyebrow}</span>
            <span className="ml-auto max-w-[55%] text-right text-[13px] text-[#8fb0ba]">{s.title.join(' ')}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button variant="white" size="lg" onClick={onOpenConsultation} icon={<ArrowUpRight className="h-4 w-4" />}>
          {SECTIONS[0].cta}
        </Button>
        <button
          onClick={onOpen3DViewer}
          className="group inline-flex items-center gap-1.5 text-sm text-[#c6dbe1] underline decoration-white/25 underline-offset-[6px] transition-colors hover:text-white"
        >
          3D modelni aylantirish
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
