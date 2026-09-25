import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { Section } from '../lib/content';
import { Button } from '../../components/ui/Button';

interface Props {
  section: Section;
  index: number;
  panelRefs: React.MutableRefObject<Array<HTMLDivElement | null>>;
  reduced: boolean;
  onOpenConsultation: () => void;
}

/**
 * One pinned section. The tall wrapper reserves scroll length; the inner panel
 * is sticky so it holds on screen while the 3D animates. The engine writes the
 * panel's entrance/exit opacity+blur+transform; on becoming active it plays a
 * staggered word reveal (transform+blur only, so the engine keeps ownership of
 * opacity — the text can never get stuck hidden).
 */
export function SectionBlock({ section, index, panelRefs, reduced, onOpenConsultation }: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const revealed = useRef(false);

  useEffect(() => {
    if (reduced) return;
    const onActive = (e: Event) => {
      const detail = (e as CustomEvent).detail as { index: number };
      if (detail.index !== index || revealed.current) return;
      revealed.current = true;
      const words = panelRef.current?.querySelectorAll<HTMLElement>('.exp-word');
      if (!words || !words.length) return;
      gsap.from(words, {
        yPercent: 70,
        filter: 'blur(7px)',
        duration: 0.72,
        stagger: 0.045,
        ease: 'power3.out',
        clearProps: 'filter',
      });
    };
    window.addEventListener('section:active', onActive);
    return () => window.removeEventListener('section:active', onActive);
  }, [index, reduced]);

  const { layout } = section;
  const alignClass =
    layout === 'right'
      ? 'lg:ml-auto lg:text-left'
      : layout === 'center'
      ? 'mx-auto text-center items-center'
      : 'lg:mr-auto';

  return (
    <section className="relative w-full" style={{ height: `${section.vh}vh` }}>
      <div className="sticky top-0 h-[100svh] flex items-center overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-14">
          <div
            ref={(el) => {
              panelRef.current = el;
              panelRefs.current[index] = el;
            }}
            className={`relative z-10 flex flex-col max-w-md lg:max-w-[40%] will-change-transform ${alignClass}`}
          >
            {/* readability scrim (mobile/tablet, where text sits over the object) */}
            <div className="absolute -inset-10 -z-10 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_center,rgba(8,16,24,0.72),rgba(8,16,24,0)_74%)]" />

            <div className="text-[11px] font-mono tracking-[0.24em] text-[var(--c-accent)] uppercase mb-5">
              {section.eyebrow}
            </div>

            <h2 className="text-[2.1rem] sm:text-[2.8rem] lg:text-[3.4rem] tracking-[-0.03em] leading-[1.04] text-white">
              {section.title.map((line, li) => (
                <span
                  key={li}
                  className={`block overflow-hidden ${li === 0 ? 'font-light text-white/85' : 'font-semibold'}`}
                >
                  {line.split(' ').map((word, wi) => (
                    <span key={wi} className="exp-word inline-block will-change-transform">
                      {word}
                      {wi < line.split(' ').length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </span>
              ))}
            </h2>

            <p className="mt-6 text-[15px] sm:text-base font-light leading-relaxed text-[var(--c-text-2)] max-w-md">
              {section.body}
            </p>

            {section.stats && (
              <div className={`mt-8 flex flex-wrap gap-x-10 gap-y-5 ${layout === 'center' ? 'justify-center' : ''}`}>
                {section.stats.map((st) => (
                  <div key={st.label}>
                    <div className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
                      {st.value}
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--c-text-3)] mt-1">
                      {st.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.cta && (
              <div className={`mt-10 ${layout === 'center' ? 'flex justify-center' : ''}`}>
                <Button variant="white" size="lg" onClick={onOpenConsultation}>
                  {section.cta}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
