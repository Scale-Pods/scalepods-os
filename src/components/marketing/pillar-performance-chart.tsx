"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import type { PillarPerformance } from "@/lib/mock-data/marketing";

export function PillarPerformanceChart({ data }: { data: PillarPerformance[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Content performance by pillar</CardTitle>
        <CardDescription>Output volume and estimated engagement per content pillar.</CardDescription>
      </CardHeader>
      <CardContent className="h-56 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, bottom: 24, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="pillar"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              interval={0}
              angle={-18}
              textAnchor="end"
              height={46}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={28}
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
            <Bar dataKey="outputCount" name="Pieces published" fill="var(--primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
