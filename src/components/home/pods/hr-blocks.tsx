"use client";

import { Briefcase, UserCheck, Gauge, Timer, Users, CalendarCheck } from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { AppBlock, BarList, Columns, KpiRow, MiniList, Panel, Pill, StackBar, TONE, num } from "./pod-ui";
import type { AppManifest } from "@/lib/types/manifest";
import {
  HR_TODAY,
  MOCK_CAMPAIGNS,
  MOCK_CANDIDATES,
  MOCK_INTERVIEWS,
  dashboardStats,
  fmtDateShort,
  monthlyHiringTrend,
} from "@/lib/mock-data/hr";

export function RecruitBlock({ app }: { app: AppManifest }) {
  const s = dashboardStats();
  const openCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "open");
  const upcoming = MOCK_INTERVIEWS.filter((i) => i.date >= HR_TODAY && i.status !== "completed")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 5);
  const trend = monthlyHiringTrend().map((p) => ({ label: p.label, a: p.hires, b: p.applications }));
  const candidatesByCampaign = openCampaigns
    .map((c) => ({ label: c.title, value: MOCK_CANDIDATES.filter((x) => x.campaignId === c.id).length }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <AppBlock app={app}>
      <KpiRow cols={6}>
        <KpiCard label="Open campaigns" value={String(openCampaigns.length)} icon={<Briefcase className="size-4" />} iconClassName={TONE.blue} context={`${MOCK_CAMPAIGNS.length} total`} />
        <KpiCard label="Candidates" value={num(s.total)} icon={<Users className="size-4" />} iconClassName={TONE.purple} context={`${s.active} in pipeline`} />
        <KpiCard label="Avg. fit score" value={String(s.avgScore)} icon={<Gauge className="size-4" />} iconClassName={TONE.orange} context="AI score, 0–100" />
        <KpiCard label="Hired" value={String(s.hired)} icon={<UserCheck className="size-4" />} iconClassName={TONE.green} context={`${s.overallConversionPct}% overall conversion`} />
        <KpiCard label="Time to hire" value={`${s.timeToHireDays}d`} icon={<Timer className="size-4" />} iconClassName={TONE.neutral} context="median" />
        <KpiCard label="Interviews ahead" value={String(upcoming.length >= 5 ? MOCK_INTERVIEWS.filter((i) => i.date >= HR_TODAY && i.status !== "completed").length : upcoming.length)} icon={<CalendarCheck className="size-4" />} iconClassName={TONE.blue} context="scheduled" />
      </KpiRow>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Hiring funnel" subtitle="Candidates reaching each stage">
          <BarList rows={s.pipeline.map((p) => ({ label: p.label, value: p.count, display: `${p.count}`, color: p.key === "hired" ? "bg-success" : "bg-primary" }))} />
        </Panel>
        <Panel title="Fit quality" subtitle="Candidates by AI fit level">
          <StackBar
            segments={s.fitMix.map((f) => ({
              label: f.level,
              value: f.count,
              color: f.level === "High" ? "bg-success" : f.level === "Medium" ? "bg-warning" : "bg-destructive",
            }))}
          />
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Stage conversion</p>
            <BarList max={100} rows={s.conversion.map((c) => ({ label: c.label, value: c.pct, display: `${c.pct}%`, color: "bg-blue-500" }))} />
          </div>
        </Panel>
        <Panel title="Hires vs applications" subtitle="Last 6 months">
          <Columns data={trend} aLabel="Hires" bLabel="Applications" aColor="bg-success" bColor="bg-primary/35" />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Upcoming interviews" subtitle="Next on the calendar">
          <MiniList
            empty="No interviews scheduled."
            rows={upcoming.map((i) => ({
              key: i.id,
              primary: i.name,
              secondary: `${i.role} · R${i.round} ${i.roundName} · ${i.interviewer}`,
              right: `${fmtDateShort(i.date)} ${i.time}`,
            }))}
          />
        </Panel>
        <Panel title="Candidates per open campaign">
          <BarList rows={candidatesByCampaign} />
          <div className="mt-4 flex flex-wrap gap-1.5">
            {MOCK_CAMPAIGNS.slice(0, 8).map((c) => (
              <Pill key={c.id} label={`${c.title} · ${c.status}`} tone={c.status === "open" ? "green" : c.status === "draft" ? "neutral" : "orange"} />
            ))}
          </div>
        </Panel>
      </div>
    </AppBlock>
  );
}
