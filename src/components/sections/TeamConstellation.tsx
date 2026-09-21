import { useLayoutEffect, useRef, useState, type Ref } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown, GraduationCap, ShieldCheck } from 'lucide-react';
import type { Doctor } from '../../lib/doctors';
import { FOUNDER } from '../../lib/founder';
import { CLINIC_CONFIG } from '../../lib/clinicConfig';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { Portrait } from '../ui/Portrait';

gsap.registerPlugin(ScrollTrigger);

/**
 * Doctors-page "constellation": the chief doctor sits alone in the centre of a
 * pinned stage. As the visitor scrolls, four team members slide out one by one
 * from BEHIND the chief's portrait to the left, right, bottom-left and
 * bottom-right — each with its own card design — and a thin line ties every
 * one of them back to the chief (the "school").
 *
 * Desktop (≥1024px, ≥640px tall) = pinned, scroll-scrubbed GSAP timeline.
 * Tablet / mobile / reduced-motion = the same cards stacked, normal reveals.
 */
interface Props {
  doctors: Doctor[]; // the first four orbit the chief, in slot order below
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

// Slot order, the tilt each card carries while it is still tucked behind the
// portrait, and when it starts on the 0..1 scrubbed timeline.
const SLOTS = [
  { key: 'left', at: 0.14, rotate: -7 },
  { key: 'right', at: 0.34, rotate: 6 },
  { key: 'bottom-left', at: 0.54, rotate: 5 },
  { key: 'bottom-right', at: 0.74, rotate: -6 },
] as const;
const EMERGE = 0.2; // timeline share each card takes to leave the deck and settle

const pad2 = (n: number) => String(n).padStart(2, '0');

/* -------------------------------------------------------------------------- */
/*  Cards — one design per direction                                           */
/* -------------------------------------------------------------------------- */

const CARD_HOVER =
  'transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#8fc7d4]/40 hover:shadow-[0_24px_60px_-28px_rgba(143,199,212,0.55)]';

/** Centre: the chief — bigger, haloed, a slow-turning light ring, and a faint
 * "deck" of ghost cards behind the portrait that the team emerges from. */
function ChiefCard({ fluid, ghostsRef, portraitRef }: {
  fluid?: boolean;
  ghostsRef?: (el: HTMLDivElement | null) => void;
  portraitRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="pointer-events-none absolute left-1/2 top-[40%] -z-10 h-[130%] w-[170%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(143,199,212,0.24),transparent_62%)] blur-2xl" />

      <div ref={portraitRef} className="chief-ring relative">
        {/* ghost deck — hints that more cards are stacked behind */}
        {!fluid && (
          <div ref={ghostsRef} className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 -rotate-[7deg] scale-[0.92] rounded-[26px] border border-white/10 bg-[#0f1f2a]" />
            <div className="absolute inset-0 rotate-[5deg] scale-[0.96] rounded-[26px] border border-white/10 bg-[#0e1d28]" />
          </div>
        )}
        <div className="relative overflow-hidden rounded-[26px] bg-[#0d2230] ring-1 ring-[#8fc7d4]/50 shadow-[0_30px_90px_-20px_rgba(143,199,212,0.5)]">
          <Portrait
            photo={FOUNDER.photo}
            name={FOUNDER.name}
            rounded="rounded-none"
            loading="eager"
            className={fluid ? 'aspect-[4/5] w-full' : 'aspect-[4/5] h-[min(46vh,520px)] w-auto'}
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,20,29,0.8),rgba(10,20,29,0.1)_50%,transparent)]" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#0a141d]/85 px-3 py-1 text-[11px] font-medium text-[#a9d8e4] ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8fc7d4]" />
            {FOUNDER.title}
          </span>
          <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#8fc7d4] text-[#0a141d] shadow-[0_6px_20px_-4px_rgba(143,199,212,0.8)]" title="Klinika asoschisi">
            <ShieldCheck className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <div className="absolute inset-x-0 bottom-0 p-5 text-left">
            <h2 className="font-serif text-[clamp(1.4rem,2.2vw,1.9rem)] font-medium leading-tight tracking-tight text-white">
              {FOUNDER.name}
            </h2>
            <p className="mt-1 text-[12px] text-[#a9d8e4]">{FOUNDER.credentials}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-stretch divide-x divide-white/10">
        {FOUNDER.heroStats.slice(0, 3).map((s) => (
          <div key={s.label} className="px-4 text-center first:pl-0 last:pr-0">
            <div className="font-serif text-lg font-medium text-white">{s.value}</div>
            <div className="text-[10px] leading-tight text-[#8fb0ba]">{s.label}</div>
          </div>
        ))}
      </div>

