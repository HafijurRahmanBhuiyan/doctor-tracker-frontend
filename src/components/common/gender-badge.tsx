import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Gender } from "@/types";

const genderLabels: Record<Gender, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
};

const genderClasses: Record<Gender, string> = {
  male: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  female: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  other: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
};

type GenderBadgeProps = {
  gender: Gender;
  className?: string;
};

/** Badge used for the gender of a patient. */
export function GenderBadge({ gender, className }: GenderBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(genderClasses[gender] ?? genderClasses.other, className)}
    >
      {genderLabels[gender] ?? gender}
    </Badge>
  );
}
