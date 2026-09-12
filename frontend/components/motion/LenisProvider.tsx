"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { LENIS_OPTIONS } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

type ScrollApi = {
  lock: () => void;
  unlock: () => void;
  scrollTo: (target: string | number) => void;
};

const ScrollContext = createContext<ScrollApi>({
  lock: () => {},
  unlock: () => {},
  scrollTo: () => {},
});

export const useScrollApi = () => useContext(ScrollContext);

export function LenisProvider({
  children,
  startLocked = false,
}: {
  children: ReactNode;
  startLocked?: boolean;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const reduced = usePrefersReducedMotion();
  const [locked, setLocked] = useState(startLocked);

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({ ...LENIS_OPTIONS, autoRaf: false });
    lenisRef.current = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  /* Scroll lock works with or without Lenis — the preloader needs it either way. */
  useEffect(() => {
    if (locked) {
      lenisRef.current?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenisRef.current?.start();
      document.documentElement.style.overflow = "";
    }
  }, [locked]);

  /* Stable identity: consumers put lock/unlock in effect dependency lists. */
  const api = useMemo<ScrollApi>(
    () => ({
      lock: () => setLocked(true),
      unlock: () => setLocked(false),
      scrollTo: (target) => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target, { offset: 0 });
          return;
        }
        if (typeof target === "number") {
          window.scrollTo({ top: target });
          return;
        }
        document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
      },
    }),
    [],
  );

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}
