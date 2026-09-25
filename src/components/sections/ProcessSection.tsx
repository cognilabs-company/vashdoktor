import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CalendarCheck, ScanLine, ClipboardList, Smile, type LucideIcon } from 'lucide-react';
import { Eyebrow } from '../services/Eyebrow';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export interface ProcessStep {
  icon: LucideIcon;
  step: string;
  title: string;
  text: string;
}

const STEPS: ProcessStep[] = [
  { icon: CalendarCheck, step: '01', title: 'Konsultatsiya', text: 'Shikoyatni tinglaymiz, og‘iz bo‘shlig‘ini ko‘ramiz.' },
  { icon: ScanLine, step: '02', title: 'Raqamli diagnostika', text: 'Rentgen va 3D skan — taxminsiz, aniq tashxis.' },
  { icon: ClipboardList, step: '03', title: 'Davolash rejasi', text: 'Bosqichlar, muddat va narx — oldindan.' },
  { icon: Smile, step: '04', title: 'Davolash & kuzatuv', text: 'Og‘riqsiz davolash va bepul nazorat ko‘riklari.' },
];

// The wave the four stops sit on (viewBox 1200×260, stretched to the grid).
// Stops are at the column centres: x = 150 / 450 / 750 / 1050, alternating
// y = 60 / 200 — so the copy below zigzags with the line.
const WAVE = 'M 150 60 C 300 60 300 200 450 200 S 600 60 750 60 S 900 200 1050 200 H 1200';
const PIN_DISTANCE = 1600; // px of scroll the pinned stage holds for (stop 1 → 4)
const NODE_X = [150, 450, 750, 1050];
const NODE_Y = [60, 200, 60, 200];
const SVG_H = 260;

interface Props {
  bg?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  steps?: ProcessStep[]; // defaults to the patient journey
  flow?: string; // ride the page background (data-bg) instead of a solid colour
}

/** Four stops on a wave. On desktop the stage PINS when it reaches the top of
 * the viewport: stop 1 is already lit, and scrolling draws the line on to
 * 2 → 3 → 4 before the section lets go. Small screens get a plain vertical
 * timeline. */
