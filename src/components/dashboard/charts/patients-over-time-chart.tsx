"use client";

import { memo, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-media-query";
import type { DashboardPatientOverTime } from "@/types";
import { TooltipShell, type ChartTooltipProps } from "./chart-tooltip";
import { useChartPalette } from "./use-chart-palette";

type ChartPoint = {
  date: string;
  count: number;
  /** Pre-formatted axis label ("MMM d") */
  label: string;
};

function PatientsOverTimeTooltip({
  active,
  payload,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0]?.payload as ChartPoint | undefined;
  if (!point) return null;

  return (
    <TooltipShell title={format(parseISO(point.date), "EEEE, MMM d, yyyy")}>
      <p>
        {point.count} {point.count === 1 ? "patient" : "patients"} added
      </p>
    </TooltipShell>
  );
}

function buildTicks(points: ChartPoint[], maxTicks: number) {
  if (points.length === 0) return [];
  if (points.length <= maxTicks) return points.map((point) => point.date);

  const step = Math.ceil((points.length - 1) / (maxTicks - 1));
  const ticks: string[] = [];

  for (let index = 0; index < points.length; index += step) {
    ticks.push(points[index].date);
  }

  const last = points[points.length - 1].date;
  if (ticks[ticks.length - 1] !== last) {
    // Drop the previous tick when it would sit too close to the last one.
    if (points.length - 1 - (ticks.length - 1) * step < step / 2) ticks.pop();
    ticks.push(last);
  }

  return ticks;
}

type PatientsOverTimeChartProps = {
  data: DashboardPatientOverTime[];
};

export const PatientsOverTimeChart = memo(function PatientsOverTimeChart({
  data,
}: PatientsOverTimeChartProps) {
  const palette = useChartPalette();
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion() === true;

  const chartData = useMemo<ChartPoint[]>(
    () =>
      data.map((point) => ({
        ...point,
        label: format(parseISO(point.date), "MMM d"),
      })),
    [data]
  );

  const labelByDate = useMemo(() => {
    const map = new Map<string, string>();
    chartData.forEach((point) => map.set(point.date, point.label));
    return map;
  }, [chartData]);

  const ticks = useMemo(
    () => buildTicks(chartData, isMobile ? 4 : 8),
    [chartData, isMobile]
  );

  const total = useMemo(
    () => data.reduce((sum, point) => sum + point.count, 0),
    [data]
  );

  const periodLabel = useMemo(() => {
    if (chartData.length === 0) return "no period selected";
    const first = chartData[0];
    const last = chartData[chartData.length - 1];
    return `${first.label} – ${format(parseISO(last.date), "MMM d, yyyy")}`;
  }, [chartData]);

  return (
    <div className="h-[260px] w-full min-w-0">
      <p className="sr-only">
        Area chart of patients added per day from {periodLabel}. {total}{" "}
        {total === 1 ? "patient" : "patients"} added in this period.
      </p>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart
          data={chartData}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="patientsAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={palette.colors[0]}
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor={palette.colors[0]}
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke={palette.border}
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="date"
            ticks={ticks}
            tickFormatter={(value: string) => labelByDate.get(value) ?? value}
            tick={{ fill: palette.muted, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            minTickGap={8}
            height={28}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: palette.muted, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={isMobile ? 28 : 34}
          />
          <Tooltip
            content={<PatientsOverTimeTooltip />}
            cursor={{ stroke: palette.border }}
          />
          <Area
            type="monotone"
            dataKey="count"
            name="Patients"
            stroke={palette.colors[0]}
            strokeWidth={2}
            fill="url(#patientsAreaFill)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2 }}
            isAnimationActive={!reduceMotion}
            animationDuration={600}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});
