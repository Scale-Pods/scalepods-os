"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompact } from "@/lib/format";
import type { WeeklyPoint } from "@/lib/mock-data/executive-metrics";

export function PipelineTrendChart({ data }: { data: WeeklyPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline value, last 8 weeks</CardTitle>
      </CardHeader>
      <CardContent className="h-64 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="pipelineFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(v: number) => formatCompact(v)}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Pipeline value"]}
            />
            <Area
              type="monotone"
              dataKey="pipelineValue"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#pipelineFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
