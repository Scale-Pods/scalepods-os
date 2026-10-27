"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Clapperboard,
  Clock3,
  FileClock,
  FileText,
  Send,
  Sparkles,
  UserCog,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOrg } from "@/lib/org-context";
import { DraftsByStatusDonut } from "@/components/marketing/drafts-by-status-donut";
import { ContentVelocityChart } from "@/components/marketing/content-velocity-chart";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import { ContentStatusPill, FormatBadge } from "@/components/marketing/shared";
import { DraftDetailDialog } from "@/components/marketing/draft-detail-dialog";
import { useContentStore } from "@/components/marketing/store";
import {
  BRAND_PILLARS,
  getAverageTimeInReview,
  getContentVelocityWeeks,
  getDraftsByStatus,
  getTotals,
  compact,
  relativeToRef,
} from "@/lib/mock-data/marketing";

const BASE = "/marketing/content-os";

const QUICK_LINKS = [
  { href: `${BASE}/review/drafts`, label: "Review queue", hint: "Maker-checker approvals", icon: FileClock },
  { href: `${BASE}/create/ugc-videos`, label: "UGC & Video", hint: "Six playable cuts", icon: Clapperboard },
  { href: `${BASE}/publish/calendar`, label: "Calendar", hint: "Every post with a date", icon: CalendarDays },
  { href: `${BASE}/analytics`, label: "Analytics", hint: "Reach, engagement, learning", icon: BarChart3 },
  { href: `${BASE}/brand-profile`, label: "Brand profile", hint: "Voice, pillars, guardrails", icon: UserCog },
];

export function ContentDashboard() {
  const { org } = useOrg();
  const { drafts } = useContentStore();
  const [openId, setOpenId] = React.useState<string | null>(null);

  const awaiting = drafts.filter((d) => d.status === "review");
  const scheduled = drafts.filter((d) => d.status === "scheduled").length;
  const published = drafts.filter((d) => d.status === "published").length;
  const approvedPlus = drafts.filter((d) => ["approved", "scheduled", "published"].includes(d.status)).length;
  const avg = getAverageTimeInReview();
  const totals = getTotals();
  const velocity = getContentVelocityWeeks(8);
  const recent = [...drafts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);

  return (
    <>
      <PageHeader
        title="Content OS"
        description={`ScalePods Growth OS: AI content, maker-checker approval and publishing, run for ${org.name}.`}
        actions={
          <Button asChild>
            <Link href={`${BASE}/review/drafts`}>
              Open review queue
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Content awaiting review" value={String(awaiting.length)} context="Needs a checker decision" trend="flat" trendValue="0" icon={<FileClock className="size-4" />} />
        <KpiCard label="Scheduled" value={String(scheduled)} context="Queued to publish" trend="up" trendValue={`+${scheduled}`} icon={<CalendarDays className="size-4" />} />
        <KpiCard label="Published (30d)" value={String(published)} context={`${compact(totals.impressions)} impressions`} trend="up" trendValue="+18%" icon={<Send className="size-4" />} />
        <KpiCard label="Approval rate" value={`${Math.round((approvedPlus / drafts.length) * 100)}%`} context={`${approvedPlus} of ${drafts.length} drafts`} trend="up" trendValue="+5%" icon={<Sparkles className="size-4" />} />
        <KpiCard label="Total drafts" value={String(drafts.length)} context="All platforms and formats" trend="flat" trendValue="0" icon={<FileText className="size-4" />} />
        <KpiCard label="Avg. time in review" value={avg.avgDaysLabel} context={`${avg.sampleSize} reviewed drafts`} trend="down" trendValue="-0.3d" icon={<Clock3 className="size-4" />} />
      </div>

      <div className="mb-6 grid gap-5 lg:grid-cols-2">
        <DraftsByStatusDonut data={getDraftsByStatus(drafts)} />
        <ContentVelocityChart data={velocity} />
      </div>

      <div className="mb-6 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="py-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Recently updated</h2>
              <Link href={`${BASE}/review/drafts`} className="text-xs text-muted-foreground hover:text-foreground">
                See all
              </Link>
            </div>
            <div className="divide-y">
              {recent.map((d) => (
                <button key={d.id} type="button" onClick={() => setOpenId(d.id)} className="flex w-full items-center justify-between gap-3 py-2.5 text-left hover:bg-muted/40">
                  <div className="flex min-w-0 items-center gap-2">
                    <PlatformBadge platform={d.platform} />
                    <FormatBadge format={d.format} />
                    <span className="truncate text-sm font-medium">{d.title}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <ContentStatusPill status={d.status} />
                    <span className="hidden text-xs text-muted-foreground sm:inline">{relativeToRef(d.updatedAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {QUICK_LINKS.map((q) => (
            <Link key={q.href} href={q.href}>
              <Card className="mb-3 transition-colors hover:border-ring/40 hover:bg-card/80">
                <CardContent className="flex items-center gap-3 py-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <q.icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{q.label}</p>
                    <p className="text-xs text-muted-foreground">{q.hint}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="py-4">
          <h2 className="mb-3 text-sm font-semibold">Content pillars: the four Pods plus proof</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {BRAND_PILLARS.map((p) => {
              const count = drafts.filter((d) => d.pillarId === p.id).length;
              return (
                <div key={p.id} className="rounded-lg border p-3">
                  <p className="text-sm font-semibold">{p.label}</p>
                  <p className="text-xs italic text-muted-foreground">{p.tagline}</p>
                  <p className="mt-2 text-lg font-semibold">{count}</p>
                  <p className="text-[11px] text-muted-foreground">pieces in pipeline</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <DraftDetailDialog draftId={openId} open={openId !== null} onOpenChange={(o) => !o && setOpenId(null)} />
    </>
  );
}
