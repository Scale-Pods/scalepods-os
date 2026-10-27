"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AbcClass, AlertSeverity, PoStatus, StockStatus } from "@/lib/mock-data/inventory";

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
export const inrCompact = (n: number) =>
  n >= 10_000_000 ? `₹${(n / 10_000_000).toFixed(2)}Cr` : n >= 100_000 ? `₹${(n / 100_000).toFixed(2)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${Math.round(n)}`;
export const num = (n: number) => n.toLocaleString("en-IN");
export const fmtDate = (iso: string | null) =>
  iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }) : "—";

const TONES = {
  green: "bg-success/15 text-success",
  orange: "bg-warning/15 text-warning",
  red: "bg-destructive/15 text-destructive",
  blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  purple: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  neutral: "bg-muted text-muted-foreground",
} as const;
export type Tone = keyof typeof TONES;

export function Pill({ tone = "neutral", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <Badge variant="outline" className={cn("border-0 text-[11px] whitespace-nowrap", TONES[tone], className)}>
      {children}
    </Badge>
  );
}

const STOCK_TONE: Record<StockStatus, Tone> = { "Out of Stock": "red", Critical: "red", "Low Stock": "orange", Healthy: "green", Overstock: "blue" };
export const StockPill = ({ status }: { status: StockStatus }) => <Pill tone={STOCK_TONE[status]}>{status}</Pill>;

const ABC_TONE: Record<AbcClass, Tone> = { A: "green", B: "orange", C: "neutral" };
export const AbcPill = ({ cls }: { cls: AbcClass }) => <Pill tone={ABC_TONE[cls]}>Class {cls}</Pill>;

const PO_TONE: Record<PoStatus, Tone> = { Draft: "neutral", Ordered: "blue", "In Transit": "purple", Received: "green", Delayed: "red", Cancelled: "neutral" };
export const PoPill = ({ status }: { status: PoStatus }) => <Pill tone={PO_TONE[status]}>{status}</Pill>;

const SEV_TONE: Record<AlertSeverity, Tone> = { critical: "red", warning: "orange", info: "blue" };
export const SeverityPill = ({ severity }: { severity: AlertSeverity }) => <Pill tone={SEV_TONE[severity]} className="capitalize">{severity}</Pill>;

export function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm font-medium">{value}</div>
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

export function ChartCard({ title, description, children, className }: { title: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={cn("gap-3 py-4", className)}>
      <CardHeader className="px-4">
        <CardTitle className="text-sm">{title}</CardTitle>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="px-4">{children}</CardContent>
    </Card>
  );
}

/** Horizontal bar row: label, proportional bar, value. */
export function BarRow({ label, value, max, display, barClass = "bg-primary", onClick }: { label: React.ReactNode; value: number; max: number; display?: React.ReactNode; barClass?: string; onClick?: () => void }) {
  const pct = max > 0 ? Math.max(2, (value / max) * 100) : 0;
  return (
    <div className={cn("grid grid-cols-[minmax(0,9rem)_1fr_auto] items-center gap-2 text-xs", onClick && "cursor-pointer hover:bg-muted/40")} onClick={onClick}>
      <span className="truncate text-muted-foreground">{label}</span>
      <div className="h-2 rounded-full bg-muted">
        <div className={cn("h-2 rounded-full", barClass)} style={{ width: `${pct}%` }} />
      </div>
      <span className="min-w-12 text-right font-medium tabular-nums">{display ?? num(value)}</span>
    </div>
  );
}

/** Vertical column chart. */
export function Columns({ data, height = 120 }: { data: { label: string; value: number; sub?: string; className?: string }[]; height?: number }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2" style={{ height: height + 36 }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center justify-end gap-1">
          <span className="text-[10px] tabular-nums text-muted-foreground">{d.sub ?? num(d.value)}</span>
          <div className={cn("w-full rounded-t bg-primary/80", d.className)} style={{ height: Math.max(3, (d.value / max) * height) }} />
          <span className="text-[10px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
