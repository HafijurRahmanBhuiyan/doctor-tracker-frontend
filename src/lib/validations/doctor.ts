import { z } from "zod";
import { phoneSchema, requiredEmailSchema } from "./shared";

/**
 * Doctor form rules.
 *
 * Mirrors `createDoctorSchema` / `updateDoctorSchema` of the backend
 * (`backend/src/validators/doctor.ts`): every field is required and the email
 * has to be a valid address. The maximum lengths are generous client side
 * limits that protect the UI from accidental pastes.
 */
export const doctorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name must be at most 120 characters"),
  specialization: z
    .string()
    .trim()
    .min(1, "Specialization is required")
    .max(120, "Specialization must be at most 120 characters"),
  hospital: z
    .string()
    .trim()
    .min(1, "Hospital is required")
    .max(120, "Hospital must be at most 120 characters"),
  phone: phoneSchema,
  email: requiredEmailSchema,
});

export type DoctorFormValues = z.infer<typeof doctorFormSchema>;
