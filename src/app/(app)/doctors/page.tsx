import { Suspense } from "react";
import type { Metadata } from "next";
import { DoctorsView } from "@/components/doctors/doctors-view";
import { DoctorsPageSkeleton } from "@/components/doctors/doctors-skeleton";

export const metadata: Metadata = {
  title: "Doctors",
  description: "Manage doctors, their specialties, and their patients.",
};

export default function DoctorsPage() {
  return (
    <Suspense fallback={<DoctorsPageSkeleton />}>
      <DoctorsView />
    </Suspense>
  );
}
