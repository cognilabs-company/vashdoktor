import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { TechnicalBadge } from '../ui/TechnicalBadge';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface HeroProps {
  onOpenConsultation: () => void;
  onOpen3DViewer?: () => void;
}

interface Stat {
  key: string;
  to: number;
  decimals: number;
  thousands?: boolean;
  suffix?: string;
  prefix?: string;
  staticLabel?: string; // non-numeric display (e.g. "Grade 5")
  unit?: string;
  caption: string;
}

const STATS: Stat[] = [
  { key: 'acc', to: 0.075, decimals: 3, unit: 'mm', caption: '3D CBCT Accuracy' },
  { key: 'osseo', to: 99.2, decimals: 1, unit: '%', caption: 'Osseointegration Rate' },
  { key: 'grade', to: 0, decimals: 0, staticLabel: 'Grade 5', caption: 'Titanium SLA Texture' },
  { key: 'mpa', to: 1200, decimals: 0, thousands: true, unit: 'MPa', caption: 'Monolithic Zirconia' },
];

function formatNumber(v: number, decimals: number, thousands?: boolean): string {
  const fixed = v.toFixed(decimals);
  if (!thousands) return fixed;
  const [intPart, dec] = fixed.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return dec ? `${grouped}.${dec}` : grouped;
}

export function Hero({ onOpenConsultation, onOpen3DViewer }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const prefersReducedMotion = useReducedMotion();

  const scrollToStory = () => {
    const storyElem = document.getElementById('implant-story');
    if (storyElem) storyElem.scrollIntoView({ behavior: 'smooth' });
  };

  useLayoutEffect(() => {
    const setFinal = () => {
      STATS.forEach((s) => {
        const el = numberRefs.current[s.key];
        if (el && !s.staticLabel) el.textContent = formatNumber(s.to, s.decimals, s.thousands);
      });
    };

    if (prefersReducedMotion) {
      setFinal();
      return;
    }

    const ctx = gsap.context(() => {
      // Reveal choreography for the whole hero
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('[data-hero="eyebrow"]', { autoAlpha: 0, y: 16, duration: 0.7 })
        .from(
          '[data-hero="line"]',
          { yPercent: 115, autoAlpha: 0, duration: 1.0, stagger: 0.1, ease: 'power4.out' },
          '-=0.35'
        )
        .from(
          '[data-hero="sub"]',
          { autoAlpha: 0, y: 20, duration: 0.8 },
          '-=0.6'
        )
        .from(
          '[data-hero="cta"]',
          { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.12 },
          '-=0.5'
        )
        .from(
          '[data-hero="stat"]',
          { autoAlpha: 0, y: 24, duration: 0.7, stagger: 0.09 },
          '-=0.35'
        )
        .from(
          '[data-hero="footer"]',
          { autoAlpha: 0, y: 10, duration: 0.6 },
          '-=0.4'
        );

      // Count-up the numeric stats in sync with their card reveal
      STATS.forEach((s, i) => {
        if (s.staticLabel) return;
        const el = numberRefs.current[s.key];
        if (!el) return;
        const proxy = { v: 0 };
        tl.to(
          proxy,
          {
            v: s.to,
            duration: 1.3,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = formatNumber(proxy.v, s.decimals, s.thousands);
            },
          },
          0.9 + i * 0.09
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[92vh] sm:min-h-[95vh] w-full pt-32 pb-16 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#F7F8F6] via-[#FFFFFF] to-[#F5F7F4]"
    >
      {/* Animated Aurora Glows */}
      <div className="hero-aurora hero-aurora--a pointer-events-none -z-10" />
      <div className="hero-aurora hero-aurora--b pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-[#246B5B]/5 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Subtle Micro-Grid */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#14201c05_1px,transparent_1px),linear-gradient(to_bottom,#14201c05_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 w-full flex-1 flex flex-col justify-center my-auto">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div data-hero="eyebrow" className="flex items-center gap-3 mb-6 flex-wrap">
            <TechnicalBadge code="IMPLANT DENTISTRY" label="DIGITAL PRECISION" />
            <span className="hidden sm:inline-block text-[11px] text-[#747D79] font-mono">
              • SWISS SURGICAL STANDARDS
            </span>
          </div>

          {/* Main Display Headline — each line clips + rises on load */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.4rem] font-medium font-serif tracking-tight text-[#101715] leading-[1.08]">
            <span className="block overflow-hidden pb-1">
              <span data-hero="line" className="block">A tooth,</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span data-hero="line" className="block">rebuilt from</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span data-hero="line" className="block font-medium text-[#173D35]">
                the foundation.
              </span>
            </span>
          </h1>

          {/* Subheading */}
          <p
            data-hero="sub"
            className="mt-6 text-lg sm:text-xl text-[#747D79] max-w-2xl font-light leading-relaxed"
          >
            From digital planning to the final crown — every layer is designed around precision, stability and a natural result.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div data-hero="cta">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenConsultation}
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Book a consultation
              </Button>
            </div>

            <button
              data-hero="cta"
              onClick={scrollToStory}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#F5F7F4] text-sm font-medium text-[#101715] border border-black/10 shadow-2xs transition-all cursor-pointer group"
            >
              <span>See how it works</span>
              <ChevronDown className="h-4 w-4 text-[#286A5B] transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>

          {/* Clinical Specification Highlights */}
          <div className="mt-14 pt-8 border-t border-black/8 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl">
            {STATS.map((s) => (
              <div key={s.key} data-hero="stat">
                <div className="text-2xl sm:text-3xl font-serif text-[#173D35] tabular-nums">
                  {s.staticLabel ? (
                    s.staticLabel
                  ) : (
                    <>
                      <span
                        ref={(el) => {
                          numberRefs.current[s.key] = el;
                        }}
                      >
                        {formatNumber(prefersReducedMotion ? s.to : 0, s.decimals, s.thousands)}
                      </span>
                      {s.unit && (
                        <span className="text-sm font-sans font-light text-[#747D79]">{s.unit}</span>
                      )}
                    </>
                  )}
                </div>
                <div className="text-[11px] font-mono text-[#747D79] uppercase mt-1">{s.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <div
        data-hero="footer"
        className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 w-full flex items-center justify-between text-xs text-[#747D79] pt-6 border-t border-black/5"
      >
        <button
          onClick={scrollToStory}
          className="flex items-center gap-2 hover:text-[#101715] transition-colors cursor-pointer group"
        >
          <ChevronDown className="h-4 w-4 text-[#286A5B] animate-bounce" />
          <span className="font-mono text-[11px] uppercase tracking-wider">
            Scroll down to enter 3D anatomical story
          </span>
        </button>

        <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono text-[#747D79]">
          <span>HARLEY STREET, LONDON</span>
          <span>•</span>
          <span>ACCEPTED BY REFERRAL</span>
        </div>
      </div>
    </section>
  );
}
