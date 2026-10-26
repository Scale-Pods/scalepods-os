"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SourceBreakdownPoint } from "@/lib/mock-data/hr";

const SOURCE_COLORS = [
  "var(--primary)",
  "var(--accent)",
  "var(--success)",
  "var(--warning)",
  "var(--destructive)",
  "var(--muted-foreground)",
];

export function SourceBreakdownChart({
  data,
  title = "Candidate source",
  height = 220,
}: {
  data: SourceBreakdownPoint[];
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
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="source"
              innerRadius="55%"
              outerRadius="85%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={entry.source} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value, name) => [value, name]}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
