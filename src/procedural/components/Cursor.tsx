import { useEffect, useRef } from 'react';

/**
 * A lagged reticle that trails the pointer with the same exponential easing the
 * camera uses. Desktop / fine-pointer only. Purely CSS transform — never touches
 * the WebGL frame loop.
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    let raf = 0;
    let prev = performance.now();
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    let visible = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        if (ringRef.current) ringRef.current.style.opacity = '1';
        if (dotRef.current) dotRef.current.style.opacity = '1';
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };
    const onLeave = () => {
      visible = false;
      if (ringRef.current) ringRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };

    const tick = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      const k = 1 - Math.exp(-9 * dt);
      ring.x += (target.x - ring.x) * k;
      ring.y += (target.y - ring.y) * k;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] hidden lg:block">
      <div
        ref={ringRef}
        className="absolute top-0 left-0 h-7 w-7 rounded-full border border-[#173D35]/40 opacity-0 transition-opacity duration-300"
      />
      <div
        ref={dotRef}
        className="absolute top-0 left-0 h-1 w-1 rounded-full bg-[#173D35] opacity-0 transition-opacity duration-300"
      />
    </div>
  );
}
