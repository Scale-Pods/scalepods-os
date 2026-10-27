"use client";

import * as React from "react";
import { toast } from "sonner";
import { Clapperboard, DollarSign, Eye, FileClock, Check, X } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import { ContentStatusPill, Field, MiniStat, Pill, VideoPlayer, type Tone } from "@/components/marketing/shared";
import { DraftDetailDialog } from "@/components/marketing/draft-detail-dialog";
import { useContentStore } from "@/components/marketing/store";
import {
  VIDEO_APPROVAL_LABEL,
  VIDEO_ASSETS,
  VIDEO_KIND_LABEL,
  compact,
  fmtDateTime,
  getPillar,
  type VideoAsset,
  type VideoApproval,
  type VideoKind,
} from "@/lib/mock-data/marketing";

const APPROVAL_TONE: Record<VideoApproval, Tone> = {
  pending: "orange",
  approved: "green",
  changes_requested: "red",
  live: "purple",
};

const KIND_TONE: Record<VideoKind, Tone> = { ugc: "blue", billboard: "orange", product: "green" };

/** Merge the live status from the store so approvals made elsewhere show here. */
function useVideos() {
  const { drafts } = useContentStore();
  return VIDEO_ASSETS.map((v) => {
    const d = drafts.find((x) => x.id === v.draftId);
    const status = d?.status ?? v.status;
    const approval: VideoApproval =
      status === "published" ? "live" : status === "sent_back" ? "changes_requested" : status === "draft" || status === "review" ? "pending" : "approved";
    return { ...v, status, approval };
  });
}

function VideoCard({ video, onOpen }: { video: VideoAsset; onOpen: (id: string) => void }) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="bg-black">
        <video
          src={video.src}
          controls
          preload="metadata"
          playsInline
          muted
          className={video.aspect === "16:9" ? "aspect-video w-full object-contain" : "mx-auto h-72 object-contain"}
        />
      </div>
      <button type="button" onClick={() => onOpen(video.id)} className="text-left">
        <CardContent className="space-y-2 px-4 py-3 hover:bg-muted/30">
          <div className="flex flex-wrap items-center gap-1.5">
            <Pill label={VIDEO_KIND_LABEL[video.kind]} tone={KIND_TONE[video.kind]} />
            <PlatformBadge platform={video.platform} />
            <ContentStatusPill status={video.status} />
          </div>
          <h3 className="line-clamp-1 text-sm font-semibold">{video.title}</h3>
          <p className="line-clamp-2 text-xs text-muted-foreground">Hook: {video.hook}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{video.creator.split(":")[0]}</span>
            <span>{video.performance.views > 0 ? `${compact(video.performance.views)} views` : VIDEO_APPROVAL_LABEL[video.approval]}</span>
          </div>
        </CardContent>
      </button>
    </Card>
  );
}

