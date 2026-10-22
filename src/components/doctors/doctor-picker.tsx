"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
} from "react";
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { useDoctor, useDoctors } from "@/hooks/use-doctors";
import { isObjectId } from "@/lib/validations/shared";
import type { DoctorListParams } from "@/types";

/** Everything the picker needs to show a doctor. */
export type DoctorPickerDoctor = {
  _id: string;
  name: string;
  specialization: string;
  hospital?: string;
};

/** The number of doctors that are loaded at once. */
const SEARCH_LIMIT = 20;

type DoctorPickerProps = {
  /** The id of the selected doctor ("" when nothing is selected). */
  value: string;
  onChange: (doctorId: string) => void;
  /**
   * The already known doctor. It is used to show the name of the selection
   * without another request, even when the doctor is not part of the current
   * search results.
   */
  selectedDoctor?: DoctorPickerDoctor | null;
  placeholder?: string;
  className?: string;
} & Pick<
  ComponentProps<"button">,
  "id" | "disabled" | "aria-label" | "aria-describedby" | "aria-invalid"
>;

/**
 * A searchable doctor picker.
 *
 * The results come from `GET /doctors?search=&limit=20` and are only loaded
 * while the popover is open. The selection is the id of the doctor, so the
 * picker can be used for a filter (as a URL param) and for a form field.
 */
export function DoctorPicker({
  value,
  onChange,
  selectedDoctor = null,
  placeholder = "Select a doctor",
  className,
  ...buttonProps
}: DoctorPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const listboxId = useId();
  const listRef = useRef<HTMLUListElement>(null);

  const debouncedSearch = useDebounce(search, 300);

  const params = useMemo<DoctorListParams>(
    () => ({ search: debouncedSearch || undefined, limit: SEARCH_LIMIT }),
    [debouncedSearch]
  );

  // The doctors are only fetched while the popover is open.
  const doctorsQuery = useDoctors(params, { enabled: open });
  const doctors = useMemo(
    () => doctorsQuery.data?.data ?? [],
    [doctorsQuery.data]
  );

  // The name of the selected doctor is fetched when it is not known yet
  // (e.g. a deep link that only carries the id of the doctor).
  const selectedId = isObjectId(value) ? value : undefined;
  const doctorQuery = useDoctor(
    selectedId && !selectedDoctor ? selectedId : undefined
  );

  const selectedName = selectedDoctor?.name ?? doctorQuery.data?.name ?? "";

  // The highlighted entry never points behind the end of the result list.
  const maxIndex = Math.max(doctors.length - 1, 0);
  const activeIndex = Math.min(highlighted, maxIndex);

  // The highlighted entry is scrolled into the visible area.
  useEffect(() => {
    if (!open) return;

    const option = listRef.current?.children[activeIndex] as
      | HTMLElement
      | undefined;
    option?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const selectDoctor = useCallback(
    (doctorId: string) => {
      onChange(doctorId);
      setOpen(false);
      setSearch("");
    },
    [onChange]
  );

  const clearSelection = useCallback(() => {
    onChange("");
    setSearch("");
  }, [onChange]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (doctors.length === 0) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlighted((index) => Math.min(index + 1, doctors.length - 1));
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlighted((index) => Math.max(index - 1, 0));
        return;
      }

      if (event.key === "Enter") {
        const doctor = doctors[highlighted];
        if (!doctor) return;

        event.preventDefault();
        selectDoctor(doctor._id);
      }
    },
    [doctors, highlighted, selectDoctor]
  );

  const label = selectedName || (value ? "Selected doctor" : placeholder);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={selectedName ? `Doctor: ${selectedName}` : placeholder}
          className={cn(
            "w-full justify-between font-normal",
            !selectedName && "text-muted-foreground",
            className
          )}
          {...buttonProps}
        >
          <span className="truncate">{label}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-(--radix-popover-trigger-width) min-w-64 p-0"
        onKeyDown={handleKeyDown}
      >
        <div className="relative border-b p-2">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search doctors..."
            aria-label="Search doctors"
            className="h-8 pl-8"
          />
        </div>

        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label="Doctors"
          aria-activedescendant={
            doctors[highlighted]
              ? `${listboxId}-option-${highlighted}`
              : undefined
          }
          className="max-h-60 overflow-y-auto p-1"
        >
          {doctorsQuery.isPending && open ? (
            <li className="flex items-center gap-2 px-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading doctors...
            </li>
          ) : null}

          {!doctorsQuery.isPending && doctors.length === 0 ? (
            <li className="px-2 py-6 text-center text-sm text-muted-foreground">
              No doctors found
            </li>
          ) : null}

          {doctors.map((doctor, index) => {
            const isSelected = doctor._id === value;

            return (
              <li
                key={doctor._id}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => selectDoctor(doctor._id)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm",
                  index === highlighted && "bg-accent text-accent-foreground"
                )}
              >
                <Check
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isSelected ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">
                    {doctor.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {doctor.specialization}
                    {doctor.hospital ? ` · ${doctor.hospital}` : ""}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        <div className="border-t p-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={clearSelection}
            disabled={!value}
          >
            <X className="h-4 w-4" />
            Clear selection
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
