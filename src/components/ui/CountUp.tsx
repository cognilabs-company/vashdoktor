import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CountUpProps {
  /** Display string containing a number, e.g. "4,200+", "99.2%", "18+". */
  value: string;
  className?: string;
  duration?: number;
}

interface Parsed {
  prefix: string;
  number: number;
  suffix: string;
  decimals: number;
  thousands: boolean;
}

function parseValue(value: string): Parsed {
  const match = value.match(/([^\d.-]*)([\d,.]+)(.*)/);
  if (!match) return { prefix: '', number: 0, suffix: value, decimals: 0, thousands: false };
  const [, prefix, rawNum, suffix] = match;
  const thousands = rawNum.includes(',');
  const numeric = parseFloat(rawNum.replace(/,/g, ''));
  const dot = rawNum.indexOf('.');
  const decimals = dot === -1 ? 0 : rawNum.length - dot - 1;
  return { prefix, number: numeric, suffix, decimals, thousands };
}

function format(v: number, decimals: number, thousands: boolean): string {
  const fixed = v.toFixed(decimals);
  if (!thousands) return fixed;
  const [int, dec] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return dec ? `${grouped}.${dec}` : grouped;
}

/**
 * Counts a numeric value up from zero the first time it scrolls into view.
 * Non-numeric parts (prefix like "$", suffix like "+" / "%") are preserved.
 */
export function CountUp({ value, className = '', duration = 1600 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const parsed = parseValue(value);
  const [display, setDisplay] = useState(
    reduced ? value : `${parsed.prefix}${format(0, parsed.decimals, parsed.thousands)}${parsed.suffix}`
  );

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let started = false;

    const run = (start: number) => {
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // easeOutExpo
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        const current = parsed.number * eased;
        setDisplay(
          `${parsed.prefix}${format(current, parsed.decimals, parsed.thousands)}${parsed.suffix}`
        );
        if (t < 1) rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            io.unobserve(entry.target);
            run(performance.now());
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduced]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
