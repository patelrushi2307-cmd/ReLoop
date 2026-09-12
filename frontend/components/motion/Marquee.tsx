"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Seconds for one full cycle. */
  duration?: number;
  direction?: "left" | "right";
  axis?: "x" | "y";
  className?: string;
  trackClassName?: string;
};

export function Marquee({
  children,
  duration = 30,
  direction = "left",
  axis = "x",
  className = "",
  trackClassName = "",
}: Props) {
  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <div
        className={`marquee-track ${trackClassName}`}
        data-dir={direction}
        data-axis={axis}
        style={{ animationDuration: `${duration}s` }}
      >
        <div className={axis === "x" ? "flex shrink-0" : "block"} aria-hidden={false}>
          {children}
        </div>
        <div className={axis === "x" ? "flex shrink-0" : "block"} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
