"use client";

import * as React from "react";
import { TrendingUp, Target, DollarSign, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { FunnelBars } from "@/components/sales/charts/funnel-bars";
import { AreaTrendChart } from "@/components/sales/charts/area-trend-chart";
import { TrendLineChart } from "@/components/sales/charts/trend-line-chart";
import { DonutBreakdownChart } from "@/components/sales/charts/donut-breakdown-chart";
import { RankingBarChart } from "@/components/sales/charts/ranking-bar-chart";
import { useOrg } from "@/lib/org-context";
import { contactsByOrg } from "@/lib/mock-data/contacts";
import {
  dealsByOrg,
  leadToDealFunnel,
  newLeadsWeeklyTrend,
  pipelineValueWeeklyTrend,
  lossReasonBreakdown,
  revenueBySourceAttribution,
} from "@/lib/mock-data/sales";
import { formatMoney } from "@/lib/format";

export default function CrmAnalyticsPage() {
  const { org } = useOrg();
  const [now] = React.useState(() => Date.now());

  const deals = React.useMemo(() => dealsByOrg(org.id), [org.id]);
  const contacts = React.useMemo(() => contactsByOrg(org.id), [org.id]);

  const funnel = React.useMemo(() => leadToDealFunnel(deals), [deals]);
  const leadsTrend = React.useMemo(() => newLeadsWeeklyTrend(now), [now]);
  const pipelineTrend = React.useMemo(
    () =>
      pipelineValueWeeklyTrend(now).map((p) => ({
        weekLabel: p.weekLabel,
        pipelineValue: Math.round(p.pipelineValueMinor / 100),
      })),
    [now]
  );
  const lossReasons = React.useMemo(() => lossReasonBreakdown(deals), [deals]);
  const revenueBySource = React.useMemo(
    () => revenueBySourceAttribution(deals, contacts),
    [deals, contacts]
  );

  const wonDeals = deals.filter((d) => d.stage === "won");
  const lostDeals = deals.filter((d) => d.stage === "lost");
  const winRate = wonDeals.length + lostDeals.length
    ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100)
    : 0;
  const totalWonValue = wonDeals.reduce((sum, d) => sum + d.valueMinor, 0);
  const openPipelineValue = deals
    .filter((d) => d.stage !== "won" && d.stage !== "lost")
    .reduce((sum, d) => sum + d.valueMinor, 0);

  const revenueBySourceChart = revenueBySource.map((s) => ({ label: s.label, value: s.value }));

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Full-funnel sales performance across leads, pipeline and revenue."
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Closed-won value"
          value={formatMoney(totalWonValue, "INR")}
          context={`${wonDeals.length} won deals`}
          trend="up"
          trendValue="+9.2%"
          icon={<DollarSign className="size-4" />}
        />
        <KpiCard
          label="Open pipeline"
          value={formatMoney(openPipelineValue, "INR")}
          context="Across new → negotiation"
          icon={<TrendingUp className="size-4" />}
        />
        <KpiCard
          label="Win rate"
          value={`${winRate}%`}
          context={`${wonDeals.length} won of ${wonDeals.length + lostDeals.length} closed`}
          icon={<Target className="size-4" />}
        />
        <KpiCard
          label="Total contacts"
          value={String(contacts.length)}
          context="Leads + customers in CRM"
          icon={<Users className="size-4" />}
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-1 text-sm font-semibold">Lead-to-deal conversion funnel</h3>
            <p className="mb-3 text-xs text-muted-foreground">
              Deals that reached each pipeline stage, New through Won.
            </p>
            <FunnelBars stages={funnel.map((f) => ({ label: f.label, count: f.count }))} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-1 text-sm font-semibold">New leads — last 12 weeks</h3>
            <p className="mb-3 text-xs text-muted-foreground">Weekly new-lead volume trend.</p>
            <AreaTrendChart data={leadsTrend} xKey="weekLabel" yKey="newLeads" />
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-1 text-sm font-semibold">Pipeline value trend</h3>
            <p className="mb-3 text-xs text-muted-foreground">Open pipeline value over the last 12 weeks.</p>
            <TrendLineChart
              data={pipelineTrend}
              xKey="weekLabel"
              yKey="pipelineValue"
              valueFormatter={(v) => formatMoney(v * 100, "INR")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-1 text-sm font-semibold">Win/loss breakdown by reason</h3>
            <p className="mb-3 text-xs text-muted-foreground">Why lost deals were lost.</p>
            {lossReasons.length === 0 ? (
              <p className="text-sm text-muted-foreground">No lost deals recorded.</p>
            ) : (
              <DonutBreakdownChart data={lossReasons} height={180} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="px-4 py-4">
          <h3 className="mb-1 text-sm font-semibold">Revenue by lead source</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Closed-won value attributed to each lead source.
          </p>
          {revenueBySourceChart.length === 0 ? (
            <p className="text-sm text-muted-foreground">No closed-won deals yet.</p>
          ) : (
            <RankingBarChart
              data={revenueBySourceChart}
              height={Math.max(160, revenueBySourceChart.length * 40)}
              valueLabel="Closed-won value"
              valueFormatter={(v) => formatMoney(v * 100, "INR")}
              highlightTopN={1}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
