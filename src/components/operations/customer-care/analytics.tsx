"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { StatusBadge } from "@/components/shared/badges";
import { CC_CASES, CC_CHANNELS, CC_STATS, CC_TOPIC_BREAKDOWN, CC_VOLUME_14D, ccAgo, type CcCase } from "@/lib/mock-data/customer-care";
import { CaseDialog } from "./case-dialog";
import { Bar, Pill } from "./shared";

export function CareAnalyticsPage() {
  const [topic, setTopic] = React.useState<string | null>(null);
  const [caseId, setCaseId] = React.useState<string | null>(null);
  const maxVol = Math.max(...CC_VOLUME_14D.map((d) => d.total));
  const topicCases: CcCase[] = CC_CASES.filter((c) => c.topic === topic);
  const aiShare = Math.round((CC_CASES.filter((c) => c.handledBy === "AI").length / CC_CASES.length) * 100);
  const sentiments = (["positive", "neutral", "negative"] as const).map((s) => ({ s, n: CC_CASES.filter((c) => c.sentiment === s).length }));

  return (
    <>
      <PageHeader title="Analytics" description="Volume, resolution, sentiment and topic trends." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total cases" value={String(CC_STATS.totalCases)} context={`${CC_STATS.resolvedCases} resolved`} />
        <KpiCard label="AI-only handled" value={`${aiShare}%`} context="No human touch" />
        <KpiCard label="Escalated" value={String(CC_STATS.escalated)} context="Flagged for action" trendGood={false} />
        <KpiCard label="CSAT" value={`${CC_STATS.csat}`} context="Out of 5" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm">Daily volume, last 14 days (AI vs human)</CardTitle></CardHeader>
          <CardContent>
            <div className="flex h-44 items-end gap-1.5">
              {CC_VOLUME_14D.map((d) => (
                <div key={d.label} className="flex flex-1 flex-col items-center justify-end gap-1" title={`${d.label}: ${d.total} (AI ${d.ai}, human ${d.human}), CSAT ${d.csat}`}>
                  <div className="flex w-full flex-col justify-end" style={{ height: `${(d.total / maxVol) * 140}px` }}>
                    <div className="w-full bg-warning/70" style={{ height: `${(d.human / d.total) * 100}%` }} />
                    <div className="w-full rounded-t bg-primary" style={{ height: `${(d.ai / d.total) * 100}%` }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground">{d.label.slice(0, 2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-3 text-xs text-muted-foreground"><span><span className="mr-1 inline-block size-2 rounded-sm bg-primary" />AI</span><span><span className="mr-1 inline-block size-2 rounded-sm bg-warning/70" />Human</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Channel and sentiment</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {CC_CHANNELS.map((ch) => {
              const n = CC_CASES.filter((c) => c.channel === ch.id).length;
              return <div key={ch.id}><div className="mb-1 flex justify-between text-xs"><span>{ch.label}</span><span>{n}</span></div><Bar pct={(n / CC_CASES.length) * 100} /></div>;
            })}
            <div className="flex flex-wrap gap-2 border-t pt-3">
              {sentiments.map(({ s, n }) => <Pill key={s} tone={s === "positive" ? "green" : s === "negative" ? "red" : "neutral"}>{s}: {n}</Pill>)}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-sm">Top contact topics (click for cases)</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {CC_TOPIC_BREAKDOWN.map((t) => (
              <button key={t.topic} onClick={() => setTopic(t.topic)} className="block w-full rounded-lg p-2 text-left hover:bg-muted/50">
                <div className="mb-1 flex justify-between text-sm"><span>{t.topic}</span><span className="font-semibold">{t.count}</span></div>
                <Bar pct={(t.count / CC_TOPIC_BREAKDOWN[0].count) * 100} />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {topic && (
        <Dialog open onOpenChange={(o) => !o && setTopic(null)}>
          <DialogContent className={DETAIL_DIALOG_CLASS}>
            <DialogHeader>
              <DialogTitle>{topic}</DialogTitle>
              <DialogDescription>{topicCases.length} cases</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {topicCases.map((c) => (
                <button key={c.id} onClick={() => { setTopic(null); setCaseId(c.id); }} className="flex w-full items-center justify-between rounded-lg border p-3 text-left hover:bg-muted/50">
                  <div className="min-w-0"><p className="text-sm font-medium">{c.customer} <span className="text-xs text-muted-foreground">{c.caseNo}</span></p><p className="truncate text-xs text-muted-foreground">{c.msg}</p></div>
                  <div className="flex shrink-0 items-center gap-2"><StatusBadge status={c.status.toLowerCase()} /><span className="text-xs text-muted-foreground">{ccAgo(c.createdAt)}</span></div>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
      <CaseDialog c={CC_CASES.find((c) => c.id === caseId) ?? null} onClose={() => setCaseId(null)} onChange={() => {}} />
    </>
  );
}
