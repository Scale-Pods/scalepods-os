"use client";

import type * as React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { StageValuePoint } from "@/lib/mock-data/sales";
import { formatMoney } from "@/lib/format";

interface StageValueBarChartProps {
  data: StageValuePoint[];
  height?: number;
}

/** Pipeline value by deal stage, as a bar chart. */
export function StageValueBarChart({ data, height = 220 }: StageValueBarChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(v: number) => `${Math.round(v / 100000) / 10}L`}
          />
          <Tooltip
            formatter={(value, _name, item) => {
              const num = typeof value === "number" ? value : Number(value ?? 0);
              const count = (item?.payload as StageValuePoint | undefined)?.count ?? 0;
              return [formatMoney(num, "INR"), `${count} deal${count === 1 ? "" : "s"}`] as [
                React.ReactNode,
                string,
              ];
            }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="var(--primary)" maxBarSize={56} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
