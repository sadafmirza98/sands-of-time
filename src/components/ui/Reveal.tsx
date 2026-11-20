"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Fade-and-rise into view once. Reduced motion is handled by <MotionConfig reducedMotion="user">. */
export function Reveal({ children, className, delay = 0, y = 26 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
