import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

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
 * Hero — a single cinematic image (tooth on a glowing podium over icy water).
 * No WebGL here (keeps the page light); text + glass cards are overlaid with
 * gradient scrims for legibility over the bright scene.
 */
export function Hero({ onOpenConsultation }: HeroProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
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
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-[#070f17] text-white">
      {/* background image (scroll-zoom) */}
      <img
        ref={imgRef}
        src="/hero.png"
        alt="Zamonaviy stomatologiya klinikasi"
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        style={{ transformOrigin: 'center center' }}
        loading="eager"
        fetchPriority="high"
      />

      {/* legibility scrims: darken the left column + the bottom, gentle vignette */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,13,21,0.82),rgba(6,13,21,0.32)_38%,transparent_66%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,13,21,0.8),rgba(6,13,21,0.1)_42%,transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(4,10,16,0.5))]" />

      {/* headline + CTA — bottom-left. No paragraph: the picture says it. */}
      <div ref={contentRef} className="absolute bottom-[14vh] left-6 z-10 max-w-3xl will-change-transform lg:left-14">
        <div className="mb-5 inline-flex items-center gap-3 text-[13px] text-[#a9d8e4]">
          <span className="h-px w-7 bg-[#a9d8e4]/70" />
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
            className="group inline-flex items-center gap-1.5 text-sm text-[#c6dbe1] underline decoration-white/25 underline-offset-[6px] transition-colors hover:text-white hover:decoration-[#8fc7d4]"
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
            <div className="mt-1.5 text-[12px] text-[#c6dbe1]">{f.label}</div>
          </div>
        ))}
      </div>

      {/* dive-in dissolve — fades to the section colour at the peak of the zoom */}
      <div
        ref={fadeRef}
        className="pointer-events-none absolute inset-0 z-30 bg-[#0a141d] will-change-[opacity]"
        style={{ opacity: 0 }}
      />
    </section>
  );
}
