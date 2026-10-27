"use client";

import * as React from "react";
import { toast } from "sonner";
import { BellRing, BrainCircuit, Flame, Radar, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { Field, Pill, type Tone } from "@/components/marketing/shared";
import {
  ALERT_EVENTS,
  INTELLIGENCE_SECTIONS,
  TREND_SIGNALS,
  WATCH_ITEMS,
  type IntelligenceSection,
  type TrendSignal,
  type WatchItem,
} from "@/components/marketing/mock/workspace";
import { fmtDateTime, getPillar, relativeToRef } from "@/lib/mock-data/marketing";

const VELOCITY_TONE: Record<TrendSignal["velocity"], Tone> = { Spiking: "red", Rising: "orange", Steady: "neutral" };

export function TrendsView() {
  const [sel, setSel] = React.useState<TrendSignal | null>(null);
  const [source, setSource] = React.useState("all");
  const sources = ["all", ...Array.from(new Set(TREND_SIGNALS.map((t) => t.source)))];
  const shown = TREND_SIGNALS.filter((t) => source === "all" || t.source === source);

  return (
    <>
      <PageHeader
        title="Trends"
        description="Signals ranked by relevance from Reddit, Instagram, YouTube, Google Search and Google Trends. Scans every 24 hours."
        actions={<Button variant="outline" onClick={() => toast.info("Manual scan queued (simulated)")}>Run manual scan</Button>}
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <KpiCard label="Signals (latest scan)" value={String(TREND_SIGNALS.length)} context="Across 5 sources" trend="up" trendValue="+3" icon={<TrendingUp className="size-4" />} />
        <KpiCard label="Spiking" value={String(TREND_SIGNALS.filter((t) => t.velocity === "Spiking").length)} context="Above 2x baseline" trend="up" trendValue="+1" icon={<Flame className="size-4" />} />
        <KpiCard label="Avg. relevance" value={String(Math.round(TREND_SIGNALS.reduce((s, t) => s + t.relevance, 0) / TREND_SIGNALS.length))} context="To ScalePods pillars" trend="flat" trendValue="0" icon={<Radar className="size-4" />} />
      </div>
      <Tabs value={source} onValueChange={setSource} className="mb-3">
        <TabsList className="flex-wrap">
          {sources.map((s) => (
            <TabsTrigger key={s} value={s} className="capitalize">{s}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="grid gap-3 md:grid-cols-2">
        {shown.map((t) => (
          <button key={t.id} type="button" onClick={() => setSel(t)} className="text-left">
            <Card className="h-full py-4 transition-colors hover:border-ring/40">
              <CardContent className="space-y-2 px-4">
                <div className="flex items-center justify-between">
                  <Pill label={t.source} tone="blue" />
                  <div className="flex items-center gap-1.5">
                    <Pill label={t.velocity} tone={VELOCITY_TONE[t.velocity]} />
                    <Pill label={`${t.relevance} relevance`} tone="green" />
                  </div>
                </div>
                <p className="text-sm font-semibold leading-snug">{t.title}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">{t.summary}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {sel && (
            <>
              <DialogHeader>
                <div className="flex gap-2">
                  <Pill label={sel.source} tone="blue" />
                  <Pill label={sel.velocity} tone={VELOCITY_TONE[sel.velocity]} />
                </div>
                <DialogTitle className="mt-1 text-lg">{sel.title}</DialogTitle>
                <DialogDescription>{sel.summary}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="signal">
                <TabsList>
                  <TabsTrigger value="signal">Signal</TabsTrigger>
                  <TabsTrigger value="angle">Content angle</TabsTrigger>
                </TabsList>
                <TabsContent value="signal" className="pt-2">
                  <div className="divide-y rounded-lg border px-3 text-sm">
                    <Field label="Relevance">{sel.relevance} / 100</Field>
                    <Field label="Engagement">{sel.engagement}</Field>
                    <Field label="Detected">{relativeToRef(sel.detectedAt)}</Field>
                    <Field label="Pillar">{getPillar(sel.pillarId)?.label}</Field>
                  </div>
                </TabsContent>
                <TabsContent value="angle" className="pt-2 text-sm">
                  <p className="rounded-lg border bg-muted/30 p-3">{sel.suggestedAngle}</p>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button onClick={() => { toast.success("Sent to AI Studio as a post idea"); setSel(null); }}>Build a post from this trend</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

const WATCH_TONE: Record<WatchItem["status"], Tone> = { Active: "green", Paused: "neutral", "Last check failed": "red" };

export function TrendAlertsView() {
  const [sel, setSel] = React.useState<WatchItem | null>(null);
  return (
    <>
      <PageHeader title="Trend Alerts" description="Watch any topic, brand or competitor across news, Reddit, the web and YouTube. AI keeps only what matters and groups duplicate coverage." />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <KpiCard label="Watch items" value={String(WATCH_ITEMS.length)} context={`${WATCH_ITEMS.filter((w) => w.status === "Active").length} active`} trend="flat" trendValue="0" icon={<BellRing className="size-4" />} />
        <KpiCard label="Spikes" value={String(WATCH_ITEMS.filter((w) => w.spike).length)} context="Unusual volume today" trend="up" trendValue="+1" icon={<Flame className="size-4" />} />
        <KpiCard label="Matches (7d)" value={String(WATCH_ITEMS.reduce((s, w) => s + w.matches7d, 0))} context="After AI filtering" trend="up" trendValue="+11" icon={<Radar className="size-4" />} />
      </div>
      <Tabs defaultValue="watch">
        <TabsList>
          <TabsTrigger value="watch">Watch items</TabsTrigger>
          <TabsTrigger value="events">Recent alerts ({ALERT_EVENTS.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="watch" className="grid gap-3 pt-2 md:grid-cols-2">
          {WATCH_ITEMS.map((w) => (
            <button key={w.id} type="button" onClick={() => setSel(w)} className="text-left">
              <Card className="h-full py-4 transition-colors hover:border-ring/40">
                <CardContent className="space-y-2 px-4 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{w.name}</p>
                    <Pill label={w.status} tone={WATCH_TONE[w.status]} />
                  </div>
                  <p className="text-xs text-muted-foreground">{w.keywords.join(", ")}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{w.matches7d} matches this week</span>
                    {w.spike && <Pill label="Spike" tone="red" />}
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </TabsContent>
        <TabsContent value="events" className="pt-2">
          <Card className="py-0">
            <CardContent className="divide-y px-4">
              {ALERT_EVENTS.map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <p className="font-medium">{e.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {WATCH_ITEMS.find((w) => w.id === e.watchId)?.name} · {e.source} · {relativeToRef(e.at)}
                    </p>
                  </div>
                  <Pill label={e.importance} tone={e.importance === "High" ? "red" : e.importance === "Medium" ? "orange" : "neutral"} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {sel && (
            <>
              <DialogHeader>
                <Pill label={sel.status} tone={WATCH_TONE[sel.status]} className="w-fit" />
                <DialogTitle className="mt-1 text-lg">{sel.name}</DialogTitle>
                <DialogDescription>Watch configuration and recent activity</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="config">
                <TabsList>
                  <TabsTrigger value="config">Configuration</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                </TabsList>
                <TabsContent value="config" className="space-y-3 pt-2">
                  <div className="divide-y rounded-lg border px-3 text-sm">
                    <Field label="Keywords">{sel.keywords.join(", ")}</Field>
                    <Field label="Sources">{sel.sources.join(", ")}</Field>
                    <Field label="Alert rule">{sel.alertRule}</Field>
                    <Field label="Last check">{fmtDateTime(sel.lastCheck)}</Field>
                    <Field label="Matches (7d)">{sel.matches7d}</Field>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Monthly budget used: {sel.budgetUsed}%</p>
                    <Progress value={sel.budgetUsed} />
                  </div>
                </TabsContent>
                <TabsContent value="alerts" className="pt-2">
                  <ul className="divide-y text-sm">
                    {ALERT_EVENTS.filter((e) => e.watchId === sel.id).map((e) => (
                      <li key={e.id} className="py-2">
                        {e.title} <span className="text-xs text-muted-foreground">({relativeToRef(e.at)})</span>
                      </li>
                    ))}
                    {ALERT_EVENTS.filter((e) => e.watchId === sel.id).length === 0 && <li className="py-2 text-muted-foreground">No alerts yet for this watch item.</li>}
                  </ul>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button variant="outline" onClick={() => toast.info(sel.status === "Paused" ? "Watch resumed (simulated)" : "Watch paused (simulated)")}>
                  {sel.status === "Paused" ? "Resume" : "Pause"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

const SECTION_TONE: Record<IntelligenceSection["status"], Tone> = { Completed: "green", Processing: "blue", Pending: "neutral", Failed: "red" };

export function IntelligenceView() {
  const [sel, setSel] = React.useState<IntelligenceSection | null>(null);
  const done = INTELLIGENCE_SECTIONS.filter((s) => s.status === "Completed");
  const avg = Math.round(done.reduce((s, x) => s + x.score, 0) / done.length);
  return (
    <>
      <PageHeader title="Intelligence" description="Seven sub-analyses (website, Instagram, Facebook, LinkedIn, competitors, SEO, audience) compiled into one report." actions={<Button variant="outline" onClick={() => toast.info("Report refresh queued (simulated)")}>Refresh report</Button>} />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <KpiCard label="Overall score" value={String(avg)} context={`${done.length} of ${INTELLIGENCE_SECTIONS.length} sections done`} trend="up" trendValue="+4" icon={<BrainCircuit className="size-4" />} />
        <KpiCard label="Processing" value={String(INTELLIGENCE_SECTIONS.filter((s) => s.status === "Processing").length)} context="Running now" trend="flat" trendValue="0" icon={<Radar className="size-4" />} />
        <KpiCard label="Pending" value={String(INTELLIGENCE_SECTIONS.filter((s) => s.status === "Pending").length)} context="Queued" trend="flat" trendValue="0" icon={<TrendingUp className="size-4" />} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {INTELLIGENCE_SECTIONS.map((s) => (
          <button key={s.id} type="button" onClick={() => setSel(s)} className="text-left">
            <Card className="h-full py-4 transition-colors hover:border-ring/40">
              <CardContent className="space-y-2 px-4 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{s.name}</p>
                  <Pill label={s.status} tone={SECTION_TONE[s.status]} />
                </div>
                <p className="text-xs text-muted-foreground">{s.summary}</p>
                {s.status === "Completed" && <Progress value={s.score} />}
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {sel && (
            <>
              <DialogHeader>
                <Pill label={sel.status} tone={SECTION_TONE[sel.status]} className="w-fit" />
                <DialogTitle className="mt-1 text-lg">{sel.name} analysis</DialogTitle>
                <DialogDescription>{sel.summary}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="findings">
                <TabsList>
                  <TabsTrigger value="findings">Findings</TabsTrigger>
                  <TabsTrigger value="score">Score</TabsTrigger>
                </TabsList>
                <TabsContent value="findings" className="pt-2">
                  {sel.findings.length > 0 ? (
                    <ul className="list-disc space-y-1.5 pl-5 text-sm">
                      {sel.findings.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Findings appear when this analysis completes.</p>
                  )}
                </TabsContent>
                <TabsContent value="score" className="pt-2">
                  {sel.status === "Completed" ? (
                    <div className="space-y-2">
                      <p className="text-3xl font-semibold">{sel.score}<span className="text-base text-muted-foreground"> / 100</span></p>
                      <Progress value={sel.score} />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No score yet.</p>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
