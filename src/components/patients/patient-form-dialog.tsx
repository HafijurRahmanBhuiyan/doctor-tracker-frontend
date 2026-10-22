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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DoctorPicker } from "@/components/doctors/doctor-picker";
import { getErrorMessage, getErrorStatus } from "@/lib/api";
import { useCreatePatient, useUpdatePatient } from "@/hooks/use-patients";
import {
  patientFormSchemaWithDoctor,
  type PatientFormInputWithDoctor,
  type PatientFormValuesWithDoctor,
} from "@/lib/validations/patient";
import { PatientFormFields } from "./patient-form-fields";
import type { PatientWithDoctor } from "@/types";

const EMPTY_PATIENT: PatientFormInputWithDoctor = {
  name: "",
  age: "",
  gender: "male",
  phone: "",
  email: "",
  condition: "",
  notes: "",
  doctorId: "",
};

type PatientFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The patient being edited, or nothing to create a new one. */
  patient: PatientWithDoctor | null;
  /** The doctor that is pre-selected when a new patient is created. */
  defaultDoctorId?: string;
};

/**
 * Add / edit patient in one dialog.
 *
 * The doctor is required and can be changed while editing (the backend moves
 * the patient to the new doctor). A missing doctor is answered by the backend
 * with a 404, which is mapped onto the doctor field; every other error is
 * shown as a toast by the mutation hook.
 */
export function PatientFormDialog({
  open,
  onOpenChange,
  patient,
  defaultDoctorId,
}: PatientFormDialogProps) {
  const isEditing = Boolean(patient);

  const form = useForm<
    PatientFormInputWithDoctor,
    unknown,
    PatientFormValuesWithDoctor
  >({
    resolver: zodResolver(patientFormSchemaWithDoctor),
    defaultValues: EMPTY_PATIENT,
    mode: "onSubmit",
  });

  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient(patient?._id ?? "");
  const saving = createMutation.isPending || updateMutation.isPending;

  // Reset to the current patient (or an empty form) whenever the dialog opens.
  useEffect(() => {
    if (!open) return;

    form.reset(
      patient
        ? {
            name: patient.name,
            age: String(patient.age),
            gender: patient.gender,
            phone: patient.phone,
            email: patient.email ?? "",
            condition: patient.condition,
            notes: patient.notes ?? "",
            doctorId: patient.doctor._id,
          }
        : { ...EMPTY_PATIENT, doctorId: defaultDoctorId ?? "" }
    );
  }, [defaultDoctorId, form, open, patient]);

  const handleErrors = (error: unknown) => {
    const message = getErrorMessage(error);

    if (getErrorStatus(error) === 404 && /doctor/i.test(message)) {
      // The doctor does not exist (anymore): attach the message to the field.
      form.setError("doctorId", { type: "server", message });
    }
    // Every other error already shows a toast inside the mutation hook.
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      if (patient) {
        await updateMutation.mutateAsync(values);
      } else {
        await createMutation.mutateAsync(values);
      }
      onOpenChange(false);
    } catch (error) {
      handleErrors(error);
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
          <DialogTitle>
            {isEditing ? "Edit patient" : "Add patient"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Update the details of ${patient?.name}. The patient can be assigned to another doctor.`
              : "Add a new patient and assign them to a doctor."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <PatientFormFields form={form} />

            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor</FormLabel>
                  <FormControl>
                    <DoctorPicker
                      value={field.value}
                      onChange={field.onChange}
                      selectedDoctor={patient?.doctor ?? null}
                      placeholder="Select a doctor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isEditing ? "Save changes" : "Add patient"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
