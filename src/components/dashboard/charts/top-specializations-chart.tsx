"use client";

import { memo, useMemo } from "react";
import type { DashboardSpecializationCount } from "@/types";
import { useChartPalette } from "./use-chart-palette";

type BarEntry = {
  specialization: string;
  count: number;
  share: number;
  width: number;
  color: string;
};

const MAX_ITEMS = 5;

type TopSpecializationsChartProps = {
  data: DashboardSpecializationCount[];
};

export const TopSpecializationsChart = memo(function TopSpecializationsChart({
  data,
}: TopSpecializationsChartProps) {
  const palette = useChartPalette();

  const entries = useMemo<BarEntry[]>(() => {
    const sorted = [...data]
      .sort((a, b) => b.count - a.count)
      .slice(0, MAX_ITEMS);

    const total = data.reduce((sum, point) => sum + point.count, 0);
    const max = sorted.reduce((highest, point) => Math.max(highest, point.count), 0);

    return sorted.map((point, index) => ({
      specialization: point.specialization,
      count: point.count,
      share: total === 0 ? 0 : Math.round((point.count / total) * 100),
      width: max === 0 ? 0 : Math.round((point.count / max) * 100),
      color: palette.colors[index % palette.colors.length],
    }));
  }, [data, palette]);

  return (
    <ul className="space-y-2.5" aria-label="Top specializations">
      {entries.map((entry) => (
        <li key={entry.specialization} className="space-y-1">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="min-w-0 truncate font-medium">
              {entry.specialization}
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {entry.count} · {entry.share}%
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
            role="img"
            aria-label={`${entry.specialization}: ${entry.count} patients, ${entry.share}% of all patients`}
          >
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${entry.width}%`, backgroundColor: entry.color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
});
