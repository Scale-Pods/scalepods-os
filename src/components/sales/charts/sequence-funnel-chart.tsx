"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SequenceFunnelPoint } from "@/lib/mock-data/sales";

interface SequenceFunnelChartProps {
  data: SequenceFunnelPoint[];
  height?: number;
}

/** Horizontal step funnel: how many contacts reached, replied at, or dropped off at each step. */
export function SequenceFunnelChart({ data, height = 260 }: SequenceFunnelChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
          barCategoryGap={18}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
          <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="replied" name="Replied" stackId="a" fill="var(--success)" radius={[0, 0, 0, 0]} maxBarSize={28} />
          <Bar dataKey="droppedOff" name="Dropped off" stackId="a" fill="var(--destructive)" maxBarSize={28} />
          <Bar
            dataKey="reached"
            name="Reached step"
            fill="var(--primary)"
            maxBarSize={28}
            radius={[0, 4, 4, 0]}
            fillOpacity={0.18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
