"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompact } from "@/lib/format";
import type { PipelineComparisonPoint } from "@/lib/mock-data/analytics";

export function PipelineComparisonChart({ data }: { data: PipelineComparisonPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline value — this period vs last period</CardTitle>
      </CardHeader>
      <CardContent className="h-64 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(v: number) => formatCompact(v)}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="thisPeriod" name="This period" stroke="var(--primary)" strokeWidth={2} dot={false} />
            <Line
              type="monotone"
              dataKey="lastPeriod"
              name="Last period"
              stroke="var(--muted-foreground)"
              strokeWidth={2}
              strokeDasharray="4 3"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
