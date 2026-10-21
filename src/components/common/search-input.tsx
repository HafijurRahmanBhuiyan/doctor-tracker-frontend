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
  placeholder = "Search...",
  delay = 400,
  className,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, delay);
  const lastSynced = useRef(value);

  useEffect(() => {
    if (lastSynced.current !== value) {
      lastSynced.current = value;
      setInputValue(value);
    }
  }, [value]);

  useEffect(() => {
    lastSynced.current = debouncedValue;
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

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
