import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { SERVICES, SERVICE_CATEGORIES, type Service, type ServiceCategory } from '../../lib/services';
import { Eyebrow } from './Eyebrow';
import { FLOW } from '../../lib/flow';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { scrollToEl } from '../../lib/scroll';

const STICKY_TOP = 96; // px below the fixed navbar
const STEP = 14; // each stacked card peeks this much below the previous one

interface Props {
  onPickCategory: (key: ServiceCategory) => void;
  onOpenService: (s: Service) => void;
}

/** Category "chapters" as scroll-stacking spreads: each one sticks under the
 * navbar and the next slides over it while the covered one eases back.
 * Dimming is done with a plain overlay — animating `filter` on a large
 * composited layer made Chrome paint the card black mid-scroll. */
export function ServiceChapters({ onPickCategory, onOpenService }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const reduced = useReducedMotion();
  const stack = isDesktop && !reduced;

  useLayoutEffect(() => {
    if (!stack || !rootRef.current) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        const shade = shadeRefs.current[i];
        if (!next || !shade) return;
        gsap
          .timeline({
            scrollTrigger: {
              trigger: next,
              start: 'top bottom',
              end: `top ${STICKY_TOP + STEP * (i + 1)}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .to(card, { scale: 0.95, ease: 'none' }, 0)
          .to(shade, { opacity: 0.55, ease: 'none' }, 0);
      });
    }, rootRef);
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, [stack]);

  return (
    <section data-bg={FLOW.teal} className="relative w-full py-16 lg:py-24">
      {/* bridge from the photo hero above */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--c-bg-deep)] to-transparent" />
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-7">
            <Eyebrow>Yo‘nalishlar</Eyebrow>
            <h2 className="mt-5 font-serif text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.06] tracking-tight text-white">
              To‘rt yo‘nalish
            </h2>
          </div>
        </div>

        <div ref={rootRef} className={`mt-14 ${stack ? 'space-y-[16vh] pb-[8vh]' : 'space-y-8'}`}>
          {SERVICE_CATEGORIES.map((cat, i) => {
            const items = SERVICES.filter((s) => s.category === cat.key);
            return (
              <div
                key={cat.key}
                id={`chapter-${cat.key}`}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={stack ? 'sticky origin-top will-change-transform' : ''}
                style={stack ? { top: STICKY_TOP + STEP * i } : undefined}
                data-reveal={stack ? undefined : 'up'}
              >
                <article className="relative grid overflow-hidden rounded-[28px] border border-white/10 bg-[var(--c-bg-3)] lg:min-h-[560px] lg:grid-cols-2">
                  {/* copy */}
                  <div className="flex flex-col p-7 sm:p-9 lg:p-12">
                    <div className="flex items-end justify-between">
                      <span className="font-serif text-6xl font-light leading-none text-white/[0.14]">{String(i + 1).padStart(2, '0')}</span>
                      <span className="pb-1 text-[13px] text-[var(--c-text-4)]">{items.length} ta xizmat</span>
                    </div>
                    <h3 className="mt-6 font-serif text-[clamp(1.7rem,2.8vw,2.4rem)] font-medium leading-[1.08] tracking-tight text-white">
                      {cat.label}
                    </h3>
                    <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--c-text-2)]">{cat.note}</p>

                    <ol className="mt-8 border-t border-white/10">
                      {items.map((s) => (
                        <li key={s.slug} className="border-b border-white/10">
                          <button onClick={() => onOpenService(s)} className="group flex w-full items-baseline gap-4 py-3.5 text-left">
                            <span className="w-6 shrink-0 font-serif text-[12px] text-[var(--c-text-5)]">{s.eyebrow}</span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[15px] font-medium text-white transition-colors group-hover:text-[var(--c-accent)]">{s.title}</span>
                              <span className="mt-0.5 block text-[13px] leading-snug text-[var(--c-text-3)]">{s.short}</span>
                            </span>
                            <ArrowUpRight className="h-4 w-4 shrink-0 self-center text-[var(--c-text-5)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--c-accent)]" />
                          </button>
                        </li>
                      ))}
                    </ol>

                    <div className="mt-auto pt-7">
                      <button
                        onClick={() => {
                          onPickCategory(cat.key);
                          scrollToEl('#catalog');
                        }}
                        className="group inline-flex items-center gap-1.5 text-[14px] text-[var(--c-text)] underline decoration-white/25 underline-offset-[6px] transition-colors hover:text-white hover:decoration-[var(--c-accent)]"
                      >
                        Yo‘nalishning to‘liq ro‘yxati
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>

                  {/* photo with a caption, like a magazine spread */}
                  <figure className="relative min-h-[260px] lg:min-h-0">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--c-bg-3)] via-[var(--c-bg-3)]/70 to-transparent px-6 pb-5 pt-14 text-[12px] leading-snug text-[var(--c-text)]">
                      {cat.caption}
                    </figcaption>
                  </figure>

                  {/* dimmer for when the next chapter covers this one */}
                  <div
                    ref={(el) => {
                      shadeRefs.current[i] = el;
                    }}
                    className="pointer-events-none absolute inset-0 rounded-[28px] bg-[#07111a] opacity-0"
                  />
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
