"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeeklyScheduledPoint } from "@/lib/mock-data/marketing";

export function WeeklyScheduledChart({ data }: { data: WeeklyScheduledPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Content velocity — next 4 weeks</CardTitle>
      </CardHeader>
      <CardContent className="h-56 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={24}
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
            <Bar dataKey="linkedin" name="LinkedIn" stackId="platforms" fill="var(--primary)" />
            <Bar dataKey="instagram" name="Instagram" stackId="platforms" fill="var(--accent)" />
            <Bar dataKey="blog" name="Blog" stackId="platforms" fill="var(--warning)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
