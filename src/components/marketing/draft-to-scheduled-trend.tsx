"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DraftToScheduledPoint } from "@/lib/mock-data/marketing";

export function DraftToScheduledTrend({ data }: { data: DraftToScheduledPoint[] }) {
  const latest = data[data.length - 1];
  const earliest = data[0];
  const deltaDays = latest && earliest ? Math.round((latest.avgDays - earliest.avgDays) * 10) / 10 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Avg. draft-to-scheduled time</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-semibold tracking-tight">{latest?.avgDays ?? 0}d</p>
          <span className={`text-xs font-medium ${deltaDays <= 0 ? "text-success" : "text-destructive"}`}>
            {deltaDays <= 0 ? "" : "+"}
            {deltaDays}d vs {data.length}w ago
          </span>
        </div>
        <p className="mb-2 mt-1 text-xs text-muted-foreground">Time from first draft to scheduled publish</p>
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value) => [`${value}d`, "Avg. days"]}
              />
              <Line
                type="monotone"
                dataKey="avgDays"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
