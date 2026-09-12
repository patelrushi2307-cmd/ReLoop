"use client";

import { motion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { LINE_REVEAL, LINE_STAGGER, VIEWPORT_ONCE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** When provided, the reveal is driven by this flag instead of the viewport. */
  active?: boolean;
};

export function SplitText({
  lines,
  as: Tag = "h2",
  className = "",
  lineClassName = "",
  delay = 0,
  active,
}: Props) {
  const reduced = usePrefersReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: LINE_STAGGER, delayChildren: delay },
    },
  };

  const line: Variants = reduced
    ? {
        /* y is reset explicitly: the first client render happens before the
           media query resolves, so the slide-up transform may already be set. */
        hidden: { opacity: 0, y: "0%" },
        show: { opacity: 1, y: "0%", transition: { duration: 0.4 } },
      }
    : {
        hidden: { y: "110%" },
        show: { y: "0%", transition: LINE_REVEAL },
      };

  const driven =
    active === undefined
      ? { whileInView: "show" as const, viewport: VIEWPORT_ONCE }
      : { animate: active ? ("show" as const) : ("hidden" as const) };

  return (
    <Tag className={className}>
      <motion.span
        className="block"
        initial="hidden"
        variants={container}
        {...driven}
      >
        {lines.map((content, i) => (
          <span
            key={i}
            className={`block overflow-hidden pb-[0.26em] -mb-[0.26em] ${lineClassName}`}
          >
            <motion.span
              className="block"
              variants={line}
              style={{ willChange: "transform" }}
            >
              {content}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
