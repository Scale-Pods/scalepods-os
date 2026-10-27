"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { TrendLineChart } from "@/components/sales/charts/trend-line-chart";
import { RankingBarChart } from "@/components/sales/charts/ranking-bar-chart";
import { Card, CardContent } from "@/components/ui/card";
import {
  WHATSAPP_CHATS_BY_ACCOUNT,
  WHATSAPP_METRICS,
  whatsappResponseRateTrend,
} from "@/lib/mock-data/outreach-system";

export default function WhatsappAnalyticsPage() {
  const trend = React.useMemo(() => whatsappResponseRateTrend(14), []);

  return (
    <>
      <PageHeader title="WhatsApp Analytics" description="Response rate trend, chat volume by account, and message totals." />

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-3 text-sm font-semibold">Response rate — last 14 days</h3>
            <TrendLineChart data={trend} xKey="label" yKey="responseRatePct" valueFormatter={(v) => `${v}%`} color="var(--success)" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-3 text-sm font-semibold">Chats by account</h3>
            <RankingBarChart data={WHATSAPP_CHATS_BY_ACCOUNT} height={160} valueSuffix="" valueLabel="Chats" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold">Message volume</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-muted/30 px-4 py-3 text-center">
              <p className="text-2xl font-semibold tracking-tight">{WHATSAPP_METRICS.messagesSent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total messages</p>
            </div>
            <div className="rounded-lg border bg-muted/30 px-4 py-3 text-center">
              <p className="text-2xl font-semibold tracking-tight">{WHATSAPP_METRICS.totalChats.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Unique conversations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
