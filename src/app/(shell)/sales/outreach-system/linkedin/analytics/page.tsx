"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { TrendLineChart } from "@/components/sales/charts/trend-line-chart";
import { RankingBarChart } from "@/components/sales/charts/ranking-bar-chart";
import { Card, CardContent } from "@/components/ui/card";
import {
  LINKEDIN_LEADS_BY_SENDER,
  LINKEDIN_METRICS,
  linkedinConnectionRateTrend,
} from "@/lib/mock-data/outreach-system";

export default function LinkedinAnalyticsPage() {
  const trend = React.useMemo(() => linkedinConnectionRateTrend(14), []);

  return (
    <>
      <PageHeader title="LinkedIn Analytics" description="Connection-rate trend, invites by sender, and conversation volume." />

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-3 text-sm font-semibold">Connection rate — last 14 days</h3>
            <TrendLineChart data={trend} xKey="label" yKey="connectionRatePct" valueFormatter={(v) => `${v}%`} color="var(--accent)" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-3 text-sm font-semibold">Invites sent by sender</h3>
            <RankingBarChart data={LINKEDIN_LEADS_BY_SENDER} height={160} valueSuffix="" valueLabel="Invites" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold">Conversation volume</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-muted/30 px-4 py-3 text-center">
              <p className="text-2xl font-semibold tracking-tight">{LINKEDIN_METRICS.conversations.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Conversations</p>
            </div>
            <div className="rounded-lg border bg-muted/30 px-4 py-3 text-center">
              <p className="text-2xl font-semibold tracking-tight">{LINKEDIN_METRICS.connected.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Connected leads</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
