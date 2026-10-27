"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { TrendLineChart } from "@/components/sales/charts/trend-line-chart";
import { RankingBarChart } from "@/components/sales/charts/ranking-bar-chart";
import { Card, CardContent } from "@/components/ui/card";
import {
  VOICE_CONNECT_RATE_BY_NUMBER,
  VOICE_METRICS,
  voiceCallVolumeTrend,
} from "@/lib/mock-data/outreach-system";

export default function VoiceAnalyticsPage() {
  const trend = React.useMemo(() => voiceCallVolumeTrend(14), []);

  return (
    <>
      <PageHeader title="Voice Analytics" description="Call volume trend, connect rate by number, and cost/duration averages." />

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-3 text-sm font-semibold">Call volume — last 14 days</h3>
            <TrendLineChart data={trend} xKey="label" yKey="calls" color="var(--warning)" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-3 text-sm font-semibold">Connect rate by number</h3>
            <RankingBarChart data={VOICE_CONNECT_RATE_BY_NUMBER} height={160} valueLabel="Connect rate" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold">Averages</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-muted/30 px-4 py-3 text-center">
              <p className="text-2xl font-semibold tracking-tight">{VOICE_METRICS.avgDurationSeconds}s</p>
              <p className="text-xs text-muted-foreground">Avg. duration</p>
            </div>
            <div className="rounded-lg border bg-muted/30 px-4 py-3 text-center">
              <p className="text-2xl font-semibold tracking-tight">${VOICE_METRICS.totalCostUsd.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Total cost</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
