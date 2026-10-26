"use client";

import type * as React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface AreaTrendChartProps<T> {
  data: T[];
  xKey: keyof T & string;
  yKey: keyof T & string;
  height?: number;
  valueFormatter?: (value: number) => string;
  color?: string;
}

export function AreaTrendChart<T>({
  data,
  xKey,
  yKey,
  height = 220,
  valueFormatter,
  color = "var(--primary)",
}: AreaTrendChartProps<T>) {
  const gradientId = `area-gradient-${String(yKey)}`;
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
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
          <Area type="monotone" dataKey={yKey as string} stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
