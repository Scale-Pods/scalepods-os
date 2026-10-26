"use client";

import { cn } from "@/lib/utils";

interface FunnelBarsProps {
  stages: { label: string; count: number }[];
}

/** Simple horizontal funnel visualization: each stage is a bar sized relative to the first stage's count. */
export function FunnelBars({ stages }: FunnelBarsProps) {
  const max = stages[0]?.count ?? 1;
  return (
    <div className="space-y-2.5">
      {stages.map((stage, i) => {
        const pct = max > 0 ? Math.round((stage.count / max) * 100) : 0;
        const prevCount = i > 0 ? stages[i - 1].count : stage.count;
        const dropPct = prevCount > 0 && i > 0 ? Math.round(((prevCount - stage.count) / prevCount) * 100) : 0;
        return (
          <div key={stage.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">{stage.label}</span>
              <span className="text-muted-foreground">
                {stage.count}
                {i > 0 && dropPct > 0 && (
                  <span className="ml-1.5 text-destructive">-{dropPct}%</span>
                )}
              </span>
            </div>
            <div className="h-6 w-full overflow-hidden rounded-md bg-muted">
              <div
                className={cn("h-full rounded-md bg-primary transition-all")}
                style={{ width: `${Math.max(pct, 3)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
