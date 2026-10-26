"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OutputTrendPoint } from "@/lib/mock-data/marketing";

export function OutputTrendStackedArea({ data }: { data: OutputTrendPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content output by platform, last 12 weeks</CardTitle>
      </CardHeader>
      <CardContent className="h-72 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              interval={1}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={28}
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="linkedin"
              name="LinkedIn"
              stackId="output"
              stroke="var(--primary)"
              fill="var(--primary)"
              fillOpacity={0.55}
            />
            <Area
              type="monotone"
              dataKey="instagram"
              name="Instagram"
              stackId="output"
              stroke="var(--accent)"
              fill="var(--accent)"
              fillOpacity={0.55}
            />
            <Area
              type="monotone"
              dataKey="blog"
              name="Blog"
              stackId="output"
              stroke="var(--warning)"
              fill="var(--warning)"
              fillOpacity={0.55}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
