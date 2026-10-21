"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Tracks a CSS media query without an extra render pass.
 * Returns `false` during server rendering.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    [query]
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query]
  );

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True on viewports narrower than the `sm` breakpoint (640px). */
export function useIsMobile() {
  return useMediaQuery("(max-width: 639px)");
}
