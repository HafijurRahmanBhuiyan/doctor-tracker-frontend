"use client";

import { memo, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { useReducedMotion } from "framer-motion";
import type { DashboardDoctorOverTime } from "@/types";
import { TooltipShell, type ChartTooltipProps } from "./chart-tooltip";
import { useChartPalette } from "./use-chart-palette";

type ChartPoint = {
  month: string;
  count: number;
  label: string;
};

function DoctorsOverTimeTooltip({
  active,
  payload,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0]?.payload as ChartPoint | undefined;
  if (!point) return null;

  return (
    <TooltipShell title={format(parseISO(`${point.month}-01`), "MMMM yyyy")}>
      <p>
        {point.count} {point.count === 1 ? "doctor" : "doctors"} added
      </p>
    </TooltipShell>
  );
}

type DoctorsOverTimeChartProps = {
  data: DashboardDoctorOverTime[];
};

export const DoctorsOverTimeChart = memo(function DoctorsOverTimeChart({
  data,
}: DoctorsOverTimeChartProps) {
  const palette = useChartPalette();
  const reduceMotion = useReducedMotion() === true;

  const chartData = useMemo<ChartPoint[]>(
    () =>
      data.map((point) => ({
        ...point,
        label: format(parseISO(`${point.month}-01`), "MMM yy"),
      })),
    [data]
  );

  const total = useMemo(
    () => data.reduce((sum, point) => sum + point.count, 0),
    [data]
  );

  return (
    <div className="h-[220px] w-full min-w-0">
      <p className="sr-only">
        Bar chart of doctors added per month over the last six months.{" "}
        {total} {total === 1 ? "doctor" : "doctors"} added in total.
      </p>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            vertical={false}
            stroke={palette.border}
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="month"
            tickFormatter={(value: string) =>
              format(parseISO(`${value}-01`), "MMM yy")
            }
            tick={{ fill: palette.muted, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            interval={0}
            height={28}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: palette.muted, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            content={<DoctorsOverTimeTooltip />}
            cursor={{ fill: palette.border, fillOpacity: 0.25 }}
          />
          <Bar
            dataKey="count"
            name="Doctors"
            fill={palette.colors[3]}
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
            isAnimationActive={!reduceMotion}
            animationDuration={600}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});