export function UgcLibrary() {
  const videos = useVideos();
  const { setStatus } = useContentStore();
  const [search, setSearch] = React.useState("");
  const [kind, setKind] = React.useState<VideoKind | "all">("all");
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [draftId, setDraftId] = React.useState<string | null>(null);

  const open = videos.find((v) => v.id === openId) ?? null;
  const filtered = videos.filter(
    (v) =>
      (kind === "all" || v.kind === kind) &&
      (!search.trim() || v.title.toLowerCase().includes(search.toLowerCase()) || v.hook.toLowerCase().includes(search.toLowerCase()))
  );
  const awaiting = videos.filter((v) => v.approval === "pending").length;
  const views = videos.reduce((s, v) => s + v.performance.views, 0);
  const spend = videos.reduce((s, v) => s + v.costUsd, 0);

  return (
    <>
      <PageHeader
        title="UGC & Video Library"
        description="UGC testimonials, billboard motion cuts and product ads. Every clip is a draft that goes through the same maker-checker approval."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Videos" value={String(videos.length)} context="UGC, billboard and product ads" trend="up" trendValue="+2" icon={<Clapperboard className="size-4" />} />
        <KpiCard label="Awaiting review" value={String(awaiting)} context="Pending or sent-back cuts" trend="flat" trendValue="0" icon={<FileClock className="size-4" />} />
        <KpiCard label="Live views" value={compact(views)} context="Published clips" trend="up" trendValue="+12%" icon={<Eye className="size-4" />} />
        <KpiCard label="Generation spend" value={`$${spend.toFixed(2)}`} context="Hard ceiling $5 per video" trend="flat" trendValue="0" trendGood={false} icon={<DollarSign className="size-4" />} />
      </div>

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search videos by title or hook...">
        <Tabs value={kind} onValueChange={(v) => setKind(v as VideoKind | "all")}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="ugc">UGC</TabsTrigger>
            <TabsTrigger value="billboard">Billboard</TabsTrigger>
            <TabsTrigger value="product">Product ads</TabsTrigger>
          </TabsList>
        </Tabs>
      </ListToolbar>

      {filtered.length === 0 ? (
        <EmptyState icon={Clapperboard} title="No videos match" description="Clear the search or switch the type filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <VideoCard key={v.id} video={v} onOpen={setOpenId} />
          ))}
        </div>
      )}

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {open && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill label={VIDEO_KIND_LABEL[open.kind]} tone={KIND_TONE[open.kind]} />
                  <PlatformBadge platform={open.platform} />
                  <ContentStatusPill status={open.status} />
                  <Pill label={VIDEO_APPROVAL_LABEL[open.approval]} tone={APPROVAL_TONE[open.approval]} />
                </div>
                <DialogTitle className="mt-1 text-lg">{open.title}</DialogTitle>
                <DialogDescription>{open.hook}</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="player">
                <TabsList>
                  <TabsTrigger value="player">Player</TabsTrigger>
                  <TabsTrigger value="brief">Brief and script</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="approval">Approval</TabsTrigger>
                </TabsList>

                <TabsContent value="player" className="pt-2">
                  <div className="grid gap-4 md:grid-cols-2">
                    <VideoPlayer src={open.src} aspect={open.aspect} />
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Caption</p>
                        <p className="mt-1">{open.caption}</p>
                      </div>
                      <div className="divide-y rounded-lg border px-3">
                        <Field label="File">{open.fileName}</Field>
                        <Field label="Aspect ratio">{open.aspect}</Field>
                        <Field label="Platform">
                          <PlatformBadge platform={open.platform} />
                        </Field>
                        <Field label="Pillar">{getPillar(open.pillarId)?.label}</Field>
                        <Field label="Created">{fmtDateTime(open.createdAt)}</Field>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="brief" className="pt-2">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="py-3">
                      <CardContent className="space-y-2 px-4 text-sm">
                        <p className="text-xs font-medium text-muted-foreground">Creator and brief</p>
                        <p className="font-medium">{open.creator}</p>
                        <p className="text-muted-foreground">{open.brief}</p>
                        <div className="divide-y rounded-lg border px-3">
                          <Field label="Engine">{open.engine}</Field>
                          <Field label="Generation cost">${open.costUsd.toFixed(2)} of $5.00 ceiling</Field>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="py-3">
                      <CardContent className="px-4 text-sm">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">Script / storyboard</p>
                        <ol className="list-decimal space-y-2 pl-4 text-muted-foreground">
                          {open.script.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="pt-2">
                  {open.performance.views > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <MiniStat label="Views" value={compact(open.performance.views)} />
                      <MiniStat label="Completion" value={`${open.performance.completionPct}%`} />
                      <MiniStat label="Avg. watch" value={`${open.performance.avgWatchSec}s`} />
                      <MiniStat label="CTR" value={`${open.performance.ctr}%`} />
                      <MiniStat label="Likes" value={String(open.performance.likes)} />
                      <MiniStat label="Comments" value={String(open.performance.comments)} />
                      <MiniStat label="Shares" value={String(open.performance.shares)} />
                      <MiniStat label="Link clicks" value={String(open.performance.clicks)} />
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                      Not live yet. Numbers appear after publish. Benchmark from the oil product ad: 61% completion, 2.2% CTR.
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="approval" className="pt-2">
                  <div className="divide-y rounded-lg border px-3 text-sm">
                    <Field label="Approval state">
                      <Pill label={VIDEO_APPROVAL_LABEL[open.approval]} tone={APPROVAL_TONE[open.approval]} />
                    </Field>
                    <Field label="Draft status">
                      <ContentStatusPill status={open.status} />
                    </Field>
                    <Field label="Linked draft">{open.draftId}</Field>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Video generation is never auto-chained: each clip is started by an explicit human click behind the per-video spend ceiling.
                  </p>
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex-wrap gap-2">
                <Button variant="outline" onClick={() => {
                    const id = open.draftId;
                    setOpenId(null);
                    setDraftId(id);
                  }}>
                  Open linked draft
                </Button>
                {open.status === "review" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStatus(open.draftId, "sent_back");
                        toast.info("Video sent back to the maker");
                      }}
                    >
                      <X className="size-4" />
                      Send back
                    </Button>
                    <Button
                      onClick={() => {
                        setStatus(open.draftId, "approved");
                        toast.success("Video approved");
                      }}
                    >
                      <Check className="size-4" />
                      Approve
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <DraftDetailDialog draftId={draftId} open={draftId !== null} onOpenChange={(o) => !o && setDraftId(null)} />
    </>
  );
}
