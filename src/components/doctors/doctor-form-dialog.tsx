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
import { Input } from "@/components/ui/input";
import { getErrorStatus, getErrorMessage } from "@/lib/api";
import { useCreateDoctor, useUpdateDoctor } from "@/hooks/use-doctors";
import {
  doctorFormSchema,
  type DoctorFormValues,
} from "@/lib/validations/doctor";
import type { DoctorWithPatientCount } from "@/types";

const EMPTY_DOCTOR: DoctorFormValues = {
  name: "",
  specialization: "",
  hospital: "",
  phone: "",
  email: "",
};

type DoctorFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The doctor being edited, or nothing to create a new one. */
  doctor: DoctorWithPatientCount | null;
};

/**
 * Add / edit doctor in one dialog. A duplicate email sent by the backend as a
 * 409 is mapped onto the email field.
 */
export function DoctorFormDialog({
  open,
  onOpenChange,
  doctor,
}: DoctorFormDialogProps) {
  const isEditing = Boolean(doctor);

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: EMPTY_DOCTOR,
    mode: "onSubmit",
  });

  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor(doctor?._id ?? "");
  const saving = createMutation.isPending || updateMutation.isPending;

  // Reset to the current doctor (or an empty form) whenever the dialog opens.
  useEffect(() => {
    if (!open) return;

    form.reset(
      doctor
        ? {
            name: doctor.name,
            specialization: doctor.specialization,
            hospital: doctor.hospital,
            phone: doctor.phone,
            email: doctor.email,
          }
        : EMPTY_DOCTOR
    );
  }, [doctor, form, open]);

  const handleErrors = (error: unknown) => {
    if (getErrorStatus(error) === 409) {
      // Duplicate email: attach the backend message to the email field.
      form.setError("email", {
        type: "server",
        message: getErrorMessage(error),
      });
    }
    // Every other error already shows a toast inside the mutation hook.
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      if (doctor) {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit doctor" : "Add doctor"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Update the details of ${doctor?.name}.`
              : "Add a new doctor. Their email must be unique."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialization</FormLabel>
                  <FormControl>
                    <Input placeholder="Cardiology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hospital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital</FormLabel>
                  <FormControl>
                    <Input placeholder="City General Hospital" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 000-1234"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="doctor@example.com"
                      {...field}
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
                {isEditing ? "Save changes" : "Add doctor"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
