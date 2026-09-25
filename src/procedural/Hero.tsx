import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { HeroTooth } from '../components/three/HeroTooth';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';

import { ARTWORK_FRAME } from '../components/three/molarSdf';

// The 3D tooth is laid over its spot on the toothless plate (/hero-empty.jpg),
// following the image's object-cover crop.
const { imgW: IMG_W, imgH: IMG_H } = ARTWORK_FRAME;

const webglOk = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

interface HeroProps {
  onOpenConsultation: () => void;
}

const clampN = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const FACTS = [
  { value: '15+', label: 'yil' },
  { value: '20 000+', label: 'bemor' },
  { value: '12', label: 'xizmat' },
];

/**
 * Hero — a cinematic plate (podium over icy water) with a real 3D molar
 * turning slowly above the podium. Until the 3D tooth has painted, the
 * original artwork (tooth included) sits on top and then fades away, so the
 * swap is never seen. Phones / reduced-motion / no-WebGL keep the still image.
 */
export function Hero({ onOpenConsultation }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);
  const toothBoxRef = useRef<HTMLDivElement | null>(null);
  const wide = useMediaQuery('(min-width: 768px)');
  const reduced = useReducedMotion();
  const [gl] = useState(webglOk);
  // dev-only comparison modes: ?tooth=still (3D held in the artwork pose, no
  // cover), ?tooth=matte (same, flat magenta), ?tooth=ref (artwork only),
  // ?tooth=empty (plate only)
  const debug = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('tooth') : null;
  const live = wide && !reduced && gl && debug !== 'ref';
  const [toothReady, setToothReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  // keep the canvas box glued to the tooth's spot in the object-cover image
  useEffect(() => {
    if (!live) return;
    const section = sectionRef.current;
    const box = toothBoxRef.current;
    if (!section || !box) return;
    const place = () => {
      const W = section.clientWidth;
      const H = section.clientHeight;
      const s = Math.max(W / IMG_W, H / IMG_H);
      const ox = (W - IMG_W * s) / 2;
      const oy = (H - IMG_H * s) / 2;
      const size = ARTWORK_FRAME.box * s;
      box.style.width = `${size}px`;
      box.style.height = `${size}px`;
      box.style.left = `${ox + ARTWORK_FRAME.cx * s - size / 2}px`;
      box.style.top = `${oy + ARTWORK_FRAME.cy * s - size / 2}px`;
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(section);
    return () => ro.disconnect();
  }, [live]);

  // stop rendering the tooth once the hero has left the screen
  useEffect(() => {
    if (!live || !sectionRef.current) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0 });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, [live]);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const fadeRef = useRef<HTMLDivElement | null>(null);
  const factsRef = useRef<HTMLDivElement | null>(null);

  // Cinematic "dive-in": as you scroll out of the hero the image zooms hard
  // toward the centre (feels like flying INTO the scene) + a slight blur, while
  // the text lifts/fades and the whole hero dissolves to dark — a seamless
  // hand-off into the 3D model that emerges below. rAF-throttled, GPU-only.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const p = clampN(window.scrollY / window.innerHeight); // 0 top → 1 after one viewport
      const e = p * p; // ease-in → the dive accelerates
      if (imgRef.current) {
        imgRef.current.style.transform = `scale(${(1 + p * 1.4).toFixed(4)})`;
        imgRef.current.style.filter = `blur(${(e * 5).toFixed(2)}px)`;
      }
      if (contentRef.current) {
        contentRef.current.style.opacity = String(clampN(1 - p * 1.7));
        contentRef.current.style.transform = `translate3d(0, ${(-p * 90).toFixed(1)}px, 0) scale(${(1 - p * 0.08).toFixed(3)})`;
      }
      if (factsRef.current) factsRef.current.style.opacity = String(clampN(1 - p * 1.7));
      if (fadeRef.current) fadeRef.current.style.opacity = e.toFixed(3); // dissolve to dark
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] w-full overflow-hidden bg-[var(--c-bg-deep)] text-white">
      {/* the scene (scroll-zoom): plate + 3D tooth move together */}
      <div ref={imgRef} className="absolute inset-0 will-change-transform" style={{ transformOrigin: 'center center' }}>
        {live && (
          <img
            src="/hero-empty.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        )}
        {live && debug !== 'empty' && (
          <div ref={toothBoxRef} className="absolute">
            {/* soft light behind the tooth, like the glow in the artwork */}
            <div className="pointer-events-none absolute inset-[22%] rounded-full bg-[#dfeef7]/20 blur-[70px]" />
            <HeroTooth className="absolute inset-0" active={onScreen} still={debug === 'still' || debug === 'matte'} matte={debug === 'matte'} onReady={() => setToothReady(true)} />
          </div>
        )}
        {/* the original artwork — the fallback, and the cover until the 3D tooth is ready */}
        <img
          src="/hero.jpg"
          alt="Zamonaviy stomatologiya klinikasi"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            live && (toothReady || debug === 'still' || debug === 'matte' || debug === 'empty') ? 'opacity-0' : 'opacity-100'
          }`}
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* legibility scrims: darken the left column + the bottom, gentle vignette */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,13,21,0.82),rgba(6,13,21,0.32)_38%,transparent_66%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,13,21,0.8),rgba(6,13,21,0.1)_42%,transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(4,10,16,0.5))]" />

      {/* headline + CTA — bottom-left. No paragraph: the picture says it. */}
      <div ref={contentRef} className="absolute bottom-[14vh] left-6 z-10 max-w-3xl will-change-transform lg:left-14">
        <div className="mb-5 inline-flex items-center gap-3 text-[13px] text-[var(--c-accent-2)]">
          <span className="h-px w-7 bg-[var(--c-accent-2)]/70" />
          Stomatologiya · Toshkent
        </div>
        <h1 className="text-[13vw] leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-[5rem]">
          <span className="block font-light text-white/90">Butun oila uchun</span>
          <span className="block font-semibold">sog&#8216;lom tabassum.</span>
        </h1>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button
            variant="white"
            size="lg"
            onClick={onOpenConsultation}
            icon={<ArrowUpRight className="h-4 w-4" />}
          >
            Qabulga yozilish
          </Button>
          <Link
            to="/services"
            className="group inline-flex items-center gap-1.5 text-sm text-[var(--c-text)] underline decoration-white/25 underline-offset-[6px] transition-colors hover:text-white hover:decoration-[var(--c-accent)]"
          >
            Barcha xizmatlar
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* three numbers, one quiet line — bottom-right */}
      <div ref={factsRef} className="absolute bottom-[14vh] right-6 z-10 hidden items-end divide-x divide-white/15 lg:flex lg:right-14">
        {FACTS.map((f) => (
          <div key={f.label} className="px-6 text-right first:pl-0 last:pr-0">
            <div className="font-serif text-3xl font-medium leading-none text-white">{f.value}</div>
            <div className="mt-1.5 text-[12px] text-[var(--c-text)]">{f.label}</div>
          </div>
        ))}
      </div>

      {/* dive-in dissolve — fades to the section colour at the peak of the zoom */}
      <div
        ref={fadeRef}
        className="pointer-events-none absolute inset-0 z-30 bg-[var(--c-bg)] will-change-[opacity]"
        style={{ opacity: 0 }}
      />
    </section>
  );
}
