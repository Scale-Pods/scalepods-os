"use client";

import * as React from "react";
import { Clock3, FileClock, ListFilter, MessageSquareText, Play, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { EmptyState } from "@/components/shared/empty-state";
import { AiGeneratedBadge } from "@/components/shared/badges";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrg } from "@/lib/org-context";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import { PlatformBreakdownDonut } from "@/components/marketing/platform-charts";
import { ApprovalFunnelChart } from "@/components/marketing/approval-funnel-chart";
import { ContentStatusPill, FormatBadge } from "@/components/marketing/shared";
import { DraftDetailDialog } from "@/components/marketing/draft-detail-dialog";
import { useContentStore } from "@/components/marketing/store";
import {
  FORMAT_LABEL,
  PLATFORMS,
  PLATFORM_LABEL,
  STATUS_LABEL,
  getApprovalFunnelCounts,
  getAverageTimeInReview,
  getDraftVideo,
  getPlatformBreakdown,
  initials,
  relativeToRef,
  reviewerFor,
  type ContentDraft,
  type ContentFormat,
  type ContentPlatform,
  type ContentStatus,
} from "@/lib/mock-data/marketing";

const STATUS_OPTIONS = Object.keys(STATUS_LABEL) as ContentStatus[];
const FORMAT_OPTIONS = Object.keys(FORMAT_LABEL) as ContentFormat[];

export function DraftCard({ draft, onOpen }: { draft: ContentDraft; onOpen: (id: string) => void }) {
  const { org } = useOrg();
  const reviewer = reviewerFor(org.id, draft.reviewerIdx);
  const video = getDraftVideo(draft);
  return (
    <button type="button" onClick={() => onOpen(draft.id)} className="text-left">
      <Card className="h-full gap-3 py-4 transition-colors hover:border-ring/40 hover:bg-card/80">
        <CardContent className="px-4">
          {video && (
            <div className="relative mb-3 overflow-hidden rounded-md bg-black">
              <video
                src={video.src}
                preload="metadata"
                playsInline
                muted
                className="h-36 w-full object-cover"
                aria-label={`${video.title} preview`}
              />
              <span className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
                <Play className="size-3" /> {video.aspect}
              </span>
            </div>
          )}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <PlatformBadge platform={draft.platform} />
              <FormatBadge format={draft.format} />
              <ContentStatusPill status={draft.status} />
            </div>
            {draft.aiGenerated && <AiGeneratedBadge />}
          </div>
          <h3 className="mt-2.5 line-clamp-1 text-sm font-semibold">{draft.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{draft.hook}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarFallback>{initials(reviewer.name)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{reviewer.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {draft.comments.length > 0 && (
                <span className="flex items-center gap-1">
                  <MessageSquareText className="size-3" />
                  {draft.comments.length}
                </span>
              )}
              <span>{relativeToRef(draft.updatedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}

export function DraftsView() {
  const { drafts } = useContentStore();
  const [search, setSearch] = React.useState("");
  const [platform, setPlatform] = React.useState<ContentPlatform | "all">("all");
  const [status, setStatus] = React.useState<ContentStatus | "all">("all");
  const [format, setFormat] = React.useState<ContentFormat | "all">("all");
  const [openId, setOpenId] = React.useState<string | null>(null);

  const awaiting = drafts.filter((d) => d.status === "review").length;
  const sentBack = drafts.filter((d) => d.status === "sent_back").length;
  const approvedPlus = drafts.filter((d) => ["approved", "scheduled", "published"].includes(d.status)).length;
  const approvalRate = Math.round((approvedPlus / drafts.length) * 100);
  const avg = getAverageTimeInReview();

  const filtered = drafts.filter((d) => {
    const q = search.trim().toLowerCase();
    return (
      (!q || d.title.toLowerCase().includes(q) || d.hook.toLowerCase().includes(q) || d.tags.some((t) => t.includes(q))) &&
      (platform === "all" || d.platform === platform) &&
      (status === "all" || d.status === status) &&
      (format === "all" || d.format === format)
    );
  });

  return (
    <>
      <PageHeader
        title="Drafts"
        description="Every AI-generated and manual piece moving through the maker-checker pipeline. Click a card to review it."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Awaiting review" value={String(awaiting)} context="Needs a checker decision" trend="flat" trendValue="0" icon={<FileClock className="size-4" />} />
        <KpiCard label="Sent back" value={String(sentBack)} context="Waiting on the maker" trend="flat" trendValue="0" trendGood={false} icon={<MessageSquareText className="size-4" />} />
        <KpiCard label="Approval rate" value={`${approvalRate}%`} context={`${approvedPlus} of ${drafts.length} approved or beyond`} trend="up" trendValue="+5%" icon={<FileClock className="size-4" />} />
        <KpiCard label="Avg. time in review" value={avg.avgDaysLabel} context={`Across ${avg.sampleSize} drafts`} trend="down" trendValue="-0.3d" icon={<Clock3 className="size-4" />} />
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-2">
        <PlatformBreakdownDonut data={getPlatformBreakdown(drafts)} />
        <ApprovalFunnelChart data={getApprovalFunnelCounts()} />
      </div>

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search drafts by title, hook or tag...">
        <Select value={platform} onValueChange={(v) => setPlatform(v as ContentPlatform | "all")}>
          <SelectTrigger className="w-40">
            <ListFilter className="size-3.5" />
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All platforms</SelectItem>
            {PLATFORMS.map((p) => (
              <SelectItem key={p} value={p}>
                {PLATFORM_LABEL[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={format} onValueChange={(v) => setFormat(v as ContentFormat | "all")}>
          <SelectTrigger className="w-40">
            <ListFilter className="size-3.5" />
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All formats</SelectItem>
            {FORMAT_OPTIONS.map((f) => (
              <SelectItem key={f} value={f}>
                {FORMAT_LABEL[f]}
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
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ListToolbar>

      {filtered.length === 0 ? (
        <EmptyState icon={Search} title="No drafts match your filters" description="Try a different search term or clear the platform, format and status filters." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <DraftCard key={d.id} draft={d} onOpen={setOpenId} />
          ))}
        </div>
      )}

      <DraftDetailDialog draftId={openId} open={openId !== null} onOpenChange={(o) => !o && setOpenId(null)} />
    </>
  );
}
