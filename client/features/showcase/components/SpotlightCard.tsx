"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";

type Props = {
  accent: string;
  className?: string;
  /** Set false for large surfaces where tilting text would hurt readability. */
  tilt?: boolean;
  children: ReactNode;
};

const MAX_TILT_DEG = 5;

/**
 * Card with a pointer-tracking glow and an optional subtle 3D tilt. The
 * visuals live in CSS (see `.spotlight` in globals.css); this component only
 * feeds it coordinates, and skips the tilt for touch input and reduced motion.
 */
const SpotlightCard = ({ accent, className = "", tilt = true, children }: Props) => {
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);

    if (
      !tilt ||
      e.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    el.style.setProperty("--ry", `${(x / rect.width - 0.5) * 2 * MAX_TILT_DEG}deg`);
    el.style.setProperty("--rx", `${-(y / rect.height - 0.5) * 2 * MAX_TILT_DEG}deg`);
  };

  const onPointerLeave = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ "--accent": accent } as CSSProperties}
      className={`spotlight ${className}`}
    >
      {children}
    </article>
  );
};

export default SpotlightCard;
