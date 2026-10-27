"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  Video,
  CalendarDays,
  Check,
  Circle,
  FileText,
  Sparkles,
  Gavel,
  History,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import {
  getCandidateStage,
  fmtDate,
  HR_TODAY,
  type Candidate,
  type Decision,
  type DecisionValue,
} from "@/lib/mock-data/hr";
import { NameAvatar, ScoreNumber, FitBadge, StageChip, DecisionChip, Field, BarRow } from "./shared";
import { cn } from "@/lib/utils";

type StepKey = "resume" | 1 | 2 | 3;

interface Props {
  candidate: Candidate | null;
  onOpenChange: (open: boolean) => void;
  onDecision?: (candidateId: string, key: StepKey, value: DecisionValue) => void;
}

export function CandidateDialog({ candidate: c, onOpenChange, onDecision }: Props) {
  return (
    <Dialog open={!!c} onOpenChange={onOpenChange}>
      <DialogContent className={DETAIL_DIALOG_CLASS}>
        {c && <CandidateBody key={c.id} c={c} onDecision={onDecision} />}
      </DialogContent>
    </Dialog>
  );
}

function CandidateBody({
  c,
  onDecision,
}: {
  c: Candidate;
  onDecision?: Props["onDecision"];
}) {
  const stage = getCandidateStage(c);
  const waNumber = c.phone.replace(/[^0-9]/g, "");

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <NameAvatar name={c.name} size="lg" />
          <div className="min-w-0">
            <DialogTitle className="truncate">{c.name}</DialogTitle>
            <DialogDescription className="truncate">
              {c.role} · {c.city} · #{c.id} · Applied {fmtDate(c.appliedAt)}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-lg border p-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Score</p>
          <ScoreNumber score={c.score} className="text-2xl" />
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border p-3 text-center">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Fit</p>
          <FitBadge fit={c.fit} />
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border p-3 text-center">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Stage</p>
          <StageChip stage={stage} />
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border p-3 text-center">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Contact</p>
          <div className="flex gap-1.5">
            <a href={`mailto:${c.email}`} title={c.email} className="rounded-md bg-primary/10 p-1.5 text-primary">
              <Mail className="size-3.5" />
            </a>
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noreferrer"
              title="WhatsApp"
              className="rounded-md bg-success/10 p-1.5 text-success"
            >
              <MessageCircle className="size-3.5" />
            </a>
            <a href={`tel:${c.phone}`} title={c.phone} className="rounded-md bg-muted p-1.5 text-muted-foreground">
              <Phone className="size-3.5" />
            </a>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>
          <TabsTrigger value="decision">Decision</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 pt-2">
          <Section icon={Sparkles} title="AI Summary">
            <p className="text-sm leading-relaxed text-muted-foreground">{c.summary}</p>
          </Section>
          <Section icon={Gavel} title="Evaluation">
            <div className="space-y-3">
              <Field label="Fit analysis">
                <p className="text-muted-foreground">{c.fitAnalysis}</p>
              </Field>
              <Field label="Strengths">
                <ul className="list-disc space-y-0.5 pl-4 text-muted-foreground">
                  {c.strengths.split("|").map((s) => (
                    <li key={s}>{s.trim()}</li>
                  ))}
                </ul>
              </Field>
              <Field label="Gaps">
                <ul className="list-disc space-y-0.5 pl-4 text-muted-foreground">
                  {c.gaps.split("|").map((s) => (
                    <li key={s}>{s.trim()}</li>
                  ))}
                </ul>
              </Field>
              {c.riskFlags && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  <strong>Risk Flags:</strong> {c.riskFlags.replace(/^risk flag:\s*/i, "")}
                </div>
              )}
            </div>
          </Section>
          <Section icon={FileText} title="Score breakdown">
            <div className="space-y-2">
              <BarRow label="Skills match" value={c.scoreBreakdown.skills} max={100} />
              <BarRow label="Experience" value={c.scoreBreakdown.experience} max={100} />
              <BarRow label="Education" value={c.scoreBreakdown.education} max={100} />
              <BarRow label="JD alignment" value={c.scoreBreakdown.jdAlignment} max={100} />
            </div>
          </Section>
          <Section icon={History} title="Advanced analysis">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Career progression">
                <p className="text-muted-foreground">{c.careerProgression}</p>
              </Field>
              <Field label="Stability analysis">
                <p className="text-muted-foreground">{c.stabilityAnalysis}</p>
              </Field>
              <Field label="Industry relevance">
                <p className="text-muted-foreground">{c.industryRelevance}</p>
              </Field>
            </div>
          </Section>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Tags:</span>
            {c.tags.map((t) => (
              <Badge key={t} variant="outline" className="text-[10px]">
                {t}
              </Badge>
            ))}
            <span className="ml-auto text-xs text-muted-foreground">
              Recruiter: {c.recruiter} · Source: {c.source}
            </span>
          </div>
        </TabsContent>

        <TabsContent value="resume" className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <FileText className="size-4" /> Resume
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info("Opens the resume in Google Drive (demo link)")}
            >
              <ExternalLink className="size-3.5" /> Open in Drive
            </Button>
          </div>
          <div className="space-y-4 rounded-lg border bg-muted/30 p-5 text-sm">
            <div>
              <p className="text-lg font-semibold">{c.name}</p>
              <p className="text-xs text-muted-foreground">
                {c.email} · {c.phone} · {c.city}
              </p>
            </div>
            <ResumeBlock title="Summary">{c.summary}</ResumeBlock>
            <ResumeBlock title="Experience">
              <p className="font-medium text-foreground">
                {c.role.replace(/ Intern$/, "")} · {c.currentCompany}
              </p>
              <p>
                {c.experienceYears} years total · Notice period: {c.noticePeriod}
              </p>
            </ResumeBlock>
            <ResumeBlock title="Education">{c.education}</ResumeBlock>
            <ResumeBlock title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {c.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="text-[10px]">
                    {s}
                  </Badge>
                ))}
              </div>
            </ResumeBlock>
            <ResumeBlock title="Expectation">Expected CTC: {c.expectedCtcLpa} LPA</ResumeBlock>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="pt-2">
          <PipelineTimeline c={c} />
        </TabsContent>

        <TabsContent value="interviews" className="space-y-3 pt-2">
          {c.rounds.filter((r) => r.meetingDate).length === 0 ? (
            <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No interviews scheduled yet.
            </p>
          ) : (
            c.rounds
              .filter((r) => r.meetingDate)
              .map((r) => (
                <div key={r.round} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">
                      Round {r.round} · {r.name}
                    </p>
                    <DecisionChip decision={r.decision} />
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <Field label="When">
                      {fmtDate(r.meetingDate)} · {r.meetingTime}
                    </Field>
                    <Field label="Interviewer">{r.assigned}</Field>
                    <Field label="Event ID">
                      <code className="text-xs">{r.eventId}</code>
                    </Field>
                    <Field label="Meeting link">
                      <a
                        href={r.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary"
                      >
                        <Video className="size-3.5" /> Join
                      </a>
                    </Field>
                    <Field label="Calendar">
                      <a
                        href={r.calendarLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary"
                      >
                        <CalendarDays className="size-3.5" /> Open event
                      </a>
                    </Field>
                    <Field label="Follow-ups">
                      <span className="text-muted-foreground">
                        WA: {r.waFollowup || "—"} · Mail: {r.mailFollowup || "—"}
                      </span>
                    </Field>
                  </div>
                  {r.reschedules.length > 0 && (
                    <div className="mt-3 rounded-md bg-warning/10 p-3 text-xs">
                      <p className="mb-1 font-semibold text-warning">Rescheduled</p>
                      {r.reschedules.map((rs) => (
                        <p key={rs.id} className="text-muted-foreground">
                          {fmtDate(rs.fromDate)} {rs.fromTime} → {fmtDate(rs.toDate)} {rs.toTime} · {rs.reason} (by{" "}
                          {rs.requestedBy})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))
          )}
        </TabsContent>

        <TabsContent value="questionnaire" className="space-y-3 pt-2">
          {c.rounds.some((r) => r.questionnaire) ? (
            c.rounds
              .filter((r) => r.questionnaire)
              .map((r) => (
                <div key={r.round} className="overflow-hidden rounded-lg border">
                  <div className="bg-muted/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Round {r.round} - {r.assigned} ({r.meetingMail})
                  </div>
                  <pre className="whitespace-pre-wrap p-4 font-sans text-sm leading-relaxed text-muted-foreground">
                    {r.questionnaire}
                  </pre>
                </div>
              ))
          ) : (
            <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No questionnaire data available
            </p>
          )}
        </TabsContent>

        <TabsContent value="decision" className="space-y-3 pt-2">
          <DecisionPanel c={c} onDecision={onDecision} />
        </TabsContent>
      </Tabs>
    </>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 border-b pb-2 text-xs font-semibold text-muted-foreground">
        <Icon className="size-3.5" /> {title}
      </p>
      {children}
    </div>
  );
}

function ResumeBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}

function PipelineTimeline({ c }: { c: Candidate }) {
  const rejected = getCandidateStage(c) === "rejected";
  const steps = [
    {
      label: "Resume Screening",
      status: c.resumeDecision === "" ? "current" : c.resumeDecision === "Rejected" ? "rejected" : "done",
      subs: [
        { k: "Review", v: c.resumeDecision ? "Complete" : "Pending" },
        { k: "Decision", v: c.resumeDecision || "—" },
        { k: "Date", v: c.resumeDecisionDate ? fmtDate(c.resumeDecisionDate) : "—" },
      ],
    },
    ...c.rounds.map((r, i) => {
      const prev = i === 0 ? c.resumeDecision : c.rounds[i - 1].decision;
      const prevOk = prev !== "" && prev !== "Rejected";
      const status = r.decision
        ? r.decision === "Rejected"
          ? "rejected"
          : "done"
        : prevOk && !rejected
          ? "current"
          : "upcoming";
      return {
        label: `Round ${r.round} · ${r.name}`,
        status,
        subs:
          status === "upcoming"
            ? []
            : [
                { k: "WhatsApp", v: r.waFollowup || "—" },
                { k: "Meeting", v: r.meetingDate ? `${fmtDate(r.meetingDate)} at ${r.meetingTime}` : "—" },
                { k: "Assigned", v: r.assigned || "—" },
                { k: "Decision", v: r.decision || "—" },
              ],
      };
    }),
  ];
  return (
    <div className="space-y-0">
      {steps.map((s, i) => (
        <div key={s.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex size-6 items-center justify-center rounded-full border-2",
                s.status === "done" && "border-success bg-success text-white",
                s.status === "rejected" && "border-destructive bg-destructive text-white",
                s.status === "current" && "border-primary bg-primary/10",
                s.status === "upcoming" && "border-border",
              )}
            >
              {s.status === "done" && <Check className="size-3.5" />}
              {s.status === "rejected" && <span className="text-xs">×</span>}
              {s.status === "current" && <Circle className="size-2 fill-primary text-primary" />}
            </div>
            {i < steps.length - 1 && (
              <div className={cn("w-0.5 flex-1", s.status === "done" ? "bg-success" : "bg-border")} />
            )}
          </div>
          <div className="min-w-0 flex-1 pb-5">
            <p className="text-sm font-medium">{s.label}</p>
            <p className="text-xs text-muted-foreground">
              {s.status === "done"
                ? "Completed"
                : s.status === "rejected"
                  ? "Rejected"
                  : s.status === "current"
                    ? "In progress"
                    : "Upcoming"}
            </p>
            {s.subs.length > 0 && (
              <div className="mt-2 space-y-1 rounded-md bg-muted/40 p-2.5">
                {s.subs.map((sub) => (
                  <div key={sub.k} className="flex justify-between gap-3 text-xs">
                    <span>{sub.k}</span>
                    <span className="text-muted-foreground">{sub.v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function DecisionPanel({ c, onDecision }: { c: Candidate; onDecision?: Props["onDecision"] }) {
  const [comments, setComments] = useState<Record<string, string>>({});
  const rejected = getCandidateStage(c) === "rejected";

  const act = (key: StepKey, value: DecisionValue, label: string) => {
    if (!onDecision) {
      toast.info("Decisions are read-only here");
      return;
    }
    onDecision(c.id, key, value);
    toast.success(`${c.name}: ${label} recorded${comments[String(key)] ? " with comments" : ""}`);
  };

  const rows: { key: StepKey; label: string; decision: Decision; enabled: boolean; isLast: boolean }[] = [
    {
      key: "resume",
      label: "Resume Screening",
      decision: c.resumeDecision,
      enabled: true,
      isLast: false,
    },
    ...c.rounds.map((r, i) => ({
      key: r.round as StepKey,
      label: `Round ${r.round} · ${r.name}`,
      decision: r.decision,
      enabled:
        (i === 0 ? c.resumeDecision === "Selected" : c.rounds[i - 1].decision === "Selected") || r.decision !== "",
      isLast: i === c.rounds.length - 1,
    })),
  ];

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={String(row.key)} className={cn("rounded-lg border", !row.enabled && "opacity-50")}>
          <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide">{row.label}</p>
            <DecisionChip decision={row.decision} />
          </div>
          <div className="space-y-2 p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={row.decision === "Selected" || row.decision === "Hired" ? "default" : "outline"}
                disabled={!row.enabled || (rejected && !row.decision)}
                onClick={() => act(row.key, row.isLast ? "hire" : "yes", row.isLast ? "Hire" : "Yes")}
              >
                {row.isLast ? "Hire" : "Yes"}
              </Button>
              {row.isLast && (
                <Button
                  size="sm"
                  variant={row.decision === "Reserve" ? "default" : "outline"}
                  disabled={!row.enabled || (rejected && !row.decision)}
                  onClick={() => act(row.key, "reserve", "Reserve")}
                >
                  Reserve
                </Button>
              )}
              <Button
                size="sm"
                variant={row.decision === "Rejected" ? "destructive" : "outline"}
                disabled={!row.enabled || (rejected && !row.decision)}
                onClick={() => act(row.key, "no", "No")}
              >
                No
              </Button>
            </div>
            {row.key !== "resume" && (
              <Textarea
                rows={2}
                placeholder={`Add comments for ${row.label}...`}
                value={comments[String(row.key)] ?? ""}
                onChange={(e) => setComments((p) => ({ ...p, [String(row.key)]: e.target.value }))}
              />
            )}
          </div>
        </div>
      ))}
      <p className="text-[11px] text-muted-foreground">
        Decisions are applied to the demo data for this session. Reference date: {fmtDate(HR_TODAY)}.
      </p>
    </div>
  );
}
