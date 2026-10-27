"use client";

import { PageHeader } from "@/components/shared/page-header";
import { AccountBadge } from "@/components/sales/outreach-system/account-badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EMAIL_INBOX_WARMUP } from "@/lib/mock-data/outreach-system";

export default function EmailWarmupPage() {
  return (
    <>
      <PageHeader title="Warmup Health" description="Per-inbox warmup progress and daily sending capacity." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {EMAIL_INBOX_WARMUP.map((inbox) => {
          const barColor =
            inbox.warmupPct >= 90 ? "bg-destructive" : inbox.warmupPct >= 60 ? "bg-success" : "bg-warning";
          const remaining = Math.max(0, inbox.dailyCap - inbox.sentToday);
          return (
            <Card key={inbox.account.id}>
              <CardContent className="px-4 py-4">
                <AccountBadge account={inbox.account} />
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-lg border bg-muted/30 px-3 py-2.5 text-center">
                    <p className="text-lg font-semibold tracking-tight">{inbox.dailyCap}</p>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Daily cap</p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 px-3 py-2.5 text-center">
                    <p className="text-lg font-semibold tracking-tight">{inbox.sentToday}</p>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Sent today</p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 px-3 py-2.5 text-center">
                    <p className="text-lg font-semibold tracking-tight">{remaining}</p>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Remaining</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${inbox.warmupPct}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Warmup health — {inbox.warmupPct}%</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
