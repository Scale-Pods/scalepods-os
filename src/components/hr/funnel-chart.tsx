"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FUNNEL_COLORS = [
  "var(--muted-foreground)",
  "var(--primary)",
  "var(--accent)",
  "var(--warning)",
  "var(--primary)",
  "var(--success)",
];

export interface FunnelChartDatum {
  label: string;
  count: number;
}

export function FunnelChart({
  data,
  title = "Candidate funnel",
  height = 220,
}: {
  data: FunnelChartDatum[];
  title?: string;
  height?: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-2" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={32}
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value) => [value, "Candidates"]}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={56}>
              {data.map((entry, i) => (
                <Cell key={entry.label} fill={FUNNEL_COLORS[i % FUNNEL_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
