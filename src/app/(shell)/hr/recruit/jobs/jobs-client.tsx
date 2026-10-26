"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/badges";
import { ListToolbar } from "@/components/hr/list-toolbar";
import { NewJobDialog } from "@/components/hr/new-job-dialog";
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
import { Card } from "@/components/ui/card";
import { KpiCard } from "@/components/shared/kpi-card";
import {
  MOCK_JOBS,
  candidatesForJob,
  candidatesInPipelineCount,
  avgTimeToFillDays,
  offersPendingCount,
  type JobStatus,
} from "@/lib/mock-data/hr";
import { format } from "date-fns";

export function JobsClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<JobStatus | "all">("all");

  const jobs = useMemo(() => {
    return MOCK_JOBS.filter((job) => {
      if (status !== "all" && job.status !== status) return false;
      if (search && !`${job.title} ${job.department} ${job.location}`.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [search, status]);

  const openRoles = MOCK_JOBS.filter((j) => j.status === "open").length;
  const pipelineCount = candidatesInPipelineCount();
  const avgTimeToFill = avgTimeToFillDays();
  const pendingOffers = offersPendingCount();

  return (
    <>
      <PageHeader
        title="Jobs"
        description="Open roles sourced from clients and internal hiring needs."
        actions={<NewJobDialog />}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Open roles" value={String(openRoles)} context={`${MOCK_JOBS.length} total jobs`} />
        <KpiCard label="Avg. time-to-fill" value={`${avgTimeToFill}d`} context="Closed roles, applied → hired" />
        <KpiCard label="Candidates in pipeline" value={String(pipelineCount)} context="Active across all open roles" />
        <KpiCard label="Offers pending" value={String(pendingOffers)} context="Sent or viewed, awaiting response" />
      </div>

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search jobs...">
        <Select value={status} onValueChange={(v) => setStatus(v as JobStatus | "all")}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </ListToolbar>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description="Try a different search term or filter, or create a new job to get started."
        />
      ) : (
        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>In pipeline</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id} className="cursor-pointer">
                  <TableCell className="font-medium">
                    <Link href={`/hr/recruit/jobs/${job.id}`} className="hover:underline">
                      {job.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{job.department}</TableCell>
                  <TableCell className="text-muted-foreground">{job.location}</TableCell>
                  <TableCell>
                    <StatusBadge status={job.status} />
                  </TableCell>
                  <TableCell>{candidatesForJob(job.id).length}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(job.createdAt), "MMM d, yyyy")}
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
