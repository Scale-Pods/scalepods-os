"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FunnelStage } from "@/lib/mock-data/analytics";

const STAGE_COLORS = ["bg-primary", "bg-accent", "bg-warning", "bg-success"];

export function FunnelChart({ data }: { data: FunnelStage[] }) {
  const max = data[0]?.value || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline funnel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-5">
        {data.map((stage, i) => {
          const pct = Math.max(8, Math.round((stage.value / max) * 100));
          const prevValue = i > 0 ? data[i - 1].value : stage.value;
          const conversion = i > 0 && prevValue > 0 ? Math.round((stage.value / prevValue) * 100) : 100;
          return (
            <div key={stage.stage}>
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <span className="font-medium">{stage.stage}</span>
                <span className="text-muted-foreground">
                  {stage.value.toLocaleString()}
                  {i > 0 && <span className="ml-1.5 text-xs">({conversion}% of prev.)</span>}
                </span>
              </div>
              <div className="h-6 w-full rounded-md bg-muted">
                <div
                  className={`h-6 rounded-md ${STAGE_COLORS[i % STAGE_COLORS.length]} transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
