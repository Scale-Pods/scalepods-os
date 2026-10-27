"use client";

import * as React from "react";
import { Eye, Heart, MousePointerClick, Radio } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { DemoAdapterBadge } from "@/components/shared/badges";
import { useOrg } from "@/lib/org-context";
import { OutputTrendStackedArea } from "@/components/marketing/platform-charts";
import { PillarPerformanceChart } from "@/components/marketing/pillar-performance-chart";
import { ApprovalRateLineChart } from "@/components/marketing/approval-rate-line-chart";
import { DraftToScheduledTrend } from "@/components/marketing/draft-to-scheduled-trend";
import { ReviewerWorkloadChart } from "@/components/marketing/reviewer-workload-chart";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import { BarRow, ContentStatusPill, Field, FormatBadge, Pill } from "@/components/marketing/shared";
import { DraftDetailDialog } from "@/components/marketing/draft-detail-dialog";
import {
  VIDEO_ASSETS,
  PLATFORMS,
  PLATFORM_LABEL,
  compact,
  getApprovalRateOverTime,
  getAvgDraftToScheduledTrend,
  getEngagementRows,
  getOutputTrendByPlatform,
  getPillarPerformance,
  getReviewerWorkload,
  getTotals,
  MOCK_CONTENT_DRAFTS,
  relativeToRef,
  agoIso,
} from "@/lib/mock-data/marketing";

const COMMENTS = [
  { id: "ic-1", user: "priya.ops", post: "draft-2", text: "SCALEPODS - we do 400 invoices a week by hand, this is us", keyword: true, at: agoIso(0, 4), status: "DM sent" },
  { id: "ic-2", user: "m.hartley_hr", post: "draft-4", text: "SCALEPODS. Screening is our biggest bottleneck", keyword: true, at: agoIso(0, 9), status: "Qualified" },
  { id: "ic-3", user: "sales.with.dan", post: "draft-v2", text: "Does it work with HubSpot?", keyword: false, at: agoIso(1, 3), status: "Needs reply" },
  { id: "ic-4", user: "nadia_founder", post: "draft-5", text: "SCALEPODS please", keyword: true, at: agoIso(1, 7), status: "DM sent" },
  { id: "ic-5", user: "leo.rev", post: "draft-2", text: "How is audit data stored? GDPR?", keyword: false, at: agoIso(2, 2), status: "Needs reply" },
  { id: "ic-6", user: "tomas_cto", post: "draft-5", text: "SCALEPODS, we are on SAP", keyword: true, at: agoIso(3), status: "Booked call" },
];

const INSIGHTS = [
  { title: "Best time to post", body: "LinkedIn: Tue-Thu 08:00-10:00 UTC. Instagram: 12:00-13:00 UTC. Scheduling uses these automatically.", tag: "Scheduling" },
  { title: "Winning hook pattern", body: "Hooks that lead with one verified number (35,000 leads, 14 days to 5) earn 1.7x the impressions of question hooks.", tag: "Copy" },
  { title: "Format winner", body: "Carousels earn 2.4x the saves of single images on Instagram. Next test: UGC reels vs. carousels on the same topic.", tag: "Format" },
  { title: "CTA winner", body: "Comment SCALEPODS converts at 4.2% on Instagram; Book an Automation Audit converts best on LinkedIn.", tag: "CTA" },
  { title: "Pillar gap", body: "HR Pod content is 14% of output but 22% of qualified comments. Increase HR cadence by one post per week.", tag: "Strategy" },
];

