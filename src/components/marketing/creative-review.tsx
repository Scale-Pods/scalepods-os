"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, CheckSquare, Eye, X } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewerWorkloadChart } from "@/components/marketing/reviewer-workload-chart";
import { ApprovalRateLineChart } from "@/components/marketing/approval-rate-line-chart";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import { ContentStatusPill, FormatBadge, Pill } from "@/components/marketing/shared";
import { DraftDetailDialog } from "@/components/marketing/draft-detail-dialog";
import { useContentStore } from "@/components/marketing/store";
import { useOrg } from "@/lib/org-context";
import {
  getApprovalRateOverTime,
  getBrandChecks,
  getDraftVideo,
  getReviewerWorkload,
  relativeToRef,
  reviewerFor,
  type ContentDraft,
} from "@/lib/mock-data/marketing";

type Filter = "all" | "review" | "sent_back";

export function CreativeReview() {
  const { org } = useOrg();
  const { drafts, setStatus } = useContentStore();
  const [filter, setFilter] = React.useState<Filter>("all");
  const [openId, setOpenId] = React.useState<string | null>(null);

  const queue = drafts.filter((d) => d.status === "review" || d.status === "sent_back");
  const shown = filter === "all" ? queue : queue.filter((d) => d.status === filter);
  const ready = drafts.filter((d) => d.status === "review").length;
  const back = drafts.filter((d) => d.status === "sent_back").length;
  const decidedWeek = drafts.filter((d) => ["approved", "scheduled", "published"].includes(d.status)).length;

  function approve(d: ContentDraft) {
    setStatus(d.id, "approved");
    toast.success(`Approved: ${d.title}`);
  }
  function sendBack(d: ContentDraft) {
    setStatus(d.id, "sent_back");
    toast.info(`Sent back: ${d.title}`, { description: "Open the draft to add the change note." });
  }

  return (
    <>
      <PageHeader title="Creative Review" description="Approve or send back each piece. The checker is never the maker, and every decision is logged." />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <KpiCard label="Ready for review" value={String(ready)} context="Waiting on a checker" trend="flat" trendValue="0" icon={<Eye className="size-4" />} />
        <KpiCard label="Sent back" value={String(back)} context="Waiting on the maker" trend="flat" trendValue="0" trendGood={false} icon={<X className="size-4" />} />
        <KpiCard label="Approved so far" value={String(decidedWeek)} context="Approved, scheduled or live" trend="up" trendValue="+3" icon={<CheckSquare className="size-4" />} />
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-2">
        <ReviewerWorkloadChart data={getReviewerWorkload(org.id)} />
        <ApprovalRateLineChart data={getApprovalRateOverTime(8)} />
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)} className="mb-3">
        <TabsList>
          <TabsTrigger value="all">All ({queue.length})</TabsTrigger>
          <TabsTrigger value="review">Ready for review ({ready})</TabsTrigger>
          <TabsTrigger value="sent_back">Sent back ({back})</TabsTrigger>
        </TabsList>
      </Tabs>

      {shown.length === 0 ? (
        <EmptyState icon={CheckSquare} title="Nothing to review" description="New AI drafts that reach the review stage will appear here." />
      ) : (
        <div className="space-y-2">
          {shown.map((d) => {
            const video = getDraftVideo(d);
            const checks = getBrandChecks(d);
            const failed = checks.filter((c) => !c.pass).length;
            const reviewer = reviewerFor(org.id, d.reviewerIdx);
            return (
              <Card key={d.id} className="py-3 transition-colors hover:border-ring/40">
                <CardContent className="flex flex-wrap items-center gap-3 px-4">
                  <button type="button" onClick={() => setOpenId(d.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    {video ? (
                      <video src={video.src} preload="metadata" playsInline muted className="h-14 w-24 shrink-0 rounded-md bg-black object-cover" />
                    ) : (
                      <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] text-muted-foreground">
                        {d.slides ? `${d.slides.length} slides` : d.format}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-1.5">
                        <PlatformBadge platform={d.platform} />
                        <FormatBadge format={d.format} />
                        <ContentStatusPill status={d.status} />
                        {failed > 0 && <Pill label={`${failed} guardrail flag`} tone="red" />}
                      </div>
                      <p className="truncate text-sm font-semibold">{d.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        Checker {reviewer.name} · updated {relativeToRef(d.updatedAt)}
                      </p>
                    </div>
                  </button>
                  {d.status === "review" ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => sendBack(d)}>
                        <X className="size-4" />
                        Send back
                      </Button>
                      <Button size="sm" onClick={() => approve(d)}>
                        <Check className="size-4" />
                        Approve
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setOpenId(d.id)}>
                      View feedback
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <DraftDetailDialog draftId={openId} open={openId !== null} onOpenChange={(o) => !o && setOpenId(null)} initialTab="approval" />
    </>
  );
}
