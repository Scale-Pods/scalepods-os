"use client";

import type * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TrendLineChartProps<T> {
  data: T[];
  xKey: keyof T & string;
  yKey: keyof T & string;
  height?: number;
  valueFormatter?: (value: number) => string;
  color?: string;
}

export function TrendLineChart<T>({
  data,
  xKey,
  yKey,
  height = 220,
  valueFormatter,
  color = "var(--primary)",
}: TrendLineChartProps<T>) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
          <XAxis
            dataKey={xKey as string}
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
            tickFormatter={valueFormatter}
          />
          <Tooltip
            formatter={(value) => {
              const num = typeof value === "number" ? value : Number(value ?? 0);
              return [valueFormatter ? valueFormatter(num) : num, ""] as [React.ReactNode, string];
            }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey={yKey as string}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
