"use client";

import * as React from "react";
import { Search, FileClock, ListFilter, Clock3 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DraftCard } from "@/components/marketing/draft-card";
import { PlatformBreakdownDonut } from "@/components/marketing/platform-breakdown-donut";
import { ApprovalFunnelChart } from "@/components/marketing/approval-funnel-chart";
import {
  MOCK_CONTENT_DRAFTS,
  PLATFORM_LABEL,
  getPlatformBreakdown,
  getApprovalFunnelCounts,
  getAverageTimeInReview,
  type ContentPlatform,
  type ContentStatus,
} from "@/lib/mock-data/marketing";

const STATUS_OPTIONS: (ContentStatus | "all")[] = ["all", "draft", "review", "approved", "scheduled"];
const PLATFORM_OPTIONS: (ContentPlatform | "all")[] = ["all", "linkedin", "instagram", "blog"];

export default function DraftsPage() {
  const [search, setSearch] = React.useState("");
  const [platform, setPlatform] = React.useState<ContentPlatform | "all">("all");
  const [status, setStatus] = React.useState<ContentStatus | "all">("all");

  const drafts = MOCK_CONTENT_DRAFTS;
  const [now] = React.useState(() => Date.now());

  const awaitingReview = drafts.filter((d) => d.status === "review").length;
  const scheduledThisWeek = drafts.filter((d) => {
    if (!d.scheduledFor) return false;
    const diffDays = (new Date(d.scheduledFor).getTime() - now) / 86400000;
    return diffDays >= 0 && diffDays <= 7;
  }).length;
  const approvedOrScheduled = drafts.filter(
    (d) => d.status === "approved" || d.status === "scheduled"
  ).length;
  const approvalRate = Math.round((approvedOrScheduled / drafts.length) * 100);

  const platformBreakdown = getPlatformBreakdown(drafts);
  const funnelCounts = getApprovalFunnelCounts();
  const avgTimeInReview = getAverageTimeInReview();

  const filtered = drafts.filter((d) => {
    const matchesSearch =
      search.trim().length === 0 ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.hook.toLowerCase().includes(search.toLowerCase());
    const matchesPlatform = platform === "all" || d.platform === platform;
    const matchesStatus = status === "all" || d.status === status;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const hasFilters = search.trim().length > 0 || platform !== "all" || status !== "all";

  return (
    <>
      <PageHeader
        title="Drafts"
        description="AI-generated content drafts moving through the maker-checker approval pipeline."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <KpiCard
          label="Awaiting review"
          value={String(awaitingReview)}
          context="Needs a reviewer decision"
          trend="flat"
          trendValue="0"
          icon={<FileClock className="size-4" />}
        />
        <KpiCard
          label="Scheduled this week"
          value={String(scheduledThisWeek)}
          context="Going out across all platforms"
          trend="up"
          trendValue={`+${scheduledThisWeek}`}
          icon={<FileClock className="size-4" />}
        />
        <KpiCard
          label="Approval rate"
          value={`${approvalRate}%`}
          context={`${approvedOrScheduled} of ${drafts.length} drafts approved`}
          trend="up"
          trendValue="+5%"
          icon={<FileClock className="size-4" />}
        />
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-3">
        <PlatformBreakdownDonut data={platformBreakdown} />
        <ApprovalFunnelChart data={funnelCounts} />
        <KpiCard
          label="Avg. time in review"
          value={avgTimeInReview.avgDaysLabel}
          context={`Across ${avgTimeInReview.sampleSize} drafts that reached review`}
          trend="down"
          trendValue="-0.3d"
          icon={<Clock3 className="size-4" />}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drafts by title or hook..."
            className="pl-8"
          />
        </div>
        <Select value={platform} onValueChange={(v) => setPlatform(v as ContentPlatform | "all")}>
          <SelectTrigger className="w-40">
            <ListFilter className="size-3.5" />
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            {PLATFORM_OPTIONS.map((p) => (
              <SelectItem key={p} value={p}>
                {p === "all" ? "All platforms" : PLATFORM_LABEL[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as ContentStatus | "all")}>
          <SelectTrigger className="w-40">
            <ListFilter className="size-3.5" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No drafts match your filters"
          description={
            hasFilters
              ? "Try a different search term or clear the platform/status filters."
              : "No content drafts yet. New AI drafts will appear here once generated."
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((draft) => (
            <DraftCard key={draft.id} draft={draft} />
          ))}
        </div>
      )}
    </>
  );
}
