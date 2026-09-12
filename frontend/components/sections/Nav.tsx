"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useScrollApi } from "@/components/motion/LenisProvider";
import { RollLink, SmoothLink } from "@/components/motion/SmoothLink";
import { brand, navLinks } from "@/content/site";
import { EASE_OUT } from "@/lib/motion";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lock, unlock } = useScrollApi();

  useEffect(() => {
    if (menuOpen) lock();
    else unlock();
  }, [menuOpen, lock, unlock]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur-md transition-colors duration-[600ms]">
        <div className="flex h-16 items-center justify-between px-4 md:h-[72px] md:px-8">
          <SmoothLink href="#top" className="flex items-baseline gap-3">
            <span className="text-[15px] font-semibold tracking-[0.2em] text-[var(--fg)]">
              {brand.wordmark}
            </span>
            <span className="eyebrow hidden sm:block">{brand.descriptor}</span>
          </SmoothLink>

          <nav className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => (
              <RollLink
                key={link.href}
                {...link}
                className="text-[14px] font-medium tracking-[-0.01em] text-[var(--fg)]"
              />
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <SmoothLink
              href="/dashboard?mode=sell"
              className="hidden h-9 items-center rounded-full bg-[var(--fg)] px-5 text-[13px] font-medium text-[var(--bg)] transition-opacity hover:opacity-85 sm:flex"
            >
              Sell item
            </SmoothLink>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-9 items-center gap-2.5 text-[13px] font-medium text-[var(--fg)]"
              aria-label="Open menu"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block h-px w-5 bg-[var(--fg)]" />
                <span className="block h-px w-5 bg-[var(--fg)]" />
              </span>
              Menu
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[90] flex flex-col bg-[var(--black)] text-[var(--off-white)]"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            <div className="flex h-16 items-center justify-between px-4 md:h-[72px] md:px-8">
              <span className="text-[15px] font-semibold tracking-[0.2em]">
                {brand.wordmark}
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="text-[13px] font-medium tracking-[0.02em]"
                aria-label="Close menu"
              >
                Close
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-center px-4 md:px-8">
              <motion.ul
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
              >
                {navLinks.map((link, i) => (
                  <li key={link.href} className="overflow-hidden">
                    <motion.div
                      variants={{
                        hidden: { y: "110%" },
                        show: { y: "0%", transition: { duration: 0.9, ease: EASE_OUT } },
                      }}
                      className="flex items-baseline gap-5 border-b border-white/10 py-3 md:py-5"
                    >
                      <span className="tnum w-8 text-[12px] tracking-[0.12em] text-[var(--grey-600)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <RollLink
                        label={link.label}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="display-sm !font-medium"
                      />
                    </motion.div>
                  </li>
                ))}
              </motion.ul>
            </div>

            <motion.div
              className="flex flex-wrap items-end justify-between gap-6 px-4 pb-8 md:px-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="eyebrow max-w-[360px] !text-[var(--grey-600)]">
                {brand.hq.lines.join(" · ")}
              </div>
              <div className="eyebrow !text-[var(--grey-600)]">
                Five material classes traded
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
