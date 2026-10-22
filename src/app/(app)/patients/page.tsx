import { Suspense } from "react";
import { PatientsView } from "@/components/patients/patients-view";
import { PatientsPageSkeleton } from "@/components/patients/patients-skeleton";

export default function PatientsPage() {
  return (
    <Suspense fallback={<PatientsPageSkeleton />}>
      <PatientsView />
    </Suspense>
  );
}
