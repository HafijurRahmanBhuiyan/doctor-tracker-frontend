"use client";

import { useCallback } from "react";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useDeleteDoctor } from "@/hooks/use-doctors";
import type { DoctorWithPatientCount } from "@/types";

type DoctorDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: DoctorWithPatientCount | null;
  /** Called after the doctor was deleted (e.g. to leave the detail page). */
  onDeleted?: () => void;
};

/**
 * Confirm dialog for deleting a doctor. The doctor AND all of their patients
 * are removed by the backend.
 */
export function DoctorDeleteDialog({
  open,
  onOpenChange,
  doctor,
  onDeleted,
}: DoctorDeleteDialogProps) {
  const deleteMutation = useDeleteDoctor();

  const handleConfirm = useCallback(async () => {
    if (!doctor) return;

    try {
      await deleteMutation.mutateAsync(doctor._id);
      onOpenChange(false);
      onDeleted?.();
    } catch {
      // The mutation hook already showed the error toast.
    }
  }, [deleteMutation, doctor, onDeleted, onOpenChange]);

  const patientCount = doctor?.patientCount ?? 0;

  return (
    <ConfirmDialog
      open={open && Boolean(doctor)}
      onOpenChange={onOpenChange}
      title="Delete doctor"
      description={`This will permanently delete ${doctor?.name ?? "this doctor"} and all of their ${patientCount} ${patientCount === 1 ? "patient" : "patients"}. This action cannot be undone.`}
      confirmText="Delete doctor"
      destructive
      loading={deleteMutation.isPending}
      onConfirm={handleConfirm}
    />
  );
}
