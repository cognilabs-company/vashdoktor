import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Page-background tones. Sections declare one with `data-bg`, stay
 * transparent themselves, and the page colour glides between them on scroll —
 * no hard seams. All tones sit close to the base so text contrast holds.
 *
 * These are custom-property NAMES, not colours: the palette decides the values
 * and GSAP cannot tween to a `var()`, so they are resolved against the document
 * at the moment a tween starts (see `resolve`). */
export const FLOW = {
  base: '--c-bg',
  teal: '--flow-teal',
  blue: '--flow-blue',
  green: '--flow-green',
  ink: '--flow-ink',
  deep: '--flow-deep', // closing CTA — a touch lighter, still in family
  footer: '--c-bg-deep',
} as const;

/** a token name → the colour the current palette gives it */
export function resolve(token: string): string {
  if (!token.startsWith('--')) return token;
  const v = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return v || '#0a141d';
}

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
      gsap.to(el, { backgroundColor: resolve(color), duration: reduced ? 0 : 1.1, ease: 'power2.out', overwrite: 'auto' });

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
      gsap.set(el, { backgroundColor: resolve(FLOW.base) });
    };
  }, [root, key]);
}
