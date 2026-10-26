"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FitScoreComparison({
  candidateScore,
  jobAvgScore,
  jobTitle,
}: {
  candidateScore: number;
  jobAvgScore: number;
  jobTitle?: string;
}) {
  const data = [
    { label: "This candidate", score: candidateScore },
    { label: `${jobTitle ?? "Job"} average`, score: jobAvgScore },
  ];
  const delta = candidateScore - jobAvgScore;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <span>Fit score vs. job average</span>
          <span className={delta >= 0 ? "text-success" : "text-destructive"}>
            {delta >= 0 ? "+" : ""}
            {delta} pts
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-40 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 4 }}>
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              type="category"
              dataKey="label"
              width={120}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value) => [value, "Fit score"]}
            />
            <Bar dataKey="score" radius={[0, 6, 6, 0]} maxBarSize={28}>
              <Cell fill="var(--primary)" />
              <Cell fill="var(--muted-foreground)" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
