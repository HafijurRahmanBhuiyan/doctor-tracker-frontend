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
import { useIsMobile } from "@/hooks/use-media-query";
import type { DashboardConditionCount } from "@/types";
import { formatNumber } from "@/lib/format";
import { TooltipShell, type ChartTooltipProps } from "./chart-tooltip";
import { useChartPalette } from "./use-chart-palette";

type ChartPoint = {
  condition: string;
  count: number;
  percentage: number;
  color: string;
};

function ConditionTooltip({
  active,
  payload,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0]?.payload as ChartPoint | undefined;
  if (!point) return null;

  return (
    <TooltipShell title={point.condition}>
      <p>
        {point.count} {point.count === 1 ? "patient" : "patients"} ·{" "}
        {point.percentage}%
      </p>
    </TooltipShell>
  );
}

type ConditionDonutChartProps = {
  data: DashboardConditionCount[];
};

export const ConditionDonutChart = memo(function ConditionDonutChart({
  data,
}: ConditionDonutChartProps) {
  const palette = useChartPalette();
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion() === true;

  const total = useMemo(
    () => data.reduce((sum, point) => sum + point.count, 0),
    [data]
  );

  const chartData = useMemo<ChartPoint[]>(() => {
    const paletteColors = palette.colors;

    return data.map((point, index) => ({
      condition: point.condition,
      count: point.count,
      percentage: total === 0 ? 0 : Math.round((point.count / total) * 100),
      // "Other" is a catch-all bucket and stays visually muted.
      color:
        point.condition === "Other"
          ? palette.muted
          : paletteColors[index % paletteColors.length],
    }));
  }, [data, palette, total]);

  const innerRadius = isMobile ? 46 : 54;
  const outerRadius = isMobile ? 68 : 78;

  return (
    <div className="w-full min-w-0 space-y-3">
      <div className="relative h-[190px] w-full min-w-0">
        <p className="sr-only">
          Donut chart of the most common conditions. {total} patients in total.
        </p>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="condition"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              stroke="none"
              isAnimationActive={!reduceMotion}
              animationDuration={600}
            >
              {chartData.map((point) => (
                <Cell key={point.condition} fill={point.color} />
              ))}
            </Pie>
            <Tooltip content={<ConditionTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tracking-tight tabular-nums">
            {formatNumber(total)}
          </span>
          <span className="text-xs text-muted-foreground">Total</span>
        </div>
      </div>

      <ul className="space-y-1.5" aria-label="Condition distribution legend">
        {chartData.map((point) => (
          <li
            key={point.condition}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: point.color }}
              />
              <span className="truncate">{point.condition}</span>
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
