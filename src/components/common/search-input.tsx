"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";

type SearchInputProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
};

export function SearchInput({
  value = "",
  onChange,
  placeholder = "Search by name, email or phone",
  delay = 400,
  className,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, delay);
  const lastSynced = useRef(value);
  const lastEmitted = useRef(debouncedValue);

  // The callback is kept in a ref on purpose: a new function identity (the
  // parent re-creates its handlers on every navigation) must not trigger a
  // new search. Re-sending the current value would reset the pagination of
  // the page, because a "new" search always goes back to the first page.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Adopt the value when it is changed from the outside (e.g. "Clear filters").
  useEffect(() => {
    if (lastSynced.current !== value) {
      lastSynced.current = value;
      setInputValue(value);
    }
  }, [value]);

  // Only report an actual change of the search term.
  useEffect(() => {
    if (lastEmitted.current === debouncedValue) return;

    lastEmitted.current = debouncedValue;
    onChangeRef.current(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-8"
      />
      {inputValue ? (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0.5 top-0.5 h-7 w-7"
          onClick={() => setInputValue("")}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      ) : null}
    </div>
  );
}
