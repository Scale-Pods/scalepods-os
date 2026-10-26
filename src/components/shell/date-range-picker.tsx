"use client";

import * as React from "react";
import { CalendarRange, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDateRange } from "@/lib/date-range-context";

const PRESETS = [
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "This quarter", value: "qtd" },
  { label: "This year", value: "ytd" },
] as const;

export function DateRangePicker() {
  const { range, setRange } = useDateRange();
  const current = PRESETS.find((p) => p.value === range) ?? PRESETS[1];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 h-8">
          <CalendarRange className="size-3.5 text-muted-foreground" />
          {current.label}
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {PRESETS.map((p) => (
          <DropdownMenuItem key={p.value} onClick={() => setRange(p.value)}>
            {p.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
