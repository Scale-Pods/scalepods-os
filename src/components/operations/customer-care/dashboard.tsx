"use client";

import * as React from "react";
import { toast } from "sonner";
import { Award, Bell, Bot, CheckCircle2, Clock, RefreshCw, Star, ThumbsDown } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CC_CHANNELS,
  CC_CARRIER_PERFORMANCE,
  CC_REVIEWS,
  CC_SHIPMENTS,
  CC_SLA_RULES,
  CC_STATS,
  ccAgo,
} from "@/lib/mock-data/customer-care";
import { useCases } from "./inbox";
import { CaseDialog } from "./case-dialog";
import { Bar, ChannelBadge, Pill, SentimentBadge, Stars } from "./shared";

export function CareDashboardPage() {
  const { cases, update } = useCases();
  const [openId, setOpenId] = React.useState<string | null>(null);
  const open = cases.find((c) => c.id === openId) ?? null;
  const openCount = cases.filter((c) => c.status === "Open").length;
  const attention = cases.filter((c) => c.status === "Open" && c.escalation !== "None").slice(0, 6);
  const exceptions = CC_SHIPMENTS.filter((s) => s.status === "Exception");

  return (
    <>
      <PageHeader
        title="Customer Care Command Centre"
        description="Full order lifecycle WhatsApp automation, live carrier tracking, AI support inbox and review interception."
        actions={
          <Button variant="outline" size="sm" onClick={() => toast.info("Syncing all open cases from WhatsApp, Shopify and Instagram DM...")}>
            <RefreshCw className="size-3.5" /> Sync inbox
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Live CSAT score" value={`${CC_STATS.csat} / 5.0`} context="Target: above 4.7" icon={<CheckCircle2 className="size-4" />} iconClassName="bg-success/15 text-success" />
        <KpiCard label="Public reviews generated" value={String(CC_STATS.totalReviews)} context="Nykaa, Google, Amazon, Myntra, Flipkart" icon={<Award className="size-4" />} iconClassName="bg-primary/15 text-primary" />
        <KpiCard label="Negative reviews blocked" value={String(CC_STATS.negativeIntercepted)} context="Kept off public feeds" icon={<ThumbsDown className="size-4" />} iconClassName="bg-destructive/15 text-destructive" />
        <KpiCard label="Open cases now" value={String(openCount)} context="Needs attention" icon={<Bell className="size-4" />} iconClassName="bg-warning/15 text-warning" />
        <KpiCard label="Avg first response" value={`${CC_STATS.avgFirstResponse} min`} context="AI automated" icon={<Clock className="size-4" />} iconClassName="bg-purple-500/15 text-purple-600 dark:text-purple-400" />
        <KpiCard label="Tickets auto-resolved" value={`${CC_STATS.autoResolvedPct}%`} context="No human needed" icon={<Bot className="size-4" />} iconClassName="bg-success/15 text-success" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm">Needs attention (escalated, open)</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {attention.map((c) => (
              <button key={c.id} onClick={() => setOpenId(c.id)} className="flex w-full items-start justify-between gap-3 rounded-lg border p-3 text-left hover:bg-muted/50">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{c.customer} <span className="text-xs font-normal text-muted-foreground">{c.caseNo}</span></p>
                  <p className="truncate text-xs text-muted-foreground">{c.msg}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5"><ChannelBadge channel={c.channel} /><Pill tone="red">{c.escalation}</Pill></div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{ccAgo(c.createdAt)}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Channel mix and status</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {CC_CHANNELS.map((ch) => {
              const rows = cases.filter((c) => c.channel === ch.id);
              const pct = (rows.length / cases.length) * 100;
              return (
                <div key={ch.id}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium">{ch.label}</span>
                    <span className="text-muted-foreground">{rows.length} cases · {rows.filter((r) => r.status === "Open").length} open</span>
                  </div>
                  <Bar pct={pct} />
                </div>
              );
            })}
            <div className="flex flex-wrap gap-2 pt-2 text-xs">
              <Pill tone="red">{cases.filter((c) => c.sentiment === "negative").length} negative</Pill>
              <Pill tone="neutral">{cases.filter((c) => c.sentiment === "neutral").length} neutral</Pill>
              <Pill tone="green">{cases.filter((c) => c.sentiment === "positive").length} positive</Pill>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">SLA snapshot</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {CC_SLA_RULES.map((r) => (
              <div key={r.id} className="flex items-center justify-between text-sm">
                <span>{r.rule}</span>
                <span className="flex items-center gap-2"><span className="font-semibold">{r.actual}</span><Pill tone={r.met ? "green" : "red"}>{r.met ? "MET" : "BREACH"}</Pill></span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Carrier exceptions and recent reviews</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {exceptions.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span>{s.carrier} <span className="text-xs text-muted-foreground">{s.trackId} · {s.location}</span></span>
                <Pill tone="red">{s.eta}</Pill>
              </div>
            ))}
            <div className="border-t pt-3 space-y-2">
              {CC_REVIEWS.slice(0, 4).map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate">{r.customer} <span className="text-xs text-muted-foreground">{r.platform}</span></span>
                  <Stars rating={r.rating} size={12} />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Best carrier: {[...CC_CARRIER_PERFORMANCE].sort((a, b) => b.onTime - a.onTime)[0].carrier} · Avg rating <Star className="inline size-3 fill-amber-400 text-amber-400" /> {CC_STATS.avgRating}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader><CardTitle className="text-sm">Latest conversations</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {cases.slice(0, 6).map((c) => (
            <button key={c.id} onClick={() => setOpenId(c.id)} className="flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left hover:bg-muted/50">
              <div className="min-w-0">
                <p className="text-sm font-medium">{c.customer}</p>
                <p className="truncate text-xs text-muted-foreground">{c.msg}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2"><SentimentBadge sentiment={c.sentiment} /><StatusBadge status={c.status.toLowerCase()} /></div>
            </button>
          ))}
        </CardContent>
      </Card>

      <CaseDialog c={open} onClose={() => setOpenId(null)} onChange={update} />
    </>
  );
}
