"use client";

import { useCallback } from "react";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useDeletePatient } from "@/hooks/use-patients";
import type { PatientWithDoctor } from "@/types";

type PatientDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: PatientWithDoctor | null;
};

/** Confirm dialog for deleting a patient. */
export function PatientDeleteDialog({
  open,
  onOpenChange,
  patient,
}: PatientDeleteDialogProps) {
  const deleteMutation = useDeletePatient();

  const handleConfirm = useCallback(async () => {
    if (!patient) return;

    try {
      await deleteMutation.mutateAsync(patient._id);
      onOpenChange(false);
    } catch {
      // The mutation hook already showed the error toast.
    }
  }, [deleteMutation, onOpenChange, patient]);

  return (
    <ConfirmDialog
      open={open && Boolean(patient)}
      onOpenChange={onOpenChange}
      title="Delete patient"
      description={`This will permanently delete ${
        patient?.name ?? "this patient"
      }. This action cannot be undone.`}
      confirmText="Delete patient"
      destructive
      loading={deleteMutation.isPending}
      onConfirm={handleConfirm}
    />
  );
}
