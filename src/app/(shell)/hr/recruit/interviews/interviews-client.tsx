"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ListToolbar } from "@/components/hr/list-toolbar";
import { StatusBadge } from "@/components/shared/badges";
import { InterviewQuestionsDialog } from "@/components/hr/interview-questions-dialog";
import { WeeklyVolumeChart } from "@/components/hr/weekly-volume-chart";
import { HorizontalBarChart } from "@/components/hr/horizontal-bar-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MOCK_INTERVIEWS,
  getJob,
  weeklyInterviewVolume,
  interviewerWorkloadThisWeek,
  type Interview,
} from "@/lib/mock-data/hr";
import { MOCK_CONTACTS } from "@/lib/mock-data/contacts";

export function InterviewsClient() {
  const [now] = useState(() => Date.now());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Interview["status"] | "all">("all");
  const volume = useMemo(() => weeklyInterviewVolume(8, now), [now]);
  const workload = useMemo(() => interviewerWorkloadThisWeek(now), [now]);

  const rows = useMemo(() => {
    return MOCK_INTERVIEWS.map((interview) => ({
      interview,
      contact: MOCK_CONTACTS.find((c) => c.id === interview.candidateContactId),
      job: getJob(interview.jobId),
    }))
      .filter((r) => r.contact)
      .filter((r) => (status === "all" ? true : r.interview.status === status))
      .filter((r) => (search ? r.contact!.name.toLowerCase().includes(search.toLowerCase()) : true))
      .sort((a, b) => new Date(a.interview.scheduledAt).getTime() - new Date(b.interview.scheduledAt).getTime());
  }, [search, status]);

  return (
    <>
      <PageHeader title="Interviews" description="Scheduled and completed interviews across all open roles." />

      <div className="grid gap-4 lg:grid-cols-2">
        <WeeklyVolumeChart data={volume} title="Weekly interview volume, last 8 weeks" />
        <HorizontalBarChart
          data={workload.map((w) => ({ label: w.interviewer, value: w.count }))}
          title="Interviewer workload this week"
          valueLabel="Interviews"
          color="var(--accent)"
          height={240}
        />
      </div>

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search interviews...">
        <Select value={status} onValueChange={(v) => setStatus(v as Interview["status"] | "all")}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </ListToolbar>

      {rows.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No interviews found"
          description="Try a different search or filter."
        />
      ) : (
        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Time slot</TableHead>
                <TableHead>Interviewer</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ interview, contact, job }) => (
                <TableRow key={interview.id}>
                  <TableCell className="font-medium">
                    <Link href={`/hr/recruit/candidates/${contact!.id}`} className="hover:underline">
                      {contact!.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{job?.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(interview.scheduledAt), "MMM d, h:mm a")} · {interview.durationMins} min
                  </TableCell>
                  <TableCell className="text-muted-foreground">{interview.interviewer}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">{interview.mode}</TableCell>
                  <TableCell>
                    <StatusBadge status={interview.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <InterviewQuestionsDialog candidateName={contact!.name} job={job} />
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
