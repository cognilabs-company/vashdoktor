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

      // the canvas is built while the flight's fog still covers the screen
      const near = rect.top < vh * 2 && rect.bottom > -vh * 0.2;
      if (near !== wasLive) {
        wasLive = near;
        setLive(near);
        if (near) setMounted(true);
      }

      // the whole sequence, played inside this one pinned stage
      const op = clampN((p - 0.02) / 0.96);
      showcaseProgress.current = op;

      if (fogRef.current) fogRef.current.style.opacity = (1 - smoothstep(0, 0.045, p)).toFixed(3);
      if (modelRef.current) modelRef.current.style.opacity = smoothstep(0.004, 0.04, p).toFixed(3);

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

        {/* the fog the flight ended in, still filling the frame — it clears here */}
        <div ref={fogRef} className="pointer-events-none absolute inset-0 z-20 bg-[#dbe7ef]" style={{ opacity: 1 }} />

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
