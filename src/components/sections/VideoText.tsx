import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

/** A video YOU own / have rights to. */
const VIDEO_SRC = '/videos/implant.mp4';
const PAGE_BG = '#0a141d';
const LINES = ['IMPLANT', 'TECHNOLOGY'];

const clampN = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/**
 * Scroll-driven video → text-mask.
 *
 * Perf: the SVG text mask is STATIC (rasterized once — never re-rasterized per
 * frame). The reveal is driven by the overlay's OPACITY and the video's
 * parallax TRANSFORM — the only two GPU-composited properties — so scrolling
 * stays smooth. The video-in-text is still a real SVG mask (the footage really
 * shows only inside the letters). ONE persistent <video>. Manual pin (CSS
 * sticky is broken here by overflow-x); scroll length is guaranteed by CSS.
 */
export function VideoText() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktop = window.matchMedia('(min-width: 1024px)').matches;

    const section = sectionRef.current!;
    const stage = stageRef.current!;
    // scroll length comes from the CSS class (h-[240vh] lg:h-[340vh]); JS only
    // shortens it for reduced motion, so the section can never collapse to 0.
    if (reduced) section.style.height = '110vh';

    const ctx = gsap.context(() => {
      const parallax = parallaxRef.current!;
      const svg = svgRef.current!;

      const parX = desktop ? -32 : -16;
      const parY = desktop ? 24 : 12;

      gsap.set(parallax, { scale: 1.04, x: 0, y: 0, transformOrigin: 'center center' });
      // overlay starts big + invisible → the footage reads full, then it scales
      // DOWN + fades in, collapsing into the letters (real motion). Scaling a
      // cached static-mask layer is a GPU transform — no per-frame re-raster.
      gsap.set(svg, { autoAlpha: 0, scale: 1.9, transformOrigin: 'center center' });

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
      // Phase 1 (~first 40% of scroll): full video with a slow push-in — moving,
      // so it never feels stopped, but the TEXT hasn't formed yet.
      tl.to(parallax, { scale: 1.12, duration: 1.3, ease: 'none' }, 0)
        // Phase 2: the video collapses into the letters (scale + fade) + parallax
        // continues to the end — continuous motion throughout.
        .to(svg, { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, 1.3)
        .to(svg, { scale: 1, duration: 1.8, ease: 'power1.inOut' }, 1.3)
        .to([eyebrowRef.current, hintRef.current], { autoAlpha: 0, duration: 0.4 }, 1.4)
        .to(parallax, { x: parX, y: parY, scale: 1.18, duration: 1.9, ease: 'none' }, 1.3);

      if (reduced) {
        tl.progress(0.7);
        gsap.set([eyebrowRef.current, hintRef.current], { autoAlpha: 0 });
        return;
      }

      let raf = 0;
      let lastP = -1;
      let lastPhase = '';
      const setPhase = (phase: string, top: string, bottom: string) => {
        if (phase === lastPhase) return;
        lastPhase = phase;
        stage.style.position = phase === 'pinned' ? 'fixed' : 'absolute';
        stage.style.top = top;
        stage.style.bottom = bottom;
      };
      const tick = () => {
        const vh = window.innerHeight;
        const rect = section.getBoundingClientRect();
        const total = Math.max(1, section.offsetHeight - vh);
        const p = clampN(-rect.top / total);

        if (Math.abs(p - lastP) > 0.0004) {
          tl.progress(p);
          lastP = p;
        }

        if (rect.top > 0) setPhase('before', '0px', 'auto');
        else if (-rect.top < total) setPhase('pinned', '0px', 'auto');
        else setPhase('after', 'auto', '0px');

        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="results" ref={sectionRef} className="relative w-full bg-[#0a141d] h-[170vh] lg:h-[220vh]">
      <div
        ref={stageRef}
        className="left-0 h-[100svh] w-full overflow-hidden"
        style={{ position: 'absolute', top: 0 }}
      >
        {/* eyebrow */}
        <div ref={eyebrowRef} className="pointer-events-none absolute left-6 top-24 z-20 lg:left-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8fc7d4]">Natijalar</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#7f9aa4]">
            Yakuniy natija — klinik tiklash
          </div>
        </div>

        {/* fallback so the frame is never pure black */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,#1b4b5c,#0b1b26_72%)]" />

        {/* full-bleed video (parallax layer, GPU transform) */}
        <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
          <video
            className="absolute left-1/2 top-1/2 h-[100vw] w-[100svh] max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90 object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        </div>

        {/* STATIC SVG text mask — dark page-bg everywhere except the letters.
            Rasterized once; only its opacity animates (GPU-composited). */}
        <svg
          ref={svgRef}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          viewBox="0 0 1200 675"
          preserveAspectRatio="xMidYMid slice"
          style={{ willChange: 'transform, opacity' }}
          aria-hidden
        >
          <defs>
            <mask id="implant-text-mask">
              <rect x="0" y="0" width="1200" height="675" fill="white" />
              {LINES.map((line, i) => (
                <text
                  key={line}
                  x="600"
                  y={i === 0 ? 300 : 560}
                  textAnchor="middle"
                  fontFamily="Inter, Manrope, system-ui, sans-serif"
                  fontWeight={800}
                  fontSize={250}
                  letterSpacing={-6}
                  textLength={1150}
                  lengthAdjust="spacingAndGlyphs"
                  fill="black"
                >
                  {line}
                </text>
              ))}
            </mask>
          </defs>
          <rect x="0" y="0" width="1200" height="675" fill={PAGE_BG} mask="url(#implant-text-mask)" />
        </svg>

        {/* SEO / a11y */}
        <h2 className="sr-only">Implant technology — klinik natijalar</h2>

        {/* scroll hint */}
        <div ref={hintRef} className="pointer-events-none absolute bottom-10 left-1/2 z-20 -translate-x-1/2 text-center">
          <div className="text-[11px] uppercase tracking-[0.24em] text-white/70">Pastga suring</div>
          <div className="mx-auto mt-2 h-8 w-px bg-white/40" />
        </div>
      </div>
    </section>
  );
}
