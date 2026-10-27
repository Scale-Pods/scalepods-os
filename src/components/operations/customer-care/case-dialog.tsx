"use client";

import * as React from "react";
import { toast } from "sonner";
import { ArrowUpRight, Package, RotateCcw, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/badges";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { ccAgo, ccFmtDateTime, type CcCase } from "@/lib/mock-data/customer-care";
import { Bar, Bubble, ChannelBadge, Field, inr, Pill, PriorityBadge, SentimentBadge } from "./shared";

type CaseDialogProps = { c: CcCase | null; onClose: () => void; onChange: (next: CcCase) => void };

export function CaseDialog(props: CaseDialogProps) {
  return props.c ? <CaseDialogInner key={props.c.id} {...props} c={props.c} /> : null;
}

function CaseDialogInner({ c, onClose, onChange }: CaseDialogProps & { c: CcCase }) {
  const [draft, setDraft] = React.useState("");
  const [tab, setTab] = React.useState("conversation");

  const sendOverride = () => {
    if (!draft.trim()) return;
    onChange({
      ...c,
      handledBy: "AI + Human",
      thread: [...c.thread, { sender: "agent", msg: `[Human Override] ${draft.trim()}`, at: new Date(Date.parse("2026-10-27T12:00:00Z") + c.thread.length * 60_000).toISOString() }],
    });
    setDraft("");
    toast.success("Manual override sent on behalf of the support team.");
  };

  const escalate = () => {
    onChange({ ...c, escalation: "Escalated - CS Manager", priority: "urgent" });
    toast.info("Case escalated to the CS Manager. Notification sent.");
  };

  const toggle = () => {
    const next = c.status === "Open" ? "Resolved" : "Open";
    onChange({ ...c, status: next, escalation: next === "Resolved" ? "None" : c.escalation });
    toast.success(next === "Resolved" ? "Case marked resolved." : "Case reopened.");
  };

  return (
    <Dialog open={!!c} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={DETAIL_DIALOG_CLASS}>
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            {c.customer}
            <span className="text-xs font-normal text-muted-foreground">{c.caseNo}</span>
            <StatusBadge status={c.status.toLowerCase()} />
          </DialogTitle>
          <DialogDescription>{c.subject}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <ChannelBadge channel={c.channel} />
          <PriorityBadge priority={c.priority} />
          <SentimentBadge sentiment={c.sentiment} />
          {c.escalation !== "None" && <Pill tone="red">{c.escalation}</Pill>}
          <Pill tone="neutral">{c.handledBy}</Pill>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => toast.success("Refund flow initiated for this case.")}>
            <RotateCcw className="size-3.5" /> Refund
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Replacement order triggered.")}>
            <Package className="size-3.5" /> Replace
          </Button>
          {c.status === "Open" && (
            <Button size="sm" variant="outline" onClick={escalate}>
              <ArrowUpRight className="size-3.5" /> Escalate
            </Button>
          )}
          <Button size="sm" onClick={toggle}>
            {c.status === "Open" ? "Resolve" : "Reopen"}
          </Button>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
            <TabsTrigger value="order">Order &amp; shipment</TabsTrigger>
            <TabsTrigger value="ai">AI analysis</TabsTrigger>
            <TabsTrigger value="meta">Customer &amp; SLA</TabsTrigger>
          </TabsList>

          <TabsContent value="conversation" className="mt-3 space-y-3">
            <div className="max-h-80 space-y-2 overflow-y-auto rounded-lg border p-3">
              {c.thread.map((m, i) => (
                <Bubble key={i} m={m} who={c.customer} />
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendOverride()}
                placeholder="Override AI response or add note..."
              />
              <Button onClick={sendOverride} aria-label="Send">
                <Send className="size-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="order" className="mt-3">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Order">{c.orderId}</Field>
              <Field label="Product">{c.product}</Field>
              <Field label="Order value">{inr(c.orderValue)}</Field>
              <Field label="Carrier">{c.carrier}</Field>
              <Field label="Tracking ID">{c.trackId}</Field>
              <Field label="Topic">{c.topic}</Field>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-3 space-y-3">
            <div className="rounded-lg border bg-muted/40 p-3 text-sm">
              <p className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Sparkles className="size-3" /> AI summary
              </p>
              {c.aiSummary}
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>AI confidence</span>
                <span>{Math.round(c.aiConfidence * 100)}%</span>
              </div>
              <Bar pct={c.aiConfidence * 100} tone={c.aiConfidence > 0.85 ? "green" : "orange"} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {c.tags.map((t) => (
                <Pill key={t} tone="blue">
                  {t}
                </Pill>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="meta" className="mt-3">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Phone">{c.phone}</Field>
              <Field label="Email">{c.email}</Field>
              <Field label="Assignee">{c.assignee}</Field>
              <Field label="Opened">{ccFmtDateTime(c.createdAt)} ({ccAgo(c.createdAt)})</Field>
              <Field label="Last update">{ccFmtDateTime(c.updatedAt)}</Field>
              <Field label="First response">{c.firstResponseMin} min</Field>
              <Field label="Resolution time">{c.resolutionHours != null ? `${c.resolutionHours} hrs` : "Pending"}</Field>
              <Field label="CSAT">{c.csat != null ? `${c.csat} / 5` : "Not rated"}</Field>
              <Field label="Handled by">{c.handledBy}</Field>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
