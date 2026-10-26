"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { TrendLineChart } from "@/components/hr/trend-line-chart";
import { HorizontalBarChart } from "@/components/hr/horizontal-bar-chart";
import { FunnelChart } from "@/components/hr/funnel-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MOCK_JOBS,
  CANDIDATE_HR_FIELDS,
  MOCK_INTERVIEWS,
  timeToHireTrend,
  sourceEffectiveness,
  recruiterPerformance,
  costPerHireEstimate,
  allJobsFunnelSummary,
  avgTimeToFillDays,
  averageFitScore,
} from "@/lib/mock-data/hr";
import { formatMoney } from "@/lib/format";

export function AnalyticsClient() {
  const [now] = useState(() => Date.now());

  const trend = useMemo(() => timeToHireTrend(12, now), [now]);
  const sourceEff = useMemo(() => sourceEffectiveness(), []);
  const recruiterPerf = useMemo(() => recruiterPerformance(), []);
  const cost = useMemo(() => costPerHireEstimate(), []);
  const funnel = useMemo(() => allJobsFunnelSummary(), []);

  const totalHires = CANDIDATE_HR_FIELDS.filter((c) => c.stage === "hired").length;
  const openRoles = MOCK_JOBS.filter((j) => j.status === "open").length;
  const avgTimeToFill = avgTimeToFillDays();
  const avgFit = averageFitScore();

  return (
    <>
      <PageHeader
        title="Analytics"
        description="A full-funnel view of the Recruit app: time-to-hire, source effectiveness, recruiter performance and cost-per-hire."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total hires" value={String(totalHires)} context={`Across ${MOCK_JOBS.length} jobs tracked`} />
        <KpiCard label="Open roles" value={String(openRoles)} context="Currently sourcing" />
        <KpiCard label="Avg. time-to-fill" value={`${avgTimeToFill}d`} context="Closed roles" />
        <KpiCard label="Avg. fit score" value={String(avgFit)} context="All candidates, 0-100 scale" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrendLineChart
            data={trend.map((t) => ({ label: t.week, value: t.days }))}
            title="Time-to-hire trend, last 12 weeks"
            valueLabel="Days"
            valueSuffix="d"
          />
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-sm">Cost-per-hire estimate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total sourcing + interview cost</span>
              <span className="font-medium">{formatMoney(cost.totalCostInr * 100, "INR")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hires to date</span>
              <span className="font-medium">{cost.hires}</span>
            </div>
            <div className="flex items-baseline justify-between border-t pt-3">
              <span className="text-muted-foreground">Cost per hire</span>
              <span className="text-xl font-semibold tracking-tight">
                {formatMoney(cost.costPerHireInr * 100, "INR")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated from job-board/sourcing spend per open role and interviewer time cost per interview held.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <HorizontalBarChart
          data={sourceEff.map((s) => ({ label: s.source, value: s.avgFitScore }))}
          title="Source effectiveness: avg. fit score"
          valueLabel="Avg. fit score"
        />
        <HorizontalBarChart
          data={sourceEff.map((s) => ({ label: s.source, value: s.hires }))}
          title="Source effectiveness: hires produced"
          valueLabel="Hires"
          color="var(--success)"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FunnelChart data={funnel} title="Hiring funnel, all jobs combined" height={240} />
        <HorizontalBarChart
          data={recruiterPerf.map((r) => ({ label: r.recruiter, value: r.interviewsHeld }))}
          title="Interviewer performance: load"
          valueLabel="Interviews held"
          color="var(--accent)"
          height={240}
        />
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm">Recruiter / interviewer performance detail</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-6 py-2 font-medium">Interviewer</th>
                <th className="px-6 py-2 font-medium">Interviews held</th>
                <th className="px-6 py-2 font-medium">Hires influenced</th>
                <th className="px-6 py-2 font-medium">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {recruiterPerf.map((r) => (
                <tr key={r.recruiter} className="border-b last:border-0">
                  <td className="px-6 py-2.5 font-medium">{r.recruiter}</td>
                  <td className="px-6 py-2.5 text-muted-foreground">{r.interviewsHeld}</td>
                  <td className="px-6 py-2.5 text-muted-foreground">{r.hiresInfluenced}</td>
                  <td className="px-6 py-2.5 text-muted-foreground">
                    {r.interviewsHeld === 0
                      ? "—"
                      : `${Math.round((r.hiresInfluenced / r.interviewsHeld) * 100)}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {MOCK_INTERVIEWS.length === 0 && (
            <p className="px-6 py-4 text-sm text-muted-foreground">No interview data yet.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
