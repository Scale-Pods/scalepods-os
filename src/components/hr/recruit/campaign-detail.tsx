"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  LayoutGrid,
  List,
  Upload,
  FolderUp,
  Send,
  X,
  Users,
  Gauge,
  Percent,
  Hourglass,
  MapPin,
  CalendarDays,
  Wallet,
  Users2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getCampaign,
  candidatesForCampaign,
  campaignStats,
  getCandidateStage,
  nextDecisionStep,
  applyDecision,
  isRejected,
  fmtDate,
  STAGE_LABELS,
  STAGE_ORDER,
  type Candidate,
  type DecisionValue,
} from "@/lib/mock-data/hr";
import { NameAvatar, ScoreNumber, FitBadge, StageChip, SuggestiveSearch, BarRow, Field } from "./shared";
import { CandidateDialog } from "./candidate-dialog";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

export function CampaignDetail({ id }: { id: string }) {
  const campaign = getCampaign(id);
  const [cands, setCands] = useState<Candidate[]>(() => candidatesForCampaign(id));
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");
  const [fit, setFit] = useState("all");
  const [status, setStatus] = useState("all");
  const [recruiter, setRecruiter] = useState("all");
  const [tag, setTag] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [pending, setPending] = useState<{ id: string; key: "resume" | 1 | 2 | 3; value: DecisionValue; label: string } | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [uploadTags, setUploadTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => campaignStats(id, cands), [id, cands]);
  const recruiters = useMemo(() => Array.from(new Set(cands.map((c) => c.recruiter))), [cands]);
  const allTags = useMemo(() => Array.from(new Set(cands.flatMap((c) => c.tags))), [cands]);

  const filtered = useMemo(() => {
    let list = cands.filter(
      (c) =>
        (!q || `${c.name} ${c.email} ${c.city} ${c.id}`.toLowerCase().includes(q.toLowerCase())) &&
        (fit === "all" || c.fit === fit) &&
        (status === "all" || getCandidateStage(c) === status) &&
        (recruiter === "all" || c.recruiter === recruiter) &&
        (tag === "all" || c.tags.includes(tag)),
    );
    if (sort === "score") list = [...list].sort((a, b) => b.score - a.score);
    else if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else list = [...list].sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));
    return list;
  }, [cands, q, fit, status, recruiter, tag, sort]);

  if (!campaign) {
    return (
      <EmptyState
        icon={Users2}
        title="Campaign not found"
        description="This campaign does not exist."
        action={
          <Button asChild size="sm">
            <Link href="/hr/recruit/campaigns">Back to campaigns</Link>
          </Button>
        }
      />
    );
  }

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const openCand = cands.find((c) => c.id === openId) ?? null;
  const resetPage = <T,>(fn: (v: T) => void) => (v: T) => {
    fn(v);
    setPage(1);
  };

  const decide = (cid: string, key: "resume" | 1 | 2 | 3, value: DecisionValue) =>
    setCands((prev) => prev.map((c) => (c.id === cid ? applyDecision(c, key, value) : c)));

  const confirmPending = () => {
    if (!pending) return;
    decide(pending.id, pending.key, pending.value);
    const c = cands.find((x) => x.id === pending.id);
    toast.success(`${c?.name ?? "Candidate"}: ${pending.label}`);
    setPending(null);
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((p) => [...p, ...Array.from(list).map((f) => f.name)]);
  };

  const submitResumes = () => {
    toast.success(`${files.length} resume${files.length === 1 ? "" : "s"} submitted for AI scoring (demo)`);
    setFiles([]);
    setUploadTags([]);
  };

  return (
    <>
      <Link
        href="/hr/recruit/campaigns"
        className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to Campaigns
      </Link>
      <PageHeader
        title={campaign.title}
        description={`${campaign.department} · ${campaign.location} · Owner ${campaign.owner}`}
        badge={
          <Badge
            variant="secondary"
            className={cn(
              "hover:bg-transparent",
              campaign.status === "open" && "bg-success/15 text-success",
              campaign.status === "closed" && "bg-muted text-muted-foreground",
              campaign.status === "draft" && "bg-warning/15 text-warning",
            )}
          >
            {campaign.status}
          </Badge>
        }
        actions={
          <Button size="sm" variant="outline" onClick={() => toast.info("Campaign editing is available in the full product")}>
            Edit Campaign
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Total Candidates"
          value={String(stats.total)}
          icon={<Users className="size-4" />}
          iconClassName="bg-primary/10 text-primary"
          trend="up"
          trendValue={`+${Math.min(stats.total, 4)}`}
        />
        <KpiCard
          label="Average Score"
          value={stats.total ? String(stats.avgScore) : "—"}
          icon={<Gauge className="size-4" />}
          iconClassName="bg-accent/10 text-accent"
          trend="up"
          trendValue="+2"
        />
        <KpiCard
          label="Pass Rate"
          value={`${stats.passRate}%`}
          icon={<Percent className="size-4" />}
          iconClassName="bg-success/10 text-success"
          context="Cleared resume screening"
        />
        <KpiCard
          label="Pending Candidates"
          value={String(stats.pending)}
          icon={<Hourglass className="size-4" />}
          iconClassName="bg-warning/10 text-warning"
          context="Awaiting screening decision"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Campaign details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Description">{campaign.description}</Field>
            <Field label="Job description">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">
                {campaign.jdText}
              </pre>
            </Field>
            <div className="grid gap-3 sm:grid-cols-4">
              <Field label="Location">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-muted-foreground" /> {campaign.location}
                </span>
              </Field>
              <Field label="Duration">
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-3.5 text-muted-foreground" /> {fmtDate(campaign.startDate)} -{" "}
                  {fmtDate(campaign.endDate)}
                </span>
              </Field>
              <Field label="Salary">
                <span className="flex items-center gap-1">
                  <Wallet className="size-3.5 text-muted-foreground" /> {campaign.salaryMinLpa}-{campaign.salaryMaxLpa}{" "}
                  LPA
                </span>
              </Field>
              <Field label="Expected joining">{fmtDate(campaign.expectedJoining)}</Field>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {campaign.skills.map((s) => (
                <Badge key={s} variant="outline" className="text-[10px]">
                  {s}
                </Badge>
              ))}
              {campaign.quickHire && <Badge className="text-[10px]">Quick hire</Badge>}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interview rounds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="text-[10px]">
                  R0
                </Badge>
                Resume Screening
              </div>
              {campaign.rounds.map((r, i) => (
                <div key={r} className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-[10px]">
                    R{i + 1}
                  </Badge>
                  {r}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Status breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.byStage.map((s) => (
                <BarRow key={s.key} label={s.label} value={s.count} max={Math.max(1, stats.total)} />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Scoring weights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <BarRow label="Skills" value={campaign.weights.skills} max={100} suffix="%" />
              <BarRow label="Experience" value={campaign.weights.experience} max={100} suffix="%" />
              <BarRow label="Education" value={campaign.weights.education} max={100} suffix="%" />
              <BarRow label="JD alignment" value={campaign.weights.jd} max={100} suffix="%" />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Upload resumes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div
            className="rounded-lg border-2 border-dashed p-6 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              addFiles(e.dataTransfer.files);
            }}
          >
            <Upload className="mx-auto mb-2 size-6 text-muted-foreground" />
            <p className="text-sm font-medium">Drag and drop resumes here</p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, Word (DOCX - auto-converted to PDF), and image files (PNG, JPG, GIF, WEBP)
            </p>
            <div className="mt-3 flex justify-center gap-2">
              <Button size="sm" onClick={() => fileRef.current?.click()}>
                <Upload className="size-3.5" /> Upload Files
              </Button>
              <Button size="sm" variant="outline" onClick={() => folderRef.current?.click()}>
                <FolderUp className="size-3.5" /> Upload Folder
              </Button>
            </div>
            <input ref={fileRef} type="file" multiple hidden onChange={(e) => addFiles(e.target.files)} />
            <input ref={folderRef} type="file" multiple hidden onChange={(e) => addFiles(e.target.files)} />
          </div>
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {files.map((f, i) => (
                  <Badge key={`${f}-${i}`} variant="secondary" className="gap-1">
                    {f}
                    <button onClick={() => setFiles((p) => p.filter((_, k) => k !== i))}>
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Input
                  className="max-w-sm"
                  value={tagInput}
                  placeholder="Type a tag and press Enter (e.g. Senior, Remote, Python)"
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && tagInput.trim()) {
                      e.preventDefault();
                      setUploadTags((p) => [...p, tagInput.trim()]);
                      setTagInput("");
                    }
                  }}
                />
                {uploadTags.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </div>
              <Button size="sm" onClick={submitResumes}>
                <Send className="size-3.5" /> Submit Resumes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-3 mt-6 flex flex-wrap items-center gap-2">
        <SuggestiveSearch
          value={q}
          onChange={resetPage(setQ)}
          suggestions={cands.slice(0, 8).map((c) => c.name)}
        />
        <FilterSelect
          value={fit}
          onChange={resetPage(setFit)}
          placeholder="All Fit"
          options={[
            ["High", "High"],
            ["Medium", "Medium"],
            ["Low", "Low"],
          ]}
        />
        <FilterSelect
          value={status}
          onChange={resetPage(setStatus)}
          placeholder="All Statuses"
          options={STAGE_ORDER.map((s) => [s, STAGE_LABELS[s]])}
        />
        <FilterSelect
          value={recruiter}
          onChange={resetPage(setRecruiter)}
          placeholder="All Recruiters"
          options={recruiters.map((r) => [r, r])}
        />
        <FilterSelect
          value={tag}
          onChange={resetPage(setTag)}
          placeholder="All Tags"
          options={allTags.map((t) => [t, t])}
        />
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Sort: Newest</SelectItem>
            <SelectItem value="score">Sort: Score</SelectItem>
            <SelectItem value="name">Sort: Name</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex rounded-lg border p-0.5">
          <Button size="icon-sm" variant={view === "grid" ? "secondary" : "ghost"} onClick={() => setView("grid")} title="Card view">
            <LayoutGrid />
          </Button>
          <Button size="icon-sm" variant={view === "list" ? "secondary" : "ghost"} onClick={() => setView("list")} title="List view">
            <List />
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users2} title="No candidates" description="No candidates match the current filters." />
      ) : view === "grid" ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {slice.map((c) => {
            const step = nextDecisionStep(c);
            const rejected = isRejected(c);
            return (
              <Card
                key={c.id}
                className={cn("cursor-pointer gap-3 py-4 transition-shadow hover:shadow-md", rejected && "opacity-70")}
                onClick={() => setOpenId(c.id)}
              >
                <CardContent className="space-y-3 px-4">
                  <div className="flex items-start gap-3">
                    <NameAvatar name={c.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.role} · {c.city} · #{c.id}
                      </p>
                    </div>
                    <ScoreNumber score={c.score} className="text-xl" />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <FitBadge fit={c.fit} />
                    <StageChip stage={getCandidateStage(c)} />
                    {c.tags.map((t) => (
                      <Badge key={t} variant="outline" className="text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <Journey c={c} />
                  {rejected ? (
                    <p className="border-t pt-2 text-xs font-semibold text-destructive">Rejected</p>
                  ) : step ? (
                    <div
                      className="flex items-center gap-2 border-t pt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-xs font-semibold text-muted-foreground">{step.label}?</span>
                      <div className="ml-auto flex gap-1">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() =>
                            setPending({
                              id: c.id,
                              key: step.key,
                              value: step.isLast ? "hire" : "yes",
                              label: step.isLast ? "Hire" : "Yes",
                            })
                          }
                        >
                          {step.isLast ? "Hire" : "Yes"}
                        </Button>
                        {step.isLast && (
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => setPending({ id: c.id, key: step.key, value: "reserve", label: "Reserve" })}
                          >
                            Reserve
                          </Button>
                        )}
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => setPending({ id: c.id, key: step.key, value: "no", label: "No" })}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Fit</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Recruiter</TableHead>
                <TableHead>Applied</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slice.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => setOpenId(c.id)}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <NameAvatar name={c.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{c.city}</TableCell>
                  <TableCell>
                    <ScoreNumber score={c.score} />
                  </TableCell>
                  <TableCell>
                    <FitBadge fit={c.fit} />
                  </TableCell>
                  <TableCell>
                    <StageChip stage={getCandidateStage(c)} />
                  </TableCell>
                  <TableCell>{c.recruiter}</TableCell>
                  <TableCell>{fmtDate(c.appliedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {(safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length} candidates
          </span>
          <div className="flex items-center gap-1">
            <Button size="icon-sm" variant="outline" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
              <ChevronLeft />
            </Button>
            <span className="px-2">
              {safePage} / {pages}
            </span>
            <Button size="icon-sm" variant="outline" disabled={safePage >= pages} onClick={() => setPage(safePage + 1)}>
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}

      <CandidateDialog candidate={openCand} onOpenChange={(o) => !o && setOpenId(null)} onDecision={decide} />

      <Dialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pending?.value === "hire"
                ? `Hire ${cands.find((c) => c.id === pending.id)?.name}?`
                : `Confirm ${pending?.label}?`}
            </DialogTitle>
            <DialogDescription>
              {pending?.value === "hire"
                ? `This candidate will be selected for the role of ${campaign.title}.`
                : `Mark ${cands.find((c) => c.id === pending?.id)?.name ?? "candidate"} as ${pending?.label} for this step?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button variant={pending?.value === "no" ? "destructive" : "default"} onClick={confirmPending}>
              Yes, {pending?.label}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[][];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-[150px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {options.map(([v, l]) => (
          <SelectItem key={v} value={v}>
            {l}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Journey({ c }: { c: Candidate }) {
  const stage = getCandidateStage(c);
  const doneResume = c.resumeDecision !== "";
  const labels = ["Screening", ...c.rounds.map((_, i) => `R${i + 1}`)];
  const current =
    stage === "screening"
      ? 0
      : stage === "hired" || stage === "reserve"
        ? labels.length
        : stage === "rejected"
          ? -1
          : Number(stage.replace("round", ""));
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {labels.map((l, i) => {
        const done = current === -1 ? false : i < current || (i === 0 && doneResume && current > 0);
        const isCur = i === current;
        return (
          <div key={l} className="flex items-center gap-1.5">
            {i > 0 && <span className={cn("size-1.5 rounded-full", done ? "bg-success" : "bg-border")} />}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px]",
                isCur ? "bg-primary/15 font-semibold text-primary" : done ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {l}
            </span>
          </div>
        );
      })}
    </div>
  );
}
