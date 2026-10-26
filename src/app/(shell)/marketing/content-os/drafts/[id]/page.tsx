"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  MessageSquarePlus,
  X,
  CalendarClock,
  Hash,
  ImageIcon,
  MessageSquareText,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AiGeneratedBadge } from "@/components/shared/badges";
import { ApprovalStepper } from "@/components/marketing/approval-stepper";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import { ContentPreview } from "@/components/marketing/content-preview";
import { formatRelative } from "@/lib/format";
import { MEMBERS } from "@/lib/mock-data/orgs";
import {
  getContentDraft,
  type ContentComment,
  type ContentStatus,
} from "@/lib/mock-data/marketing";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DraftDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const original = getContentDraft(params.id);

  const [status, setStatus] = React.useState<ContentStatus | "rejected">(
    original?.status ?? "draft"
  );
  const [comments, setComments] = React.useState<ContentComment[]>(original?.comments ?? []);
  const [changeDialogOpen, setChangeDialogOpen] = React.useState(false);
  const [changeNote, setChangeNote] = React.useState("");

  if (!original) {
    return (
      <EmptyState
        icon={MessageSquareText}
        title="Draft not found"
        description="This content draft may have been removed."
        action={
          <Button asChild variant="outline">
            <Link href="/marketing/content-os/drafts">Back to drafts</Link>
          </Button>
        }
      />
    );
  }

  const draft = original;
  const reviewer = MEMBERS.find((m) => m.id === draft.reviewerId);
  const isRejected = status === "rejected";
  const isApproved = status === "approved" || status === "scheduled";
  const isTerminal = isApproved || isRejected;

  function handleApprove() {
    setStatus(draft.scheduledFor ? "scheduled" : "approved");
    toast.success("Draft approved", {
      description: draft.scheduledFor
        ? "This draft will publish automatically on its scheduled date."
        : "Awaiting a publish date — add one from the Calendar.",
    });
  }

  function handleReject() {
    setStatus("rejected");
    toast.error("Draft rejected", {
      description: "The content agent will be notified to regenerate this draft.",
    });
  }

  function handleRequestChanges() {
    if (!changeNote.trim()) {
      toast.error("Add a note describing the requested change.");
      return;
    }
    const comment: ContentComment = {
      id: `cmt-local-${Date.now()}`,
      authorName: "You",
      body: changeNote.trim(),
      createdAt: new Date().toISOString(),
      type: "change_request",
    };
    setComments((prev) => [comment, ...prev]);
    setStatus("review");
    setChangeNote("");
    setChangeDialogOpen(false);
    toast.info("Change request sent", {
      description: "The content agent will revise the draft based on your note.",
    });
  }

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/marketing/content-os/drafts")}>
          <ArrowLeft className="size-4" />
          Back to drafts
        </Button>
      </div>

      <PageHeader
        title={draft.title}
        description={draft.hook}
        badge={draft.aiGenerated ? <AiGeneratedBadge /> : undefined}
        actions={
          <div className="flex items-center gap-2">
            <PlatformBadge platform={draft.platform} />
          </div>
        }
      />

      <Card className="mb-5">
        <CardContent className="py-4">
          <ApprovalStepper current={isRejected ? "draft" : (status as ContentStatus)} rejected={isRejected} />
          {isRejected && (
            <p className="mt-3 text-center text-sm font-medium text-destructive">
              This draft was rejected and sent back to the content agent for a rewrite.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContentPreview draft={draft} />

          <div className="mx-auto mt-5 flex w-full max-w-xl flex-wrap items-center justify-center gap-2">
            <Button onClick={handleApprove} disabled={isTerminal}>
              <Check className="size-4" />
              Approve
            </Button>
            <Button variant="outline" onClick={() => setChangeDialogOpen(true)} disabled={isRejected}>
              <MessageSquarePlus className="size-4" />
              Request changes
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isTerminal}>
              <X className="size-4" />
              Reject
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reviewer</span>
                <div className="flex items-center gap-1.5">
                  <Avatar size="sm">
                    <AvatarFallback>{reviewer ? initials(reviewer.name) : "?"}</AvatarFallback>
                  </Avatar>
                  <span>{reviewer?.name ?? "Unassigned"}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{formatRelative(draft.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last updated</span>
                <span>{formatRelative(draft.updatedAt)}</span>
              </div>
              {draft.scheduledFor && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Scheduled for</span>
                  <span className="flex items-center gap-1">
                    <CalendarClock className="size-3.5" />
                    {new Date(draft.scheduledFor).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              {draft.wordCount && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Word count</span>
                  <span>{draft.wordCount}</span>
                </div>
              )}
              <Separator />
              <div className="flex flex-wrap gap-1.5">
                {draft.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[11px]">
                    <Hash className="mr-0.5 size-2.5" />
                    {tag}
                  </Badge>
                ))}
              </div>
              {draft.imagePrompt && (
                <div className="flex items-start gap-1.5 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
                  <ImageIcon className="mt-0.5 size-3.5 shrink-0" />
                  {draft.imagePrompt}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5 text-sm">
                <MessageSquareText className="size-4" />
                Comments {comments.length > 0 && `(${comments.length})`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="rounded-md border bg-muted/30 p-2.5 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{comment.authorName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelative(comment.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{comment.body}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={changeDialogOpen} onOpenChange={setChangeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request changes</DialogTitle>
            <DialogDescription>
              Describe what should change. The content agent will revise this draft and resubmit it for review.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={changeNote}
            onChange={(e) => setChangeNote(e.target.value)}
            placeholder="e.g. Soften the tone in the opening line, and add a stat on response time."
            rows={4}
            autoFocus
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleRequestChanges}>Send request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
