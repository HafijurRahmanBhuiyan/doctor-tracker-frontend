import { Suspense } from "react";
import { DoctorsView } from "@/components/doctors/doctors-view";
import { DoctorsPageSkeleton } from "@/components/doctors/doctors-skeleton";

export default function DoctorsPage() {
  return (
    <Suspense fallback={<DoctorsPageSkeleton />}>
      <DoctorsView />
    </Suspense>
  );
}
