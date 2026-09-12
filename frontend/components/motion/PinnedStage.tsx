"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  type MotionValue,
} from "framer-motion";
import {
  createContext,
  useContext,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { STAGE_SPRING } from "@/lib/motion";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";

type StageContextValue = {
  /** Spring-smoothed 0 → 1 across the pinned distance. */
  progress: MotionValue<number>;
  /** Raw, unsmoothed scroll progress — for anything that must track exactly. */
  raw: MotionValue<number>;
  /** True while the stage is near or inside the viewport. */
  active: boolean;
  reduced: boolean;
  isMobile: boolean;
};

const StageContext = createContext<StageContextValue | null>(null);

export function useStage() {
  const ctx = useContext(StageContext);
  if (!ctx) throw new Error("useStage must be used inside a <PinnedStage>");
  return ctx;
}

type Props = {
  id?: string;
  children: ReactNode;
  /** Scroll distance of the pin, in vh. */
  length?: number;
  /** Shorter pin on small screens. */
  mobileLength?: number;
  className?: string;
  stickyClassName?: string;
};

export function PinnedStage({
  id,
  children,
  length = 300,
  mobileLength = 180,
  className = "",
  stickyClassName = "",
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const active = useInView(wrapperRef, { margin: "20% 0px 20% 0px" });

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });
  const smoothed = useSpring(scrollYProgress, STAGE_SPRING);

  /* Reduced motion: no pin, no scrub — hold every layer at its end state. */
  const settled = useMotionValue(1);
  const progress = reduced ? settled : smoothed;
  const raw = reduced ? settled : scrollYProgress;

  const wrapperStyle: CSSProperties = reduced
    ? {}
    : { height: `${isMobile ? mobileLength : length}vh` };

  return (
    <StageContext.Provider
      value={{ progress, raw, active, reduced, isMobile }}
    >
      <section
        id={id}
        ref={wrapperRef}
        className={`relative ${className}`}
        style={wrapperStyle}
      >
        <div
          className={`${
            reduced ? "relative min-h-[80vh]" : "sticky top-0 h-screen"
          } w-full overflow-hidden ${stickyClassName}`}
        >
          {children}
        </div>
      </section>
    </StageContext.Provider>
  );
}

/**
 * Absolutely-positioned full-bleed layer. `will-change` is only promoted while
 * the stage is actually on screen, then dropped again when it exits.
 */
export function StageLayer({
  children,
  className = "",
  style,
  z = 0,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  z?: number;
}) {
  const { active, reduced } = useStage();
  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      style={{
        zIndex: z,
        willChange: active && !reduced ? "transform" : "auto",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}
