"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { DoctorWithPatientCount } from "@/types";

type DoctorActionsMenuProps = {
  doctor: DoctorWithPatientCount;
  onEdit: (doctor: DoctorWithPatientCount) => void;
  onDelete: (doctor: DoctorWithPatientCount) => void;
};

/**
 * Row / card actions: view, edit and delete.
 * The menu stops the click so a parent row navigation is not triggered.
 */
export function DoctorActionsMenu({
  doctor,
  onEdit,
  onDelete,
}: DoctorActionsMenuProps) {
  const router = useRouter();

  const handleView = useCallback(() => {
    router.push(`/doctors/${doctor._id}`);
  }, [doctor._id, router]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions for ${doctor.name}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-36"
        // The content is rendered in a portal, but clicks still bubble through
        // the React tree: stop them so the row below is not navigated.
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenuItem onSelect={handleView}>
          <Eye className="h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onEdit(doctor)}>
          <Pencil className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(doctor)}>
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
