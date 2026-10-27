"use client";

import * as React from "react";
import { CalendarDays, ChevronLeft, ChevronRight, FileClock, Send } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformDot } from "@/components/marketing/platform-badge";
import { WeeklyScheduledChart } from "@/components/marketing/platform-charts";
import { ContentStatusPill } from "@/components/marketing/shared";
import { DraftDetailDialog } from "@/components/marketing/draft-detail-dialog";
import { useContentStore } from "@/components/marketing/store";
import { cn } from "@/lib/utils";
import {
  PLATFORMS,
  PLATFORM_LABEL,
  REF_MS,
  fmtDate,
  getWeeklyScheduledCounts,
  type ContentDraft,
} from "@/lib/mock-data/marketing";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function key(y: number, m: number, d: number) {
  return `${y}-${m}-${d}`;
}

export function CalendarView() {
  const { drafts } = useContentStore();
  const ref = new Date(REF_MS);
  const [cursor, setCursor] = React.useState({ y: ref.getUTCFullYear(), m: ref.getUTCMonth() });
  const [openId, setOpenId] = React.useState<string | null>(null);

  const byDay = React.useMemo(() => {
    const map = new Map<string, ContentDraft[]>();
    for (const d of drafts) {
      const t = new Date(d.targetDate);
      const k = key(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
      map.set(k, [...(map.get(k) ?? []), d]);
    }
    return map;
  }, [drafts]);

  const first = new Date(Date.UTC(cursor.y, cursor.m, 1));
  const daysInMonth = new Date(Date.UTC(cursor.y, cursor.m + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < first.getUTCDay(); i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = first.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  const awaiting = drafts.filter((d) => d.status === "review");
  const scheduled = drafts.filter((d) => d.status === "scheduled").length;
  const inMonth = drafts.filter((d) => {
    const t = new Date(d.targetDate);
    return t.getUTCFullYear() === cursor.y && t.getUTCMonth() === cursor.m;
  }).length;

  function shift(delta: number) {
    const d = new Date(Date.UTC(cursor.y, cursor.m + delta, 1));
    setCursor({ y: d.getUTCFullYear(), m: d.getUTCMonth() });
  }
  const todayKey = key(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate());

  return (
    <>
      <PageHeader title="Calendar" description="Every post with a target date: draft, in review, approved, scheduled or published. Click a post to open it." />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <KpiCard label="Awaiting review" value={String(awaiting.length)} context="Need a decision before their slot" trend="flat" trendValue="0" icon={<FileClock className="size-4" />} />
        <KpiCard label="Scheduled" value={String(scheduled)} context="Locked to a publish slot" trend="up" trendValue={`+${scheduled}`} icon={<Send className="size-4" />} />
        <KpiCard label={`In ${monthLabel}`} value={String(inMonth)} context="Pieces with a date this month" trend="flat" trendValue="0" icon={<CalendarDays className="size-4" />} />
      </div>

      <div className="mb-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{monthLabel}</CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={() => shift(-1)} aria-label="Previous month">
                  <ChevronLeft className="size-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => shift(1)} aria-label="Next month">
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border bg-border">
              {WEEKDAYS.map((w) => (
                <div key={w} className="bg-muted/50 px-2 py-1.5 text-center text-[11px] font-medium text-muted-foreground">
                  {w}
                </div>
              ))}
              {cells.map((day, i) => {
                const items = day ? (byDay.get(key(cursor.y, cursor.m, day)) ?? []) : [];
                const isToday = day !== null && key(cursor.y, cursor.m, day) === todayKey;
                return (
                  <div key={i} className={cn("min-h-24 bg-card p-1.5", !day && "bg-muted/20")}>
                    {day && (
                      <>
                        <span className={cn("mb-1 inline-flex size-5 items-center justify-center rounded-full text-[11px]", isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
                          {day}
                        </span>
                        <div className="space-y-1">
                          {items.slice(0, 3).map((d) => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => setOpenId(d.id)}
                              className="flex w-full items-center gap-1 rounded bg-muted/60 px-1 py-0.5 text-left text-[10px] hover:bg-muted"
                            >
                              <PlatformDot platform={d.platform} />
                              <span className="truncate">{d.title}</span>
                            </button>
                          ))}
                          {items.length > 3 && <p className="px-1 text-[10px] text-muted-foreground">+{items.length - 3} more</p>}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {PLATFORMS.map((p) => (
                <span key={p} className="flex items-center gap-1.5">
                  <PlatformDot platform={p} />
                  {PLATFORM_LABEL[p]}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <WeeklyScheduledChart data={getWeeklyScheduledCounts(4)} />
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Needs a decision</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {awaiting.map((d) => (
                <button key={d.id} type="button" onClick={() => setOpenId(d.id)} className="flex w-full items-center justify-between gap-2 py-2 text-left hover:bg-muted/40">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{d.title}</span>
                    <span className="text-xs text-muted-foreground">Due {fmtDate(d.targetDate)}</span>
                  </span>
                  <ContentStatusPill status={d.status} />
                </button>
              ))}
              {awaiting.length === 0 && <p className="py-2 text-sm text-muted-foreground">Nothing waiting on review.</p>}
            </CardContent>
          </Card>
        </div>
      </div>

      <DraftDetailDialog draftId={openId} open={openId !== null} onOpenChange={(o) => !o && setOpenId(null)} />
    </>
  );
}
