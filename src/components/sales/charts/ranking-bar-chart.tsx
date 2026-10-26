"use client";

import type * as React from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface RankingBarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  valueSuffix?: string;
  valueLabel?: string;
  valueFormatter?: (value: number) => string;
  highlightTopN?: number;
}

/** Horizontal ranking bar chart (e.g. sequences ranked by reply rate). */
export function RankingBarChart({
  data,
  height = 240,
  valueSuffix = "%",
  valueLabel = "Value",
  valueFormatter,
  highlightTopN = 1,
}: RankingBarChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
          <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={150}
          />
          <Tooltip
            formatter={(value) => {
              const num = typeof value === "number" ? value : Number(value ?? 0);
              return [
                valueFormatter ? valueFormatter(num) : `${num}${valueSuffix}`,
                valueLabel,
              ] as [React.ReactNode, string];
            }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {data.map((entry, i) => (
              <Cell key={entry.label} fill={i < highlightTopN ? "var(--success)" : "var(--primary)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
