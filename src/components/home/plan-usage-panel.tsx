"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PlanUsage } from "@/lib/mock-data/analytics";

interface UsageRowProps {
  label: string;
  used: number;
  cap: number;
  formatValue?: (n: number) => string;
}

function UsageRow({ label, used, cap, formatValue }: UsageRowProps) {
  const pct = cap > 0 ? Math.min(100, Math.round((used / cap) * 100)) : 0;
  const format = formatValue ?? ((n: number) => n.toLocaleString());
  const isNearCap = pct >= 85;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {format(used)} <span className="text-muted-foreground">/ {format(cap)}</span>
        </span>
      </div>
      <Progress
        value={pct}
        className={isNearCap ? "[&_[data-slot=progress-indicator]]:bg-warning" : undefined}
      />
      <p className="mt-1 text-xs text-muted-foreground">{pct}% used this cycle</p>
    </div>
  );
}

export function PlanUsagePanel({ usage, planLabel }: { usage: PlanUsage; planLabel: string }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Plan usage</CardTitle>
        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent capitalize">
          {planLabel} plan
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <UsageRow label="AI actions" used={usage.aiActionsUsed} cap={usage.aiActionsCap} />
        <UsageRow label="Outbound messages" used={usage.messagesUsed} cap={usage.messagesCap} />
        <UsageRow label="Seats" used={usage.seatsUsed} cap={usage.seatsCap} />
      </CardContent>
    </Card>
  );
}
