"use client";

import { useEffect, useRef } from "react";

type Props = {
  value: number;
  durationMs?: number;
};

/**
 * Counts from 0 to `value` when scrolled into view. Server-renders the final
 * number so it is correct without JS and under reduced motion.
 */
const CountUp = ({ value, durationMs = 1400 }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = String(Math.round(value * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        el.textContent = "0";
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, durationMs]);

  return <span ref={ref}>{value}</span>;
};

export default CountUp;
