"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { EASE_OUT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  value: number;
  /** Zero-pad to this many integer digits, e.g. 2 renders 7 as "07". */
  pad?: number;
  decimals?: number;
  duration?: number;
  delay?: number;
  className?: string;
};

function format(v: number, pad: number, decimals: number) {
  const fixed = decimals > 0 ? v.toFixed(decimals) : String(Math.round(v));
  const [int, frac] = fixed.split(".");
  const padded = int.padStart(pad, "0");
  return frac ? `${padded}.${frac}` : padded;
}

export function Counter({
  value,
  pad = 0,
  decimals = 0,
  duration = 2,
  delay = 0,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const mv = useMotionValue(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration, delay, ease: EASE_OUT });
    return () => controls.stop();
  }, [inView, reduced, value, duration, delay, mv]);

  useMotionValueEvent(mv, "change", (v) => {
    if (ref.current) ref.current.textContent = format(v, pad, decimals);
  });

  return (
    <span ref={ref} className={`tnum ${className}`}>
      {format(0, pad, decimals)}
    </span>
  );
}
