"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_SEQUENCE_EFFECTIVENESS } from "@/lib/mock-data/operations";

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export function SequenceEffectivenessChart() {
  const chartData = MOCK_SEQUENCE_EFFECTIVENESS.map((s) => ({
    ...s,
    shortName: s.name.replace(" Recovery", ""),
  }));

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Collection rate by sequence</CardTitle>
      </CardHeader>
      <CardContent className="h-56 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="shortName"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              interval={0}
              angle={-12}
              textAnchor="end"
              height={46}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={40}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name) => [
                name === "collectionRatePct" ? `${value}%` : `${value}d`,
                name === "collectionRatePct" ? "Collection rate" : "Avg. days to collect",
              ]}
            />
            <Bar dataKey="collectionRatePct" fill="var(--primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
