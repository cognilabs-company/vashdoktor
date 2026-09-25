import { useEffect } from 'react';
import { SECTION_RANGES, layoutToObjectX } from '../lib/content';
import { view, applySectionScroll, clamp, damp, smoothstep } from '../lib/state';

interface Props {
  rootRef: React.MutableRefObject<HTMLDivElement | null>;
  panelRefs: React.MutableRefObject<Array<HTMLDivElement | null>>;
  progressRef: React.MutableRefObject<HTMLDivElement | null>;
  canvasLayerRef: React.MutableRefObject<HTMLDivElement | null>;
  railRef: React.MutableRefObject<HTMLDivElement | null>;
  reduced: boolean;
}

/**
 * Headless scroll driver. Runs Lenis (or native scroll under reduced-motion),
 * writes every scroll-derived value into the mutable `view`, and mutates DOM
 * (panel opacity/transform/blur, progress fill, canvas fade) directly — never
 * React state. Dispatches `section:active` when the active section changes so
 * SectionBlock can play its title reveal.
 */
export function ScrollEngine({ rootRef, panelRefs, progressRef, canvasLayerRef, railRef, reduced }: Props) {
  useEffect(() => {
    let raf = 0;
    let lastY = window.scrollY;
    let prev = performance.now();
    let activeIndex = -1;

    // NOTE: smooth scrolling (Lenis) is owned by App.initSmoothScroll and synced
    // to ScrollTrigger there. This engine only READS window.scrollY (already
    // smoothed) — it must NOT create its own Lenis or the page double-scrolls.

    const onPointer = (e: PointerEvent) => {
      view.pointer.rawX = (e.clientX / window.innerWidth) * 2 - 1;
      view.pointer.rawY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true });

    const computeObjectPlacement = (op: number, forcedW?: number) => {
      const w = forcedW ?? window.innerWidth;
      if (w < 1024) {
        view.model.objectX = 0;
        view.model.objectScale = w < 640 ? 0.62 : 0.82;
        return;
      }
      view.model.objectScale = 1;
      // active section layout → object side (opposite the text column)
      // `op < r.end` never matches the last range at op === 1, so start from the
      // closing shot and walk back — otherwise the object snaps across the
      // screen on the very last frame
      let layout = SECTION_RANGES[SECTION_RANGES.length - 1].layout;
      for (const r of SECTION_RANGES) {
        if (op < r.end) {
          layout = r.layout;
          break;
        }
      }
      view.model.objectX = layoutToObjectX(layout);
    };

    const tick = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;

      const root = rootRef.current;
      if (root) {
        const vh = window.innerHeight;
        const y = window.scrollY;
        const rect = root.getBoundingClientRect();
        const absTop = y + rect.top;
        const total = Math.max(1, root.offsetHeight - vh);
        const op = clamp((y - absTop) / total, 0, 1);

        view.scrollVelocity = y - lastY;
        lastY = y;
        view.scrollY = y;
        view.overallProgress = op;
        applySectionScroll(op);
        computeObjectPlacement(op);

        // active section + per-panel focus (entrance + exit tied to scroll)
        let curActive = 0;
        for (let i = 0; i < SECTION_RANGES.length; i++) {
          const r = SECTION_RANGES[i];
          const p = clamp((op - r.start) / (r.end - r.start || 1), 0, 1);
          if (op >= r.start && op < r.end) {
            curActive = i;
            view.sectionIndex = i;
            view.sectionProgress = p;
          }
          const panel = panelRefs.current[i];
          if (panel) {
            const enter = i === 0 ? 1 : smoothstep(0, 0.16, p);
            const exit = smoothstep(0.72, 1, p);
            const focus = reduced ? 1 : enter * (1 - exit);
            panel.style.opacity = focus.toFixed(3);
            panel.style.transform = `translate3d(0, ${((1 - focus) * 18).toFixed(1)}px, 0)`;
            panel.style.filter = reduced ? 'none' : `blur(${((1 - focus) * 5).toFixed(2)}px)`;
          }
        }
        if (curActive !== activeIndex) {
          activeIndex = curActive;
          window.dispatchEvent(new CustomEvent('section:active', { detail: { index: curActive } }));
        }

        // progress rail fill
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleY(${op.toFixed(4)})`;
        }

        // The experience now sits BELOW the hero. Its fixed 3D layer + rail must
        // only show while its section is on screen: fade IN as it enters from
        // below, fade OUT once scrolled past.
        const past = (y - (absTop + total)) / vh;
        const fadeIn = clamp(1 - smoothstep(0, vh * 0.6, rect.top));
        const fadeOut = clamp(1 - smoothstep(0.05, 0.7, past));
        const vis = fadeIn * fadeOut;
        // Also toggle visibility: an opacity-0 dark full-screen layer can still
        // flash the screen dark if a repaint lands mid-transition. Hard-hide it
        // (and drop pointer capture) whenever the experience isn't on screen.
        if (canvasLayerRef.current) {
          canvasLayerRef.current.style.opacity = vis.toFixed(3);
          canvasLayerRef.current.style.visibility = vis < 0.005 ? 'hidden' : 'visible';
        }
        if (railRef.current) railRef.current.style.opacity = vis.toFixed(3);
      }

      view.pointer.easedX = damp(view.pointer.easedX, view.pointer.rawX, 4, dt);
      view.pointer.easedY = damp(view.pointer.easedY, view.pointer.rawY, 4, dt);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [rootRef, panelRefs, progressRef, canvasLayerRef, railRef, reduced]);

  return null;
}
