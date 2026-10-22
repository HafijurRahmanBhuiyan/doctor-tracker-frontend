"use client";

import { X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { SearchInput } from "@/components/common/search-input";
import { DateRangePicker } from "@/components/common/date-range-picker";
import { DoctorPicker } from "@/components/doctors/doctor-picker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Gender, PatientSort } from "@/types";

/**
 * The value of the "All" option. Radix Select needs a non-empty value, so the
 * "no filter" state is mapped to "" in the URL by the caller.
 */
const ALL = "all";

/** Only the sort options the backend accepts (`sortBy` + `order`). */
const SORT_OPTIONS: { value: PatientSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
  { value: "age-asc", label: "Age (low to high)" },
  { value: "age-desc", label: "Age (high to low)" },
  { value: "condition", label: "Condition (A-Z)" },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

type PatientsToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  conditions: string[];
  condition: string;
  onConditionChange: (value: string) => void;
  /** The id of the doctor the list is filtered by. */
  doctor: string;
  onDoctorChange: (doctorId: string) => void;
  gender: string;
  onGenderChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  sort: PatientSort;
  onSortChange: (value: PatientSort) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

/**
 * The toolbar of the patients page: search, filters and sorting.
 *
 * Every control writes its value into the URL, so the view can be shared and
 * restored as it is.
 */
export function PatientsToolbar({
  search,
  onSearchChange,
  conditions,
  condition,
  onConditionChange,
  doctor,
  onDoctorChange,
  gender,
  onGenderChange,
  dateRange,
  onDateRangeChange,
  sort,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
}: PatientsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search by name or condition"
        className="w-full sm:w-64"
      />

      <Select
        value={condition || ALL}
        onValueChange={(value) => onConditionChange(value === ALL ? "" : value)}
      >
        <SelectTrigger aria-label="Filter by condition" className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All conditions</SelectItem>
          {conditions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DoctorPicker
        value={doctor}
        onChange={onDoctorChange}
        placeholder="All doctors"
        className="w-full sm:w-56"
      />

      <Select
        value={gender || ALL}
        onValueChange={(value) => onGenderChange(value === ALL ? "" : value)}
      >
        <SelectTrigger aria-label="Filter by gender" className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All genders</SelectItem>
          {GENDER_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DateRangePicker
        value={dateRange}
        onChange={onDateRangeChange}
        placeholder="Created date"
      />

      <Select
        value={sort}
        onValueChange={(value) => onSortChange(value as PatientSort)}
      >
        <SelectTrigger aria-label="Sort patients" className="ml-auto w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters ? (
        <Button variant="outline" onClick={onClearFilters}>
          <X />
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
