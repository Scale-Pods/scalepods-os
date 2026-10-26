"use client";

import { BarChart3, FileClock, Percent, Clock3 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { OutputTrendStackedArea } from "@/components/marketing/output-trend-stacked-area";
import { ApprovalRateLineChart } from "@/components/marketing/approval-rate-line-chart";
import { DraftToScheduledTrend } from "@/components/marketing/draft-to-scheduled-trend";
import { ReviewerWorkloadChart } from "@/components/marketing/reviewer-workload-chart";
import { EngagementSummaryTable } from "@/components/marketing/engagement-summary-table";
import { MEMBERS } from "@/lib/mock-data/orgs";
import {
  MOCK_CONTENT_DRAFTS,
  getOutputTrendByPlatform,
  getApprovalRateOverTime,
  getAvgDraftToScheduledTrend,
  getReviewerWorkload,
  getEstimatedEngagement,
  getAverageTimeInReview,
} from "@/lib/mock-data/marketing";

export default function ContentOsAnalyticsPage() {
  const drafts = MOCK_CONTENT_DRAFTS;

  const outputTrend = getOutputTrendByPlatform(12);
  const approvalRateTrend = getApprovalRateOverTime(12);
  const draftToScheduledTrend = getAvgDraftToScheduledTrend(12);
  const reviewerWorkload = getReviewerWorkload(MEMBERS);
  const engagementRows = getEstimatedEngagement();
  const avgTimeInReview = getAverageTimeInReview();

  const totalOutput12w = outputTrend.reduce((sum, w) => sum + w.linkedin + w.instagram + w.blog, 0);
  const latestApprovalRate = approvalRateTrend[approvalRateTrend.length - 1]?.approvalRate ?? 0;
  const totalEngagementActions = engagementRows.reduce(
    (sum, r) => sum + r.likes + r.comments + r.shares,
    0
  );

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Deep-dive performance across content output, approvals, reviewer workload and engagement."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Content output, 12 weeks"
          value={String(totalOutput12w)}
          context="Pieces created across all platforms"
          trend="up"
          trendValue="+8%"
          icon={<BarChart3 className="size-4" />}
        />
        <KpiCard
          label="Current approval rate"
          value={`${latestApprovalRate}%`}
          context="Trailing week"
          trend="up"
          trendValue="+3%"
          icon={<Percent className="size-4" />}
        />
        <KpiCard
          label="Avg. time in review"
          value={avgTimeInReview.avgDaysLabel}
          context={`Based on ${avgTimeInReview.sampleSize} reviewed drafts`}
          trend="down"
          trendValue="-0.3d"
          icon={<Clock3 className="size-4" />}
        />
        <KpiCard
          label="Est. engagement actions"
          value={totalEngagementActions.toLocaleString()}
          context={`Across ${engagementRows.length} published/scheduled pieces`}
          trend="up"
          trendValue="+12%"
          icon={<FileClock className="size-4" />}
        />
      </div>

      <div className="mb-5 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OutputTrendStackedArea data={outputTrend} />
        </div>
        <DraftToScheduledTrend data={draftToScheduledTrend} />
      </div>

      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        <ApprovalRateLineChart data={approvalRateTrend} />
        <ReviewerWorkloadChart data={reviewerWorkload} />
      </div>

      <EngagementSummaryTable data={engagementRows} />

      <p className="mt-3 text-xs text-muted-foreground">
        Showing data for {drafts.length} tracked drafts across LinkedIn, Instagram and the blog.
      </p>
    </>
  );
}
