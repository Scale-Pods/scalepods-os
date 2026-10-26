"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PodSlice } from "@/lib/mock-data/analytics";

const POD_COLORS = [
  "var(--primary)",
  "var(--accent)",
  "var(--success)",
  "var(--warning)",
  "var(--destructive)",
  "var(--muted-foreground)",
];

export function AiActionsDonut({ data }: { data: PodSlice[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI actions by pod</CardTitle>
      </CardHeader>
      <CardContent className="h-72 px-2">
        <div className="relative h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius="58%"
                outerRadius="85%"
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={entry.pod} fill={POD_COLORS[i % POD_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value, name) => [
                  `${Number(value).toLocaleString()} (${total ? Math.round((Number(value) / total) * 100) : 0}%)`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xl font-semibold">{total.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">actions</p>
          </div>
        </div>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {data.map((d, i) => (
            <span key={d.pod} className="flex items-center gap-1.5">
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: POD_COLORS[i % POD_COLORS.length] }}
              />
              {d.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
