"use client";

import { memo, useMemo } from "react";
import { Activity, Stethoscope, UserRoundPlus, Users } from "lucide-react";
import type { DashboardStats } from "@/types";
import { DashboardStatCard, type StatTone } from "./dashboard-stat-card";

type StatCardsProps = {
  stats: DashboardStats;
};

export const StatCards = memo(function StatCards({ stats }: StatCardsProps) {
  const cards = useMemo(
    () => [
      {
        key: "doctors",
        icon: Stethoscope,
        label: "Total Doctors",
        value: stats.totals.doctors,
        hint: "All-time",
        tone: "chart-1" as StatTone,
      },
      {
        key: "patients",
        icon: Users,
        label: "Total Patients",
        value: stats.totals.patients,
        hint: "All-time",
        tone: "chart-2" as StatTone,
      },
      {
        key: "patients-7d",
        icon: UserRoundPlus,
        label: "Patients (last 7 days)",
        value: stats.patientsAddedLast7Days,
        hint: "Last 7 days",
        tone: "chart-3" as StatTone,
      },
      {
        key: "patients-30d",
        icon: Activity,
        label: "Patients (last 30 days)",
        value: stats.patientsAddedLast30Days,
        hint: "Last 30 days",
        tone: "chart-4" as StatTone,
      },
    ],
    [stats]
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <DashboardStatCard
          key={card.key}
          icon={card.icon}
          label={card.label}
          value={card.value}
          hint={card.hint}
          tone={card.tone}
        />
      ))}
    </div>
  );
});
