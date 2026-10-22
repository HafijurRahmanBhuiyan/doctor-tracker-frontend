import { Badge } from "@/components/ui/badge";

type ConditionBadgeProps = {
  condition: string;
  className?: string;
};

/** Badge used for the condition of a patient. */
export function ConditionBadge({ condition, className }: ConditionBadgeProps) {
  return (
    <Badge variant="secondary" className={className}>
      {condition}
    </Badge>
  );
}
