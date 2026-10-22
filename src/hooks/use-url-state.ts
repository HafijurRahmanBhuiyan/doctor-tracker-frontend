"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type UrlStateValue = string | number | undefined;
export type UrlStateDefaults = Record<string, UrlStateValue>;

type SetParamsOptions = {
  /**
   * Keys that are reset to their default value, e.g. `["page"]` so a new
   * filter always shows the first page again.
   */
  reset?: string[];
};

function parseValue(raw: string | null, fallback: UrlStateValue): UrlStateValue {
  if (raw === null) return fallback;

  if (typeof fallback === "number") {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return raw;
}

/**
 * Keeps a piece of state in the URL query string.
 *
 * The URL is the single source of truth: the values are read from it and every
 * change is written back with `router.replace` (without scrolling), so a
 * shared link restores exactly the same view.
 *
 * ```tsx
 * const { values, setParams } = useUrlState({ search: "", page: 1 });
 * setParams({ search: "abc" }, { reset: ["page"] });
 * ```
 *
 * Has to be rendered inside a `Suspense` boundary because it reads the search
 * params of the current route.
 */
export function useUrlState<T extends UrlStateDefaults>(defaults: T) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // The defaults are usually a module level constant, but they are serialized
  // so an inline object never invalidates the memoized values.
  const defaultsKey = JSON.stringify(defaults);
  const defaultsMap = useMemo(
    () => JSON.parse(defaultsKey) as T,
    [defaultsKey]
  );

  const currentQuery = searchParams.toString();

  // The current query string is kept in a ref, so `setParams` / `resetParams`
  // keep a stable identity. Otherwise every navigation would re-create the
  // callbacks of the consumer, which re-runs the effects that depend on them
  // (a re-run search would reset the pagination of the page).
  const currentQueryRef = useRef(currentQuery);
  useEffect(() => {
    // Only runs when the query really changed, so the optimistic update of
    // `replace` is not overwritten by an outdated URL.
    currentQueryRef.current = currentQuery;
  }, [currentQuery]);

  const values = useMemo(() => {
    const result = {} as T;

    (Object.keys(defaultsMap) as (keyof T)[]).forEach((key) => {
      result[key] = parseValue(
        searchParams.get(String(key)),
        defaultsMap[key]
      ) as T[keyof T];
    });

    return result;
    // `searchParams` changes whenever the URL changes.
  }, [defaultsMap, searchParams]);

  const replace = useCallback(
    (params: URLSearchParams) => {
      const next = params.toString();
      const previous = currentQueryRef.current;

      // Keep the ref in sync right away, so a second change in the same tick
      // is built on top of the first one.
      currentQueryRef.current = next;

      // Nothing changed: skip the navigation so the router is not updated
      // for every render (and the URL stays exactly as the user left it).
      if (next === previous) return;

      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  const setParams = useCallback(
    (patch: Partial<T>, options?: SetParamsOptions) => {
      const params = new URLSearchParams(currentQueryRef.current);

      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          params.delete(key);
          return;
        }
        params.set(key, String(value));
      });

      options?.reset?.forEach((key) => {
        const fallback = (defaultsMap as UrlStateDefaults)[key];
        if (fallback === undefined || fallback === "") {
          params.delete(key);
          return;
        }
        params.set(key, String(fallback));
      });

      replace(params);
    },
    [defaultsMap, replace]
  );

  /** Resets the given keys (or all of them) back to their default value. */
  const resetParams = useCallback(
    (keys?: string[]) => {
      const params = new URLSearchParams(currentQueryRef.current);
      const list = keys ?? (Object.keys(defaultsMap) as string[]);

      list.forEach((key) => {
        const fallback = (defaultsMap as UrlStateDefaults)[key];
        if (fallback === undefined || fallback === "") {
          params.delete(key);
          return;
        }
        params.set(key, String(fallback));
      });

      replace(params);
    },
    [defaultsMap, replace]
  );

  /** True when the value of a key still is the default one. */
  const isDefault = useCallback(
    (key: string) =>
      String(values[key as keyof T] ?? "") ===
      String((defaultsMap as UrlStateDefaults)[key] ?? ""),
    [defaultsMap, values]
  );

  return { values, setParams, resetParams, isDefault };
}
