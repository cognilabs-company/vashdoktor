import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Page-background tones. Sections declare one with `data-bg`, stay
 * transparent themselves, and the page colour glides between them on scroll —
 * no hard seams. All tones sit close to the base so text contrast holds. */
export const FLOW = {
  base: '#0a141d',
  teal: '#0a1e27',
  blue: '#0b192b',
  green: '#0b1f21',
  ink: '#10151f',
  deep: '#0e2531', // closing CTA — a touch lighter, still in family
  footer: '#070f17',
} as const;

/**
 * Tweens `root`'s background to the colour of whichever `[data-bg]` section
 * is crossing the middle of the viewport. Re-armed on every route change.
 */
export function useSectionFlow(root: RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const go = (color: string) =>
      gsap.to(el, { backgroundColor: color, duration: reduced ? 0 : 1.1, ease: 'power2.out', overwrite: 'auto' });

    let triggers: ScrollTrigger[] = [];
    // the page's own sections must be mounted (and pinned) before we measure
    const t = window.setTimeout(() => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-bg]'));
      triggers = sections.map((section, i) => {
        const color = section.dataset.bg || FLOW.base;
        const prev = i > 0 ? sections[i - 1].dataset.bg || FLOW.base : FLOW.base;
        return ScrollTrigger.create({
          trigger: section,
          start: 'top 62%',
          end: 'bottom 62%',
          onEnter: () => go(color),
          onEnterBack: () => go(color),
          onLeaveBack: () => go(prev),
        });
      });
      ScrollTrigger.refresh();
    }, 120);

    return () => {
      window.clearTimeout(t);
      triggers.forEach((tr) => tr.kill());
      gsap.set(el, { backgroundColor: FLOW.base });
    };
  }, [root, key]);
}
