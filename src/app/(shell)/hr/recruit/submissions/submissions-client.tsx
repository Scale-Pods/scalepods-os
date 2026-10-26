"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Send } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ListToolbar } from "@/components/hr/list-toolbar";
import { StaffingModeBadge } from "@/components/hr/staffing-mode-badge";
import { StatusBadge } from "@/components/shared/badges";
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
  MOCK_SUBMISSIONS,
  getClient,
  getRequisition,
  anonymisedLabel,
  submissionsByClient,
  type SubmissionFeedback,
} from "@/lib/mock-data/hr";
import { getCompany } from "@/lib/mock-data/contacts";

export function SubmissionsClient() {
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<SubmissionFeedback | "all">("all");
  const byClient = useMemo(() => submissionsByClient(), []);

  const rows = useMemo(() => {
    return MOCK_SUBMISSIONS.map((submission) => {
      const client = getClient(submission.clientId);
      const company = client ? getCompany(client.companyId) : undefined;
      const requisition = getRequisition(submission.requisitionId);
      return { submission, company, requisition };
    })
      .filter((r) => (feedback === "all" ? true : r.submission.clientFeedback === feedback))
      .filter((r) =>
        search
          ? `${anonymisedLabel(r.submission.candidateContactId)} ${r.company?.name ?? ""}`
              .toLowerCase()
              .includes(search.toLowerCase())
          : true
      )
      .sort((a, b) => new Date(b.submission.submittedAt).getTime() - new Date(a.submission.submittedAt).getTime());
  }, [search, feedback]);

  return (
    <>
      <PageHeader
        title="Submissions"
        description="Candidate submissions sent to clients, shown anonymised until the client shortlists."
        badge={<StaffingModeBadge />}
      />

      <HorizontalBarChart
        data={byClient.map((c) => ({ label: c.clientName, value: c.count }))}
        title="Submissions by client"
        valueLabel="Submissions"
        color="var(--accent)"
        height={200}
      />

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search submissions...">
        <Select value={feedback} onValueChange={(v) => setFeedback(v as SubmissionFeedback | "all")}>
          <SelectTrigger className="h-9 w-[170px]">
            <SelectValue placeholder="Client feedback" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All feedback</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </ListToolbar>

      {rows.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No submissions found"
          description="Try a different search or filter."
        />
      ) : (
        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Requisition</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Client feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ submission, company, requisition }) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{anonymisedLabel(submission.candidateContactId)}</TableCell>
                  <TableCell className="text-muted-foreground">{company?.name}</TableCell>
                  <TableCell className="text-muted-foreground">{requisition?.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(submission.submittedAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={submission.clientFeedback} />
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
