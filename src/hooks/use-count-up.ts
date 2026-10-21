"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useHydrated } from "@/hooks/use-hydrated";

/**
 * Animates a number from its previous value to the new target.
 * Respects `prefers-reduced-motion` by jumping straight to the target.
 *
 * `useReducedMotion()` returns `null` on the server and a boolean in the
 * browser, so the target is only used once the tree is hydrated. The server
 * render and the first client render therefore always render the same value.
 */
export function useCountUp(target: number, duration = 900) {
  const hydrated = useHydrated();
  const reduceMotion = useReducedMotion();
  const [animatedValue, setAnimatedValue] = useState(0);
  const currentRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduceMotion) {
      currentRef.current = target;
      return;
    }

    const from = currentRef.current;
    const delta = target - from;

    if (delta === 0) return;

    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(from + delta * eased);

      currentRef.current = next;
      setAnimatedValue(next);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [target, duration, reduceMotion]);

  return hydrated && reduceMotion === true ? target : animatedValue;
}
