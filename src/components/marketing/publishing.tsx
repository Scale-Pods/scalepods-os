"use client";

import * as React from "react";
import { toast } from "sonner";
import { CheckCircle2, Plug, Send, XCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import { ContentStatusPill, Field, FormatBadge, Pill } from "@/components/marketing/shared";
import { DraftDetailDialog } from "@/components/marketing/draft-detail-dialog";
import { useContentStore } from "@/components/marketing/store";
import { CONNECTIONS, PUBLISH_LOG, SAFETY_FLAGS, type PublishLogEntry } from "@/components/marketing/mock/workspace";
import { PLATFORM_LABEL, fmtDateTime, getContentDraft, relativeToRef } from "@/lib/mock-data/marketing";

const LOG_TONE = { Posted: "green", Queued: "blue", Failed: "red" } as const;

export function PublishingView() {
  const { drafts, setStatus } = useContentStore();
  const [draftId, setDraftId] = React.useState<string | null>(null);
  const [logId, setLogId] = React.useState<string | null>(null);

  const ready = drafts.filter((d) => d.status === "approved" || d.status === "scheduled");
  const log = PUBLISH_LOG;
  const entry = log.find((l) => l.id === logId) ?? null;
  const entryDraft = entry ? getContentDraft(entry.draftId) : undefined;
  const publishingOn = SAFETY_FLAGS.find((f) => f.key === "PUBLISHING_ENABLED")?.on;

  return (
    <>
      <PageHeader
        title="Publishing"
        description="Post now or schedule at the AI-predicted best time to Instagram, Facebook, LinkedIn and X. YouTube video is manual-only; the blog publishes to scalepods.co."
        badge={<Pill label={publishingOn ? "Live publishing" : "Simulated (PUBLISHING_ENABLED off)"} tone={publishingOn ? "green" : "orange"} />}
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        <KpiCard label="Ready to publish" value={String(ready.length)} context="Approved or scheduled" trend="flat" trendValue="0" icon={<Send className="size-4" />} />
        <KpiCard label="Posted (30d)" value={String(log.filter((l) => l.status === "Posted").length)} context="Successful publishes" trend="up" trendValue="+2" icon={<CheckCircle2 className="size-4" />} />
        <KpiCard label="Queued" value={String(log.filter((l) => l.status === "Queued").length)} context="Waiting on their slot" trend="flat" trendValue="0" icon={<Send className="size-4" />} />
        <KpiCard label="Failed" value={String(log.filter((l) => l.status === "Failed").length)} context="Needs a retry" trend="flat" trendValue="0" trendGood={false} icon={<XCircle className="size-4" />} />
      </div>

      <Tabs defaultValue="ready">
        <TabsList>
          <TabsTrigger value="ready">Ready to publish ({ready.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity log ({log.length})</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="ready" className="space-y-2 pt-2">
          {ready.length === 0 ? (
            <EmptyState icon={Send} title="Nothing approved yet" description="Approve drafts in Creative Review and they land here." />
          ) : (
            ready.map((d) => (
              <Card key={d.id} className="py-3">
                <CardContent className="flex flex-wrap items-center gap-3 px-4">
                  <button type="button" onClick={() => setDraftId(d.id)} className="min-w-0 flex-1 text-left">
                    <div className="mb-1 flex flex-wrap items-center gap-1.5">
                      <PlatformBadge platform={d.platform} />
                      <FormatBadge format={d.format} />
                      <ContentStatusPill status={d.status} />
                    </div>
                    <p className="truncate text-sm font-semibold">{d.title}</p>
                    <p className="text-xs text-muted-foreground">Best-time slot {fmtDateTime(d.targetDate)}</p>
                  </button>
                  <div className="flex gap-2">
                    {d.status === "approved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setStatus(d.id, "scheduled");
                          toast.success("Scheduled at the predicted best time");
                        }}
                      >
                        Schedule
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => {
                        setStatus(d.id, "published");
                        toast.info("Publish simulated", { description: "PUBLISHING_ENABLED is off, so no live post was made." });
                      }}
                    >
                      <Send className="size-4" />
                      Post now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="activity" className="pt-2">
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {log.map((l) => {
                  const d = getContentDraft(l.draftId);
                  return (
                    <TableRow key={l.id} className="cursor-pointer" onClick={() => setLogId(l.id)}>
                      <TableCell className="max-w-64 truncate font-medium">{d?.title}</TableCell>
                      <TableCell>{d && <PlatformBadge platform={d.platform} />}</TableCell>
                      <TableCell>{l.mode}</TableCell>
                      <TableCell>
                        <Pill label={l.status} tone={LOG_TONE[l.status]} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">{relativeToRef(l.at)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="connections" className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          {CONNECTIONS.map((c) => (
            <Card key={c.platform} className="py-3">
              <CardContent className="space-y-2 px-4 text-sm">
                <div className="flex items-center justify-between">
                  <PlatformBadge platform={c.platform} />
                  <Pill label={c.status} tone={c.status === "Connected" ? "green" : "orange"} />
                </div>
                <p className="flex items-center gap-1.5 font-medium">
                  <Plug className="size-3.5 text-muted-foreground" />
                  {c.route}
                </p>
                <p className="text-xs text-muted-foreground">
                  {c.account} · synced {relativeToRef(c.lastSync)}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={!!entry} onOpenChange={(o) => !o && setLogId(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {entry && <LogBody entry={entry} onOpenDraft={() => { const id = entry.draftId; setLogId(null); setDraftId(id); }} title={entryDraft?.title ?? ""} platform={entryDraft ? PLATFORM_LABEL[entryDraft.platform] : ""} />}
        </DialogContent>
      </Dialog>

      <DraftDetailDialog draftId={draftId} open={draftId !== null} onOpenChange={(o) => !o && setDraftId(null)} />
    </>
  );
}

function LogBody({ entry, title, platform, onOpenDraft }: { entry: PublishLogEntry; title: string; platform: string; onOpenDraft: () => void }) {
  const route = CONNECTIONS.find((c) => c.platform === getContentDraft(entry.draftId)?.platform)?.route;
  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Pill label={entry.status} tone={LOG_TONE[entry.status]} />
          <Pill label={entry.mode} />
        </div>
        <DialogTitle className="mt-1 text-lg">{title}</DialogTitle>
        <DialogDescription>Publish attempt details</DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trace">Trace</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-2">
          <div className="divide-y rounded-lg border px-3 text-sm">
            <Field label="Platform">{platform}</Field>
            <Field label="Route">{route}</Field>
            <Field label="Mode">{entry.mode}</Field>
            <Field label="Time">{fmtDateTime(entry.at)}</Field>
            <Field label="Result">{entry.note}</Field>
          </div>
        </TabsContent>
        <TabsContent value="trace" className="pt-2">
          <ol className="space-y-2 text-sm">
            <li>1. Draft approved by checker</li>
            <li>2. Brand overlay stamp applied (logo, one-liner, handle)</li>
            <li>3. {entry.mode === "Post now" ? "Immediate publish requested" : "Best-time slot chosen from the learning engine"}</li>
            <li>4. {entry.status === "Posted" ? "Platform accepted the post" : entry.status === "Failed" ? "Platform rejected the post, retry available" : "Waiting for the slot"}</li>
          </ol>
        </TabsContent>
      </Tabs>
      <DialogFooter>
        <Button variant="outline" onClick={onOpenDraft}>
          Open draft
        </Button>
        {entry.status === "Failed" && <Button onClick={() => toast.info("Retry simulated")}>Retry publish</Button>}
      </DialogFooter>
    </>
  );
}
