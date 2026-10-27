"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { TrendLineChart } from "@/components/sales/charts/trend-line-chart";
import { RankingBarChart } from "@/components/sales/charts/ranking-bar-chart";
import { Card, CardContent } from "@/components/ui/card";
import {
  EMAIL_REPLY_RATE_BY_ACCOUNT,
  EMAIL_FUNNEL,
  emailOpenRateTrend,
} from "@/lib/mock-data/outreach-system";

export default function EmailAnalyticsPage() {
  const trend = React.useMemo(() => emailOpenRateTrend(14), []);

  return (
    <>
      <PageHeader title="Email Analytics" description="Open-rate trend, reply rate by inbox, and the send funnel." />

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-3 text-sm font-semibold">Open rate — last 14 days</h3>
            <TrendLineChart data={trend} xKey="label" yKey="openRatePct" valueFormatter={(v) => `${v}%`} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-3 text-sm font-semibold">Reply rate by inbox</h3>
            <RankingBarChart data={EMAIL_REPLY_RATE_BY_ACCOUNT} height={160} valueLabel="Reply rate" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold">Funnel: Sent → Opened → Replied</h3>
          <div className="grid grid-cols-3 gap-3">
            {EMAIL_FUNNEL.map((stage) => (
              <div key={stage.label} className="rounded-lg border bg-muted/30 px-4 py-3 text-center">
                <p className="text-2xl font-semibold tracking-tight">{stage.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{stage.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
