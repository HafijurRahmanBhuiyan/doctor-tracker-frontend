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
import { useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-media-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { DashboardPatientPerDoctor } from "@/types";
import { TooltipShell, type ChartTooltipProps } from "./chart-tooltip";
import { useChartPalette } from "./use-chart-palette";

type ChartPoint = {
  doctorId: string;
  name: string;
  specialization: string;
  count: number;
};

function PatientsPerDoctorTooltip({
  active,
  payload,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0]?.payload as ChartPoint | undefined;
  if (!point) return null;

  return (
    <TooltipShell title={point.name}>
      <p>{point.specialization}</p>
      <p>
        {point.count} {point.count === 1 ? "patient" : "patients"}
      </p>
    </TooltipShell>
  );
}

type PatientsPerDoctorChartProps = {
  data: DashboardPatientPerDoctor[];
};

export const PatientsPerDoctorChart = memo(function PatientsPerDoctorChart({
  data,
}: PatientsPerDoctorChartProps) {
  const palette = useChartPalette();
  const router = useRouter();
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion() === true;

  const chartData = useMemo<ChartPoint[]>(
    () => data.map((point) => ({ ...point })),
    [data]
  );

  const truncate = useMemo(() => {
    const maxLength = isMobile ? 14 : 20;
    return (name: string) =>
      name.length > maxLength
        ? `${name.slice(0, maxLength - 1).trimEnd()}…`
        : name;
  }, [isMobile]);

  const total = useMemo(
    () => data.reduce((sum, point) => sum + point.count, 0),
    [data]
  );

  return (
    <div className="h-[300px] w-full min-w-0">
      <p className="sr-only">
        Bar chart of the ten doctors with the most patients. {total} patients in
        total across these doctors.
      </p>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            horizontal={false}
            stroke={palette.border}
            strokeDasharray="3 3"
          />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={isMobile ? 96 : 140}
            tickFormatter={truncate}
            tick={{ fill: palette.muted, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <Tooltip
            content={<PatientsPerDoctorTooltip />}
            cursor={{ fill: palette.border, fillOpacity: 0.25 }}
          />
          <Bar
            dataKey="count"
            name="Patients"
            fill={palette.colors[1]}
            radius={[0, 6, 6, 0]}
            barSize={16}
            isAnimationActive={!reduceMotion}
            animationDuration={600}
            cursor="pointer"
            onClick={(entry) => {
              const point = (entry as { payload?: ChartPoint }).payload;
              if (point?.doctorId) router.push(`/doctors/${point.doctorId}`);
            }}
          />
        </BarChart>
      </ResponsiveContainer>
      <ul className="sr-only focus-within:not-sr-only focus-within:mt-2 focus-within:grid focus-within:grid-cols-2 focus-within:gap-2">
        {data.map((doctor) => (
          <li key={doctor.doctorId}>
            <Link
              href={`/doctors/${doctor.doctorId}`}
              className="flex min-h-11 items-center justify-between gap-2 rounded-md px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="truncate">{doctor.name}</span>
              <span className="shrink-0 text-muted-foreground">{doctor.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
});
