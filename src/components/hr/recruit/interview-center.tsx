"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  CalendarClock,
  CalendarCheck,
  Clock,
  Users,
  CalendarDays,
  Radio,
  ExternalLink,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import {
  MOCK_CANDIDATES,
  interviewsFromCandidates,
  CURRENT_INTERVIEWER,
  HR_TODAY,
  addDays,
  dayOfWeek,
  isoFor,
  monthLabel,
  fmtDate,
  fmtDateLong,
  fmtDateShort,
  timeToMinutes,
  minutesToTime,
  type Interview,
  type Reschedule,
} from "@/lib/mock-data/hr";
import { NameAvatar, DecisionChip, Field, SuggestiveSearch } from "./shared";
import { CandidateDialog } from "./candidate-dialog";
import { cn } from "@/lib/utils";

const ROUND_COLOR = ["bg-primary", "bg-accent", "bg-success"];
const ROUND_TEXT = ["text-primary", "text-accent", "text-success"];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS_STYLE: Record<Interview["status"], string> = {
  scheduled: "bg-primary/15 text-primary",
  rescheduled: "bg-warning/15 text-warning",
  "awaiting-decision": "bg-accent/15 text-accent",
  completed: "bg-success/15 text-success",
};
const STATUS_LABEL: Record<Interview["status"], string> = {
  scheduled: "Scheduled",
  rescheduled: "Rescheduled",
  "awaiting-decision": "Awaiting decision",
  completed: "Completed",
};

