"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Bookmark,
  CalendarClock,
  Check,
  Heart,
  Hash,
  MessageCircle,
  MessageSquarePlus,
  MousePointerClick,
  Repeat2,
  Send,
  ThumbsUp,
  X,
  Eye,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { AiGeneratedBadge } from "@/components/shared/badges";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { useOrg } from "@/lib/org-context";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import { ApprovalStepper } from "@/components/marketing/approval-stepper";
import { ContentStatusPill, Field, FormatBadge, MiniStat, Pill, VideoPlayer } from "@/components/marketing/shared";
import { useContentStore } from "@/components/marketing/store";
import {
  BRAND_PROFILE,
  FORMAT_LABEL,
  PLATFORM_LABEL,
  REF_ISO,
  compact,
  fmtDateTime,
  getApprovalTimeline,
  getBrandChecks,
  getDraftVideo,
  getPillar,
  initials,
  relativeToRef,
  reviewerFor,
  type ContentComment,
  type ContentDraft,
} from "@/lib/mock-data/marketing";
import { cn } from "@/lib/utils";

export function DraftDetailDialog({
  draftId,
  open,
  onOpenChange,
  initialTab = "preview",
}: {
  draftId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: string;
}) {
  const { drafts } = useContentStore();
  const draft = drafts.find((d) => d.id === draftId) ?? null;
  return (
    <Dialog open={open && !!draft} onOpenChange={onOpenChange}>
      <DialogContent className={DETAIL_DIALOG_CLASS}>
        {draft && <DraftDetailBody key={draft.id} draft={draft} initialTab={initialTab} />}
      </DialogContent>
    </Dialog>
  );
}

