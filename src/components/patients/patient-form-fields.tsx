"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Gender,
} from "@/types";
import type {
  PatientFormInputWithDoctor,
  PatientFormValuesWithDoctor,
} from "@/lib/validations/patient";

/** The typed form object a host page needs to use `PatientFormFields`. */
export type PatientFormReturn = UseFormReturn<
  PatientFormInputWithDoctor,
  unknown,
  PatientFormValuesWithDoctor
>;

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

type PatientFormFieldsProps = {
  form: PatientFormReturn;
};

/**
 * The patient form fields (name, age, gender, phone, email, condition,
 * notes). Reusable: the dialog has to be wrapped in a `<Form>` so the fields
 * can read the form context, which keeps them usable for the Patients page
 * as well.
 */
export function PatientFormFields({ form }: PatientFormFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Jane Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={130}
                  step={1}
                  placeholder="35"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="+1 (555) 000-1234" {...field} />
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
            <FormLabel>
              Email{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="patient@example.com"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="condition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Condition</FormLabel>
            <FormControl>
              <Input placeholder="Hypertension" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Notes{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </FormLabel>
            <FormControl>
              <Textarea
                rows={3}
                placeholder="Anything worth remembering..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
