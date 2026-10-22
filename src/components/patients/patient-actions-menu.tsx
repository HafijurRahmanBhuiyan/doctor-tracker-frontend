"use client";

import { useCallback } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { PatientWithDoctor } from "@/types";

type PatientActionsMenuProps = {
  patient: PatientWithDoctor;
  onEdit: (patient: PatientWithDoctor) => void;
  onDelete: (patient: PatientWithDoctor) => void;
};

/** Row / card actions of a patient: edit and delete. */
export function PatientActionsMenu({
  patient,
  onEdit,
  onDelete,
}: PatientActionsMenuProps) {
  const handleEdit = useCallback(() => {
    onEdit(patient);
  }, [onEdit, patient]);

  const handleDelete = useCallback(() => {
    onDelete(patient);
  }, [onDelete, patient]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions for ${patient.name}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onSelect={handleEdit}>
          <Pencil className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
