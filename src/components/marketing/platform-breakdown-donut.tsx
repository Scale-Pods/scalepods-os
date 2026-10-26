"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlatformCount } from "@/lib/mock-data/marketing";

const PLATFORM_COLORS: Record<PlatformCount["platform"], string> = {
  linkedin: "var(--primary)",
  instagram: "var(--accent)",
  blog: "var(--warning)",
};

export function PlatformBreakdownDonut({ data }: { data: PlatformCount[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Platform breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-48 px-2">
        <div className="relative h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="label"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.platform} fill={PLATFORM_COLORS[entry.platform]} />
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
            <p className="text-lg font-semibold">{total.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
          {data.map((d) => (
            <span key={d.platform} className="flex items-center gap-1.5">
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: PLATFORM_COLORS[d.platform] }}
              />
              {d.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
