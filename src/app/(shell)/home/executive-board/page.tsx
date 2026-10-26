"use client";

import { useMemo } from "react";
import { BarChart3, Gauge, LineChart as LineChartIcon, Table2, Trophy } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { PipelineTrendChart } from "@/components/home/pipeline-trend-chart";
import { AiCostChart } from "@/components/home/ai-cost-chart";
import { AiSpendTable } from "@/components/home/ai-spend-table";
import { FunnelChart } from "@/components/home/funnel-chart";
import { PipelineComparisonChart } from "@/components/home/pipeline-comparison-chart";
import { AiBudgetGauge } from "@/components/home/ai-budget-gauge";
import { PodPerformanceTable } from "@/components/home/pod-performance-table";
import { TopAgentsTable } from "@/components/home/top-agents-table";
import { useOrg } from "@/lib/org-context";
import {
  AI_COST_BY_APP,
  AI_SPEND_ROWS,
  EXEC_SUMMARY,
  PIPELINE_TREND,
  TOP_AGENTS_BY_COST,
} from "@/lib/mock-data/executive-metrics";
import {
  buildAiBudget,
  buildFunnel,
  buildPipelineComparison,
  buildPodPerformance,
} from "@/lib/mock-data/analytics";
import { AppIcon } from "@/lib/icon";

export default function ExecutiveBoardPage() {
  const { org } = useOrg();

  const funnel = useMemo(() => buildFunnel(org.id, org.plan), [org.id, org.plan]);
  const pipelineComparison = useMemo(
    () => buildPipelineComparison(org.id, org.plan),
    [org.id, org.plan]
  );
  const aiBudget = useMemo(() => buildAiBudget(org.id, org.plan), [org.id, org.plan]);
  const podPerformance = useMemo(
    () => buildPodPerformance(org.id, org.installedApps, org.plan),
    [org.id, org.installedApps, org.plan]
  );
  const topAgents = TOP_AGENTS_BY_COST;

  return (
    <div>
      <PageHeader
        title="Executive Board"
        badge={
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            Last 90 days
          </span>
        }
        description={`Founder view of ${org.name} — pipeline, hiring, response time, receivables and AI spend.`}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard
          label="Pipeline value"
          value={`$${(EXEC_SUMMARY.pipelineValueUsd / 1000).toFixed(0)}K`}
          context="58 open deals"
          trend="up"
          trendValue={`+${EXEC_SUMMARY.pipelineChangePct}%`}
          icon={<AppIcon name="TrendingUp" className="size-4" />}
        />
        <KpiCard
          label="Hires in progress"
          value={String(EXEC_SUMMARY.hiresInProgress)}
          context="Across 14 open roles"
          trend="up"
          trendValue={`+${EXEC_SUMMARY.hiresChange}`}
          icon={<AppIcon name="UserCheck" className="size-4" />}
        />
        <KpiCard
          label="Response time to leads"
          value={`${EXEC_SUMMARY.medianResponseTimeSec}s`}
          context="Median, last 7 days"
          trend="down"
          trendValue={`${EXEC_SUMMARY.responseTimeChangeSec}s`}
          trendGood
          icon={<AppIcon name="Zap" className="size-4" />}
        />
        <KpiCard
          label="Receivables overdue"
          value={`$${(EXEC_SUMMARY.receivablesOverdueUsd / 1000).toFixed(1)}K`}
          context="9 invoices overdue"
          trend="down"
          trendValue={`${EXEC_SUMMARY.receivablesChangePct}%`}
          trendGood
          icon={<AppIcon name="Wallet" className="size-4" />}
        />
        <KpiCard
          label="AI usage cost"
          value={`$${EXEC_SUMMARY.aiCostThisMonthUsd.toFixed(0)}`}
          context="This month, all apps"
          trend="up"
          trendValue={`+${EXEC_SUMMARY.aiCostChangePct}%`}
          trendGood={false}
          icon={<AppIcon name="Sparkles" className="size-4" />}
        />
      </div>

      <div className="mb-3 flex items-center gap-2">
        <BarChart3 className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Pipeline &amp; AI spend overview</h2>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PipelineTrendChart data={PIPELINE_TREND} />
        <AiCostChart data={AI_COST_BY_APP} />
      </div>

      <div className="mb-3 flex items-center gap-2">
        <LineChartIcon className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Conversion &amp; period comparison</h2>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <FunnelChart data={funnel} />
        </div>
        <div className="lg:col-span-1">
          <PipelineComparisonChart data={pipelineComparison} />
        </div>
        <div className="lg:col-span-1">
          <AiBudgetGauge budget={aiBudget} />
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <Gauge className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Pod performance</h2>
      </div>
      <div className="mb-8">
        <PodPerformanceTable rows={podPerformance} />
      </div>

      <div className="mb-3 flex items-center gap-2">
        <Trophy className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Top agents by cost</h2>
      </div>
      <div className="mb-8">
        <TopAgentsTable rows={topAgents} />
      </div>

      <div className="mb-3 flex items-center gap-2">
        <Table2 className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">AI spend breakdown</h2>
      </div>
      <AiSpendTable rows={AI_SPEND_ROWS} />
    </div>
  );
}
