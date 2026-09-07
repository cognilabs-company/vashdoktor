import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll(): () => void {
  const lenis = new Lenis({
    // lerp-based smoothing feels snappier and less "floaty" than a long duration
    lerp: 0.12,
    wheelMultiplier: 1.0,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    // Native (non-smoothed) touch on mobile — smoothing touch adds perceptible lag
    syncTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  // Expose for tooling / debugging (lets automated screenshots jump to a scroll pos)
  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tickerCallback);
    lenis.destroy();
  };
}
