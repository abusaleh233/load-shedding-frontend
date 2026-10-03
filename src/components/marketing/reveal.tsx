"use client";

import { motion, type Variants } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger this reveal after others in the same viewport pass — in seconds. */
  delay?: number;
  /** Which edge the content slides in from. "none" just fades. */
  from?: "bottom" | "left" | "right" | "none";
}

const DISTANCE = 24;

function buildVariants(from: RevealProps["from"]): Variants {
  const offset =
    from === "bottom" ? { y: DISTANCE } : from === "left" ? { x: -DISTANCE } : from === "right" ? { x: DISTANCE } : {};
  return {
    hidden: { opacity: 0, ...offset },
    visible: { opacity: 1, x: 0, y: 0 },
  };
}

/**
 * Wraps children in a fade+slide entrance that plays once, when the
 * element scrolls into view — the one animation primitive every marketing
 * page below is built from, so the whole site's motion language stays
 * consistent instead of each page inventing its own.
 */
export function Reveal({ children, className, delay = 0, from = "bottom" }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={buildVariants(from)}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