export function InterviewCenter() {
  const [ivs, setIvs] = useState<Interview[]>(() => interviewsFromCandidates(MOCK_CANDIDATES));
  const [mine, setMine] = useState(false);
  const [roundFilter, setRoundFilter] = useState<"all" | 1 | 2 | 3>("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(HR_TODAY);
  const [cursor, setCursor] = useState({ year: 2026, month: 9 });
  const [openIv, setOpenIv] = useState<string | null>(null);
  const [resched, setResched] = useState<string | null>(null);
  const [candId, setCandId] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      ivs.filter(
        (i) =>
          (!mine || i.interviewer === CURRENT_INTERVIEWER) &&
          (roundFilter === "all" || i.round === roundFilter) &&
          (!q || `${i.name} ${i.interviewer} ${i.role} ${i.date}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [ivs, mine, roundFilter, q],
  );

  const byDate = useMemo(() => {
    const m = new Map<string, Interview[]>();
    visible.forEach((i) => m.set(i.date, [...(m.get(i.date) ?? []), i]));
    return m;
  }, [visible]);

  const todayCount = visible.filter((i) => i.date === HR_TODAY).length;
  const scheduled = visible.filter((i) => i.decision === "").length;
  const activeCands = new Set(visible.map((i) => i.candidateId)).size;
  const next = visible.find(
    (i) => i.decision === "" && (i.date > HR_TODAY || (i.date === HR_TODAY && timeToMinutes(i.time) > 11 * 60)),
  );

  const dayList = (byDate.get(sel) ?? []).slice().sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  const upcoming = visible
    .filter((i) => i.decision === "" && i.date >= HR_TODAY)
    .slice(0, 8);

  const firstDow = dayOfWeek(isoFor(cursor.year, cursor.month, 1));
  const daysInMonth = new Date(Date.UTC(cursor.year, cursor.month + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const shiftMonth = (d: number) =>
    setCursor((c) => {
      const m = c.month + d;
      return { year: c.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 };
    });

  const current = ivs.find((i) => i.id === openIv) ?? null;
  const reschedIv = ivs.find((i) => i.id === resched) ?? null;

  const applyReschedule = (id: string, date: string, time: string, reason: string) => {
    setIvs((prev) =>
      prev
        .map((i) => {
          if (i.id !== id) return i;
          const rs: Reschedule = {
            id: `rs-new-${id}-${i.reschedules.length + 1}`,
            fromDate: i.date,
            fromTime: i.time,
            toDate: date,
            toTime: time,
            reason: reason || "Rescheduled from Interview Center",
            requestedBy: CURRENT_INTERVIEWER,
            at: HR_TODAY,
          };
          return { ...i, date, time, status: "rescheduled" as const, reschedules: [...i.reschedules, rs] };
        })
        .sort((a, b) => a.date.localeCompare(b.date) || timeToMinutes(a.time) - timeToMinutes(b.time)),
    );
    setSel(date);
    setResched(null);
    toast.success(`Interview moved to ${fmtDateShort(date)} at ${time}. Calendar invite updated.`);
  };

  return (
    <>
      <PageHeader
        title="Interview Center"
        description="Calendar of all interview rounds across campaigns, with one-click reschedule"
        actions={
          <div className="flex rounded-lg border p-0.5">
            <Button size="sm" variant={!mine ? "secondary" : "ghost"} onClick={() => setMine(false)}>
              All
            </Button>
            <Button size="sm" variant={mine ? "secondary" : "ghost"} onClick={() => setMine(true)}>
              Mine
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Today's Sessions" value={String(todayCount)} icon={<Radio className="size-4" />} iconClassName="bg-primary/10 text-primary" context={fmtDateLong(HR_TODAY)} />
        <KpiCard label="Active Candidates" value={String(activeCands)} icon={<Users className="size-4" />} iconClassName="bg-accent/10 text-accent" context="With at least one meeting" />
        <KpiCard label="Scheduled" value={String(scheduled)} icon={<CalendarDays className="size-4" />} iconClassName="bg-warning/10 text-warning" context="Awaiting a decision" />
        <KpiCard
          label="Next Session"
          value={next ? next.time : "—"}
          icon={<Clock className="size-4" />}
          iconClassName="bg-success/10 text-success"
          context={next ? `${fmtDateShort(next.date)} · ${next.name}` : "Nothing upcoming"}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{monthLabel(cursor.year, cursor.month)}</CardTitle>
            <div className="flex items-center gap-1">
              <Button size="icon-sm" variant="outline" onClick={() => shiftMonth(-1)}>
                <ChevronLeft />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setCursor({ year: 2026, month: 9 });
                  setSel(HR_TODAY);
                }}
              >
                Today
              </Button>
              <Button size="icon-sm" variant="outline" onClick={() => shiftMonth(1)}>
                <ChevronRight />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-muted-foreground">
              {DOW.map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((d, idx) => {
                if (d === null) return <div key={`e${idx}`} />;
                const iso = isoFor(cursor.year, cursor.month, d);
                const evs = byDate.get(iso) ?? [];
                const isSel = iso === sel;
                const isToday = iso === HR_TODAY;
                return (
                  <button
                    key={iso}
                    onClick={() => setSel(iso)}
                    className={cn(
                      "flex min-h-14 flex-col items-center gap-1 rounded-lg border p-1.5 text-sm transition-colors hover:bg-muted/50",
                      isSel && "border-primary bg-primary/5",
                      isToday && !isSel && "border-primary/40",
                    )}
                  >
                    <span className={cn("font-medium", isToday && "text-primary")}>{d}</span>
                    {evs.length > 0 && (
                      <div className="flex items-center gap-0.5">
                        {Array.from(new Set(evs.map((e) => e.round))).map((r) => (
                          <span key={r} className={cn("size-1.5 rounded-full", ROUND_COLOR[r - 1])} />
                        ))}
                        <span className="ml-0.5 text-[10px] text-muted-foreground">{evs.length}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex gap-4 text-[11px] text-muted-foreground">
              {["Round 1", "Round 2", "Round 3"].map((r, i) => (
                <span key={r} className="flex items-center gap-1.5">
                  <span className={cn("size-2 rounded-full", ROUND_COLOR[i])} /> {r}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{fmtDateLong(sel)}</CardTitle>
            <CardDescription>
              {dayList.length} {dayList.length === 1 ? "interview" : "interviews"} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {dayList.length === 0 && (
              <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No interviews on this day.
              </p>
            )}
            {dayList.map((i) => (
              <IvRow key={i.id} iv={i} onOpen={() => setOpenIv(i.id)} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mb-3 mt-6 flex flex-wrap items-center gap-2">
        <SuggestiveSearch
          value={q}
          onChange={setQ}
          suggestions={["Search interviews...", "Search by date...", "Search by interviewer..."]}
        />
        <div className="flex rounded-lg border p-0.5">
          {([["all", "All"], [1, "Round 1"], [2, "Round 2"], [3, "Round 3"]] as const).map(([v, l]) => (
            <Button key={String(v)} size="sm" variant={roundFilter === v ? "secondary" : "ghost"} onClick={() => setRoundFilter(v)}>
              {l}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live daily track</CardTitle>
          <CardDescription>Upcoming interviews awaiting a decision</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {upcoming.length === 0 && <p className="text-sm text-muted-foreground">Nothing upcoming for this filter.</p>}
          {upcoming.map((i) => (
            <IvRow key={i.id} iv={i} showDate onOpen={() => setOpenIv(i.id)} />
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!current} onOpenChange={(o) => !o && setOpenIv(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {current && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <NameAvatar name={current.name} size="lg" />
                  <div className="min-w-0">
                    <DialogTitle>{current.name}</DialogTitle>
                    <DialogDescription>
                      {current.role} · Round {current.round} · {current.roundName}
                    </DialogDescription>
                  </div>
                  <Badge variant="secondary" className={cn("ml-auto hover:bg-transparent", STATUS_STYLE[current.status])}>
                    {STATUS_LABEL[current.status]}
                  </Badge>
                </div>
              </DialogHeader>
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="history">Reschedule history ({current.reschedules.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 pt-2">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Date">{fmtDateLong(current.date)}</Field>
                    <Field label="Time">
                      {current.time} ({current.durationMin} min)
                    </Field>
                    <Field label="Campaign">{current.campaignName}</Field>
                    <Field label="Interviewer">
                      {current.interviewer}
                      <p className="text-xs text-muted-foreground">{current.interviewerEmail}</p>
                    </Field>
                    <Field label="Candidate email">{current.email}</Field>
                    <Field label="Decision">
                      <DecisionChip decision={current.decision} />
                    </Field>
                    <Field label="Event ID">
                      <code className="text-xs">{current.eventId}</code>
                    </Field>
                    <Field label="Meeting link">
                      <a href={current.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary">
                        <Video className="size-3.5" /> Join meeting
                      </a>
                    </Field>
                    <Field label="Calendar event">
                      <a href={current.calendarLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary">
                        <ExternalLink className="size-3.5" /> Open in calendar
                      </a>
                    </Field>
                  </div>
                  <div className="flex flex-wrap gap-2 border-t pt-4">
                    <Button
                      size="sm"
                      disabled={current.decision !== ""}
                      onClick={() => {
                        setResched(current.id);
                        setOpenIv(null);
                      }}
                    >
                      <CalendarClock className="size-3.5" /> Reschedule
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCandId(current.candidateId);
                        setOpenIv(null);
                      }}
                    >
                      <User className="size-3.5" /> View candidate
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="history" className="space-y-2 pt-2">
                  {current.reschedules.length === 0 ? (
                    <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                      This interview has not been rescheduled.
                    </p>
                  ) : (
                    current.reschedules.map((r) => (
                      <div key={r.id} className="rounded-lg border p-3 text-sm">
                        <p className="font-medium">
                          {fmtDate(r.fromDate)} {r.fromTime} → {fmtDate(r.toDate)} {r.toTime}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {r.reason} · requested by {r.requestedBy} on {fmtDate(r.at)}
                        </p>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      <RescheduleDialog
        iv={reschedIv}
        all={ivs}
        onClose={() => setResched(null)}
        onConfirm={applyReschedule}
      />

      <CandidateDialog
        candidate={MOCK_CANDIDATES.find((c) => c.id === candId) ?? null}
        onOpenChange={(o) => !o && setCandId(null)}
      />
    </>
  );
}

function IvRow({ iv, onOpen, showDate }: { iv: Interview; onOpen: () => void; showDate?: boolean }) {
  return (
    <button
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors hover:bg-muted/50"
    >
      <span className={cn("h-9 w-1 rounded-full", ROUND_COLOR[iv.round - 1])} />
      <NameAvatar name={iv.name} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{iv.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          <span className={ROUND_TEXT[iv.round - 1]}>R{iv.round}</span> {iv.roundName} · {iv.role} · {iv.interviewer}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs font-medium">
          {showDate ? `${fmtDateShort(iv.date)} · ` : ""}
          {iv.time}
        </p>
        <Badge variant="secondary" className={cn("mt-0.5 text-[10px] hover:bg-transparent", STATUS_STYLE[iv.status])}>
          {STATUS_LABEL[iv.status]}
        </Badge>
      </div>
    </button>
  );
}

function RescheduleDialog({
  iv,
  all,
  onClose,
  onConfirm,
}: {
  iv: Interview | null;
  all: Interview[];
  onClose: () => void;
  onConfirm: (id: string, date: string, time: string, reason: string) => void;
}) {
  return (
    <Dialog open={!!iv} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={DETAIL_DIALOG_CLASS}>
        {iv && <RescheduleBody key={iv.id} iv={iv} all={all} onClose={onClose} onConfirm={onConfirm} />}
      </DialogContent>
    </Dialog>
  );
}

function RescheduleBody({
  iv,
  all,
  onClose,
  onConfirm,
}: {
  iv: Interview;
  all: Interview[];
  onClose: () => void;
  onConfirm: (id: string, date: string, time: string, reason: string) => void;
}) {
  const [date, setDate] = useState<string>(iv.date >= HR_TODAY ? iv.date : HR_TODAY);
  const [time, setTime] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const slots = useMemo(() => {
    const busy = new Set(
      all
        .filter((x) => x.id !== iv.id && x.date === date && x.interviewer === iv.interviewer)
        .map((x) => timeToMinutes(x.time)),
    );
    const out: { label: string; busy: boolean }[] = [];
    for (let m = 9 * 60; m <= 18 * 60; m += 30) {
      const past = date === HR_TODAY && m <= 11 * 60;
      if (past) continue;
      out.push({ label: minutesToTime(m), busy: busy.has(m) });
    }
    return out;
  }, [all, date, iv]);

  const selDate = new Date(`${date}T00:00:00`);
  const today = new Date(`${HR_TODAY}T00:00:00`);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Reschedule interview</DialogTitle>
        <DialogDescription>
          {iv.name} · Round {iv.round} {iv.roundName} with {iv.interviewer}. Currently {fmtDate(iv.date)} at {iv.time}.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex justify-center rounded-lg border">
          <Calendar
            mode="single"
            selected={selDate}
            defaultMonth={selDate}
            onSelect={(d) => {
              if (!d) return;
              const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
              setDate(iso);
              setTime(null);
            }}
            disabled={(d) => d < today || d > new Date(`${addDays(HR_TODAY, 60)}T00:00:00`) || d.getDay() === 0}
          />
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">{fmtDateLong(date)}</p>
            <p className="text-xs text-muted-foreground">
              {slots.filter((s) => !s.busy).length} slots available · busy slots are already booked for {iv.interviewer}
            </p>
          </div>
          <div className="grid max-h-56 grid-cols-3 gap-1.5 overflow-y-auto pr-1">
            {slots.map((s) => (
              <Button
                key={s.label}
                size="sm"
                variant={time === s.label ? "default" : "outline"}
                disabled={s.busy}
                onClick={() => setTime(s.label)}
                className="text-xs"
              >
                {s.label}
              </Button>
            ))}
          </div>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="Reason for rescheduling (optional)"
            className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <div className="flex items-center justify-between gap-2 border-t pt-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarCheck className="size-3.5" />
              {time ? `${fmtDateShort(date)} · ${time}` : "Pick a slot to continue"}
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button size="sm" disabled={!time} onClick={() => time && onConfirm(iv.id, date, time, reason)}>
                Confirm reschedule
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
