"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FileClock, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { StatusBadge } from "@/components/shared/badges";
import { PlatformBadge, PlatformDot } from "@/components/marketing/platform-badge";
import { WeeklyScheduledChart } from "@/components/marketing/weekly-scheduled-chart";
import { cn } from "@/lib/utils";
import {
  MOCK_CONTENT_DRAFTS,
  PLATFORM_LABEL,
  getWeeklyScheduledCounts,
  type ContentDraft,
  type ContentPlatform,
} from "@/lib/mock-data/marketing";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PLATFORMS: ContentPlatform[] = ["linkedin", "instagram", "blog"];

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function ContentCalendarPage() {
  const [cursor, setCursor] = React.useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const awaitingReview = MOCK_CONTENT_DRAFTS.filter((d) => d.status === "review");
  const scheduledDrafts = MOCK_CONTENT_DRAFTS.filter((d) => d.scheduledFor);
  const weeklyScheduled = getWeeklyScheduledCounts(4);
  const platformMix = PLATFORMS.map((platform) => ({
    platform,
    count: scheduledDrafts.filter((d) => d.platform === platform).length,
  }));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstOfMonth.getDay();
  const today = new Date();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  function draftsOn(day: Date) {
    return scheduledDrafts.filter((d) => d.scheduledFor && sameDay(new Date(d.scheduledFor), day));
  }

  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <>
      <PageHeader
        title="Content Calendar"
        description="Month view of scheduled content across LinkedIn, Instagram and the blog."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <KpiCard
          label="Content awaiting review"
          value={String(awaitingReview.length)}
          context="Needs a reviewer decision before scheduling"
          trend="flat"
          trendValue="0"
          icon={<FileClock className="size-4" />}
        />
        <KpiCard
          label="Scheduled this month"
          value={String(
            scheduledDrafts.filter(
              (d) =>
                d.scheduledFor &&
                new Date(d.scheduledFor).getMonth() === month &&
                new Date(d.scheduledFor).getFullYear() === year
            ).length
          )}
          context="Across all platforms"
          trend="up"
          trendValue="+2"
          icon={<CalendarDays className="size-4" />}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        <Card className="lg:col-span-3">
          <CardContent className="py-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{monthLabel}</h2>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setCursor(new Date(year, month - 1, 1))}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setCursor(new Date(year, month + 1, 1))}
                  aria-label="Next month"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
              {WEEKDAYS.map((w) => (
                <div key={w} className="py-1">
                  {w}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) {
                  return <div key={i} className="min-h-24 rounded-md bg-muted/20" />;
                }
                const dayDrafts = draftsOn(day);
                const isToday = sameDay(day, today);
                return (
                  <DayCell key={i} day={day} isToday={isToday} drafts={dayDrafts} />
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <WeeklyScheduledChart data={weeklyScheduled} />
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Platform mix (scheduled)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {platformMix.map(({ platform, count }) => (
                <div key={platform} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5">
                    <PlatformDot platform={platform} />
                    {PLATFORM_LABEL[platform]}
                  </span>
                  <span className="font-medium tabular-nums">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Legend:</span>
        {PLATFORMS.map((p) => (
          <span key={p} className="flex items-center gap-1.5">
            <PlatformDot platform={p} />
            {PLATFORM_LABEL[p]}
          </span>
        ))}
      </div>
    </>
  );
}

function DayCell({
  day,
  isToday,
  drafts,
}: {
  day: Date;
  isToday: boolean;
  drafts: ContentDraft[];
}) {
  const [open, setOpen] = React.useState(false);
  const visible = drafts.slice(0, 2);
  const overflow = drafts.length - visible.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex min-h-24 flex-col items-start gap-1 rounded-md border p-1.5 text-left transition-colors hover:border-ring/40 hover:bg-card/80",
            isToday ? "border-primary/50 bg-primary/5" : "border-border bg-card"
          )}
        >
          <span
            className={cn(
              "text-xs font-medium",
              isToday ? "flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground" : "text-muted-foreground"
            )}
          >
            {day.getDate()}
          </span>
          <div className="flex w-full flex-col gap-1">
            {visible.map((d) => (
              <span
                key={d.id}
                className={cn(
                  "flex items-center gap-1 truncate rounded px-1 py-0.5 text-[10px] font-medium",
                  d.platform === "linkedin" && "bg-primary/10 text-primary",
                  d.platform === "instagram" && "bg-accent/10 text-accent",
                  d.platform === "blog" && "bg-warning/15 text-warning"
                )}
              >
                <PlatformDot platform={d.platform} />
                <span className="truncate">{d.title}</span>
              </span>
            ))}
            {overflow > 0 && (
              <span className="text-[10px] text-muted-foreground">+{overflow} more</span>
            )}
          </div>
        </button>
      </PopoverTrigger>
      {drafts.length > 0 && (
        <PopoverContent className="w-80" align="start">
          <p className="mb-2 text-sm font-semibold">
            {day.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <div className="space-y-2">
            {drafts.map((d) => (
              <Link
                key={d.id}
                href={`/marketing/content-os/drafts/${d.id}`}
                className="block rounded-md border p-2 text-sm hover:bg-muted/50"
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center justify-between gap-2">
                  <PlatformBadge platform={d.platform} />
                  <StatusBadge status={d.status} />
                </div>
                <p className="mt-1.5 line-clamp-1 font-medium">{d.title}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">{d.hook}</p>
              </Link>
            ))}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}
