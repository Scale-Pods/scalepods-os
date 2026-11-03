"use client";

import { FileText, FileClock, CalendarClock, Send, Eye } from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { AppBlock, BarList, Columns, KpiRow, MiniList, Panel, Pill, StackBar, TONE, num } from "./pod-ui";
import type { AppManifest } from "@/lib/types/manifest";
import {
  MOCK_CONTENT_DRAFTS,
  PLATFORM_LABEL,
  VIDEO_ASSETS,
  compact,
  getContentVelocityWeeks,
  getDraftsByStatus,
  getPlatformBreakdown,
} from "@/lib/mock-data/marketing";

const STATUS_COLOR: Record<string, string> = {
  draft: "bg-muted-foreground/40",
  review: "bg-warning",
  sent_back: "bg-destructive",
  approved: "bg-blue-500",
  scheduled: "bg-purple-500",
  published: "bg-success",
};

export function ContentOsBlock({ app }: { app: AppManifest }) {
  const byStatus = getDraftsByStatus();
  const count = (k: string) => byStatus.find((s) => s.status === k)?.count ?? 0;
  const published = MOCK_CONTENT_DRAFTS.filter((d) => d.status === "published");
  const impressions = published.reduce((s, d) => s + (d.metrics?.impressions ?? 0), 0);
  const awaiting = MOCK_CONTENT_DRAFTS.filter((d) => d.status === "review").slice(0, 5);
  const velocity = getContentVelocityWeeks(8).map((w) => ({ label: w.week, a: w.published, b: w.created }));
  const topVideos = [...VIDEO_ASSETS].sort((a, b) => b.performance.views - a.performance.views).slice(0, 5);

  return (
    <AppBlock app={app}>
      <KpiRow cols={5}>
        <KpiCard label="Total drafts" value={String(MOCK_CONTENT_DRAFTS.length)} icon={<FileText className="size-4" />} iconClassName={TONE.blue} context={`${VIDEO_ASSETS.length} are videos`} />
        <KpiCard label="Awaiting review" value={String(count("review"))} icon={<FileClock className="size-4" />} iconClassName={TONE.orange} context={`${count("sent_back")} sent back`} />
        <KpiCard label="Scheduled" value={String(count("scheduled"))} icon={<CalendarClock className="size-4" />} iconClassName={TONE.purple} context={`${count("approved")} approved, unscheduled`} />
        <KpiCard label="Published" value={String(count("published"))} icon={<Send className="size-4" />} iconClassName={TONE.green} context="live content" />
        <KpiCard label="Impressions" value={compact(impressions)} icon={<Eye className="size-4" />} iconClassName={TONE.neutral} context="published content" />
      </KpiRow>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Approval pipeline" subtitle="Drafts by status">
          <StackBar segments={byStatus.map((s) => ({ label: s.label, value: s.count, color: STATUS_COLOR[s.status] ?? "bg-primary" }))} />
        </Panel>
        <Panel title="Output by platform">
          <BarList rows={getPlatformBreakdown().filter((p) => p.count > 0).map((p) => ({ label: p.label, value: p.count }))} />
        </Panel>
        <Panel title="Content velocity" subtitle="Published vs created, 8 weeks">
          <Columns data={velocity} aLabel="Published" bLabel="Created" aColor="bg-success" bColor="bg-primary/35" />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Waiting on a reviewer" subtitle="Needs approval before it can be scheduled">
          <MiniList
            empty="Nothing waiting."
            rows={awaiting.map((d) => ({
              key: d.id,
              primary: d.title,
              secondary: `${PLATFORM_LABEL[d.platform]} · ${d.format}`,
              right: <Pill label="In review" tone="orange" />,
            }))}
          />
        </Panel>
        <Panel title="UGC & video library" subtitle="Top videos by views">
          <MiniList
            rows={topVideos.map((v) => ({
              key: v.id,
              primary: v.title,
              secondary: `${PLATFORM_LABEL[v.platform]} · ${v.kind}`,
              right: `${num(v.performance.views)} views`,
            }))}
          />
        </Panel>
      </div>
    </AppBlock>
  );
}
