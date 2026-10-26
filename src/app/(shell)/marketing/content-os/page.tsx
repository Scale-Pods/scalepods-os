"use client";

import Link from "next/link";
import {
  FileClock,
  CalendarDays,
  UserCog,
  ArrowRight,
  Sparkles,
  FileText,
  Clock3,
  BarChart3,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/badges";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import { DraftsByStatusDonut } from "@/components/marketing/drafts-by-status-donut";
import { ContentVelocityChart } from "@/components/marketing/content-velocity-chart";
import { useOrg } from "@/lib/org-context";
import {
  MOCK_CONTENT_DRAFTS,
  getDraftsByStatus,
  getContentVelocityWeeks,
  getAverageTimeInReview,
} from "@/lib/mock-data/marketing";
import { formatRelative } from "@/lib/format";

export default function ContentOsOverviewPage() {
  const { org } = useOrg();
  const drafts = MOCK_CONTENT_DRAFTS;

  const awaitingReview = drafts.filter((d) => d.status === "review").length;
  const scheduled = drafts.filter((d) => d.status === "scheduled").length;
  const approvedOrScheduled = drafts.filter(
    (d) => d.status === "approved" || d.status === "scheduled"
  ).length;
  const approvalRate = Math.round((approvedOrScheduled / drafts.length) * 100);
  const avgTimeInReview = getAverageTimeInReview();
  const statusBreakdown = getDraftsByStatus();
  const velocityWeeks = getContentVelocityWeeks(8);

  const recent = [...drafts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <>
      <PageHeader
        title="Content OS"
        description={`AI content drafts, maker-checker approval and the content calendar for ${org.name}.`}
        actions={
          <Button asChild>
            <Link href="/marketing/content-os/drafts">
              View all drafts
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          label="Content awaiting review"
          value={String(awaitingReview)}
          context="Needs a reviewer decision"
          trend="flat"
          trendValue="0"
          icon={<FileClock className="size-4" />}
        />
        <KpiCard
          label="Scheduled"
          value={String(scheduled)}
          context="Approved and queued to publish"
          trend="up"
          trendValue={`+${scheduled}`}
          icon={<CalendarDays className="size-4" />}
        />
        <KpiCard
          label="Approval rate"
          value={`${approvalRate}%`}
          context={`${approvedOrScheduled} of ${drafts.length} drafts approved`}
          trend="up"
          trendValue="+5%"
          icon={<Sparkles className="size-4" />}
        />
        <KpiCard
          label="Total drafts"
          value={String(drafts.length)}
          context="Across all platforms"
          trend="flat"
          trendValue="0"
          icon={<FileText className="size-4" />}
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
          label="Content pieces/week"
          value={String(velocityWeeks[velocityWeeks.length - 1]?.created ?? 0)}
          context="Current week output"
          trend="up"
          trendValue="+1"
          icon={<BarChart3 className="size-4" />}
        />
      </div>

      <div className="mb-6 grid gap-5 lg:grid-cols-2">
        <DraftsByStatusDonut data={statusBreakdown} />
        <ContentVelocityChart data={velocityWeeks} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="py-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Recently updated drafts</h2>
              <Link
                href="/marketing/content-os/drafts"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                See all
              </Link>
            </div>
            <div className="divide-y">
              {recent.map((d) => (
                <Link
                  key={d.id}
                  href={`/marketing/content-os/drafts/${d.id}`}
                  className="flex items-center justify-between gap-3 py-2.5 hover:bg-muted/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <PlatformBadge platform={d.platform} />
                    <span className="truncate text-sm font-medium">{d.title}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <StatusBadge status={d.status} />
                    <span className="text-xs text-muted-foreground">{formatRelative(d.updatedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Link href="/marketing/content-os/calendar">
            <Card className="transition-colors hover:border-ring/40 hover:bg-card/80">
              <CardContent className="flex items-center gap-3 py-4">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarDays className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Content Calendar</p>
                  <p className="text-xs text-muted-foreground">Month view of scheduled posts</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/marketing/content-os/brand-profile">
            <Card className="transition-colors hover:border-ring/40 hover:bg-card/80">
              <CardContent className="flex items-center gap-3 py-4">
                <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <UserCog className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Brand Profile</p>
                  <p className="text-xs text-muted-foreground">Tone, audience and pillars</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
}
