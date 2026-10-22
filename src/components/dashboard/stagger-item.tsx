"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useHydrated } from "@/hooks/use-hydrated";

type StaggerItemProps = {
  index: number;
  className?: string;
  children: ReactNode;
};

/** Short fade-in / rise stagger on mount. Disabled when the user prefers reduced motion. */
export function StaggerItem({ index, className, children }: StaggerItemProps) {
  const hydrated = useHydrated();
  const reduceMotion = useReducedMotion();

  // `useReducedMotion()` is `null` on the server and a boolean in the browser,
  // so the preference is only trusted after hydration. Until then the animated
  // markup is rendered, which keeps the server render and the first client
  // render identical.
  if (hydrated && reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut", delay: index * 0.05 }}
    >
      {children}
    </motion.div>
  );
}
