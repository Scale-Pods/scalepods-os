"use client";

import * as React from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCheck, KanbanSquare, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { useOrg } from "@/lib/org-context";
import { Field, Pill, ContentStatusPill } from "@/components/marketing/shared";
import { DraftDetailDialog } from "@/components/marketing/draft-detail-dialog";
import { useContentStore } from "@/components/marketing/store";
import {
  BOARD_COLUMNS,
  PRIORITY_TONE,
  type BoardColumnId,
  type BoardTicket,
} from "@/components/marketing/mock/workspace";
import { cn } from "@/lib/utils";
import { fmtDate, fmtDateTime, getContentDraft, reviewerFor } from "@/lib/mock-data/marketing";

const ORDER: BoardColumnId[] = ["backlog", "progress", "review", "done"];

function TicketCard({ t, onOpen }: { t: BoardTicket; onOpen: (id: string) => void }) {
  return (
    <button type="button" onClick={() => onOpen(t.id)} className="w-full text-left">
      <Card className="gap-2 py-3 transition-colors hover:border-ring/40">
        <CardContent className="space-y-2 px-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="font-mono">{t.key}</span>
            <span className={cn("rounded px-1.5 py-0.5 capitalize", PRIORITY_TONE[t.priority])}>{t.priority}</span>
          </div>
          <p className="text-sm font-medium leading-snug">{t.title}</p>
          {t.rejectionNote && <p className="rounded bg-destructive/10 px-2 py-1 text-[11px] text-destructive">Sent back: {t.rejectionNote}</p>}
          <div className="flex flex-wrap items-center gap-1">
            <Pill label={t.type} tone="blue" className="capitalize" />
            {t.labels.slice(0, 2).map((l) => (
              <Pill key={l} label={l} />
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{t.assignee}</span>
            <span>Due {fmtDate(t.dueDate)}</span>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}

export function BoardView() {
  const { org } = useOrg();
  const { tickets, moveTicket, setStatus } = useContentStore();
  const [search, setSearch] = React.useState("");
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [draftId, setDraftId] = React.useState<string | null>(null);

  const filtered = tickets.filter(
    (t) => !search.trim() || t.title.toLowerCase().includes(search.toLowerCase()) || t.key.toLowerCase().includes(search.toLowerCase())
  );
  const open = tickets.find((t) => t.id === openId) ?? null;
  const reviewCount = tickets.filter((t) => t.column === "review").length;
  const doneCount = tickets.filter((t) => t.column === "done").length;
  const reworkCount = tickets.filter((t) => t.rejectionNote && t.column !== "done").length;

  function move(t: BoardTicket, to: BoardColumnId) {
    if (to === "done") {
      const reviewer = reviewerFor(org.id, t.reviewerIdx);
      moveTicket(t.id, to);
      if (t.linkedDraftId) setStatus(t.linkedDraftId, "approved");
      toast.success(`${t.key} accepted`, { description: `Reviewer gate passed (${reviewer.name} or a full-access admin).` });
      return;
    }
    moveTicket(t.id, to);
    if (to === "progress" && t.column === "review") {
      toast.info(`${t.key} sent back to In progress`);
      if (t.linkedDraftId) setStatus(t.linkedDraftId, "sent_back");
    } else if (to === "review") {
      toast.success(`${t.key} submitted for review`);
      if (t.linkedDraftId) setStatus(t.linkedDraftId, "review");
    } else {
      toast.success(`${t.key} moved to ${BOARD_COLUMNS.find((c) => c.id === to)?.label}`);
    }
  }

  return (
    <>
      <PageHeader title="Board" description="Maker-checker kanban. Only the assigned reviewer (or a full-access admin) can move a ticket into Done." />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <KpiCard label="Open tickets" value={String(tickets.length - doneCount)} context={`${tickets.length} total`} trend="flat" trendValue="0" icon={<KanbanSquare className="size-4" />} />
        <KpiCard label="In review" value={String(reviewCount)} context="Waiting on the checker" trend="flat" trendValue="0" icon={<ShieldCheck className="size-4" />} />
        <KpiCard label="Rework" value={String(reworkCount)} context="Sent back with a note" trend="down" trendValue="-1" trendGood={false} icon={<CheckCheck className="size-4" />} />
      </div>

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search tickets by key or title..." />

      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="pt-2">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {BOARD_COLUMNS.map((col) => {
              const items = filtered.filter((t) => t.column === col.id);
              return (
                <div key={col.id} className="rounded-lg border bg-muted/20 p-2">
                  <div className="mb-2 flex items-center justify-between px-1">
                    <div>
                      <p className="text-sm font-semibold">{col.label}</p>
                      <p className="text-[11px] text-muted-foreground">{col.hint}</p>
                    </div>
                    <Pill label={String(items.length)} />
                  </div>
                  <div className="space-y-2">
                    {items.map((t) => (
                      <TicketCard key={t.id} t={t} onOpen={setOpenId} />
                    ))}
                    {items.length === 0 && <p className="px-1 py-4 text-center text-xs text-muted-foreground">No tickets</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="list" className="pt-2">
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Column</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id} className="cursor-pointer" onClick={() => setOpenId(t.id)}>
                    <TableCell className="font-mono text-xs">{t.key}</TableCell>
                    <TableCell className="max-w-72 truncate font-medium">{t.title}</TableCell>
                    <TableCell className="capitalize">{t.type}</TableCell>
                    <TableCell>
                      <span className={cn("rounded px-1.5 py-0.5 text-[11px] capitalize", PRIORITY_TONE[t.priority])}>{t.priority}</span>
                    </TableCell>
                    <TableCell>{BOARD_COLUMNS.find((c) => c.id === t.column)?.label}</TableCell>
                    <TableCell>{t.assignee}</TableCell>
                    <TableCell>{fmtDate(t.dueDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {open && <TicketBody t={open} orgId={org.id} onMove={move} onOpenDraft={(id) => { setOpenId(null); setDraftId(id); }} />}
        </DialogContent>
      </Dialog>

      <DraftDetailDialog draftId={draftId} open={draftId !== null} onOpenChange={(o) => !o && setDraftId(null)} />
    </>
  );
}

function TicketBody({
  t,
  orgId,
  onMove,
  onOpenDraft,
}: {
  t: BoardTicket;
  orgId: string;
  onMove: (t: BoardTicket, to: BoardColumnId) => void;
  onOpenDraft: (id: string) => void;
}) {
  const reviewer = reviewerFor(orgId, t.reviewerIdx);
  const draft = t.linkedDraftId ? getContentDraft(t.linkedDraftId) : undefined;
  const idx = ORDER.indexOf(t.column);
  const prev = idx > 0 ? ORDER[idx - 1] : null;
  const next = idx < ORDER.length - 1 ? ORDER[idx + 1] : null;

  return (
    <>
      <DialogHeader>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{t.key}</span>
          <Pill label={t.type} tone="blue" className="capitalize" />
          <span className={cn("rounded px-1.5 py-0.5 text-[11px] capitalize", PRIORITY_TONE[t.priority])}>{t.priority}</span>
          <Pill label={BOARD_COLUMNS.find((c) => c.id === t.column)!.label} tone={t.column === "done" ? "green" : t.column === "review" ? "orange" : "neutral"} />
        </div>
        <DialogTitle className="mt-1 text-lg">{t.title}</DialogTitle>
        <DialogDescription>{t.description}</DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="draft">Linked draft</TabsTrigger>
          <TabsTrigger value="activity">Activity ({t.activity.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="pt-2">
          <div className="divide-y rounded-lg border px-3 text-sm">
            <Field label="Assignee (maker)">{t.assignee}</Field>
            <Field label="Reviewer (checker)">{reviewer.name}</Field>
            <Field label="Due">{fmtDate(t.dueDate)}</Field>
            <Field label="Labels">{t.labels.join(", ")}</Field>
            {t.acceptedAt && <Field label="Accepted">{fmtDateTime(t.acceptedAt)}</Field>}
            {t.rejectionNote && <Field label="Rejection note">{t.rejectionNote}</Field>}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Done gate: only {reviewer.name} (the assigned checker) or an admin with full board access can accept this ticket. Sending a ticket back out of
            Review clears the submission and returns it to In progress.
          </p>
        </TabsContent>
        <TabsContent value="draft" className="pt-2">
          {draft ? (
            <Card className="py-3">
              <CardContent className="space-y-2 px-4 text-sm">
                <div className="flex items-center gap-2">
                  <ContentStatusPill status={draft.status} />
                  <span className="font-medium">{draft.title}</span>
                </div>
                <p className="text-muted-foreground">{draft.hook}</p>
                <Button size="sm" variant="outline" onClick={() => onOpenDraft(draft.id)}>
                  Open draft
                </Button>
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">No linked draft.</p>
          )}
        </TabsContent>
        <TabsContent value="activity" className="pt-2">
          <ol className="space-y-3">
            {t.activity.map((a, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-muted-foreground/50" />
                <div>
                  <p>{a.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.actor} · {fmtDateTime(a.at)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </TabsContent>
      </Tabs>

      <DialogFooter className="flex-wrap gap-2">
        {prev && t.column !== "done" && (
          <Button variant="outline" onClick={() => onMove(t, prev)}>
            <ArrowLeft className="size-4" />
            Move to {BOARD_COLUMNS.find((c) => c.id === prev)?.label}
          </Button>
        )}
        {next && (
          <Button onClick={() => onMove(t, next)}>
            {next === "done" ? "Accept and mark done" : `Move to ${BOARD_COLUMNS.find((c) => c.id === next)?.label}`}
            <ArrowRight className="size-4" />
          </Button>
        )}
      </DialogFooter>
    </>
  );
}
