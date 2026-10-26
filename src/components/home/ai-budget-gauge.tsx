"use client";

import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AiBudget } from "@/lib/mock-data/analytics";

export function AiBudgetGauge({ budget }: { budget: AiBudget }) {
  const isHigh = budget.pct >= 85;
  const data = [{ name: "usage", value: budget.pct, fill: isHigh ? "var(--warning)" : "var(--primary)" }];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI budget utilization</CardTitle>
      </CardHeader>
      <CardContent className="h-64 px-2">
        <div className="relative h-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={data}
              startAngle={90}
              endAngle={-270}
              innerRadius="70%"
              outerRadius="100%"
              barSize={16}
            >
              <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "var(--muted)" }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-semibold">{budget.pct}%</p>
            <p className="text-xs text-muted-foreground">
              ${budget.usedUsd.toLocaleString()} / ${budget.capUsd.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
