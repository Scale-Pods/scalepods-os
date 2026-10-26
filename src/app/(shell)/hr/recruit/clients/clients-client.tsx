"use client";

import { useMemo, useState } from "react";
import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ListToolbar } from "@/components/hr/list-toolbar";
import { StaffingModeBadge } from "@/components/hr/staffing-mode-badge";
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
import { MOCK_CLIENTS, requisitionsForClient, clientHealthSummary } from "@/lib/mock-data/hr";
import { getCompany } from "@/lib/mock-data/contacts";

export function ClientsClient() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState<string>("all");

  const rows = useMemo(() => {
    return MOCK_CLIENTS.map((client) => ({ client, company: getCompany(client.companyId) }))
      .filter((r) => r.company)
      .filter((r) => (industry === "all" ? true : r.company!.industry === industry))
      .filter((r) => (search ? r.company!.name.toLowerCase().includes(search.toLowerCase()) : true));
  }, [search, industry]);

  const industries = Array.from(
    new Set(MOCK_CLIENTS.map((c) => getCompany(c.companyId)?.industry).filter(Boolean) as string[])
  );

  const health = useMemo(() => clientHealthSummary(), []);

  return (
    <>
      <PageHeader
        title="Clients"
        description="Client accounts this agency is recruiting for."
        badge={<StaffingModeBadge />}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <HorizontalBarChart
          data={health.map((h) => ({ label: h.clientName, value: h.openReqs }))}
          title="Open requisitions by client"
          valueLabel="Open reqs"
        />
        <HorizontalBarChart
          data={health.map((h) => ({ label: h.clientName, value: h.avgTimeToFillDays }))}
          title="Avg. time-to-fill by client (days)"
          valueLabel="Days"
          color="var(--accent)"
        />
      </div>

      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Open reqs</TableHead>
              <TableHead>Submissions this month</TableHead>
              <TableHead>Avg. time-to-fill</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {health.map((h) => (
              <TableRow key={h.clientId}>
                <TableCell className="font-medium">{h.clientName}</TableCell>
                <TableCell>{h.openReqs}</TableCell>
                <TableCell className="text-muted-foreground">{h.submissionsThisMonth}</TableCell>
                <TableCell className="text-muted-foreground">
                  {h.avgTimeToFillDays > 0 ? `${h.avgTimeToFillDays}d` : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search clients...">
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="h-9 w-[170px]">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All industries</SelectItem>
            {industries.map((i) => (
              <SelectItem key={i} value={i}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ListToolbar>

      {rows.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No clients found"
          description="Try a different search or filter."
        />
      ) : (
        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Contact person</TableHead>
                <TableHead>Open requisitions</TableHead>
                <TableHead>Submissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ client, company }) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{company!.name}</TableCell>
                  <TableCell className="text-muted-foreground">{company!.industry}</TableCell>
                  <TableCell className="text-muted-foreground">{client.contactPerson}</TableCell>
                  <TableCell>{client.openRequisitions}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {requisitionsForClient(client.id).reduce((sum, r) => sum + r.candidatesSubmitted, 0)}
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
