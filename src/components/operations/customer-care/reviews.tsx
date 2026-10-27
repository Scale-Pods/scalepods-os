"use client";

import * as React from "react";
import { toast } from "sonner";
import { Award, Star, ThumbsDown } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { cn } from "@/lib/utils";
import { CC_CASES, CC_REVIEWS, CC_STATS, ccFmtDate, type CcReview } from "@/lib/mock-data/customer-care";
import { CaseDialog } from "./case-dialog";
import { Field, Pill, SentimentBadge, Stars } from "./shared";

export function ReviewsPage() {
  const [q, setQ] = React.useState("");
  const [platform, setPlatform] = React.useState("all");
  const [rating, setRating] = React.useState("all");
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [caseId, setCaseId] = React.useState<string | null>(null);
  const [replies, setReplies] = React.useState<Record<string, string>>({});

  const rows = CC_REVIEWS.filter((r) => {
    if (platform !== "all" && r.platform !== platform) return false;
    if (rating === "pos" && r.rating < 4) return false;
    if (rating === "neg" && r.rating >= 4) return false;
    const s = q.trim().toLowerCase();
    return !s || [r.customer, r.text, r.product].some((v) => v.toLowerCase().includes(s));
  });
  const review = CC_REVIEWS.find((r) => r.id === openId) ?? null;
  const linked = CC_CASES.find((c) => c.id === caseId) ?? null;
  const platforms = [...new Set(CC_REVIEWS.map((r) => r.platform))];

  return (
    <>
      <PageHeader title="Review Engine" description="4-5 star reviews are routed to marketplaces. 1-3 star ratings are privately intercepted into support tickets." />
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="CSAT" value={`${CC_STATS.csat} / 5`} context={`Avg public rating ${CC_STATS.avgRating}`} icon={<Star className="size-4" />} iconClassName="bg-warning/15 text-warning" />
        <KpiCard label="Public reviews" value={String(CC_STATS.totalReviews)} context={`${platforms.length} platforms`} icon={<Award className="size-4" />} iconClassName="bg-primary/15 text-primary" />
        <KpiCard label="Intercepted" value={String(CC_STATS.negativeIntercepted)} context="Not public" icon={<ThumbsDown className="size-4" />} iconClassName="bg-destructive/15 text-destructive" />
      </div>

      <div className="mt-4">
        <ListToolbar searchValue={q} onSearchChange={setQ} placeholder="Search reviews...">
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Platform" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All platforms</SelectItem>
              {platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={rating} onValueChange={setRating}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Rating" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ratings</SelectItem>
              <SelectItem value="pos">4-5 stars</SelectItem>
              <SelectItem value="neg">1-3 stars</SelectItem>
            </SelectContent>
          </Select>
        </ListToolbar>

        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((r) => (
            <Card key={r.id} className={cn("cursor-pointer gap-2 border-l-4 py-4 hover:shadow-md", r.rating >= 4 ? "border-l-success" : "border-l-destructive")} onClick={() => setOpenId(r.id)}>
              <CardContent className="space-y-2 px-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">{r.customer}</p>
                    <p className="text-xs text-muted-foreground">{r.platform} · {ccFmtDate(r.date)}</p>
                  </div>
                  <Stars rating={r.rating} size={12} />
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{r.text}</p>
                <div className="flex flex-wrap gap-1.5">
                  {r.intercepted && <Pill tone="red">Intercepted - not public</Pill>}
                  {r.reply ? <Pill tone="green">Replied</Pill> : r.rating >= 4 && <Pill tone="orange">Awaiting reply</Pill>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {review && (
        <ReviewDialog
          r={review}
          reply={replies[review.id] ?? review.reply}
          onReply={(t) => setReplies((p) => ({ ...p, [review.id]: t }))}
          onOpenCase={() => { setCaseId(review.linkedCaseId); setOpenId(null); }}
          onClose={() => setOpenId(null)}
        />
      )}
      <CaseDialog c={linked} onClose={() => setCaseId(null)} onChange={() => {}} />
    </>
  );
}

function ReviewDialog({ r, reply, onReply, onOpenCase, onClose }: { r: CcReview; reply: string | null; onReply: (t: string) => void; onOpenCase: () => void; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={DETAIL_DIALOG_CLASS}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">{r.customer} <Stars rating={r.rating} /></DialogTitle>
          <DialogDescription>{r.platform} review · {ccFmtDate(r.date)}</DialogDescription>
        </DialogHeader>
        <p className="rounded-lg bg-muted/50 p-3 text-sm">{r.text}</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Product">{r.product}</Field>
          <Field label="Platform">{r.platform}</Field>
          <Field label="Sentiment"><SentimentBadge sentiment={r.sentiment} /></Field>
          <Field label="Verified purchase">{r.verifiedPurchase ? "Yes" : "No"}</Field>
        </div>
        {reply ? (
          <div className="rounded-lg border p-3 text-sm"><span className="font-semibold text-primary">Brand reply: </span>{reply}</div>
        ) : r.rating >= 4 ? (
          <Button onClick={() => { onReply(`Thank you ${r.customer.split(" ")[0]}, we are delighted you enjoy it!`); toast.success("AI reply drafted and posted to the review platform."); }}>AI auto-reply</Button>
        ) : null}
        {r.intercepted && (
          <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">
            <span>Intercepted into a private support ticket. This review is not public.</span>
            <Button size="sm" variant="outline" onClick={onOpenCase}>Open ticket</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
