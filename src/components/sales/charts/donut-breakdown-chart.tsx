"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { BreakdownSlice } from "@/lib/mock-data/sales";

// Fixed categorical order — never cycled, assigned by position so identity
// stays stable as filters change which labels are present.
const SLICE_COLORS = [
  "var(--primary)",
  "var(--accent)",
  "var(--success)",
  "var(--warning)",
  "var(--destructive)",
  "var(--muted-foreground)",
];

interface DonutBreakdownChartProps {
  data: BreakdownSlice[];
  height?: number;
}

export function DonutBreakdownChart({ data, height = 220 }: DonutBreakdownChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex items-center gap-4">
      <div style={{ height, width: height }} className="shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="60%"
              outerRadius="95%"
              paddingAngle={2}
              stroke="var(--card)"
              strokeWidth={2}
            >
              {data.map((entry, i) => (
                <Cell key={entry.label} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => {
                const num = typeof value === "number" ? value : Number(value ?? 0);
                const pct = total ? Math.round((num / total) * 100) : 0;
                return [`${num} (${pct}%)`, name ?? ""] as [React.ReactNode, string];
              }}
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        {data.map((entry, i) => (
          <div key={entry.label} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-1.5 truncate">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: SLICE_COLORS[i % SLICE_COLORS.length] }}
              />
              <span className="truncate text-muted-foreground">{entry.label}</span>
            </span>
            <span className="shrink-0 font-medium">
              {entry.value}
              <span className="ml-1 text-muted-foreground">
                ({total ? Math.round((entry.value / total) * 100) : 0}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
