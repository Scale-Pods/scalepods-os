import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AppIcon } from "@/lib/icon";
import { cn } from "@/lib/utils";
import type { AppManifest, PodDefinition } from "@/lib/types/manifest";

export const inrCompact = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", notation: "compact", maximumFractionDigits: 1 }).format(n);

export const num = (n: number) => new Intl.NumberFormat("en-IN").format(n);

const POD_TAGLINE: Record<string, string> = {
  sales: "Outbound reach, replies and pipeline across every channel",
  hr: "Hiring campaigns, candidate pipeline and interviews",
  marketing: "Content production, approvals and publishing performance",
  operations: "Operations Pod · support, collections, audits and stock",
};

/** One big labelled band per pod, so every app below it reads as belonging to that pod. */
export function PodSection({
  pod,
  apps,
  children,
}: {
  pod: PodDefinition;
  apps: AppManifest[];
  children: React.ReactNode;
}) {
  return (
    <section id={`pod-${pod.id}`} className="scroll-mt-20">
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border bg-muted/40 px-4 py-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <AppIcon name={pod.icon} className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold tracking-tight">{pod.label}</h2>
          <p className="text-xs text-muted-foreground">{POD_TAGLINE[pod.id] ?? ""}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {apps.map((a) => (
            <Link
              key={a.id}
              href={a.basePath}
              className="rounded-full border bg-background px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {a.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="space-y-8">{children}</div>
    </section>
  );
}

/** A single app inside a pod: title row with an Open link, then its KPIs and analytics. */
export function AppBlock({ app, children }: { app: AppManifest; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <AppIcon name={app.icon} className="size-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">{app.name}</h3>
            <p className="truncate text-xs text-muted-foreground">{app.description}</p>
          </div>
        </div>
        <Link
          href={app.basePath}
          className="inline-flex shrink-0 items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-muted"
        >
          Open <ArrowUpRight className="size-3" />
        </Link>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function KpiRow({ children, cols = 4 }: { children: React.ReactNode; cols?: 3 | 4 | 5 | 6 }) {
  const grid =
    cols === 6 ? "lg:grid-cols-6" : cols === 5 ? "lg:grid-cols-5" : cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";
  return <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", grid)}>{children}</div>;
}

export function Panel({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="px-4 py-4">
        <div className="mb-3">
          <h4 className="text-sm font-semibold">{title}</h4>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export interface BarRow {
  label: string;
  value: number;
  display?: string;
  color?: string;
}

export function BarList({ rows, max }: { rows: BarRow[]; max?: number }) {
  const top = max ?? Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-xs text-muted-foreground sm:w-32" title={r.label}>
            {r.label}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", r.color ?? "bg-primary")}
              style={{ width: `${r.value > 0 ? Math.max(3, (r.value / top) * 100) : 0}%` }}
            />
          </div>
          <span className="w-14 shrink-0 text-right text-xs font-medium tabular-nums">{r.display ?? num(r.value)}</span>
        </div>
      ))}
    </div>
  );
}

export interface Segment {
  label: string;
  value: number;
  color: string;
}

export function StackBar({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {segments.map((s) => (
          <div key={s.label} className={s.color} style={{ width: `${total ? (s.value / total) * 100 : 0}%` }} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5 text-xs">
            <span className={cn("size-2 shrink-0 rounded-sm", s.color)} />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="font-medium tabular-nums">{num(s.value)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export interface ColumnPoint {
  label: string;
  a: number;
  b?: number;
}

/** Stacked columns: `a` is the base segment, `b` (optional) stacks on top of it. */
export function Columns({
  data,
  aLabel,
  bLabel,
  aColor = "bg-primary",
  bColor = "bg-primary/35",
}: {
  data: ColumnPoint[];
  aLabel: string;
  bLabel?: string;
  aColor?: string;
  bColor?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.a + (d.b ?? 0)));
  return (
    <div>
      <div className="flex h-36 items-end gap-1">
        {data.map((d) => (
          <div key={d.label} className="group flex h-full flex-1 flex-col justify-end" title={`${d.label}: ${d.a}${d.b !== undefined ? ` / ${d.b}` : ""}`}>
            {d.b !== undefined && <div className={cn("w-full rounded-t-sm", bColor)} style={{ height: `${(d.b / max) * 100}%` }} />}
            <div className={cn("w-full", d.b === undefined ? "rounded-t-sm" : "", aColor)} style={{ height: `${(d.a / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-1">
        {data.map((d, i) => (
          <span key={d.label} className="flex-1 truncate text-center text-[9px] text-muted-foreground">
            {i % Math.ceil(data.length / 7) === 0 ? d.label : ""}
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className={cn("size-2 rounded-sm", aColor)} />{aLabel}</span>
        {bLabel && <span className="flex items-center gap-1.5"><span className={cn("size-2 rounded-sm", bColor)} />{bLabel}</span>}
      </div>
    </div>
  );
}

export interface ListRow {
  key: string;
  primary: string;
  secondary?: string;
  right?: React.ReactNode;
}

export function MiniList({ rows, empty = "Nothing to show yet." }: { rows: ListRow[]; empty?: string }) {
  if (rows.length === 0) return <p className="py-6 text-center text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="divide-y">
      {rows.map((r) => (
        <li key={r.key} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{r.primary}</p>
            {r.secondary && <p className="truncate text-xs text-muted-foreground">{r.secondary}</p>}
          </div>
          {r.right !== undefined && <div className="shrink-0 text-xs font-medium tabular-nums">{r.right}</div>}
        </li>
      ))}
    </ul>
  );
}

export function Pill({ label, tone }: { label: string; tone: "green" | "orange" | "red" | "blue" | "neutral" | "purple" }) {
  const t = {
    green: "bg-success/15 text-success",
    orange: "bg-warning/15 text-warning",
    red: "bg-destructive/15 text-destructive",
    blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    neutral: "bg-muted text-muted-foreground",
  }[tone];
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", t)}>{label}</span>;
}

/** Icon-chip colour classes for KpiCard's `iconClassName`. */
export const TONE = {
  blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  green: "bg-success/15 text-success",
  orange: "bg-warning/15 text-warning",
  red: "bg-destructive/15 text-destructive",
  purple: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  neutral: "bg-muted text-muted-foreground",
} as const;
