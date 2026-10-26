"use client";

import type * as React from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";

interface SparklineProps {
  data: { label: string; count: number }[];
  height?: number;
  color?: string;
}

/** Compact sparkline-style bar chart for per-day activity counts. */
export function Sparkline({ data, height = 56, color = "var(--primary)" }: SparklineProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <Tooltip
            cursor={{ fill: "var(--muted)" }}
            formatter={(value) => {
              const num = typeof value === "number" ? value : Number(value ?? 0);
              return [`${num} activities`, ""] as [React.ReactNode, string];
            }}
            labelFormatter={(label) => (label ?? "") as React.ReactNode}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 11,
              padding: "4px 8px",
            }}
          />
          <Bar dataKey="count" fill={color} radius={[2, 2, 0, 0]} maxBarSize={6} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
