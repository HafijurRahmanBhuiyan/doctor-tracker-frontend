"use client";

import { X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { SearchInput } from "@/components/common/search-input";
import { DateRangePicker } from "@/components/common/date-range-picker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DoctorSort } from "@/types";

/**
 * The value of the "All" option. Radix Select needs a non-empty value, so the
 * "no filter" state is mapped to "" in the URL by the caller.
 */
const ALL = "all";

const SORT_OPTIONS: { value: DoctorSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
];

type DoctorsToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  specializations: string[];
  specialization: string;
  onSpecializationChange: (value: string) => void;
  hospitals: string[];
  hospital: string;
  onHospitalChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  sort: DoctorSort;
  onSortChange: (value: DoctorSort) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

export function DoctorsToolbar({
  search,
  onSearchChange,
  specializations,
  specialization,
  onSpecializationChange,
  hospitals,
  hospital,
  onHospitalChange,
  dateRange,
  onDateRangeChange,
  sort,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
}: DoctorsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search by name or email"
        className="w-full sm:w-64"
      />

      <Select
        value={specialization || ALL}
        onValueChange={(value) => onSpecializationChange(value === ALL ? "" : value)}
      >
        <SelectTrigger aria-label="Filter by specialization" className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All specializations</SelectItem>
          {specializations.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={hospital || ALL}
        onValueChange={(value) => onHospitalChange(value === ALL ? "" : value)}
      >
        <SelectTrigger aria-label="Filter by hospital" className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All hospitals</SelectItem>
          {hospitals.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
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
        onValueChange={(value) => onSortChange(value as DoctorSort)}
      >
        <SelectTrigger aria-label="Sort doctors" className="ml-auto w-40">
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
