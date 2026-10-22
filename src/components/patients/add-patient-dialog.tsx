"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useAddDoctorPatient } from "@/hooks/use-doctors";
import {
  patientFormSchema,
  type PatientFormInput,
  type PatientFormValues,
} from "@/lib/validations/patient";
import { PatientFormFields } from "./patient-form-fields";

const EMPTY_PATIENT: PatientFormInput = {
  name: "",
  age: "",
  gender: "male",
  phone: "",
  email: "",
  condition: "",
  notes: "",
};

type AddPatientDialogProps = {
  doctorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Dialog to add a new patient to one doctor. */
export function AddPatientDialog({
  doctorId,
  open,
  onOpenChange,
}: AddPatientDialogProps) {
  const addMutation = useAddDoctorPatient(doctorId);
  const saving = addMutation.isPending;

  const form = useForm<PatientFormInput, unknown, PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: EMPTY_PATIENT,
    mode: "onSubmit",
  });

  // Always start from an empty form when the dialog is opened.
  useEffect(() => {
    if (open) form.reset(EMPTY_PATIENT);
  }, [form, open]);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await addMutation.mutateAsync(values);
      onOpenChange(false);
    } catch {
      // The mutation hook already rolled back and showed the error toast.
    }
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!saving) onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add patient</DialogTitle>
          <DialogDescription>
            Create a new patient and assign them to this doctor.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <PatientFormFields form={form} />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" /> : null}
                Add patient
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
