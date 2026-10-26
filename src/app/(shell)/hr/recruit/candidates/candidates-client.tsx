"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { Users2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ListToolbar } from "@/components/hr/list-toolbar";
import { BulkUploadDialog } from "@/components/hr/bulk-upload-dialog";
import { FitScoreBar } from "@/components/hr/fit-score";
import { StageBadge } from "@/components/hr/stage-badge";
import { FitScoreHistogram } from "@/components/hr/fit-score-histogram";
import { SourceBreakdownChart } from "@/components/hr/source-breakdown-chart";
import { FunnelChart } from "@/components/hr/funnel-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CANDIDATE_HR_FIELDS,
  MOCK_JOBS,
  STAGE_LABELS,
  type CandidateStage,
  getJob,
  buildFitScoreHistogram,
  candidateSourceBreakdown,
  buildFunnel,
} from "@/lib/mock-data/hr";
import { MOCK_CONTACTS } from "@/lib/mock-data/contacts";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function CandidatesClient() {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<CandidateStage | "all">("all");
  const [jobId, setJobId] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    return CANDIDATE_HR_FIELDS.map((hr) => ({
      hr,
      contact: MOCK_CONTACTS.find((c) => c.id === hr.contactId),
      job: getJob(hr.appliedJobId),
    }))
      .filter((r) => r.contact)
      .filter((r) => (stage === "all" ? true : r.hr.stage === stage))
      .filter((r) => (jobId === "all" ? true : r.hr.appliedJobId === jobId))
      .filter((r) =>
        search ? r.contact!.name.toLowerCase().includes(search.toLowerCase()) : true
      )
      .sort((a, b) => b.hr.fitScore - a.hr.fitScore);
  }, [search, stage, jobId]);

  function toggleAll() {
    if (selected.size === rows.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(rows.map((r) => r.contact!.id)));
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  const histogram = useMemo(() => buildFitScoreHistogram(), []);
  const sourceBreakdown = useMemo(() => candidateSourceBreakdown(), []);
  const funnel = useMemo(() => buildFunnel(), []);

  return (
    <>
      <PageHeader
        title="Candidates"
        description="All candidates sourced, screened and ranked by AI fit score."
        actions={<BulkUploadDialog />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <FitScoreHistogram data={histogram} height={200} />
        <SourceBreakdownChart data={sourceBreakdown} height={200} />
        <FunnelChart data={funnel} title="Stage funnel" height={200} />
      </div>

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search candidates...">
        <Select value={stage} onValueChange={(v) => setStage(v as CandidateStage | "all")}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {Object.entries(STAGE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={jobId} onValueChange={setJobId}>
          <SelectTrigger className="h-9 w-[200px]">
            <SelectValue placeholder="Applied job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All jobs</SelectItem>
            {MOCK_JOBS.map((job) => (
              <SelectItem key={job.id} value={job.id}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selected.size > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{selected.size} selected</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.success(`Moved ${selected.size} candidate(s) to a new stage`);
                setSelected(new Set());
              }}
            >
              Move stage
            </Button>
            <Button
              size="sm"
              onClick={() => {
                toast.success(`AI outreach queued for ${selected.size} candidate(s)`, {
                  description: "Drafts will appear in Approvals before sending.",
                });
                setSelected(new Set());
              }}
            >
              Send outreach
            </Button>
          </div>
        )}
      </ListToolbar>

      {rows.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="No candidates found"
          description="Try a different search or filter, or bulk-upload CVs to add new candidates."
        />
      ) : (
        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={selected.size > 0 && selected.size === rows.length}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Applied job</TableHead>
                <TableHead>Fit score</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Applied</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ hr, contact, job }) => (
                <TableRow key={contact!.id} data-state={selected.has(contact!.id) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox
                      checked={selected.has(contact!.id)}
                      onCheckedChange={() => toggleOne(contact!.id)}
                      aria-label={`Select ${contact!.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Link href={`/hr/recruit/candidates/${contact!.id}`} className="flex items-center gap-2 font-medium hover:underline">
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[10px]">{initials(contact!.name)}</AvatarFallback>
                      </Avatar>
                      {contact!.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{job?.title ?? "—"}</TableCell>
                  <TableCell>
                    <FitScoreBar score={hr.fitScore} />
                  </TableCell>
                  <TableCell>
                    <StageBadge stage={hr.stage} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{contact!.source}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(hr.appliedAt), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  );
}
