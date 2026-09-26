import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import { SequenceCanvas, type SequenceCanvasHandle } from '../procedure/SequenceCanvas';
import { HomeServices } from './HomeServices';
import { Button } from '../ui/Button';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SERVICES } from '../../lib/services';
import {
  FLIGHT_VH,
  PRIORITY_FRAMES,
  STOPS,
  TOTAL_FRAMES,
  getFrameSrc,
  headlineOpacity,
  progressToFrame,
  stopOpacities,
} from '../../lib/heroFlight';

const clampN = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clampN((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
// A card arrives the way a sheet of paper that was balled up does: the outline
// is dented irregularly all the way round, and settles back to the card's own
// rectangle as it opens out. 20 points, each pushed in by its own amount.
const CRUMPLE_SEED = [
  0.62, -0.84, 0.31, -0.47, 0.93, -0.22, 0.55, -0.71, 0.18, -0.95,
  0.77, -0.36, 0.44, -0.62, 0.86, -0.15, 0.29, -0.78, 0.68, -0.41,
];
function crumplePath(k: number, seedOffset: number): string {
  const n = 24;
  const amp = 15 * k;
  const ball = k * k * k; // a tight ball at the start, a dented sheet by mid-way
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / n; // around the perimeter, clockwise from the top-left
    const a = CRUMPLE_SEED[(i + seedOffset) % CRUMPLE_SEED.length];
    const b = CRUMPLE_SEED[(i * 3 + seedOffset + 5) % CRUMPLE_SEED.length];
    let x: number, y: number, nx: number, ny: number, tx: number, ty: number;
    if (t < 0.3) { x = (t / 0.3) * 100; y = 0; nx = 0; ny = 1; tx = 1; ty = 0; }
    else if (t < 0.5) { x = 100; y = ((t - 0.3) / 0.2) * 100; nx = -1; ny = 0; tx = 0; ty = 1; }
    else if (t < 0.8) { x = 100 - ((t - 0.5) / 0.3) * 100; y = 100; nx = 0; ny = -1; tx = -1; ty = 0; }
    else { x = 0; y = 100 - ((t - 0.8) / 0.2) * 100; nx = 1; ny = 0; tx = 0; ty = -1; }
    const dent = (0.15 + Math.abs(a) * 0.85) * amp; // always inward, never even
    const slide = b * amp * 0.45; // and shifted along the edge, so no fold lines up
    const fx = x + nx * dent + tx * slide;
    const fy = y + ny * dent + ty * slide;
    // the same point on a lumpy ball — a sheet screwed up tight is round
    const ang = ((-135 + t * 360) * Math.PI) / 180;
    const rad = 28 + Math.abs(a) * 16; // 28..44 %, so the ball is never a circle
    const bx = 50 + Math.cos(ang) * rad;
    const by = 50 + Math.sin(ang) * rad;
    pts.push(`${(fx + (bx - fx) * ball).toFixed(1)}% ${(fy + (by - fy) * ball).toFixed(1)}%`);
  }
  return `polygon(${pts.join(',')})`;
}

const FACTS = [
  { value: '15+', label: 'yil' },
  { value: '20 000+', label: 'bemor' },
  { value: `${SERVICES.length}`, label: 'xizmat' },
];

interface Props {
  onOpenConsultation: () => void;
}

/**
 * The home hero: a drone flight through the fjord, played by scroll. The
 * camera passes a headland on each side and, at each one, that direction's services
 * break out of the rock face and fly across to the open side of the frame;
 * then it climbs above the peaks into thick fog, which is handed over — still
 * white — to the implant section below.
 *
 * Desktop only — phones and reduced-motion get the still frame plus the
 * ordinary services section.
 */
export function HeroFlight({ onOpenConsultation }: Props) {
  const wide = useMediaQuery('(min-width: 768px) and (min-height: 600px)');
  const reduced = useReducedMotion();
  if (!wide || reduced) {
    return (
      <>
        <HeroStill onOpenConsultation={onOpenConsultation} />
        <HomeServices />
      </>
    );
  }
  return <Flight onOpenConsultation={onOpenConsultation} />;
}

/* -------------------------------------------------------------------------- */

function Flight({ onOpenConsultation }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<SequenceCanvasHandle | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const riftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const creaseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const fogRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!section || !stage || !canvas) return;

    let raf = 0;
    let lastFrame = -1;
    let lastPhase = '';
    // eased progress: the drawn position chases the scroll position, so a
    // flick of the wheel glides instead of jumping frames
    let eased = 0;
    let primed = false;
    // manual pin: CSS sticky is unreliable under the smooth-scroll wrapper, so
    // the stage switches between absolute and fixed as the section passes.
    const setPhase = (phase: string, top: string, bottom: string) => {
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

      if (rect.top > 0) setPhase('before', '0px', 'auto');
      else if (-rect.top < total) setPhase('pinned', '0px', 'auto');
      else setPhase('after', 'auto', '0px');

      if (!primed) {
        eased = p;
        primed = true;
      }
      eased += (p - eased) * 0.12;
      if (Math.abs(p - eased) < 0.0002) eased = p;

      const frame = Math.round(progressToFrame(eased));
      if (frame !== lastFrame) {
        canvas.draw(frame);
        lastFrame = frame;
      }

      const ops = stopOpacities(eased);
      for (let i = 0; i < STOPS.length; i++) {
        const o = ops[i];
        // the card is born small and deep inside the headland the camera is
        // passing, then flies out across the open water to its own side
        const dir = STOPS[i].side === 'left' ? -1 : 1;
        // back-loaded travel: it stays over the rock face, then flies out
        const ease = Math.pow(o, 1.7);
        // a tight ball as it leaves the rock, flat by the time it arrives
        const crumple = 1 - smoothstep(0.26, 0.88, o);
        const el = cardRefs.current[i];
        if (el) {
          // still inside the rock while it is dark — it appears as it breaks out
          el.style.opacity = smoothstep(0.12, 0.5, o).toFixed(3);
          const x = (1 - ease) * -dir * 50; // vw — starts over the mountain
          const s = 0.40 + ease * 0.60; // a small ball that opens out to full size
          const rot = (1 - ease) * dir * 4 + crumple * dir * 9;
          const sx = s * (1 + crumple * 0.06);
          const sy = s * (1 - crumple * 0.08); // squashed flat, then released
          el.style.transform = `translate3d(${x.toFixed(2)}vw, -50%, 0) rotate(${rot.toFixed(2)}deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
          el.style.clipPath = crumple > 0.02 ? crumplePath(crumple, i * 7) : '';
          el.style.pointerEvents = o > 0.85 ? 'auto' : 'none';
          el.classList.toggle('is-in', o > 0.3); // inner lines cascade in (CSS)
          el.classList.toggle('is-left', dir === -1);
          // the glass and its tether only once it has arrived and flattened —
          // a backdrop filter through a scaling, clipped element is expensive
          el.classList.toggle('is-settled', o > 0.92 && crumple < 0.02);
        }
        const crease = creaseRefs.current[i];
        if (crease) {
          crease.style.opacity = crumple.toFixed(3);
          crease.style.visibility = crumple > 0.02 ? 'visible' : 'hidden';
        }
        // the rock face glows where it opens, and closes again behind the card
        const rift = riftRefs.current[i];
        if (rift) rift.style.opacity = (Math.sin(Math.PI * o) * 0.85).toFixed(3);
        const dot = dotRefs.current[i];
        if (dot) dot.style.opacity = (0.25 + o * 0.75).toFixed(3);
      }

      const head = headlineOpacity(eased);
      if (headlineRef.current) {
        headlineRef.current.style.opacity = head.toFixed(3);
        headlineRef.current.style.transform = `translate3d(0, ${((1 - head) * -40).toFixed(1)}px, 0)`;
      }
      if (hintRef.current) hintRef.current.style.opacity = head.toFixed(3);
      if (scrimRef.current) scrimRef.current.style.opacity = head.toFixed(3);
      // the flight ends inside fog and stays there: the section below opens in
      // the same white-blue, so the cloud is handed over instead of being cut
      if (fogRef.current) fogRef.current.style.opacity = clampN((eased - 0.925) / 0.05).toFixed(3);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const skip = () => {
    const section = sectionRef.current;
    if (!section) return;
    const y = section.offsetTop + section.offsetHeight; // straight to the section below
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="relative w-full bg-[var(--c-fog)]" style={{ height: `${FLIGHT_VH}vh` }}>
      <div
        ref={stageRef}
        className="left-0 h-[100svh] w-full overflow-hidden bg-cover bg-center"
        // the poster paints instantly while the first frames are still loading
        style={{ position: 'absolute', top: 0, backgroundImage: 'url(/hero-flight-poster.jpg)' }}
      >
        <SequenceCanvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
          src={getFrameSrc}
          total={TOTAL_FRAMES}
          priority={PRIORITY_FRAMES}
          fit="cover"
        />

        {/* legibility: darken the bottom and the two sides a touch */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(6,13,21,0.75),rgba(6,13,21,0.12)_42%,transparent_65%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(4,10,16,0.45))]" />

        {/* the opening frame is bright water and sky — a scrim under the words
            only while they are on screen, so nothing is darkened in the flight */}
        <div
          ref={scrimRef}
          style={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(290deg,rgba(5,12,20,0.6),rgba(5,12,20,0.26)_38%,transparent_64%)]"
        />

        {/* opening headline */}
        <div ref={headlineRef} className="pointer-events-none absolute bottom-[14vh] right-6 z-10 w-[min(56vw,660px)] lg:right-14">
          <div className="mb-5 inline-flex items-center gap-3 text-[13px] text-[var(--c-accent-2)]">
            <span className="h-px w-7 bg-[var(--c-accent-2)]/70" />
            Stomatologiya · Toshkent
          </div>
          <h1 className="text-[12vw] leading-[0.95] tracking-[-0.03em] text-white sm:text-5xl lg:text-[4.2rem]">
            <span className="block font-light text-white/90">Butun oila uchun</span>
            <span className="block font-semibold">sog&#8216;lom tabassum.</span>
          </h1>
          <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button variant="white" size="lg" onClick={onOpenConsultation} icon={<ArrowUpRight className="h-4 w-4" />}>
              Qabulga yozilish
            </Button>
            <Link
              to="/services"
              className="group inline-flex items-center gap-1.5 text-sm text-[var(--c-text)] underline decoration-white/25 underline-offset-[6px] transition-colors hover:text-white hover:decoration-[var(--c-accent)]"
            >
              Barcha xizmatlar
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* three numbers, bottom right — same as before */}
        <div ref={hintRef} className="pointer-events-none absolute bottom-[14vh] left-6 z-10 hidden items-end divide-x divide-white/15 lg:flex lg:left-14">
          {FACTS.map((f) => (
            <div key={f.label} className="px-6 first:pl-0 last:pr-0">
              <div className="font-serif text-3xl font-medium leading-none text-white">{f.value}</div>
              <div className="mt-1.5 text-[12px] text-[var(--c-text)]">{f.label}</div>
            </div>
          ))}
        </div>

        {/* the rock face lights up where each card breaks out of it */}
        {STOPS.map((stop, i) => (
          <div
            key={`rift-${stop.category.key}`}
            ref={(el) => {
              riftRefs.current[i] = el;
            }}
            style={{ opacity: 0 }}
            className={`pointer-events-none absolute top-1/2 z-10 h-[56vh] w-[34vw] -translate-y-1/2 ${
              stop.side === 'left' ? 'right-0' : 'left-0'
            }`}
          >
            <div className="h-full w-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(199,232,240,0.5),rgba(143,199,212,0.14)_45%,transparent_72%)] blur-[2px]" />
          </div>
        ))}

        {/* the four service cards, each breaking out of the headland it passes */}
        {STOPS.map((stop, i) => (
          <div
            key={stop.category.key}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            style={{ opacity: 0 }}
            className={`flight-card absolute top-1/2 z-20 w-[min(38vw,430px)] will-change-transform ${
              stop.side === 'left' ? 'left-6 lg:left-14' : 'right-6 lg:right-14'
            }`}
          >
            {/* the line it travelled out on, still tying it to the rock face */}
            <span
              aria-hidden="true"
              className={`flight-tether pointer-events-none absolute top-1/2 hidden lg:block ${
                stop.side === 'left' ? 'left-full' : 'right-full'
              }`}
            >
              <span className="flight-tether-line" />
              <span className="flight-tether-dot" />
            </span>

            <article className="flight-glass relative overflow-hidden rounded-[14px]">
              {/* the creases of the sheet it was, fading out as it opens */}
              <div
                ref={(el) => {
                  creaseRefs.current[i] = el;
                }}
                className="flight-crease"
                style={{ opacity: 0, visibility: 'hidden' }}
              />

              <div className="flight-card-el px-6 pt-6 lg:px-7">
                <div className="flex items-center gap-3 text-[12px] tracking-[0.14em] text-[var(--c-accent-2)]">
                  <span className="h-px w-6 bg-[var(--c-accent-2)]/70" />
                  {String(i + 1).padStart(2, '0')} / {String(STOPS.length).padStart(2, '0')}
                </div>
                <h2 className="mt-3 font-serif text-[clamp(1.4rem,2.1vw,1.9rem)] font-medium leading-[1.06] tracking-tight text-white">
                  {stop.category.label}
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-[var(--c-text-2)]">{stop.category.note}</p>
              </div>

              <ul className="mt-5 px-6 lg:px-7">
                {stop.items.map((title) => (
                  <li
                    key={title}
                    className="flight-card-el flex items-center gap-3 border-t border-white/[0.10] py-2.5 text-[14px] text-[var(--c-text)]"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--c-accent)]" />
                    {title}
                  </li>
                ))}
              </ul>

              <div className="flight-card-el mt-1 flex items-center justify-between gap-4 border-t border-white/[0.10] px-6 py-5 lg:px-7">
                <span className="text-[13px] text-[var(--c-text-3)]">{stop.items.length} ta xizmat</span>
                <Link
                  to={`/services#chapter-${stop.category.key}`}
                  className="group inline-flex items-center gap-2 text-[13px] font-medium text-white underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-[var(--c-accent)]"
                >
                  Batafsil
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          </div>
        ))}

        {/* stop dots + skip */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
          <ChevronDown className="h-4 w-4 animate-bounce text-white/60" />
          <div className="flex gap-1.5">
            {STOPS.map((s, i) => (
              <span
                key={s.category.key}
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                style={{ opacity: 0.25 }}
                className="h-1.5 w-1.5 rounded-full bg-white"
              />
            ))}
          </div>
        </div>
        <button
          onClick={skip}
          className="absolute bottom-6 right-6 z-20 rounded-full bg-[var(--c-bg)]/50 px-4 py-2 text-[12px] text-white/80 ring-1 ring-white/15 backdrop-blur-md transition-colors hover:text-white lg:right-14"
        >
          O‘tkazib yuborish
        </button>

        {/* the fog thickens until nothing is left of the landscape */}
        <div ref={fogRef} className="pointer-events-none absolute inset-0 z-30 bg-[var(--c-fog)]" style={{ opacity: 0 }} />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/** Phones / reduced motion: the flight's opening frame, no scroll choreography. */
function HeroStill({ onOpenConsultation }: Props) {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-[var(--c-bg-deep)] text-white">
      <img
        src="/hero-flight-poster.jpg"
        alt="Muzli fjord ustida suzayotgan tish — klinika sahnasi"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: '24% center' }} // keep the tooth in frame on portrait screens
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,13,21,0.85),rgba(6,13,21,0.15)_45%,transparent_70%)]" />
      <div className="absolute bottom-[12vh] left-6 z-10 max-w-2xl lg:left-14">
        <div className="mb-5 inline-flex items-center gap-3 text-[13px] text-[var(--c-accent-2)]">
          <span className="h-px w-7 bg-[var(--c-accent-2)]/70" />
          Stomatologiya · Toshkent
        </div>
        <h1 className="text-[13vw] leading-[0.95] tracking-[-0.03em] sm:text-6xl">
          <span className="block font-light text-white/90">Butun oila uchun</span>
          <span className="block font-semibold">sog&#8216;lom tabassum.</span>
        </h1>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button variant="white" size="lg" onClick={onOpenConsultation} icon={<ArrowUpRight className="h-4 w-4" />}>
            Qabulga yozilish
          </Button>
          <Link
            to="/services"
            className="group inline-flex items-center gap-1.5 text-sm text-[var(--c-text)] underline decoration-white/25 underline-offset-[6px] transition-colors hover:text-white"
          >
            Barcha xizmatlar
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
