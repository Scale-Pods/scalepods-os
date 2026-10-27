"use client";

import * as React from "react";
import { Mail, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ConversationEntry, OutreachStatus, RecoveryOutreachRow } from "@/lib/mock-data/receivables";

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export const fmtDateTime = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
    : "—";

// Accent convention: Email blue, WhatsApp green, Voice purple; success green,
// warning orange, failure red, neutral muted.
export const ACCENT = {
  blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  green: "bg-success/15 text-success",
  purple: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  orange: "bg-warning/15 text-warning",
  red: "bg-destructive/15 text-destructive",
  neutral: "bg-muted text-muted-foreground",
} as const;
export type Accent = keyof typeof ACCENT;

export const CHANNEL_META: Record<"email" | "whatsapp" | "call", { label: string; accent: Accent; icon: LucideIcon; bar: string }> = {
  email: { label: "Email", accent: "blue", icon: Mail, bar: "bg-blue-500" },
  whatsapp: { label: "WhatsApp", accent: "green", icon: MessageCircle, bar: "bg-success" },
  call: { label: "Voice", accent: "purple", icon: Phone, bar: "bg-purple-500" },
};

const STATUS_ACCENT: Record<OutreachStatus, Accent> = {
  Queued: "neutral",
  Active: "blue",
  "Awaiting Reply": "orange",
  Replied: "green",
  Closed: "green",
  Disputed: "red",
  "Founder Review": "red",
};

export function RecoveryBadge({ label, accent }: { label: string; accent: Accent }) {
  return (
    <Badge variant="outline" className={cn("border-0 text-[11px]", ACCENT[accent])}>
      {label}
    </Badge>
  );
}

export function StatusPill({ status }: { status: OutreachStatus }) {
  return <RecoveryBadge label={status} accent={STATUS_ACCENT[status]} />;
}

export function SentimentPill({ sentiment }: { sentiment: RecoveryOutreachRow["sentiment"] }) {
  if (!sentiment) return <span className="text-xs text-muted-foreground">—</span>;
  const accent: Accent = sentiment === "Positive" ? "green" : sentiment === "Negative" ? "red" : "neutral";
  return <RecoveryBadge label={sentiment} accent={accent} />;
}

/** Proportional bar row used by the hand-rolled analytics pages (no chart lib). */
export function FunnelRow({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${value === 0 ? 0 : pct}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
}

export interface Segment {
  label: string;
  value: number;
  color: string; // tailwind bg class
}

export function SegmentedBar({ title, segments }: { title: string; segments: Segment[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  return (
    <Card>
      <CardContent className="px-4 py-4">
        <h3 className="mb-3 text-sm font-semibold">{title}</h3>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
          {segments.map((s) => (
            <div key={s.label} className={s.color} style={{ width: `${total ? (s.value / total) * 100 : 0}%` }} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
          {segments.map((s) => (
            <span key={s.label} className="flex items-center gap-1.5 text-xs">
              <span className={cn("size-2 shrink-0 rounded-sm", s.color)} />
              <span className="text-muted-foreground">{s.label}</span>
              <span className="font-medium tabular-nums">{s.value}</span>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SummaryStats({ stats }: { stats: { label: string; value: string; note?: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s) => (
        <Card key={s.label} className="gap-1 py-4">
          <CardContent className="px-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{s.value}</p>
            {s.note && <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-10 text-center text-sm text-muted-foreground">
        {message}
      </TableCell>
    </TableRow>
  );
}

/** First column: bold name over a muted secondary line. */
export function TwoLine({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <>
      <p className="font-medium">{primary}</p>
      <p className="text-xs text-muted-foreground">{secondary}</p>
    </>
  );
}

/** Chat-style bubble. Inbound left, outbound right and green-tinted; both sharp-cornered on the speaker side. */
export function Bubble({
  entry,
  receipt,
}: {
  entry: ConversationEntry;
  receipt?: boolean;
}) {
  const outbound = entry.role === "assistant";
  return (
    <div className={cn("flex", outbound ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-3 py-2 text-sm",
          outbound ? "rounded-tr-sm bg-success/15" : "rounded-tl-sm bg-muted"
        )}
      >
        {entry.stage && <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{entry.stage}</p>}
        <p className="whitespace-pre-wrap">{entry.message}</p>
        <p className="mt-1 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
          {fmtDateTime(entry.timestamp)}
          {outbound && receipt && <span className="text-blue-500">✓✓</span>}
        </p>
      </div>
    </div>
  );
}
