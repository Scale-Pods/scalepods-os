"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ListToolbar({
  searchValue,
  onSearchChange,
  placeholder = "Search...",
  children,
  className,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex flex-wrap items-center gap-2", className)}>
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="pl-8"
        />
      </div>
      {children}
    </div>
  );
}
