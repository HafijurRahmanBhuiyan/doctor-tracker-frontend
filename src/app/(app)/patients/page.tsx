import { Suspense } from "react";
import type { Metadata } from "next";
import { PatientsView } from "@/components/patients/patients-view";
import { PatientsPageSkeleton } from "@/components/patients/patients-skeleton";

export const metadata: Metadata = {
  title: "Patients",
  description: "Manage patients and their assigned doctors.",
};

export default function PatientsPage() {
  return (
    <Suspense fallback={<PatientsPageSkeleton />}>
      <PatientsView />
    </Suspense>
  );
}
