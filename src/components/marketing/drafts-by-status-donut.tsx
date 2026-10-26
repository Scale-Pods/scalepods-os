"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatusCount } from "@/lib/mock-data/marketing";

const STATUS_COLORS: Record<StatusCount["status"], string> = {
  draft: "var(--muted-foreground)",
  review: "var(--warning)",
  approved: "var(--success)",
  scheduled: "var(--primary)",
};

export function DraftsByStatusDonut({ data }: { data: StatusCount[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Drafts by status</CardTitle>
      </CardHeader>
      <CardContent className="h-64 px-2">
        <div className="relative h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="label"
                innerRadius="58%"
                outerRadius="85%"
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value, name) => {
                  const num = Number(value ?? 0);
                  return [
                    `${num.toLocaleString()} (${total ? Math.round((num / total) * 100) : 0}%)`,
                    String(name ?? ""),
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xl font-semibold">{total.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">drafts</p>
          </div>
        </div>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {data.map((d) => (
            <span key={d.status} className="flex items-center gap-1.5">
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[d.status] }}
              />
              {d.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
