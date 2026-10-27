"use client";

import * as React from "react";
import {
  AlignLeft,
  FileText,
  GalleryHorizontal,
  Image as ImageIcon,
  Megaphone,
  PlayCircle,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  FORMAT_LABEL,
  STATUS_LABEL,
  type ContentFormat,
  type ContentStatus,
} from "@/lib/mock-data/marketing";

export const TONE = {
  green: "bg-success/15 text-success",
  blue: "bg-primary/15 text-primary",
  orange: "bg-warning/15 text-warning",
  red: "bg-destructive/15 text-destructive",
  purple: "bg-accent/15 text-accent",
  neutral: "bg-muted text-muted-foreground",
} as const;
export type Tone = keyof typeof TONE;

export function Pill({ label, tone = "neutral", className }: { label: string; tone?: Tone; className?: string }) {
  return (
    <Badge variant="outline" className={cn("border-0 text-[11px]", TONE[tone], className)}>
      {label}
    </Badge>
  );
}

const STATUS_TONE: Record<ContentStatus, Tone> = {
  draft: "neutral",
  review: "orange",
  sent_back: "red",
  approved: "green",
  scheduled: "blue",
  published: "purple",
};

export function ContentStatusPill({ status }: { status: ContentStatus }) {
  return <Pill label={STATUS_LABEL[status]} tone={STATUS_TONE[status]} />;
}

export const FORMAT_ICON: Record<ContentFormat, LucideIcon> = {
  text: AlignLeft,
  image: ImageIcon,
  carousel: GalleryHorizontal,
  video: Video,
  ugc: PlayCircle,
  billboard: Megaphone,
  blog: FileText,
};

export function FormatBadge({ format }: { format: ContentFormat }) {
  const Icon = FORMAT_ICON[format];
  return (
    <Badge variant="outline" className="gap-1 text-[11px] font-normal text-muted-foreground">
      <Icon className="size-3" />
      {FORMAT_LABEL[format]}
    </Badge>
  );
}

/**
 * Native video player used by every UGC / video surface. `src` must already be
 * URL-encoded (e.g. "/oil%20video.mp4"). Muted + playsInline so it can show a
 * first frame / be started without autoplay restrictions.
 */
export function VideoPlayer({
  src,
  aspect = "9:16",
  className,
}: {
  src: string;
  aspect?: "9:16" | "16:9" | "1:1";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg bg-black",
        aspect === "9:16" ? "mx-auto aspect-[9/16] max-h-[420px]" : aspect === "16:9" ? "aspect-video w-full" : "mx-auto aspect-square max-h-[420px]",
        className
      )}
    >
      <video
        src={src}
        controls
        preload="metadata"
        playsInline
        muted
        className="h-full w-full object-contain"
      />
    </div>
  );
}

export function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 py-1.5 text-sm", className)}>
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right">{children}</span>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm">{title}</CardTitle>
            {description && <p className="mt-1 text-xs font-normal text-muted-foreground">{description}</p>}
          </div>
          {actions}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function MiniStat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-semibold">{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Proportional bar row for hand-rolled breakdowns (no chart lib). */
export function BarRow({ label, value, max, display }: { label: string; value: number; max: number; display?: string }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-28 shrink-0 truncate text-muted-foreground">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-14 shrink-0 text-right text-xs font-medium">{display ?? String(value)}</span>
    </div>
  );
}
