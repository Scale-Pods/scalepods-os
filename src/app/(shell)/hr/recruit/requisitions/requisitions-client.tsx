"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ClipboardList } from "lucide-react";
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
  MOCK_REQUISITIONS,
  getClient,
  getJob,
  requisitionsByStatus,
  type Requisition,
} from "@/lib/mock-data/hr";
import { getCompany } from "@/lib/mock-data/contacts";

const STATUS_LABELS: Record<Requisition["status"], string> = {
  open: "Open",
  "on-hold": "On hold",
  filled: "Filled",
  closed: "Closed",
};

export function RequisitionsClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Requisition["status"] | "all">("all");
  const byStatus = useMemo(
    () => requisitionsByStatus().map((s) => ({ label: STATUS_LABELS[s.status], value: s.count })),
    []
  );

  const rows = useMemo(() => {
    return MOCK_REQUISITIONS.map((req) => {
      const client = getClient(req.clientId);
      const company = client ? getCompany(client.companyId) : undefined;
      const job = getJob(req.jobId);
      return { req, client, company, job };
    })
      .filter((r) => (status === "all" ? true : r.req.status === status))
      .filter((r) =>
        search
          ? `${r.req.title} ${r.company?.name ?? ""}`.toLowerCase().includes(search.toLowerCase())
          : true
      )
      .sort((a, b) => new Date(b.req.createdAt).getTime() - new Date(a.req.createdAt).getTime());
  }, [search, status]);

  return (
    <>
      <PageHeader
        title="Requisitions"
        description="Open headcount requests from clients, each linked to a job."
        badge={<StaffingModeBadge />}
      />

      <HorizontalBarChart
        data={byStatus}
        title="Requisitions by status"
        valueLabel="Requisitions"
        height={180}
      />

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search requisitions...">
        <Select value={status} onValueChange={(v) => setStatus(v as Requisition["status"] | "all")}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="on-hold">On hold</SelectItem>
            <SelectItem value="filled">Filled</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </ListToolbar>

      {rows.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No requisitions found"
          description="Try a different search or filter."
        />
      ) : (
        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requisition</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Candidates submitted</TableHead>
                <TableHead>Opened</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ req, company, job }) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.title}</TableCell>
                  <TableCell className="text-muted-foreground">{company?.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {job ? (
                      <Link href={`/hr/recruit/jobs/${job.id}`} className="hover:underline">
                        {job.title}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                  <TableCell>{req.candidatesSubmitted}</TableCell>
                  <TableCell className="text-muted-foreground">{format(new Date(req.createdAt), "MMM d, yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  );
}
