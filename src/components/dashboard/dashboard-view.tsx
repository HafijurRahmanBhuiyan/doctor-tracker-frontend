"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { DateRange } from "react-day-picker";
import { getErrorMessage } from "@/lib/api";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { ChartCard } from "./chart-card";
import { ChartEmptyState } from "./chart-empty-state";
import { DashboardError, DashboardErrorBanner } from "./dashboard-error";
import { DashboardHeader } from "./dashboard-header";
import { dashboardGrid, dashboardGridClasses } from "./dashboard-layout";
import { ChartSkeleton, DashboardSkeleton } from "./dashboard-skeleton";
import { isEmptySeries, toApiRange } from "./dashboard-utils";
import { RecentPatientsCard } from "./recent-patients-card";
import { StaggerItem } from "./stagger-item";
import { StatCards } from "./stat-cards";

const PatientsOverTimeChart = dynamic(
  () =>
    import("./charts/patients-over-time-chart").then(
      (module) => module.PatientsOverTimeChart
    ),
  { ssr: false, loading: () => <ChartSkeleton className="h-[260px]" /> }
);

const PatientsPerDoctorChart = dynamic(
  () =>
    import("./charts/patients-per-doctor-chart").then(
      (module) => module.PatientsPerDoctorChart
    ),
  { ssr: false, loading: () => <ChartSkeleton className="h-[300px]" /> }
);

const ConditionDonutChart = dynamic(
  () =>
    import("./charts/condition-donut-chart").then(
      (module) => module.ConditionDonutChart
    ),
  { ssr: false, loading: () => <ChartSkeleton className="h-[260px]" /> }
);

const DoctorsOverTimeChart = dynamic(
  () =>
    import("./charts/doctors-over-time-chart").then(
      (module) => module.DoctorsOverTimeChart
    ),
  { ssr: false, loading: () => <ChartSkeleton className="h-[220px]" /> }
);

const GenderSplitChart = dynamic(
  () =>
    import("./charts/gender-split-chart").then(
      (module) => module.GenderSplitChart
    ),
  { ssr: false, loading: () => <ChartSkeleton className="h-[160px]" /> }
);

const TopSpecializationsChart = dynamic(
  () =>
    import("./charts/top-specializations-chart").then(
      (module) => module.TopSpecializationsChart
    ),
  { ssr: false, loading: () => <ChartSkeleton className="h-[160px]" /> }
);

export function DashboardView() {
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const apiRange = useMemo(() => toApiRange(range), [range]);
  const query = useDashboardStats(apiRange);
  const stats = query.data;

  const errorMessage = query.isError ? getErrorMessage(query.error) : null;

  const hasPatientsOverTime = !isEmptySeries(stats?.patientsOverTime ?? []);
  const hasPatientsPerDoctor = !isEmptySeries(stats?.patientsPerDoctor ?? []);
  const hasConditions = !isEmptySeries(stats?.conditionDistribution ?? []);
  const hasDoctorsOverTime = !isEmptySeries(stats?.doctorsOverTime ?? []);
  const hasGender = !isEmptySeries(stats?.genderDistribution ?? []);
  const hasSpecializations = !isEmptySeries(
    stats?.specializationDistribution ?? []
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        range={range}
        onRangeChange={setRange}
        isFetching={query.isFetching}
      />

      {query.isPending ? (
        <DashboardSkeleton />
      ) : errorMessage && !stats ? (
        <DashboardError
          message={errorMessage}
          onRetry={() => query.refetch()}
          isRetrying={query.isFetching}
        />
      ) : stats ? (
        <>
          {errorMessage ? (
            <DashboardErrorBanner
              message={errorMessage}
              onRetry={() => query.refetch()}
              isRetrying={query.isFetching}
            />
          ) : null}

          <StaggerItem index={0}>
            <StatCards stats={stats} />
          </StaggerItem>

          <div className={dashboardGrid} aria-busy={query.isFetching}>
            <StaggerItem index={1} className={dashboardGridClasses.area}>
              <ChartCard
                title="Patients over time"
                description="New patients added each day in the selected range."
                ariaLabel="Patients added per day"
              >
                {hasPatientsOverTime ? (
                  <PatientsOverTimeChart data={stats.patientsOverTime} />
                ) : (
                  <ChartEmptyState />
                )}
              </ChartCard>
            </StaggerItem>

            <StaggerItem index={2} className={dashboardGridClasses.donut}>
              <ChartCard
                title="Condition distribution"
                description="Share of the patients per condition."
                ariaLabel="Distribution of patient conditions"
              >
                {hasConditions ? (
                  <ConditionDonutChart data={stats.conditionDistribution} />
                ) : (
                  <ChartEmptyState />
                )}
              </ChartCard>
            </StaggerItem>

            <StaggerItem index={3} className={dashboardGridClasses.perDoctor}>
              <ChartCard
                title="Patients per doctor"
                description="Top 10 doctors by number of patients."
                ariaLabel="Patients per doctor, top 10"
              >
                {hasPatientsPerDoctor ? (
                  <PatientsPerDoctorChart data={stats.patientsPerDoctor} />
                ) : (
                  <ChartEmptyState />
                )}
              </ChartCard>
            </StaggerItem>

            <StaggerItem index={4} className={dashboardGridClasses.recentPatients}>
              <RecentPatientsCard patients={stats.recentPatients} />
            </StaggerItem>

            <StaggerItem index={5} className={dashboardGridClasses.doctorsOverTime}>
              <ChartCard
                title="Doctors added per month"
                description="New doctors registered over the last six months."
                ariaLabel="Doctors added per month"
              >
                {hasDoctorsOverTime ? (
                  <DoctorsOverTimeChart data={stats.doctorsOverTime} />
                ) : (
                  <ChartEmptyState />
                )}
              </ChartCard>
            </StaggerItem>

            <StaggerItem index={6} className={dashboardGridClasses.gender}>
              <ChartCard
                title="Gender split"
                description="Patient distribution by gender."
                ariaLabel="Patient gender split"
              >
                {hasGender ? (
                  <GenderSplitChart data={stats.genderDistribution} />
                ) : (
                  <ChartEmptyState />
                )}
              </ChartCard>
            </StaggerItem>

            <StaggerItem index={7} className={dashboardGridClasses.specializations}>
              <ChartCard
                title="Top specializations"
                description="Specializations with the most patients."
                ariaLabel="Top specializations by patient count"
              >
                {hasSpecializations ? (
                  <TopSpecializationsChart
                    data={stats.specializationDistribution}
                  />
                ) : (
                  <ChartEmptyState />
                )}
              </ChartCard>
            </StaggerItem>
          </div>
        </>
      ) : null}
    </div>
  );
}