export function ProcessSection({
  bg = 'var(--c-bg-2)',
  eyebrow = 'Jarayon',
  title = 'Qanday ishlaymiz',
  subtitle,
  steps = STEPS,
  flow,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const reduced = useReducedMotion();
  const animate = isDesktop && !reduced;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const path = pathRef.current;
    if (!animate || !section || !stage || !path) return;
    const markers = markerRefs.current.filter(Boolean) as HTMLDivElement[];
    const nums = numRefs.current.filter(Boolean) as HTMLSpanElement[];

    // where along the wave (0..1) each stop's x lies — sampled once
    const total = path.getTotalLength();
    const at = NODE_X.map((x) => {
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i <= 200; i++) {
        const p = path.getPointAtLength((i / 200) * total);
        const d = Math.abs(p.x - x);
        if (d < bestD) {
          bestD = d;
          best = i / 200;
        }
      }
      return best;
    });

    const ctx = gsap.context(() => {
      // stop 1 is lit from the start
      if (markers[0]) gsap.set(markers[0], { scale: 1, autoAlpha: 1 });
      if (nums[0]) gsap.set(nums[0], { color: 'var(--c-accent)', opacity: 1 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${PIN_DISTANCE}`,
          pin: stage,
          pinSpacing: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          refreshPriority: -1,
        },
      });
      tl.fromTo(path, { attr: { 'stroke-dashoffset': 1 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 1 }, 0);
      at.forEach((t, i) => {
        if (i === 0) return;
        if (markers[i]) tl.fromTo(markers[i], { scale: 0.3, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.06, ease: 'back.out(2)' }, Math.max(0, t - 0.04));
        if (nums[i]) tl.to(nums[i], { color: 'var(--c-accent)', opacity: 1, duration: 0.08 }, Math.max(0, t - 0.03));
      });
    }, section);
    const r = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(r);
      ctx.revert();
    };
  }, [animate, steps]);

  return (
    <section
      ref={sectionRef}
      data-bg={flow}
      className={`relative w-full py-20 lg:py-0 ${flow ? '' : 'border-t border-white/10'}`}
      style={flow ? undefined : { backgroundColor: bg }}
    >
      {/* desktop: a full-height stage that pins while the line draws */}
      <div ref={stageRef} className="hidden h-[100svh] min-h-[640px] w-full flex-col justify-center lg:flex">
        <div className="mx-auto w-full max-w-[1440px] px-6 pt-16 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>{eyebrow}</Eyebrow>
              <h2 className="mt-4 font-serif text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.06] tracking-tight text-white">
                {title}
              </h2>
            </div>
            {subtitle && <p className="max-w-xs text-[14px] leading-snug text-[var(--c-text-3)]">{subtitle}</p>}
          </div>

          <div className="relative mt-12">
          <svg
            className="pointer-events-none absolute inset-x-0 top-0 w-full"
            style={{ height: SVG_H }}
            viewBox={`0 0 1200 ${SVG_H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d={WAVE} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} />
            <path
              ref={pathRef}
              d={WAVE}
              fill="none"
              stroke="var(--c-accent)"
              strokeWidth={1.5}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={animate ? 1 : 0}
              style={{ filter: 'drop-shadow(0 0 6px rgba(143,199,212,0.55))' }}
            />
          </svg>

          {/* stops: the icon rings sit exactly on the wave */}
          {steps.slice(0, 4).map((s, i) => (
            <div
              key={s.step}
              ref={(el) => {
                markerRefs.current[i] = el;
              }}
              className="absolute z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--c-accent)]/60 bg-[var(--c-bg)] text-[var(--c-accent-2)] shadow-[0_0_0_8px_rgba(10,20,29,1),0_0_30px_-6px_rgba(143,199,212,0.6)]"
              style={{ left: `${(NODE_X[i] / 1200) * 100}%`, top: NODE_Y[i], opacity: animate ? 0 : 1 }}
            >
              <s.icon className="h-5 w-5" strokeWidth={1.6} />
            </div>
          ))}

            <ol className="grid grid-cols-4 gap-8">
              {steps.slice(0, 4).map((s, i) => (
                <li key={s.step} className="text-center" style={{ paddingTop: NODE_Y[i] + 44 }}>
                  <span
                    ref={(el) => {
                      numRefs.current[i] = el;
                    }}
                    className="block font-serif text-[64px] font-light leading-none"
                    style={{ color: 'rgba(255,255,255,0.14)' }}
                  >
                    {s.step}
                  </span>
                  <h3 className="mt-3 font-serif text-xl font-medium tracking-tight text-white">{s.title}</h3>
                  <p className="mx-auto mt-2 max-w-[240px] text-[14px] leading-relaxed text-[var(--c-text-3)]">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* small screens: header + a vertical line */}
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:hidden">
        <div data-reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-4 font-serif text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.06] tracking-tight text-white">
            {title}
          </h2>
          {subtitle && <p className="mt-3 max-w-xs text-[14px] leading-snug text-[var(--c-text-3)]">{subtitle}</p>}
        </div>
        <ol className="relative mt-10 ml-5 border-l border-white/10" data-stagger>
          {steps.map((s) => (
            <li key={s.step} className="relative pb-10 pl-10 last:pb-0">
              <span className="absolute -left-6 top-0 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--c-accent)]/50 bg-[var(--c-bg)] text-[var(--c-accent-2)]">
                <s.icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <span className="font-serif text-[13px] text-[var(--c-accent)]">{s.step}</span>
              <h3 className="mt-1 font-serif text-xl font-medium tracking-tight text-white">{s.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--c-text-3)]">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
