import React from "react";
import { motion } from "framer-motion";
import { Counter } from "../motion/Counter";
import { stats } from "../content/site";
import { EASE_OUT, VIEWPORT_ONCE } from "../lib/motion";

export function StatsBand() {
  return (
    <section
      id="numbers"
      className="scroll-mt-24 border-t border-[var(--line)] px-4 py-16 md:px-8 md:py-20"
    >
      <div className="mb-12 flex items-center gap-3">
        <span className="eyebrow tnum">02</span>
        <span className="eyebrow">{stats.eyebrow}</span>
      </div>

      <div className="grid gap-x-8 gap-y-12 md:grid-cols-4">
        {stats.figures.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.9, delay: i * 0.08, ease: EASE_OUT }}
            className="flex flex-col gap-4 border-t border-[var(--line)] pt-5"
          >
            <div className="flex items-baseline text-[clamp(2.6rem,5.4vw,4.6rem)] font-medium leading-[0.9] tracking-[-0.04em]">
              <Counter
                value={f.value}
                decimals={f.decimals ?? 0}
                pad={f.pad ?? 0}
                delay={i * 0.08}
              />
              <span>{f.suffix}</span>
            </div>
            <span className="text-[14px] text-[var(--muted)]">{f.label}</span>
          </motion.div>
        ))}

        {/* speedometer readout */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.9, delay: 0.24, ease: EASE_OUT }}
          className="flex flex-col gap-4 border-t border-[#ff5b14] pt-5"
        >
          <div className="flex items-baseline gap-2 text-[clamp(2.6rem,5.4vw,4.6rem)] font-medium leading-[0.9] tracking-[-0.04em] text-[#ff5b14]">
            <Counter value={stats.speedometer.value} pad={2} duration={2.6} />
            <span className="text-[15px] font-medium tracking-[0.02em]">
              {stats.speedometer.unit}
            </span>
          </div>

          <div className="flex gap-[3px]" aria-hidden>
            {Array.from({ length: 28 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.12 }}
                whileInView={{
                  opacity: i < 20 ? 1 : 0.12,
                }}
                viewport={VIEWPORT_ONCE}
                transition={{
                  duration: 0.25,
                  delay: 0.3 + i * 0.055,
                  ease: "linear",
                }}
                className={`h-4 w-[3px] ${i < 20 ? "bg-[#ff5b14]" : "bg-[var(--fg)]"}`}
              />
            ))}
          </div>

          <span className="text-[14px] text-[var(--muted)]">
            {stats.speedometer.label}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
