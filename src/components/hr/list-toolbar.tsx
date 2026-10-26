"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ListToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  className?: string;
}

export function ListToolbar({ searchValue, onSearchChange, placeholder = "Search...", children, className }: ListToolbarProps) {
  return (
    <div className={cn("mb-4 flex flex-wrap items-center gap-2", className)}>
      <div className="relative w-full max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="h-9 pl-8"
        />
      </div>
      {children}
    </div>
  );
}
