import { Suspense } from "react";
import type { Metadata } from "next";
import { DoctorDetailView } from "@/components/doctors/detail/doctor-detail-view";
import { DoctorDetailSkeleton } from "@/components/doctors/doctors-skeleton";

export const metadata: Metadata = {
  title: "Doctor details",
  description: "Doctor profile and assigned patients.",
};

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<DoctorDetailSkeleton />}>
      <DoctorDetailView doctorId={id} />
    </Suspense>
  );
}
