"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { KanbanSquare } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ListToolbar } from "@/components/hr/list-toolbar";
import { FitScoreBadge } from "@/components/hr/fit-score";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  CANDIDATE_HR_FIELDS,
  MOCK_JOBS,
  STAGE_LABELS,
  STAGE_ORDER,
  getJob,
  stageConversionRates,
  type CandidateStage,
} from "@/lib/mock-data/hr";
import { MOCK_CONTACTS } from "@/lib/mock-data/contacts";

export function PipelineClient() {
  const [search, setSearch] = useState("");
  const [jobId, setJobId] = useState<string>("all");

  const rows = useMemo(() => {
    return CANDIDATE_HR_FIELDS.map((hr) => ({
      hr,
      contact: MOCK_CONTACTS.find((c) => c.id === hr.contactId),
      job: getJob(hr.appliedJobId),
    }))
      .filter((r) => r.contact)
      .filter((r) => (jobId === "all" ? true : r.hr.appliedJobId === jobId))
      .filter((r) => (search ? r.contact!.name.toLowerCase().includes(search.toLowerCase()) : true));
  }, [search, jobId]);

  const columns: { stage: CandidateStage; items: typeof rows }[] = STAGE_ORDER.map((stage) => ({
    stage,
    items: rows.filter((r) => r.hr.stage === stage),
  }));

  const isEmpty = rows.length === 0;
  const conversions = useMemo(() => stageConversionRates(), []);

  return (
    <>
      <PageHeader title="Pipeline" description="Candidates by stage, from sourcing through to hire." />

      <Card className="overflow-x-auto">
        <CardContent className="flex items-center gap-4 px-4 py-3 text-xs">
          {conversions.map((c) => (
            <div key={`${c.fromStage}-${c.toStage}`} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-muted-foreground">
                {STAGE_LABELS[c.fromStage]} → {STAGE_LABELS[c.toStage]}
              </span>
              <span
                className={
                  c.rate >= 60 ? "font-semibold text-success" : c.rate >= 30 ? "font-semibold text-warning" : "font-semibold text-destructive"
                }
              >
                {c.rate}%
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search pipeline...">
        <Select value={jobId} onValueChange={setJobId}>
          <SelectTrigger className="h-9 w-[200px]">
            <SelectValue placeholder="Job" />
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
      </ListToolbar>

      {isEmpty ? (
        <EmptyState
          icon={KanbanSquare}
          title="No candidates in the pipeline"
          description="Try a different search or job filter."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 overflow-x-auto pb-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {columns.map((col) => (
            <div key={col.stage} className="min-w-[220px]">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-sm font-semibold">{STAGE_LABELS[col.stage]}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{col.items.length}</span>
                  {col.items.length > 0 && (
                    <span>
                      · avg{" "}
                      {Math.round(
                        col.items.reduce((sum, r) => sum + r.hr.fitScore, 0) / col.items.length
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {col.items.map(({ hr, contact, job }) => (
                  <Link key={contact!.id} href={`/hr/recruit/candidates/${contact!.id}`}>
                    <Card className="gap-2 py-3 transition-colors hover:border-primary/40">
                      <CardContent className="space-y-1.5 px-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium">{contact!.name}</p>
                          <FitScoreBadge score={hr.fitScore} />
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{job?.title}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                {col.items.length === 0 && (
                  <div className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                    No candidates
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
