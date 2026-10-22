import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of doctors, patients, and clinic activity.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
