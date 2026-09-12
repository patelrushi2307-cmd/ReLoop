"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Flips the document theme to near-black while this zone crosses the middle of
 * the viewport. Nav, borders and cursor all read from the same CSS variables,
 * so they invert with it. Counted, so overlapping zones can't fight.
 */
let activeZones = 0;

function apply() {
  document.documentElement.dataset.theme = activeZones > 0 ? "dark" : "light";
}

export function InvertZone({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let counted = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted) {
          activeZones += 1;
          counted = true;
          apply();
        } else if (!entry.isIntersecting && counted) {
          activeZones -= 1;
          counted = false;
          apply();
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    io.observe(el);
    return () => {
      if (counted) {
        activeZones -= 1;
        apply();
      }
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
