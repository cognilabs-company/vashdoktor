import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Outlet, useLocation } from 'react-router-dom';
import { initSmoothScroll } from '../../lib/animations';
import { scrollToEl } from '../../lib/scroll';
import { useSectionFlow } from '../../lib/flow';
import { ClinicUIContext } from '../../lib/uiContext';
import { Navbar } from './Navbar';
import { PalettePicker } from '../ui/PalettePicker';
import { Footer } from './Footer';
import { ConsultationModal } from './ConsultationModal';
import { InteractiveViewerModal } from '../three/InteractiveViewerModal';

export function Layout() {
  const { pathname, hash } = useLocation();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Background colour glides between [data-bg] sections as you scroll.
  useSectionFlow(rootRef, pathname);

  // Lenis smooth scroll — once for the whole app.
  useEffect(() => {
    const cleanup = initSmoothScroll();
    return cleanup;
  }, []);

  // Every route opens at the very top — before paint, and through Lenis so a
  // smooth-scroll still in flight cannot drag the page back down. The browser's
  // own restoration is switched off so reload/back behave the same. A #hash
  // target is honoured once the new page has laid out.
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    if (!hash) return () => window.clearTimeout(refresh);
    const t = window.setTimeout(() => scrollToEl(hash, -80), 350);
    return () => {
      window.clearTimeout(refresh);
      window.clearTimeout(t);
    };
  }, [pathname, hash]);

  // Scroll-reveal + parallax — re-armed on every route so new page elements
  // animate in. Fail-safe: nothing can stay hidden (2s fallback reveals all).
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal], [data-stagger]')
    );
    const revealAll = () => els.forEach((el) => el.classList.add('is-revealed'));
    if (reduced) {
      revealAll();
      return;
    }

    let io: IntersectionObserver | null = null;
    let fallback = 0;
    if (els.length) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add('is-revealed');
              io?.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px 300px 0px', threshold: 0 }
      );
      els.forEach((el) => io!.observe(el));
      fallback = window.setTimeout(revealAll, 2000);
    }

    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    let raf = 0;
    const applyParallax = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of parallaxEls) {
        const speed = parseFloat(el.dataset.parallax || '0.1');
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!raf && parallaxEls.length) raf = requestAnimationFrame(applyParallax);
    };
    if (parallaxEls.length) {
      applyParallax();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    }

    return () => {
      io?.disconnect();
      if (fallback) window.clearTimeout(fallback);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  return (
    <ClinicUIContext.Provider
      value={{
        openConsultation: () => setIsConsultationOpen(true),
        open3DViewer: () => setIs3DViewerOpen(true),
      }}
    >
      <div ref={rootRef} className="relative min-h-screen bg-[var(--c-bg)] text-[#eaf2f4] font-sans antialiased overflow-x-clip selection:bg-[var(--c-accent)] selection:text-[var(--c-bg)]">
        <Navbar
          onOpenConsultation={() => setIsConsultationOpen(true)}
          onOpen3DViewer={() => setIs3DViewerOpen(true)}
        />
        <main>
          <Outlet />
        </main>

        {/* temporary: choosing the site's colour palette */}
        <PalettePicker />
        <Footer />
        <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
        <InteractiveViewerModal isOpen={is3DViewerOpen} onClose={() => setIs3DViewerOpen(false)} />
      </div>
    </ClinicUIContext.Provider>
  );
}
