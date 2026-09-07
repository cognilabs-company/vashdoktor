import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { initSmoothScroll } from '../../lib/animations';
import { ClinicUIContext } from '../../lib/uiContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ConsultationModal } from './ConsultationModal';
import { InteractiveViewerModal } from '../three/InteractiveViewerModal';

export function Layout() {
  const { pathname } = useLocation();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);

  // Lenis smooth scroll — once for the whole app.
  useEffect(() => {
    const cleanup = initSmoothScroll();
    return cleanup;
  }, []);

  // Jump to top on every route change.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
      <div className="relative min-h-screen bg-[#0a141d] text-[#eaf2f4] font-sans antialiased overflow-x-hidden selection:bg-[#8fc7d4] selection:text-[#0a141d]">
        <Navbar
          onOpenConsultation={() => setIsConsultationOpen(true)}
          onOpen3DViewer={() => setIs3DViewerOpen(true)}
        />
        <main>
          <Outlet />
        </main>
        <Footer />
        <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
        <InteractiveViewerModal isOpen={is3DViewerOpen} onClose={() => setIs3DViewerOpen(false)} />
      </div>
    </ClinicUIContext.Provider>
  );
}
