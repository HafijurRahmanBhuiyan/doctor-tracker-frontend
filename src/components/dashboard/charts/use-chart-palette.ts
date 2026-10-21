"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@teispace/next-themes";

const CHART_VARS = [
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
] as const;

export type ChartPalette = {
  /** chart-1 .. chart-5, resolved for the active theme */
  colors: string[];
  /** muted foreground, used for axes / muted slices */
  muted: string;
  /** border color, used for grid lines */
  border: string;
};

const FALLBACK: ChartPalette = {
  colors: CHART_VARS.map((variable) => `var(${variable})`),
  muted: "var(--muted-foreground)",
  border: "var(--border)",
};

function readVariable(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

function readPalette(): ChartPalette {
  return {
    colors: CHART_VARS.map((variable) =>
      readVariable(variable, `var(${variable})`)
    ),
    muted: readVariable("--muted-foreground", FALLBACK.muted),
    border: readVariable("--border", FALLBACK.border),
  };
}

/**
 * Resolves the theme aware chart colors (CSS variables) to concrete values so
 * Recharts can use them for SVG fills / strokes. Re-reads on theme change.
 *
 * The colors are read from the computed style of the document, so they are
 * only available in the browser. Every chart is imported with
 * `next/dynamic` and `ssr: false`, which means these components are never
 * rendered on the server and therefore never take part in hydration - the
 * resolved palette can safely be read during the first client render.
 */
export function useChartPalette(): ChartPalette {
  const { resolvedTheme } = useTheme();
  const [palette, setPalette] = useState<ChartPalette>(readPalette);

  useEffect(() => {
    const read = () => setPalette(readPalette());

    read();
    // The theme class is applied by next-themes in an effect, so re-read once
    // on the next frame to pick up the new values.
    const frame = requestAnimationFrame(read);

    return () => cancelAnimationFrame(frame);
  }, [resolvedTheme]);

  return palette;
}
