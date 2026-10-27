"use client";

import * as React from "react";
import { toast } from "sonner";
import { AlertTriangle, Bot, CheckCircle2, RefreshCw, Smartphone, Star } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/badges";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Inbox as InboxIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CC_CASES, CC_CHANNELS, CC_REF_DATE, ccAgo, type CcCase } from "@/lib/mock-data/customer-care";
import { CaseDialog } from "./case-dialog";
import { ChannelBadge, Pill, PriorityBadge, SentimentBadge } from "./shared";

export function useCases() {
  const [cases, setCases] = React.useState<CcCase[]>(CC_CASES);
  const update = React.useCallback((next: CcCase) => setCases((p) => p.map((c) => (c.id === next.id ? next : c))), []);
  return { cases, setCases, update };
}

export function InboxPage() {
  const { cases, setCases, update } = useCases();
  const [q, setQ] = React.useState("");
  const [channel, setChannel] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [sentiment, setSentiment] = React.useState("all");
  const [openId, setOpenId] = React.useState<string | null>(null);

  const rows = cases.filter((c) => {
    if (channel !== "all" && c.channel !== channel) return false;
    if (status !== "all" && c.status.toLowerCase() !== status) return false;
    if (sentiment !== "all" && c.sentiment !== sentiment) return false;
    const s = q.trim().toLowerCase();
    return !s || [c.customer, c.msg, c.orderId, c.caseNo, c.topic].some((v) => v.toLowerCase().includes(s));
  });
  const open = cases.find((c) => c.id === openId) ?? null;

  return (
    <>
      <PageHeader
        title="Support Inbox"
        description="AI support streams across WhatsApp, Shopify, Instagram DM and website chat."
        badge={<Pill tone="blue"><Bot className="mr-1 inline size-3" />AI first-response</Pill>}
        actions={
          <Button variant="outline" size="sm" onClick={() => toast.info("Syncing all open cases from WhatsApp, Shopify and Instagram DM...")}>
            <RefreshCw className="size-3.5" /> Sync inbox
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div>
          <ListToolbar searchValue={q} onSearchChange={setQ} placeholder="Search customer, order, topic...">
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Channel" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All channels</SelectItem>
                {CC_CHANNELS.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sentiment} onValueChange={setSentiment}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Sentiment" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sentiment</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </ListToolbar>

          {rows.length === 0 ? (
            <EmptyState icon={InboxIcon} title="No conversations" description="Try changing the filters." />
          ) : (
            <Card className="py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Handled by</TableHead>
                    <TableHead className="text-right">Opened</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((c) => (
                    <TableRow
                      key={c.id}
                      className={cn("cursor-pointer", c.escalation !== "None" && "border-l-2 border-l-destructive")}
                      onClick={() => setOpenId(c.id)}
                    >
                      <TableCell>
                        <div className="font-medium">{c.customer}</div>
                        <div className="text-xs text-muted-foreground">{c.caseNo} · {c.orderId}</div>
                      </TableCell>
                      <TableCell><ChannelBadge channel={c.channel} /></TableCell>
                      <TableCell className="max-w-64">
                        <div className="truncate text-sm">{c.msg}</div>
                        {c.escalation !== "None" && <div className="text-[11px] font-semibold text-destructive">{c.escalation}</div>}
                      </TableCell>
                      <TableCell><StatusBadge status={c.status.toLowerCase()} /></TableCell>
                      <TableCell><PriorityBadge priority={c.priority} /></TableCell>
                      <TableCell><SentimentBadge sentiment={c.sentiment} /></TableCell>
                      <TableCell className="text-xs">{c.handledBy}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">{ccAgo(c.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>

        <SurveySimulator
          onTicket={(c) => {
            setCases((p) => [c, ...p]);
            setOpenId(c.id);
          }}
          nextNo={cases.length + 1}
        />
      </div>

      <CaseDialog c={open} onClose={() => setOpenId(null)} onChange={update} />
    </>
  );
}

function SurveySimulator({ onTicket, nextNo }: { onTicket: (c: CcCase) => void; nextNo: number }) {
  const [name, setName] = React.useState("Nisha Gupta");
  const [rating, setRating] = React.useState(0);
  const [text, setText] = React.useState("");
  const [created, setCreated] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) return;
    if (rating >= 4) {
      toast.success(`${rating} star rating pushed live to Google, Amazon and Nykaa review pages.`);
      setRating(0);
      setText("");
      return;
    }
    const at = CC_REF_DATE;
    const msg = `[Auto-Intercept: ${rating} star] ${text || "Negative experience reported."}`;
    onTicket({
      id: `case-${nextNo}`,
      caseNo: `CC-${4100 + nextNo}`,
      customer: name,
      phone: "+91 98100 00000",
      email: "survey@shills.in",
      channel: "whatsapp",
      subject: `Auto-intercept: ${rating} star survey rating`,
      msg,
      status: "Open",
      escalation: "Low CSAT Intercept",
      createdAt: at,
      updatedAt: at,
      priority: "high",
      sentiment: "negative",
      topic: "Low CSAT intercept",
      handledBy: "AI",
      assignee: "AI Agent",
      firstResponseMin: 0.4,
      resolutionHours: null,
      csat: rating,
      orderId: "#SH-9840",
      product: "Nail Gel Set #12 (Classic Nudes)",
      orderValue: 999,
      carrier: "Delhivery",
      trackId: "DEL-9840-X",
      tags: ["csat-intercept"],
      aiSummary: "Survey rating below 4 intercepted before reaching public platforms.",
      aiConfidence: 0.9,
      thread: [
        { sender: "customer", msg: `Rating: ${rating} star - ${text || "Negative experience."}`, at },
        { sender: "ai", msg: `Hi ${name}, we're really sorry to hear about your experience! A support manager has been assigned to your case. We'll make this right within 2 hours. Case ID: #${nextNo}`, at },
      ],
    });
    setCreated(true);
    toast.error(`${rating} star intercepted. Public review blocked, support ticket created.`);
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Smartphone className="size-4 text-primary" /> Post-delivery survey simulator
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Simulate a Day 3 check-in. 4-5 stars route to public platforms; 1-3 stars create a private support ticket.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Customer name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Star rating</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" aria-label={`${n} stars`} onClick={() => { setRating(n); setCreated(false); }}>
                  <Star className={cn("size-6", n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Comments</label>
            <Textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder={rating >= 4 ? "Positive review..." : "What went wrong?"} />
          </div>
          <Button type="submit" disabled={!rating} className="w-full">Submit survey response</Button>
        </form>
        {rating >= 4 && (
          <div className="mt-3 rounded-lg border border-success/30 bg-success/10 p-3 text-xs">
            <p className="flex items-center gap-1 font-semibold text-success"><CheckCircle2 className="size-3" /> ROUTING TO PUBLIC PLATFORMS</p>
            <p className="mt-1 text-muted-foreground">AI will push this {rating} star review to Google, Amazon and Nykaa.</p>
          </div>
        )}
        {rating > 0 && rating <= 3 && !created && (
          <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs">
            <p className="flex items-center gap-1 font-semibold text-destructive"><AlertTriangle className="size-3" /> NEGATIVE INTERCEPT - PUBLIC BLOCKED</p>
            <p className="mt-1 text-muted-foreground">Submitting creates a high-priority support ticket instead of posting publicly.</p>
          </div>
        )}
        {created && <p className="mt-3 text-center text-xs font-semibold">Ticket created and CS manager notified.</p>}
      </CardContent>
    </Card>
  );
}
