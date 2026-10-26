"use client";

import * as React from "react";

type RangeValue = "today" | "7d" | "30d" | "qtd" | "ytd";

interface DateRangeContextValue {
  range: RangeValue;
  setRange: (v: RangeValue) => void;
}

const DateRangeContext = React.createContext<DateRangeContextValue | null>(null);

export function DateRangeProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = React.useState<RangeValue>("30d");
  return (
    <DateRangeContext.Provider value={{ range, setRange }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const ctx = React.useContext(DateRangeContext);
  if (!ctx) throw new Error("useDateRange must be used within DateRangeProvider");
  return ctx;
}
