"use client";

import { memo, useMemo } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useReducedMotion } from "framer-motion";
import type { DashboardGenderCount } from "@/types";
import { formatNumber } from "@/lib/format";
import { TooltipShell, type ChartTooltipProps } from "./chart-tooltip";
import { useChartPalette } from "./use-chart-palette";

type ChartPoint = {
  gender: string;
  count: number;
  percentage: number;
  color: string;
};

function GenderTooltip({
  active,
  payload,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0]?.payload as ChartPoint | undefined;
  if (!point) return null;

  return (
    <TooltipShell title={point.gender}>
      <p>
        {point.count} {point.count === 1 ? "patient" : "patients"} ·{" "}
        {point.percentage}%
      </p>
    </TooltipShell>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

type GenderSplitChartProps = {
  data: DashboardGenderCount[];
};

export const GenderSplitChart = memo(function GenderSplitChart({
  data,
}: GenderSplitChartProps) {
  const palette = useChartPalette();
  const reduceMotion = useReducedMotion() === true;

  const total = useMemo(
    () => data.reduce((sum, point) => sum + point.count, 0),
    [data]
  );

  const chartData = useMemo<ChartPoint[]>(() => {
    const paletteColors = palette.colors;

    return data.map((point, index) => ({
      gender: point.gender,
      count: point.count,
      percentage: total === 0 ? 0 : Math.round((point.count / total) * 100),
      color: paletteColors[index % paletteColors.length],
    }));
  }, [data, palette, total]);

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative h-[140px] w-[140px] shrink-0">
        <p className="sr-only">
          Donut chart of the patient gender split. {total} patients in total.
        </p>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="gender"
              innerRadius={34}
              outerRadius={54}
              paddingAngle={2}
              stroke="none"
              isAnimationActive={!reduceMotion}
              animationDuration={600}
            >
              {chartData.map((point) => (
                <Cell key={point.gender} fill={point.color} />
              ))}
            </Pie>
            <Tooltip content={<GenderTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold tabular-nums">
            {formatNumber(total)}
          </span>
          <span className="text-[10px] text-muted-foreground">Patients</span>
        </div>
      </div>

      <ul className="w-full min-w-0 space-y-1.5" aria-label="Gender split legend">
        {chartData.map((point) => (
          <li
            key={point.gender}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: point.color }}
              />
              <span className="truncate">{capitalize(point.gender)}</span>
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {point.count} · {point.percentage}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
});