export function AnalyticsView() {
  const { org } = useOrg();
  const totals = getTotals();
  const rows = getEngagementRows();
  const [draftId, setDraftId] = React.useState<string | null>(null);
  const [commentId, setCommentId] = React.useState<string | null>(null);
  const comment = COMMENTS.find((c) => c.id === commentId) ?? null;
  const liveVideos = VIDEO_ASSETS.filter((v) => v.performance.views > 0);
  const maxPlat = Math.max(...PLATFORMS.map((p) => rows.filter((r) => r.platform === p).reduce((s, r) => s + r.impressions, 0)));

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Reach, engagement, pillar performance and the learning engine that feeds back into scheduling and copy."
        badge={<DemoAdapterBadge />}
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Impressions" value={compact(totals.impressions)} context={`${totals.posts} live posts`} trend="up" trendValue="+18%" icon={<Eye className="size-4" />} />
        <KpiCard label="Reach" value={compact(totals.reach)} context="Unique accounts" trend="up" trendValue="+12%" icon={<Radio className="size-4" />} />
        <KpiCard label="Engagements" value={compact(totals.engagements)} context="Likes, comments, shares, saves" trend="up" trendValue="+9%" icon={<Heart className="size-4" />} />
        <KpiCard label="Link clicks" value={compact(totals.clicks)} context={`${((totals.clicks / totals.impressions) * 100).toFixed(1)}% CTR`} trend="up" trendValue="+0.3pt" icon={<MousePointerClick className="size-4" />} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="video">UGC & video</TabsTrigger>
          <TabsTrigger value="comments">Instagram comments</TabsTrigger>
          <TabsTrigger value="learning">Learning engine</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-5 pt-2">
          <OutputTrendStackedArea data={getOutputTrendByPlatform(12)} />
          <div className="grid gap-5 lg:grid-cols-2">
            <PillarPerformanceChart data={getPillarPerformance()} />
            <Card>
              <CardContent className="space-y-3 py-4">
                <h3 className="text-sm font-semibold">Impressions by platform</h3>
                {PLATFORMS.map((p) => {
                  const v = rows.filter((r) => r.platform === p).reduce((s, r) => s + r.impressions, 0);
                  return <BarRow key={p} label={PLATFORM_LABEL[p]} value={v} max={maxPlat} display={compact(v)} />;
                })}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <ApprovalRateLineChart data={getApprovalRateOverTime(12)} />
            <DraftToScheduledTrend data={getAvgDraftToScheduledTrend(12)} />
            <ReviewerWorkloadChart data={getReviewerWorkload(org.id)} />
          </div>
        </TabsContent>

        <TabsContent value="posts" className="pt-2">
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Impr.</TableHead>
                  <TableHead className="text-right">Likes</TableHead>
                  <TableHead className="text-right">Comments</TableHead>
                  <TableHead className="text-right">Shares</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.draftId} className="cursor-pointer" onClick={() => setDraftId(r.draftId)}>
                    <TableCell className="max-w-64 truncate font-medium">{r.title}</TableCell>
                    <TableCell><PlatformBadge platform={r.platform} /></TableCell>
                    <TableCell><FormatBadge format={r.format} /></TableCell>
                    <TableCell><ContentStatusPill status={r.status} /></TableCell>
                    <TableCell className="text-right">{compact(r.impressions)}</TableCell>
                    <TableCell className="text-right">{r.likes}</TableCell>
                    <TableCell className="text-right">{r.comments}</TableCell>
                    <TableCell className="text-right">{r.shares}</TableCell>
                    <TableCell className="text-right">{r.clicks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <p className="mt-2 text-xs text-muted-foreground">Likes and shares only expose aggregate counts on each platform; comments are the one place real usernames are available.</p>
        </TabsContent>

        <TabsContent value="video" className="pt-2">
          <div className="grid gap-3 md:grid-cols-2">
            {VIDEO_ASSETS.map((v) => (
              <button key={v.id} type="button" onClick={() => setDraftId(v.draftId)} className="text-left">
                <Card className="py-3 transition-colors hover:border-ring/40">
                  <CardContent className="flex items-center gap-3 px-4">
                    <video src={v.src} preload="metadata" playsInline muted className="h-20 w-14 shrink-0 rounded bg-black object-cover" />
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="truncate font-semibold">{v.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {v.performance.views > 0
                          ? `${compact(v.performance.views)} views · ${v.performance.completionPct}% completion · ${v.performance.ctr}% CTR`
                          : "Not live yet, no performance data"}
                      </p>
                    </div>
                    <Pill label={v.performance.views > 0 ? "Live" : "Pre-launch"} tone={v.performance.views > 0 ? "green" : "neutral"} />
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{liveVideos.length} of {VIDEO_ASSETS.length} clips are live. Click a clip to open its draft.</p>
        </TabsContent>

        <TabsContent value="comments" className="pt-2">
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMMENTS.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => setCommentId(c.id)}>
                    <TableCell className="font-medium">@{c.user}</TableCell>
                    <TableCell className="max-w-80 truncate">{c.text}</TableCell>
                    <TableCell><Pill label={c.keyword ? "SCALEPODS" : "No keyword"} tone={c.keyword ? "green" : "neutral"} /></TableCell>
                    <TableCell><Pill label={c.status} tone={c.status === "Needs reply" ? "orange" : "blue"} /></TableCell>
                    <TableCell className="text-muted-foreground">{relativeToRef(c.at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="grid gap-3 pt-2 md:grid-cols-2">
          {INSIGHTS.map((i) => (
            <Card key={i.title} className="py-3">
              <CardContent className="space-y-1 px-4 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{i.title}</p>
                  <Pill label={i.tag} tone="blue" />
                </div>
                <p className="text-muted-foreground">{i.body}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={!!comment} onOpenChange={(o) => !o && setCommentId(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {comment && (
            <>
              <DialogHeader>
                <DialogTitle>@{comment.user}</DialogTitle>
                <DialogDescription>Instagram comment captured as a lead signal</DialogDescription>
              </DialogHeader>
              <div className="rounded-lg border bg-muted/30 p-4 text-sm">{comment.text}</div>
              <div className="divide-y rounded-lg border px-3 text-sm">
                <Field label="Post">{MOCK_CONTENT_DRAFTS.find((d) => d.id === comment.post)?.title}</Field>
                <Field label="Keyword trigger">{comment.keyword ? "SCALEPODS (DM flow fired)" : "None, needs a human reply"}</Field>
                <Field label="Status">{comment.status}</Field>
                <Field label="Captured">{relativeToRef(comment.at)}</Field>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <DraftDetailDialog draftId={draftId} open={draftId !== null} onOpenChange={(o) => !o && setDraftId(null)} initialTab="performance" />
    </>
  );
}
