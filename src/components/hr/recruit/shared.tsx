"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STAGE_LABELS, type FitLevel, type StageKey, type Decision } from "@/lib/mock-data/hr";

const AVATAR_COLORS = [
  "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  "bg-rose-500/15 text-rose-600 dark:text-rose-400",
];

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function NameAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        AVATAR_COLORS[h % AVATAR_COLORS.length],
        size === "sm" && "size-7 text-[10px]",
        size === "md" && "size-9 text-xs",
        size === "lg" && "size-11 text-sm",
      )}
    >
      {initials(name)}
    </div>
  );
}

export function ScoreNumber({ score, className }: { score: number; className?: string }) {
  return (
    <span
      className={cn(
        "font-semibold tabular-nums",
        score >= 75 ? "text-success" : score >= 55 ? "text-warning" : "text-destructive",
        className,
      )}
    >
      {score}
    </span>
  );
}

export function FitBadge({ fit }: { fit: FitLevel }) {
  const cls =
    fit === "High"
      ? "bg-success/15 text-success"
      : fit === "Medium"
        ? "bg-warning/15 text-warning"
        : "bg-destructive/15 text-destructive";
  return (
    <Badge variant="secondary" className={cn("text-[10px] hover:bg-transparent", cls)}>
      {fit} fit
    </Badge>
  );
}

const STAGE_STYLE: Record<StageKey, string> = {
  screening: "bg-muted text-muted-foreground",
  round1: "bg-primary/15 text-primary",
  round2: "bg-accent/15 text-accent",
  round3: "bg-warning/15 text-warning",
  hired: "bg-success/15 text-success",
  reserve: "bg-warning/15 text-warning",
  rejected: "bg-destructive/15 text-destructive",
};

export function StageChip({ stage, label }: { stage: StageKey; label?: string }) {
  return (
    <Badge variant="secondary" className={cn("text-[10px] hover:bg-transparent", STAGE_STYLE[stage])}>
      {label ?? STAGE_LABELS[stage]}
    </Badge>
  );
}

export function DecisionChip({ decision }: { decision: Decision }) {
  if (!decision) {
    return (
      <Badge variant="secondary" className="bg-muted text-[10px] text-muted-foreground hover:bg-muted">
        Pending
      </Badge>
    );
  }
  const cls =
    decision === "Rejected"
      ? "bg-destructive/15 text-destructive"
      : decision === "Reserve"
        ? "bg-warning/15 text-warning"
        : "bg-success/15 text-success";
  return (
    <Badge variant="secondary" className={cn("text-[10px] hover:bg-transparent", cls)}>
      {decision}
    </Badge>
  );
}

/** Search input with a typewriter placeholder cycling through suggestions (reference "suggestive search"). */
export function SuggestiveSearch({
  value,
  onChange,
  suggestions,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  suggestions: string[];
  className?: string;
}) {
  const [placeholder, setPlaceholder] = useState(suggestions[0] ?? "Search...");

  useEffect(() => {
    if (!suggestions.length) return;
    let s = 0;
    let c = 0;
    let deleting = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = suggestions[s % suggestions.length];
      if (!deleting) {
        c++;
        setPlaceholder(word.slice(0, c) || " ");
        if (c >= word.length) {
          deleting = true;
          t = setTimeout(tick, 1400);
          return;
        }
        t = setTimeout(tick, 70);
      } else {
        c--;
        setPlaceholder(word.slice(0, Math.max(c, 0)) || " ");
        if (c <= 0) {
          deleting = false;
          s++;
          t = setTimeout(tick, 250);
          return;
        }
        t = setTimeout(tick, 35);
      }
    };
    t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, [suggestions]);

  return (
    <div className={cn("relative w-full max-w-xs", className)}>
      <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8"
      />
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}

export function BarRow({
  label,
  value,
  max,
  suffix,
  className,
}: {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  className?: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-28 shrink-0 truncate text-muted-foreground">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full bg-primary", className)} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-12 shrink-0 text-right text-xs tabular-nums font-medium">
        {value}
        {suffix}
      </span>
    </div>
  );
}