function DraftDetailBody({ draft, initialTab }: { draft: ContentDraft; initialTab: string }) {
  const { org } = useOrg();
  const { setStatus, addComment } = useContentStore();
  const [note, setNote] = React.useState("");
  const [tab, setTab] = React.useState(initialTab);
  const reviewer = reviewerFor(org.id, draft.reviewerIdx);
  const pillar = getPillar(draft.pillarId);
  const video = getDraftVideo(draft);
  const timeline = getApprovalTimeline(draft, reviewer.name);
  const checks = getBrandChecks(draft);
  const m = draft.metrics;

  function approve() {
    setStatus(draft.id, "approved");
    toast.success("Draft approved", { description: "Checker sign-off recorded. Schedule it from here or the Calendar." });
  }
  function schedule() {
    setStatus(draft.id, "scheduled");
    toast.success("Scheduled at the predicted best time", { description: fmtDateTime(draft.targetDate) });
  }
  function publishNow() {
    setStatus(draft.id, "published");
    toast.info("Publishing is simulated", { description: "PUBLISHING_ENABLED is off, so nothing was posted to a live account." });
  }
  function submit() {
    setStatus(draft.id, "review");
    toast.success("Submitted for review");
  }
  function sendBack() {
    if (!note.trim()) {
      toast.error("Add a note describing the requested change.");
      setTab("comments");
      return;
    }
    const comment: ContentComment = {
      id: `cmt-local-${draft.id}-${draft.comments.length}`,
      authorName: reviewer.name,
      body: note.trim(),
      createdAt: REF_ISO,
      type: "change_request",
    };
    addComment(draft.id, comment);
    setStatus(draft.id, "sent_back");
    setNote("");
    toast.info("Sent back to the maker", { description: "The content agent will revise and resubmit." });
  }
  function postNote() {
    if (!note.trim()) return;
    addComment(draft.id, {
      id: `cmt-note-${draft.id}-${draft.comments.length}`,
      authorName: reviewer.name,
      body: note.trim(),
      createdAt: REF_ISO,
      type: "note",
    });
    setNote("");
  }

  return (
    <>
      <DialogHeader>
        <div className="flex flex-wrap items-center gap-2">
          <PlatformBadge platform={draft.platform} />
          <FormatBadge format={draft.format} />
          <ContentStatusPill status={draft.status} />
          {draft.aiGenerated && <AiGeneratedBadge />}
        </div>
        <DialogTitle className="mt-1 text-lg">{draft.title}</DialogTitle>
        <DialogDescription>{draft.hook}</DialogDescription>
      </DialogHeader>

      <Card className="py-3">
        <CardContent className="px-4">
          <ApprovalStepper current={draft.status} />
          {draft.status === "sent_back" && (
            <p className="mt-3 text-center text-xs font-medium text-destructive">
              Sent back to the maker{draft.flag ? `: ${draft.flag}` : ""}
            </p>
          )}
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="approval">Approval</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="comments">Comments ({draft.comments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="pt-2">
          <ContentPreview draft={draft} />
        </TabsContent>

        <TabsContent value="details" className="pt-2">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="py-3">
              <CardContent className="divide-y px-4">
                <Field label="Platform">{PLATFORM_LABEL[draft.platform]}</Field>
                <Field label="Format">{FORMAT_LABEL[draft.format]}</Field>
                <Field label="Pillar">{pillar?.label ?? "-"}</Field>
                <Field label="Maker">{draft.authorLabel}</Field>
                <Field label="Checker">
                  <span className="inline-flex items-center gap-1.5">
                    <Avatar size="sm">
                      <AvatarFallback>{initials(reviewer.name)}</AvatarFallback>
                    </Avatar>
                    {reviewer.name}
                  </span>
                </Field>
                <Field label="Created">{fmtDateTime(draft.createdAt)}</Field>
                <Field label="Last updated">{relativeToRef(draft.updatedAt)}</Field>
                <Field label="Target date">
                  <span className="inline-flex items-center gap-1">
                    <CalendarClock className="size-3.5" />
                    {fmtDateTime(draft.targetDate)}
                  </span>
                </Field>
                <Field label="Word count">{draft.wordCount}</Field>
                <Field label="Call to action">{draft.cta}</Field>
              </CardContent>
            </Card>
            <div className="space-y-3">
              <Card className="py-3">
                <CardContent className="space-y-2 px-4 text-sm">
                  <p className="text-xs font-medium text-muted-foreground">Tags and hashtags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {draft.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[11px]">
                        <Hash className="mr-0.5 size-2.5" />
                        {t}
                      </Badge>
                    ))}
                  </div>
                  {draft.hashtags.length > 0 && <p className="text-sm text-primary">{draft.hashtags.join(" ")}</p>}
                </CardContent>
              </Card>
              {draft.imagePrompt && (
                <Card className="py-3">
                  <CardContent className="px-4 text-sm">
                    <p className="text-xs font-medium text-muted-foreground">Image prompt</p>
                    <p className="mt-1">{draft.imagePrompt}</p>
                  </CardContent>
                </Card>
              )}
              {video && (
                <Card className="py-3">
                  <CardContent className="px-4 text-sm">
                    <p className="text-xs font-medium text-muted-foreground">Video brief</p>
                    <p className="mt-1">{video.brief}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {video.creator} · {video.engine} · ${video.costUsd.toFixed(2)} spent (ceiling $5)
                    </p>
                  </CardContent>
                </Card>
              )}
              {draft.blogSlug && (
                <Card className="py-3">
                  <CardContent className="px-4 text-sm">
                    <p className="text-xs font-medium text-muted-foreground">Blog destination</p>
                    <p className="mt-1 font-mono text-xs">scalepods.co/blog/{draft.blogSlug}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="approval" className="pt-2">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="py-3">
              <CardContent className="px-4">
                <p className="mb-3 text-xs font-medium text-muted-foreground">Maker-checker timeline</p>
                <ol className="space-y-3">
                  {timeline.map((ev, i) => (
                    <li key={`${ev.label}-${i}`} className="flex gap-3">
                      <span
                        className={cn(
                          "mt-1 size-2.5 shrink-0 rounded-full",
                          ev.tone === "success" && "bg-success",
                          ev.tone === "warning" && "bg-warning",
                          ev.tone === "danger" && "bg-destructive",
                          ev.tone === "neutral" && "bg-muted-foreground/50"
                        )}
                      />
                      <div className="text-sm">
                        <p className="font-medium">{ev.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {ev.actor} · {fmtDateTime(ev.at)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
            <Card className="py-3">
              <CardContent className="px-4">
                <p className="mb-3 text-xs font-medium text-muted-foreground">Brand guardrail checks ({BRAND_PROFILE.name})</p>
                <ul className="space-y-2.5">
                  {checks.map((c) => (
                    <li key={c.label} className="flex gap-2 text-sm">
                      {c.pass ? (
                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
                      ) : (
                        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
                      )}
                      <div>
                        <p className="font-medium">{c.label}</p>
                        <p className="text-xs text-muted-foreground">{c.note}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="pt-2">
          {m ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MiniStat label="Impressions" value={compact(m.impressions)} />
                <MiniStat label="Reach" value={compact(m.reach)} />
                <MiniStat label="Engagements" value={compact(m.likes + m.comments + m.shares + m.saves)} />
                <MiniStat label="Link clicks" value={compact(m.clicks)} hint={`${((m.clicks / m.impressions) * 100).toFixed(1)}% CTR`} />
                <MiniStat label="Likes" value={compact(m.likes)} />
                <MiniStat label="Comments" value={String(m.comments)} />
                <MiniStat label="Shares" value={String(m.shares)} />
                <MiniStat label="Saves" value={String(m.saves)} />
                {m.views !== undefined && <MiniStat label="Views" value={compact(m.views)} />}
                {m.avgWatchPct !== undefined && <MiniStat label="Avg. watched" value={`${m.avgWatchPct}%`} />}
              </div>
              <p className="text-xs text-muted-foreground">
                Demo data. Live numbers sync from each platform once PUBLISHING_ENABLED and the analytics connectors are on.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No performance yet. This piece is {draft.status === "scheduled" ? `scheduled for ${fmtDateTime(draft.targetDate)}` : "not live"}; projected reach for
              {" "}{PLATFORM_LABEL[draft.platform]} is {compact(Math.round(BRAND_PROFILE.handles.find((h) => h.platform === draft.platform)!.followers * 3.4))} impressions.
            </div>
          )}
        </TabsContent>

        <TabsContent value="comments" className="space-y-3 pt-2">
          {draft.comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          ) : (
            draft.comments.map((c) => (
              <div key={c.id} className="rounded-md border bg-muted/30 p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-medium">
                    {c.authorName}
                    <Pill label={c.type === "change_request" ? "Change request" : "Note"} tone={c.type === "change_request" ? "orange" : "neutral"} />
                  </span>
                  <span className="text-xs text-muted-foreground">{relativeToRef(c.createdAt)}</span>
                </div>
                <p className="mt-1 text-muted-foreground">{c.body}</p>
              </div>
            ))
          )}
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Write a note, or describe the change you want, then use Send back."
          />
          <Button size="sm" variant="outline" onClick={postNote} disabled={!note.trim()}>
            <MessageSquarePlus className="size-4" />
            Add note
          </Button>
        </TabsContent>
      </Tabs>

      <DialogFooter className="flex-wrap gap-2 sm:justify-between">
        <span className="text-xs text-muted-foreground">
          Checker: {reviewer.name} · {draft.id}
        </span>
        <div className="flex flex-wrap gap-2">
          {draft.status === "draft" && (
            <Button onClick={submit}>
              <Send className="size-4" />
              Submit for review
            </Button>
          )}
          {draft.status === "sent_back" && (
            <Button onClick={submit}>
              <Send className="size-4" />
              Resubmit
            </Button>
          )}
          {draft.status === "review" && (
            <>
              <Button variant="outline" onClick={sendBack}>
                <X className="size-4" />
                Send back
              </Button>
              <Button onClick={approve}>
                <Check className="size-4" />
                Approve
              </Button>
            </>
          )}
          {draft.status === "approved" && (
            <Button onClick={schedule}>
              <CalendarClock className="size-4" />
              Schedule
            </Button>
          )}
          {draft.status === "scheduled" && (
            <Button variant="outline" onClick={publishNow}>
              <Send className="size-4" />
              Publish now
            </Button>
          )}
        </div>
      </DialogFooter>
    </>
  );
}

// ---------------------------------------------------------------------------
// Platform-style preview
// ---------------------------------------------------------------------------

export function ContentPreview({ draft }: { draft: ContentDraft }) {
  const video = getDraftVideo(draft);
  const handle = BRAND_PROFILE.handles.find((h) => h.platform === draft.platform);
  const m = draft.metrics;

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      <Card className="gap-0 overflow-hidden py-0">
        <CardContent className="px-4 py-4">
          <div className="flex items-start gap-2.5">
            <Avatar>
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold">{BRAND_PROFILE.name}</p>
              <p className="text-xs text-muted-foreground">
                {handle?.handle} · {compact(handle?.followers ?? 0)} followers
              </p>
            </div>
            <PlatformBadge platform={draft.platform} />
          </div>

          {draft.format === "blog" ? (
            <div className="mt-3">
              <h3 className="text-base font-semibold">{draft.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                scalepods.co/blog/{draft.blogSlug} · {draft.wordCount} words
              </p>
              <div className="mt-3 space-y-2 text-sm leading-relaxed">
                {draft.body.split("\n").map((line, i) =>
                  line.startsWith("## ") ? (
                    <h4 key={i} className="pt-1 text-sm font-semibold">
                      {line.replace("## ", "")}
                    </h4>
                  ) : line.trim() ? (
                    <p key={i} className="text-muted-foreground">
                      {line}
                    </p>
                  ) : null
                )}
              </div>
            </div>
          ) : (
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{draft.body}</p>
          )}

          {draft.hashtags.length > 0 && draft.format !== "blog" && (
            <p className="mt-3 text-sm font-medium text-primary">{draft.hashtags.join(" ")}</p>
          )}

          {video && (
            <div className="mt-3">
              <VideoPlayer src={video.src} aspect={video.aspect} />
              <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
                {video.fileName} · {video.aspect}
              </p>
            </div>
          )}

          {draft.slides && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {draft.slides.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex aspect-[4/5] flex-col justify-between rounded-md border p-2 text-[10px] leading-tight",
                    s.type === "cta" ? "bg-primary/10" : s.type === "stat" ? "bg-accent/10" : "bg-muted/50"
                  )}
                >
                  <span className="font-semibold uppercase tracking-wide text-muted-foreground">
                    {s.eyebrow ?? `Slide ${i + 1}`}
                  </span>
                  <span className="text-xs font-semibold">{s.headline}</span>
                  {s.body && <span className="line-clamp-3 text-muted-foreground">{s.body}</span>}
                </div>
              ))}
            </div>
          )}

          {!video && !draft.slides && draft.imagePrompt && draft.format !== "text" && draft.format !== "blog" && (
            <div className="mt-3 flex aspect-[1.91/1] items-center justify-center rounded-lg border border-dashed bg-muted/50 px-4 text-center text-xs text-muted-foreground">
              Generated image placeholder: &ldquo;{draft.imagePrompt}&rdquo;
            </div>
          )}

          <p className="mt-3 rounded-md bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground">CTA: {draft.cta}</p>
        </CardContent>
        <CardContent className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
          {draft.platform === "linkedin" || draft.platform === "facebook" ? (
            <>
              <span className="flex items-center gap-1">
                <ThumbsUp className="size-3.5" /> {m ? m.likes : 0}
              </span>
              <span>
                {m ? m.comments : 0} comments · {m ? m.shares : 0} reposts
              </span>
            </>
          ) : draft.platform === "blog" ? (
            <>
              <span className="flex items-center gap-1">
                <Eye className="size-3.5" /> {m?.views ?? 0} views
              </span>
              <span className="flex items-center gap-1">
                <MousePointerClick className="size-3.5" /> {m?.clicks ?? 0} CTA clicks
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-3">
                <Heart className="size-3.5" /> {m?.likes ?? 0}
                <MessageCircle className="size-3.5" /> {m?.comments ?? 0}
                <Repeat2 className="size-3.5" /> {m?.shares ?? 0}
              </span>
              <Bookmark className="size-3.5" />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
