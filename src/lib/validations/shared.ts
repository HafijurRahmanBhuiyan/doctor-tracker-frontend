import { z } from "zod";

/**
 * Shared field rules.
 *
 * The backend only enforces `min(1)` on the phone number and a valid email
 * (`backend/src/validators/doctor.ts`, `backend/src/validators/patient.ts`).
 * The client mirrors those rules and adds a light format check so obvious
 * typos are caught before a request is sent.
 */

/** Digits, spaces and the usual phone separators. */
const PHONE_PATTERN = /^[0-9+\-\s().]+$/;

function countDigits(value: string) {
  return value.match(/\d/g)?.length ?? 0;
}

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .max(30, "Phone number must be at most 30 characters")
  .regex(
    PHONE_PATTERN,
    "Phone number can only contain digits, spaces and + - ( ) characters"
  )
  .refine((value) => countDigits(value) >= 3, "Enter a valid phone number");

/** A required email address (the backend rejects anything that is not one). */
export const requiredEmailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .pipe(z.email("Enter a valid email address"));

/** An optional email address: empty is allowed, a filled one must be valid. */
export const optionalEmailSchema = z.union([
  z.literal(""),
  z.string().trim().pipe(z.email("Enter a valid email address")),
]);

export const genderSchema = z.enum(["male", "female", "other"], {
  error: "Select a gender",
});
