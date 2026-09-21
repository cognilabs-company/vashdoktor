import type Lenis from 'lenis';

/** Smooth-scroll to an element (selector or node), going through Lenis when
 * it is running so the page does not fight the smoother. */
export function scrollToEl(target: string | HTMLElement, offset = -88) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.2 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' });
}
