"use client";

import { useSyncExternalStore } from "react";

/**
 * The store never changes, so subscribing is a no-op. Keeping the function
 * outside of the component guarantees a stable reference (React would
 * re-subscribe on every render otherwise).
 */
const subscribe = () => () => {};

/**
 * Returns `false` while rendering on the server and during the very first
 * client render, then `true` once the component tree is hydrated.
 *
 * Use it to guard anything that depends on browser-only state (cookies,
 * `window`, `matchMedia`, ...) so the server markup and the first client
 * render are always identical.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
