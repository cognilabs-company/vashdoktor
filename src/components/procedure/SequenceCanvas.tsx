import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { getFrameSrc as dentalSrc, PRIORITY_FRAMES as DENTAL_PRIORITY, TOTAL_FRAMES as DENTAL_TOTAL } from '../../lib/dentalSequence';

const DPR_CAP = 1.75;
// Memory guard: 300 decoded 1280×720 frames ≈ 1 GB RAM → GC stutter/lag. Keep a
// sliding window of frames near the current position (+ the priority frames);
// evict the rest so decoded memory stays ~300 MB.
const WINDOW = 28; // preload ± this many frames around current
const CACHE_CAP = 96; // max decoded images retained

export interface SequenceCanvasHandle {
  /** draw a given frame (uses the nearest already-loaded frame if not ready). */
  draw: (frame: number) => void;
}

interface Props {
  className?: string;
  /** which sequence to play — defaults to the dental procedure frames */
  src?: (frame: number) => string;
  total?: number;
  priority?: number[];
  /** 'contain' keeps the whole frame (dental model); 'cover' fills the box (hero flight) */
  fit?: 'contain' | 'cover';
}

/**
 * One <canvas> that renders the current frame of the 300-image dental sequence,
 * drawing the ORIGINAL frames verbatim — no masking / keying / filters / blur.
 * - one Image per frame, cached (never re-instantiated)
 * - progressive loading (priority frames + warm-up, then idle batches)
 * - DPR-aware (setTransform, cap 1.75) → crisp at native pixel density
 * - object-fit: contain from the image's real naturalWidth/Height (never cropped)
 * - single clean draw: source image → canvas (no offscreen/intermediate scaling)
 * No React state per frame — the parent calls `draw(frame)` from its rAF.
 */
export const SequenceCanvas = forwardRef<SequenceCanvasHandle, Props>(
  function SequenceCanvas(
    { className, src: getFrameSrc = dentalSrc, total: TOTAL_FRAMES = DENTAL_TOTAL, priority: PRIORITY_FRAMES = DENTAL_PRIORITY, fit = 'contain' },
    apiRef
  ) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const cache = useRef<Map<number, HTMLImageElement>>(new Map());
    const currentFrame = useRef(1);
    const dprRef = useRef(1);
    const cssRef = useRef({ w: 1, h: 1 });

    const isReady = (img?: HTMLImageElement) => !!img && img.complete && img.naturalWidth > 0;

    const ensure = (frame: number) => {
      const f = Math.min(TOTAL_FRAMES, Math.max(1, frame));
      const c = cache.current;
      if (c.has(f)) return c.get(f)!;
      const img = new Image();
      img.decoding = 'async';
      img.src = getFrameSrc(f);
      img.onload = () => {
        // if the frame we're waiting to show just arrived, paint it
        if (f === currentFrame.current) drawFrame(currentFrame.current);
      };
      c.set(f, img);
      return img;
    };

    // nearest already-loaded frame around `frame` (so we never blank the canvas)
    const nearestReady = (frame: number): HTMLImageElement | null => {
      const c = cache.current;
      if (isReady(c.get(frame))) return c.get(frame)!;
      for (let d = 1; d <= TOTAL_FRAMES; d++) {
        const a = c.get(frame - d);
        if (isReady(a)) return a!;
        const b = c.get(frame + d);
        if (isReady(b)) return b!;
      }
      return null;
    };

    const paint = (img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = dprRef.current;
      const { w: cssW, h: cssH } = cssRef.current;
      // draw in CSS space; setTransform maps to the DPR-scaled backing store
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      // clear the previous frame; letterbox stays transparent (dark section shows)
      ctx.clearRect(0, 0, cssW, cssH);
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = fit === 'cover' ? Math.max(cssW / iw, cssH / ih) : Math.min(cssW / iw, cssH / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.drawImage(img, (cssW - dw) / 2, (cssH - dh) / 2, dw, dh);
    };

    // drop decoded frames far from the current position (keeps memory bounded)
    const prio = new Set(PRIORITY_FRAMES);
    const evict = () => {
      const c = cache.current;
      if (c.size <= CACHE_CAP) return;
      const cur = currentFrame.current;
      const far = [...c.keys()]
        .filter((f) => !prio.has(f) && Math.abs(f - cur) > WINDOW)
        .sort((a, b) => Math.abs(b - cur) - Math.abs(a - cur));
      for (const f of far) {
        if (c.size <= CACHE_CAP) break;
        const img = c.get(f);
        if (img) img.src = ''; // release the decoded bitmap
        c.delete(f);
      }
    };

    const drawFrame = (frame: number) => {
      currentFrame.current = frame;
      ensure(frame);
      // warm a window around the current position so scrub/reverse is ready
      for (let d = 1; d <= WINDOW; d++) {
        ensure(frame + d);
        ensure(frame - d);
      }
      evict();
      const img = nearestReady(frame);
      if (img) paint(img);
    };

    useImperativeHandle(apiRef, () => ({ draw: drawFrame }), []);

    // ---- size the canvas to its container (DPR aware) + redraw ----
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
        // clientWidth/Height = layout size in CSS px, unaffected by the parent's
        // CSS transform (getBoundingClientRect would return the scaled size and
        // feed it back into the canvas resolution).
        const cssW = Math.max(1, parent.clientWidth);
        const cssH = Math.max(1, parent.clientHeight);
        const w = Math.round(cssW * dpr);
        const h = Math.round(cssH * dpr);
        dprRef.current = dpr;
        cssRef.current = { w: cssW, h: cssH };
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
          canvas.style.width = `${cssW}px`;
          canvas.style.height = `${cssH}px`;
        }
        drawFrame(currentFrame.current);
      };

      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(parent);
      return () => ro.disconnect();
    }, []);

    // ---- initial preload: priority frames + opening window only ----
    // (NOT all 300 — the sliding window in drawFrame streams the rest on scroll
    // and evicts far frames, so decoded memory stays bounded → no lag)
    useEffect(() => {
      PRIORITY_FRAMES.forEach(ensure);
      for (let f = 1; f <= WINDOW; f++) ensure(f);
    }, []);

    return <canvas ref={canvasRef} className={className} aria-hidden />;
  }
);
