import { z } from "zod";
import {
  genderSchema,
  optionalEmailSchema,
  phoneSchema,
} from "./shared";

/**
 * Patient form rules.
 *
 * Mirrors `createPatientSchema` of the backend
 * (`backend/src/validators/doctor.ts`): the age is coerced to a number
 * between 0 and 130, the gender is one of `male | female | other` and the
 * email is optional but has to be valid when it is filled in.
 *
 * The age is kept as a string while typing and turns into a number once the
 * values are parsed (like the `z.coerce.number()` of the backend does).
 * `PatientFormInput` is the shape while editing, `PatientFormValues` is the
 * parsed payload that is sent to the API.
 */
export const patientFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name must be at most 120 characters"),
  age: z
    .string()
    .trim()
    .min(1, "Age is required")
    .regex(/^\d{1,3}$/, "Enter a valid age (digits only)")
    .refine((value) => Number(value) <= 130, "Age must be at most 130")
    .transform(Number),
  gender: genderSchema,
  phone: phoneSchema,
  email: optionalEmailSchema,
  condition: z
    .string()
    .trim()
    .min(1, "Condition is required")
    .max(150, "Condition must be at most 150 characters"),
  notes: z
    .string()
    .trim()
    .max(2000, "Notes must be at most 2000 characters")
    .transform((value) => value || undefined),
});

/** The form values while editing (the age and the email are plain strings). */
export type PatientFormInput = z.input<typeof patientFormSchema>;

/** The parsed values that are sent to the API. */
export type PatientFormValues = z.output<typeof patientFormSchema>;
