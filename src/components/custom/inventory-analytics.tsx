"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_FASTEST_DEPLETING_SKUS, MOCK_STOCK_DISTRIBUTION } from "@/lib/mock-data/custom";

const STATUS_COLORS: Record<string, string> = {
  "in-stock": "var(--success)",
  "low-stock": "var(--warning)",
  "out-of-stock": "var(--destructive)",
};

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export function InventoryAnalytics() {
  const maxVelocity = Math.max(1, ...MOCK_FASTEST_DEPLETING_SKUS.map((s) => s.dailyVelocity));

  return (
    <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Stock level distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-48 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOCK_STOCK_DISTRIBUTION}
                dataKey="count"
                nameKey="label"
                innerRadius={40}
                outerRadius={64}
                paddingAngle={2}
                strokeWidth={0}
              >
                {MOCK_STOCK_DISTRIBUTION.map((d) => (
                  <Cell key={d.status} fill={STATUS_COLORS[d.status]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value, _name, item) => [value, item.payload.label]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 flex flex-wrap justify-center gap-3">
            {MOCK_STOCK_DISTRIBUTION.map((d) => (
              <span key={d.status} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="size-2 rounded-full" style={{ background: STATUS_COLORS[d.status] }} />
                {d.label} ({d.count})
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Fastest depleting SKUs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5 px-4">
          {MOCK_FASTEST_DEPLETING_SKUS.map((sku) => (
            <div key={sku.sku} className="flex items-center gap-3">
              <div className="w-28 shrink-0">
                <p className="truncate text-xs font-medium">{sku.sku}</p>
                <p className="truncate text-[10px] text-muted-foreground">{sku.productName}</p>
              </div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-destructive"
                  style={{ width: `${Math.round((sku.dailyVelocity / maxVelocity) * 100)}%` }}
                />
              </div>
              <div className="flex w-20 shrink-0 items-center justify-end gap-1 text-right text-[11px] text-muted-foreground">
                <TrendingDown className="size-3" />
                {sku.daysOfCoverLeft}d left
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
