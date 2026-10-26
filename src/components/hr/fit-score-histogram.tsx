"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FitScoreBucket } from "@/lib/mock-data/hr";

function bucketColor(min: number) {
  if (min >= 81) return "var(--success)";
  if (min >= 61) return "var(--primary)";
  if (min >= 41) return "var(--warning)";
  return "var(--destructive)";
}

export function FitScoreHistogram({
  data,
  title = "Fit score distribution",
  height = 200,
}: {
  data: FitScoreBucket[];
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
              dataKey="bucket"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={28}
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
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((entry) => (
                <Cell key={entry.bucket} fill={bucketColor(entry.min)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
