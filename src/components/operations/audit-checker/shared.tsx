"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AuditKind, AuditStatus, Decision, FieldStatus } from "@/lib/mock-data/audit-checker";

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const inrCompact = (n: number) =>
  n >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` : n >= 1e5 ? `₹${(n / 1e5).toFixed(2)} L` : inr(n);

export const fmtDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }) : "—";
export const fmtDateTime = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC" })
    : "—";

export const ACCENT = {
  blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  green: "bg-success/15 text-success",
  purple: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  orange: "bg-warning/15 text-warning",
  red: "bg-destructive/15 text-destructive",
  neutral: "bg-muted text-muted-foreground",
} as const;
export type Accent = keyof typeof ACCENT;

export const STATUS_ACCENT: Record<FieldStatus | AuditStatus, Accent> = {
  Match: "green",
  "Partial Match": "orange",
  Mismatch: "red",
  Critical: "red",
};
export const STATUS_BAR: Record<FieldStatus | AuditStatus, string> = {
  Match: "bg-success",
  "Partial Match": "bg-warning",
  Mismatch: "bg-destructive/70",
  Critical: "bg-destructive",
};
const DECISION_ACCENT: Record<Decision, Accent> = { Pending: "orange", Approved: "green", Rejected: "red" };

export function Pill({ label, accent, className }: { label: string; accent: Accent; className?: string }) {
  return (
    <Badge variant="secondary" className={cn("text-[10px] font-medium hover:bg-transparent", ACCENT[accent], className)}>
      {label}
    </Badge>
  );
}
export const StatusPill = ({ status }: { status: FieldStatus | AuditStatus }) => (
  <Pill label={status} accent={STATUS_ACCENT[status]} className={status === "Critical" ? "font-bold" : ""} />
);
export const DecisionPill = ({ decision }: { decision: Decision }) => (
  <Pill label={decision} accent={DECISION_ACCENT[decision]} />
);
export const KIND_ACCENT: Record<AuditKind, Accent> = { purchase: "blue", sales: "purple", quick: "neutral" };

export function ScoreBadge({ score }: { score: number }) {
  const accent: Accent = score >= 90 ? "green" : score >= 75 ? "blue" : score >= 60 ? "orange" : "red";
  return <Pill label={`${score}%`} accent={accent} className="tabular-nums" />;
}

export function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-0.5 break-words text-sm font-medium">{value}</div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h4>
      {children}
    </section>
  );
}

/** Horizontal stacked bar with a legend. */
export function SegmentedBar({ segments }: { segments: { label: string; value: number; className: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-muted">
        {segments.map((s) => (
          <div key={s.label} className={s.className} style={{ width: `${(s.value / total) * 100}%` }} title={`${s.label}: ${s.value}`} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn("size-2 rounded-full", s.className)} />
            {s.label} <span className="font-medium text-foreground tabular-nums">{s.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Simple labelled horizontal bar row. */
export function HBar({ label, value, max, display, className = "bg-primary", sub }: { label: React.ReactNode; value: number; max: number; display?: string; className?: string; sub?: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 text-xs">
      <div className="truncate" title={typeof label === "string" ? label : undefined}>
        {label}
        {sub && <span className="block text-[10px] text-muted-foreground">{sub}</span>}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", className)} style={{ width: `${max ? Math.max(2, (value / max) * 100) : 0}%` }} />
      </div>
      <span className="w-14 text-right font-medium tabular-nums">{display ?? value}</span>
    </div>
  );
}

export function ChartCard({ title, subtitle, children, className }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={cn("gap-3 py-4", className)}>
      <CardContent className="px-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {subtitle && <p className="mb-3 text-xs text-muted-foreground">{subtitle}</p>}
        {!subtitle && <div className="mb-3" />}
        {children}
      </CardContent>
    </Card>
  );
}

/** Stacked column chart (clean vs issues per bucket). */
export function StackedColumns({ data }: { data: { label: string; a: number; b: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.a + d.b));
  return (
    <div>
      <div className="flex h-40 items-end gap-1.5">
        {data.map((d) => (
          <div key={d.label} className="flex h-full flex-1 flex-col justify-end" title={`${d.label}: ${d.a} clean, ${d.b} with issues`}>
            <div className="flex w-full flex-col justify-end overflow-hidden rounded-t" style={{ height: `${((d.a + d.b) / max) * 100}%` }}>
              <div className="bg-destructive/70" style={{ flex: d.b }} />
              <div className="bg-success" style={{ flex: d.a }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-1.5">
        {data.map((d, i) => (
          <span key={d.label} className="flex-1 text-center text-[9px] text-muted-foreground">
            {i % 2 === 0 ? d.label : ""}
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-success" />Clean / partial</span>
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-destructive/70" />Mismatch / critical</span>
      </div>
    </div>
  );
}
