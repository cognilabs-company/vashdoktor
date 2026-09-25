import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero } from '../../procedural/Hero';
import { HomeServices } from './HomeServices';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const CLOSED = 'inset(50% 50% 50% 50% round 28px)';
const OPEN = 'inset(0% 0% 0% 0% round 0px)';
const TILT = [-7, -2.5, 2.5, 7];

interface Props {
  onOpenConsultation: () => void;
}

/**
 * Hero → services hand-off. The hero pins; as you scroll, a window opens from
 * the middle of it and widens to the edges, revealing the services panel. The
 * four photo tiles start bunched in the centre and fan out to their places,
 * the heading settles last. Meanwhile the hero keeps its own zoom-and-darken
 * "dive", so it feels like flying into the opening.
 *
 * Tablet/desktop only; phones and reduced-motion get the two sections stacked.
 */
export function HeroReveal({ onOpenConsultation }: Props) {
  const roomy = useMediaQuery('(min-width: 768px) and (min-height: 600px)');
  const reduced = useReducedMotion();
  if (!roomy || reduced) {
    return (
      <>
        <Hero onOpenConsultation={onOpenConsultation} />
        <HomeServices />
      </>
    );
  }
  return <RevealStage onOpenConsultation={onOpenConsultation} />;
}

function RevealStage({ onOpenConsultation }: Props) {
  const wrapRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const panel = panelRef.current;
    if (!wrap || !stage || !panel) return;
    const grid = panel.querySelector<HTMLElement>('[data-tiles]');
    const tiles = Array.from(panel.querySelectorAll<HTMLElement>('[data-tile]'));
    const head = panel.querySelector<HTMLElement>('[data-head]');

    // offset that puts a tile's centre on the grid's centre (layout values —
    // offsetLeft/Top ignore the transforms the timeline applies)
    const toCentreX = (el: HTMLElement) => (grid ? grid.offsetWidth / 2 - (el.offsetLeft + el.offsetWidth / 2) : 0);
    const toCentreY = (el: HTMLElement) => (grid ? grid.offsetHeight / 2 - (el.offsetTop + el.offsetHeight / 2) : 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=130%',
          pin: stage,
          pinSpacing: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      // the window opens from the centre
      tl.fromTo(panel, { clipPath: CLOSED }, { clipPath: OPEN, duration: 0.7, ease: 'power2.inOut' }, 0);

      // tiles fan out from the middle to their columns
      if (tiles.length) {
        tl.fromTo(
          tiles,
          {
            x: (_: number, el: HTMLElement) => toCentreX(el) * 0.9,
            y: (_: number, el: HTMLElement) => toCentreY(el) * 0.9,
            scale: 0.74,
            rotate: (i: number) => TILT[i % TILT.length],
          },
          { x: 0, y: 0, scale: 1, rotate: 0, duration: 0.6, ease: 'power3.out', stagger: 0.035 },
          0.18
        );
      }

      // heading arrives once the tiles are home
      if (head) tl.fromTo(head, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.58);

      // a short hold on the finished panel before it scrolls away
      tl.to({}, { duration: 0.15 });
    }, wrap);

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={wrapRef} className="relative w-full">
      <div ref={stageRef} className="relative h-[100svh] w-full overflow-hidden">
        <Hero onOpenConsultation={onOpenConsultation} />

        {/* the opening — above the hero's own dark dissolve (z-30), below the navbar (z-40) */}
        <div ref={panelRef} className="absolute inset-0 z-[35] bg-[var(--c-bg)] will-change-[clip-path]" style={{ clipPath: CLOSED }}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,var(--c-backdrop),transparent_70%)]" />
          <HomeServices staged />
        </div>
      </div>
    </section>
  );
}
