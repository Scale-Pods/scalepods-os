"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Users, Gauge, BadgeCheck, Scale, Sparkles, TrendingUp, Plus, CalendarDays, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import {
  MOCK_CAMPAIGNS,
  MOCK_CANDIDATES,
  MOCK_INTERVIEWS,
  dashboardStats,
  monthlyHiringTrend,
  campaignStats,
  addDays,
  fmtDate,
  fmtDateShort,
  fmtDateLong,
  HR_TODAY,
  type Candidate,
} from "@/lib/mock-data/hr";
import { BarRow, NameAvatar, ScoreNumber, StageChip } from "./shared";
import { CandidateDialog } from "./candidate-dialog";
import { getCandidateStage } from "@/lib/mock-data/hr";

const PIPE_COLORS = ["bg-primary", "bg-accent", "bg-primary", "bg-warning", "bg-success"];

export function HrDashboard() {
  const [campaignId, setCampaignId] = useState("all");
  const [openCand, setOpenCand] = useState<Candidate | null>(null);
  const [openMetric, setOpenMetric] = useState<null | "active" | "score" | "hired" | "quality">(null);
  const stats = useMemo(() => dashboardStats(campaignId), [campaignId]);
  const scoped = useMemo(
    () => (campaignId === "all" ? MOCK_CANDIDATES : MOCK_CANDIDATES.filter((c) => c.campaignId === campaignId)),
    [campaignId],
  );
  const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "open").length;

  const weekEnd = addDays(HR_TODAY, 7);
  const upcoming = MOCK_INTERVIEWS.filter(
    (i) => i.date >= HR_TODAY && i.date <= weekEnd && i.decision === "" && (campaignId === "all" || i.campaignId === campaignId),
  ).slice(0, 6);
  const trend = monthlyHiringTrend();
  const trendMax = Math.max(...trend.map((t) => t.applications));
  const topPerformers = [...scoped].sort((a, b) => b.score - a.score).slice(0, 5);
  const cityMax = Math.max(1, ...stats.cities.map((c) => c.count));
  const circumference = 2 * Math.PI * 48;

  const metricRows: Record<NonNullable<typeof openMetric>, Candidate[]> = {
    active: scoped.filter((c) => !["rejected", "hired"].includes(getCandidateStage(c))),
    score: [...scoped].sort((a, b) => b.score - a.score),
    hired: scoped.filter((c) => getCandidateStage(c) === "hired"),
    quality: scoped.filter((c) => c.resumeDecision !== ""),
  };
  const metricTitle: Record<NonNullable<typeof openMetric>, string> = {
    active: "Active candidates",
    score: "Candidates by score",
    hired: "Hired this quarter",
    quality: "Screening decisions behind the Decision Quality index",
  };

  return (
    <>
      <PageHeader
        title="Good morning, Abeer"
        description={`Hiring intelligence is live. ${stats.total} candidates flowing through the pipeline with a ${stats.avgScore} mean score.`}
        badge={
          <Badge variant="secondary" className="gap-1.5 bg-success/15 text-success hover:bg-success/15">
            <span className="size-1.5 rounded-full bg-success" /> AI analytics active · {activeCampaigns} active campaigns
          </Badge>
        }
        actions={
          <>
            <Select value={campaignId} onValueChange={setCampaignId}>
              <SelectTrigger className="h-9 w-[230px]">
                <SelectValue placeholder="All Campaigns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {MOCK_CAMPAIGNS.filter((c) => c.status !== "draft").map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button asChild size="sm">
              <Link href="/hr/recruit/campaigns/new">
                <Plus className="size-3.5" /> Create Campaign
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Active Candidates"
          value={String(stats.active)}
          trend="up"
          trendValue={`+${stats.pipelineGrowthPct}%`}
          context="Still moving through the pipeline"
          icon={<Users className="size-4" />}
          iconClassName="bg-primary/10 text-primary"
          onClick={() => setOpenMetric("active")}
        />
        <KpiCard
          label="Average Score"
          value={String(stats.avgScore)}
          trend="up"
          trendValue="+3"
          context="AI fit score, 0-100"
          icon={<Gauge className="size-4" />}
          iconClassName="bg-accent/10 text-accent"
          onClick={() => setOpenMetric("score")}
        />
        <KpiCard
          label="Hired This Quarter"
          value={String(stats.hired)}
          trend="up"
          trendValue="+2"
          context={`${stats.timeToHireDays} days avg time to hire`}
          icon={<BadgeCheck className="size-4" />}
          iconClassName="bg-success/10 text-success"
          onClick={() => setOpenMetric("hired")}
        />
        <KpiCard
          label="Decision Quality"
          value={String(stats.decisionQuality)}
          trend="flat"
          trendValue="Index"
          context="Screening calls that matched AI score"
          icon={<Scale className="size-4" />}
          iconClassName="bg-warning/10 text-warning"
          onClick={() => setOpenMetric("quality")}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pipeline flow</CardTitle>
            <CardDescription>Candidates reaching each stage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.pipeline.map((p, i) => (
              <div key={p.key}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{p.label}</span>
                  <span className="tabular-nums text-muted-foreground">{p.count}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${PIPE_COLORS[i]}`} style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion</CardTitle>
            <CardDescription>Screening to hire</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 120 120" className="size-28 shrink-0">
                <circle cx="60" cy="60" r="48" fill="none" strokeWidth="8" className="stroke-muted" />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="stroke-primary"
                  strokeDasharray={`${(stats.overallConversionPct / 100) * circumference} ${circumference}`}
                  transform="rotate(-90 60 60)"
                />
                <text x="60" y="58" textAnchor="middle" className="fill-foreground text-2xl font-bold" fontSize="24">
                  {stats.overallConversionPct}%
                </text>
                <text x="60" y="76" textAnchor="middle" className="fill-muted-foreground" fontSize="9">
                  overall
                </text>
              </svg>
              <div className="min-w-0 flex-1 space-y-2">
                {stats.conversion.map((c) => (
                  <div key={c.label} className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate text-muted-foreground">{c.label}</span>
                    <span className="font-semibold tabular-nums">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Candidates by city</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.cities.map((c) => (
              <BarRow key={c.city} label={c.city} value={c.count} max={cityMax} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent" /> AI insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Insight
              title="Conversion spike detected"
              body={`${stats.conversion[0].pct}% of screened candidates reached Round 1 - ahead of last month.`}
            />
            <Insight
              title="Top performer identified"
              body={
                topPerformers[0]
                  ? `${topPerformers[0].name} leads ${topPerformers[0].role} with a ${topPerformers[0].score} fit score.`
                  : "No candidates yet."
              }
            />
            <Insight
              title="Pipeline bottleneck"
              body={`Round 2 conversion is ${stats.conversion[1].pct}%. Consider adding interviewer capacity.`}
            />
            <Insight
              title="Referral program performing"
              body={`${stats.sources.find((s) => s.source === "Referral")?.count ?? 0} candidates came in through referrals this cycle.`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" /> Applications vs hires
            </CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-36 items-end gap-3">
              {trend.map((t) => (
                <div key={t.label} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] tabular-nums text-muted-foreground">{t.hires}</span>
                  <div
                    className="w-full rounded-t-md bg-primary/70"
                    style={{ height: `${(t.applications / trendMax) * 100}px` }}
                    title={`${t.applications} applications`}
                  />
                  <span className="text-[10px] text-muted-foreground">{t.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-4" /> Upcoming interviews
            </CardTitle>
            <CardDescription>Next 7 days from {fmtDate(HR_TODAY)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.length === 0 && <p className="text-sm text-muted-foreground">No interviews in the next 7 days.</p>}
            {upcoming.map((iv) => {
              const cand = MOCK_CANDIDATES.find((c) => c.id === iv.candidateId) ?? null;
              return (
                <button
                  key={iv.id}
                  onClick={() => setOpenCand(cand)}
                  className="flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors hover:bg-muted/50"
                >
                  <NameAvatar name={iv.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{iv.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {iv.role} · R{iv.round} {iv.roundName}
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-medium">{fmtDateShort(iv.date)}</p>
                    <p className="flex items-center justify-end gap-1 text-muted-foreground">
                      <Clock className="size-3" /> {iv.time}
                    </p>
                  </div>
                </button>
              );
            })}
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link href="/hr/recruit/interviews">Open Interview Center</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaigns</CardTitle>
            <CardDescription>Open and recent hiring campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK_CAMPAIGNS.filter((c) => c.status !== "draft").map((c) => {
              const cs = campaignStats(c.id);
              return (
                <Link
                  key={c.id}
                  href={`/hr/recruit/campaigns/${c.id}`}
                  className="flex items-center gap-3 rounded-lg border p-2.5 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.department} · {c.location} · {cs.total} candidates
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      c.status === "open"
                        ? "bg-success/15 text-success hover:bg-success/15"
                        : "bg-muted text-muted-foreground hover:bg-muted"
                    }
                  >
                    {c.status}
                  </Badge>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Dialog open={openMetric !== null} onOpenChange={(o) => !o && setOpenMetric(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {openMetric && (
            <>
              <DialogHeader>
                <DialogTitle>{metricTitle[openMetric]}</DialogTitle>
                <DialogDescription>
                  {metricRows[openMetric].length} candidates ·{" "}
                  {campaignId === "all" ? "all campaigns" : MOCK_CAMPAIGNS.find((c) => c.id === campaignId)?.title} ·{" "}
                  {fmtDateLong(HR_TODAY)}
                </DialogDescription>
              </DialogHeader>
              <div className="divide-y rounded-lg border">
                {metricRows[openMetric].length === 0 && (
                  <p className="p-6 text-center text-sm text-muted-foreground">Nothing to show for this selection.</p>
                )}
                {metricRows[openMetric].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setOpenMetric(null);
                      setOpenCand(c);
                    }}
                    className="flex w-full items-center gap-3 p-3 text-left hover:bg-muted/50"
                  >
                    <NameAvatar name={c.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.role}</p>
                    </div>
                    <StageChip stage={getCandidateStage(c)} />
                    <ScoreNumber score={c.score} />
                  </button>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <CandidateDialog candidate={openCand} onOpenChange={(o) => !o && setOpenCand(null)} />
    </>
  );
}

function Insight({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
