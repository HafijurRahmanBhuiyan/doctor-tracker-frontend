/**
 * Shared grid spans so the real layout and the loading skeleton stay in sync.
 * 1 column on mobile, 2 on tablet, 12 on desktop.
 */
export const dashboardGridClasses = {
  area: "md:col-span-2 lg:col-span-8",
  donut: "md:col-span-1 lg:col-span-4",
  perDoctor: "md:col-span-1 lg:col-span-7",
  recentPatients: "md:col-span-2 lg:col-span-5",
  doctorsOverTime: "md:col-span-1 lg:col-span-4",
  gender: "md:col-span-1 lg:col-span-4",
  specializations: "md:col-span-2 lg:col-span-4",
} as const;

export const dashboardGrid =
  "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12";