      <Link
        to="/bosh-shifokor"
        className="group mt-4 inline-flex items-center gap-2 rounded-full border border-[#8fc7d4]/30 bg-[#8fc7d4]/10 px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#8fc7d4]/20"
      >
        Bosh shifokor haqida
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

/** Left: horizontal "dossier" strip — photo beside the facts, an experience
 * meter, accent edge. */
function DossierCard({ d, index }: { d: Doctor; index: number }) {
  const years = Math.min(20, parseInt(d.experience, 10) || 0);
  return (
    <article className={`flex gap-4 rounded-2xl border border-white/10 border-l-2 border-l-[#8fc7d4] bg-[linear-gradient(135deg,#132836,#0f1f2a_60%)] p-4 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.8)] ${CARD_HOVER}`}>
      <div className="relative shrink-0">
        <Portrait photo={d.photo} name={d.name} rounded="rounded-xl" loading="eager" className="h-24 w-20" />
        <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-[#8fc7d4] font-mono text-[11px] font-semibold text-[#0a141d] shadow-md">
          {pad2(index)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5c7580]">{d.role}</div>
        <h3 className="mt-1 truncate font-serif text-base font-medium tracking-tight text-white">{d.name}</h3>
        {/* experience meter — one segment per ~2 years, capped at 20 */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex gap-[3px]">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className={`h-2 w-1.5 rounded-sm ${i < Math.round(years / 2) ? 'bg-[#8fc7d4]' : 'bg-white/10'}`} />
            ))}
          </div>
          <span className="text-[11px] text-[#8fc7d4]">{d.experience}</span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1">
          {d.tags.slice(0, 2).map((t) => (
            <span key={t} className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-[#8fb0ba] ring-1 ring-white/10">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

/** Right: tall editorial portrait — text lives inside the photo, big index
 * watermark, tags at the foot. */
function PortraitCard({ d, index }: { d: Doctor; index: number }) {
  return (
    <article className={`relative aspect-[3/4] overflow-hidden rounded-[22px] border border-white/10 bg-[#0f1f2a] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.8)] ${CARD_HOVER}`}>
      <Portrait photo={d.photo} name={d.name} rounded="rounded-none" loading="eager" className="h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,20,29,0.95)_0%,rgba(10,20,29,0.45)_45%,transparent_72%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8fc7d4]/70 to-transparent" />
      <span className="pointer-events-none absolute -right-1 -top-3 font-serif text-[64px] font-medium leading-none text-white/[0.08]">
        {pad2(index)}
      </span>
      <span className="absolute left-3 top-3 rounded-full bg-[#0a141d]/85 px-2.5 py-1 text-[10px] font-medium text-[#a9d8e4] ring-1 ring-white/10">
        {d.experience}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a9d8e4]">{d.role}</div>
        <h3 className="mt-1 font-serif text-lg font-medium leading-tight tracking-tight text-white">{d.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-[12px] leading-snug text-[#c6dbe1]">{d.bio}</p>
        <div className="mt-2.5 flex flex-wrap gap-1">
          {d.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-[#0a141d]/60 px-2 py-0.5 text-[10px] text-white/80">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

/** Bottom-left: a clinic ID badge — header band with a lanyard slot, avatar
 * overlapping the band, centred facts, relation footer. */
function BadgeCard({ d, index }: { d: Doctor; index: number }) {
  return (
    <article className={`overflow-hidden rounded-2xl border border-white/10 bg-[#0f1f2a] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.8)] ${CARD_HOVER}`}>
      <div className="relative h-16 bg-[linear-gradient(120deg,#1a4a5a,#0f2836)]">
        <span className="absolute left-1/2 top-2.5 h-1.5 w-10 -translate-x-1/2 rounded-full bg-[#0a141d]/70 ring-1 ring-white/10" />
        <div className="absolute inset-x-4 bottom-2.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-[#a9d8e4]/80">
          <span>{CLINIC_CONFIG.name}</span>
          <span>ID · {pad2(index)}</span>
        </div>
      </div>
      <div className="-mt-9 px-5 pb-5 text-center">
        <div className="relative z-10 mx-auto h-[76px] w-[76px] overflow-hidden rounded-full ring-4 ring-[#0f1f2a]">
          <Portrait photo={d.photo} name={d.name} rounded="rounded-full" loading="eager" className="h-full w-full" />
        </div>
        <h3 className="mt-3 font-serif text-base font-medium tracking-tight text-white">{d.name}</h3>
        <div className="mt-0.5 text-[12px] text-[#8fc7d4]">{d.role}</div>
        <div className="mt-0.5 text-[11px] text-[#8fb0ba]">{d.experience}</div>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {d.tags.map((t) => (
            <span key={t} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] text-[#8fb0ba] ring-1 ring-white/10">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-dashed border-white/10 pt-3 text-[11px] text-[#7f9aa4]">
          <GraduationCap className="h-3.5 w-3.5 text-[#8fc7d4]/70" />
          {d.relation}
        </div>
      </div>
    </article>
  );
}

/** Bottom-right: quote card — the bio reads as the doctor's own words; the
 * author line sits at the foot like a signature. */
function QuoteCard({ d, index }: { d: Doctor; index: number }) {
  return (
    <article className={`relative rounded-2xl border border-white/10 bg-[linear-gradient(160deg,#122a38,#0b1720)] p-5 pt-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.8)] ${CARD_HOVER}`}>
      <span className="pointer-events-none absolute left-4 top-1 font-serif text-[72px] leading-none text-[#8fc7d4]/20">“</span>
      <span className="absolute right-4 top-4 font-mono text-[10px] tracking-[0.2em] text-[#5c7580]">{pad2(index)}</span>
      <p className="relative mt-3 line-clamp-3 pl-6 text-[13px] italic leading-relaxed text-[#dbe8ec]">{d.bio}</p>
      <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-[#8fc7d4]/40">
          <Portrait photo={d.photo} name={d.name} rounded="rounded-full" loading="eager" className="h-full w-full" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-serif text-[15px] font-medium tracking-tight text-white">{d.name}</h3>
          <div className="text-[11px] text-[#8fb0ba]">
            <span className="text-[#8fc7d4]">{d.role}</span> · {d.experience}
          </div>
        </div>
      </div>
    </article>
  );
}

const CARD_BY_SLOT = [DossierCard, PortraitCard, BadgeCard, QuoteCard] as const;

/* -------------------------------------------------------------------------- */
/*  Desktop: pinned, scroll-scrubbed stage                                     */
/* -------------------------------------------------------------------------- */

function ConstellationStage({ doctors, eyebrow, title, subtitle }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chiefRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const ghostsRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const satRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const [revealed, setRevealed] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const chief = chiefRef.current;
    const portrait = portraitRef.current;
    const sats = satRefs.current.filter(Boolean) as HTMLDivElement[];
    const lines = lineRefs.current.filter(Boolean) as SVGLineElement[];
    const dots = dotRefs.current.filter(Boolean) as SVGCircleElement[];
    if (!section || !stage || !chief || !portrait || sats.length !== SLOTS.length) return;

    // Geometry in stage-local px. Cards are mid-flight (translated) while
    // measuring, so subtract GSAP's x/y and use offsetWidth/Height (layout
    // size, unaffected by scale/rotate).
    //  - origin[i]: where card i must sit to be centred behind the portrait
    //  - connector lines: chief edge → card edge
    const GAP = 14;
    type Box = { cx: number; cy: number; hw: number; hh: number };
    const origin = SLOTS.map(() => ({ x: 0, y: 0 }));
    const measure = () => {
      const s = stage.getBoundingClientRect();
      const box = (el: HTMLElement): Box => {
        const r = el.getBoundingClientRect();
        const tx = Number(gsap.getProperty(el, 'x')) || 0;
        const ty = Number(gsap.getProperty(el, 'y')) || 0;
        return {
          cx: r.left - s.left + r.width / 2 - tx,
          cy: r.top - s.top + r.height / 2 - ty,
          hw: el.offsetWidth / 2,
          hh: el.offsetHeight / 2,
        };
      };
      const edge = (from: Box, toward: Box) => {
        const dx = toward.cx - from.cx;
        const dy = toward.cy - from.cy;
        const len = Math.hypot(dx, dy) || 1;
        const t = Math.min(from.hw / (Math.abs(dx) || 1e-6), from.hh / (Math.abs(dy) || 1e-6));
        return { x: from.cx + dx * t + (dx / len) * GAP, y: from.cy + dy * t + (dy / len) * GAP };
      };
      // the chief's transform scales the whole column; the portrait's centre
      // is what the cards hide behind
      const chiefScale = Number(gsap.getProperty(chief, 'scale')) || 1;
      const chiefY = Number(gsap.getProperty(chief, 'y')) || 0;
      const c = box(chief);
      const pr = portrait.getBoundingClientRect();
      const p = {
        cx: c.cx + (pr.left - s.left + pr.width / 2 - c.cx) / chiefScale,
        cy: c.cy + (pr.top - s.top + pr.height / 2 - chiefY - c.cy) / chiefScale,
      };
      sats.forEach((el, i) => {
        const b = box(el);
        origin[i] = { x: p.cx - b.cx, y: p.cy - b.cy };
        const a = edge(c, b);
        const z = edge(b, c);
        lines[i].setAttribute('x1', a.x.toFixed(1));
        lines[i].setAttribute('y1', a.y.toFixed(1));
        lines[i].setAttribute('x2', z.x.toFixed(1));
        lines[i].setAttribute('y2', z.y.toFixed(1));
        dots[i].setAttribute('cx', z.x.toFixed(1));
        dots[i].setAttribute('cy', z.y.toFixed(1));
      });
    };
    measure(); // origins must exist before the timeline's immediate render

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=3000',
          pin: stage,
          pinSpacing: true,
          scrub: 0.8,
          invalidateOnRefresh: true, // re-reads the function-based origins
          refreshPriority: -1,
          onRefreshInit: measure,
          onRefresh: measure,
          onUpdate: (self) => {
            const p = self.progress;
            let n = 0;
            for (const slot of SLOTS) if (p >= slot.at + EMERGE * 0.6) n++;
            setRevealed((prev) => (prev === n ? prev : n));
          },
        },
      });

      // 1) the chief alone — settles from a slightly larger, lower pose
      tl.fromTo(chief, { scale: 1.06, y: 24 }, { scale: 1, y: 0, duration: 0.2 }, 0);
      if (hintRef.current) tl.to(hintRef.current, { autoAlpha: 0, duration: 0.06 }, 0.02);
      // the ghost deck thins out as the real cards leave it
      if (ghostsRef.current) tl.to(ghostsRef.current, { autoAlpha: 0, duration: 0.3 }, SLOTS[1].at);

      // 2) team members slide out from behind the portrait, one by one
      SLOTS.forEach((slot, i) => {
        tl.fromTo(
          sats[i],
          { x: () => origin[i].x, y: () => origin[i].y, scale: 0.7, rotate: slot.rotate },
          { x: 0, y: 0, scale: 1, rotate: 0, duration: EMERGE, ease: 'power2.out' },
          slot.at
        );
        // becomes visible while still tucked behind the portrait
        tl.fromTo(sats[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: EMERGE * 0.3 }, slot.at);
        tl.fromTo(
          lines[i],
          { attr: { 'stroke-dashoffset': 1 } },
          { attr: { 'stroke-dashoffset': 0 }, duration: EMERGE * 0.6 },
          slot.at + EMERGE * 0.5
        );
        tl.fromTo(
          dots[i],
          { attr: { r: 0 }, autoAlpha: 0 },
          { attr: { r: 4 }, autoAlpha: 1, duration: 0.04 },
          slot.at + EMERGE
        );
      });
    }, section);

    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(stage);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    // refresh after the rest of the page has laid out (images, fonts)
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      window.clearTimeout(t);
      ro.disconnect();
      ctx.revert();
    };
  }, []);

  const [left, right, bottomLeft, bottomRight] = doctors;

  return (
    <section ref={sectionRef} className="relative w-full bg-[#0b1720]">
      <div ref={stageRef} className="relative flex h-[100svh] min-h-[640px] w-full flex-col overflow-hidden">
        {/* backdrop: glow + faint grid + orbit rings around the centre */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#0f2836_0%,#0b1720_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="pointer-events-none absolute left-1/2 top-[54%] h-[68vh] w-[68vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />
        <div className="pointer-events-none absolute left-1/2 top-[54%] h-[96vh] w-[96vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.04]" />

        {/* connectors — drawn under the cards, so they appear to run edge-to-edge */}
        <svg className="pointer-events-none absolute inset-0 z-[1] h-full w-full" aria-hidden="true">
          {SLOTS.map((slot, i) => (
            <g key={slot.key}>
              <line
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1}
                stroke="rgba(143,199,212,0.45)"
                strokeWidth={1}
              />
              <circle
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                r={0}
                fill="#8fc7d4"
                style={{ opacity: 0 }}
              />
            </g>
          ))}
        </svg>

        {/* heading — clears the fixed navbar; subtitle only when there is room */}
        <div className="relative z-[3] shrink-0 px-6 pt-[clamp(76px,10vh,96px)] text-center" data-reveal>
          <TechnicalBadge label={eyebrow ?? 'Jamoa'} variant="dark" />
          <h1 className="mt-4 font-serif text-[clamp(1.8rem,3.2vw,2.6rem)] font-medium leading-[1.02] tracking-tight text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-2.5 hidden max-w-xl text-[13px] leading-relaxed text-[#a7c2cb] [@media(min-height:800px)]:block">
              {subtitle}
            </p>
          )}
        </div>

        {/* stage grid: [ left column | chief | right column ] */}
        <div className="relative z-[2] mx-auto grid min-h-0 w-full max-w-[1440px] flex-1 grid-cols-[1fr_auto_1fr] items-center gap-x-8 px-6 pb-[52px] pt-4 sm:px-8 lg:px-12">
          <div className="flex h-full min-w-0 flex-col justify-between">
            <div
              ref={(el) => {
                satRefs.current[0] = el;
              }}
              className="w-[min(100%,330px)] self-start will-change-transform"
            >
              {left && <DossierCard d={left} index={1} />}
            </div>
            <div
              ref={(el) => {
                satRefs.current[2] = el;
              }}
              className="mr-[2vw] w-[min(100%,290px)] self-end will-change-transform"
            >
              {bottomLeft && <BadgeCard d={bottomLeft} index={3} />}
            </div>
          </div>

          <div ref={chiefRef} className="relative z-10 will-change-transform">
            <ChiefCard
              portraitRef={portraitRef}
              ghostsRef={(el) => {
                ghostsRef.current = el;
              }}
            />
          </div>

          <div className="flex h-full min-w-0 flex-col justify-between">
            <div
              ref={(el) => {
                satRefs.current[1] = el;
              }}
              className="w-[min(100%,clamp(180px,27vh,240px))] self-end will-change-transform"
            >
              {right && <PortraitCard d={right} index={2} />}
            </div>
            <div
              ref={(el) => {
                satRefs.current[3] = el;
              }}
              className="ml-[2vw] w-[min(100%,330px)] self-start will-change-transform"
            >
              {bottomRight && <QuoteCard d={bottomRight} index={4} />}
            </div>
          </div>
        </div>

        {/* footer: scroll hint (fades out) + reveal counter */}
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-[3] flex items-end justify-between px-6 sm:px-8 lg:px-12">
          <div ref={hintRef} className="flex items-center gap-2 text-[11px] text-[#7f9aa4]">
            <ChevronDown className="h-4 w-4 animate-bounce text-[#8fc7d4]" />
            Pastga suring — jamoa bilan tanishing
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: SLOTS.length + 1 }, (_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${i <= revealed ? 'w-5 bg-[#8fc7d4]' : 'w-2 bg-white/15'}`}
                />
              ))}
            </div>
            <div className="font-mono text-[11px] tracking-[0.2em] text-[#5c7580]">
              <span className="text-[#a9d8e4]">{pad2(revealed + 1)}</span> / {pad2(SLOTS.length + 1)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tablet / mobile / reduced-motion: the same cards, stacked                  */
/* -------------------------------------------------------------------------- */

function TeamStack({ doctors, eyebrow, title, subtitle }: Props) {
  const REVEAL = ['left', 'right', 'left', 'right'] as const;
  return (
    <section className="relative w-full overflow-hidden bg-[#0b1720] pb-20 pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(ellipse_at_50%_0%,#0f2836_0%,#0b1720_60%)]" />
      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <TechnicalBadge label={eyebrow ?? 'Jamoa'} variant="dark" />
          <h1 className="mt-5 font-serif text-[clamp(2rem,6vw,3rem)] font-medium leading-[1.02] tracking-tight text-white">
            {title}
          </h1>
          {subtitle && <p className="mt-4 text-base leading-relaxed text-[#a7c2cb]">{subtitle}</p>}
        </div>

        <div className="mx-auto mt-12 max-w-[360px]" data-reveal="scale">
          <ChiefCard fluid />
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-5 sm:grid-cols-2">
          {doctors.slice(0, SLOTS.length).map((d, i) => {
            const Card = CARD_BY_SLOT[i];
            return (
              <div key={d.id} data-reveal={REVEAL[i]}>
                <Card d={d} index={i + 1} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function TeamConstellation(props: Props) {
  const isDesktop = useMediaQuery('(min-width: 1024px) and (min-height: 640px)');
  const reduced = useReducedMotion();
  return isDesktop && !reduced ? <ConstellationStage {...props} /> : <TeamStack {...props} />;
}
