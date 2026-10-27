"use client";

import * as React from "react";
import { toast } from "sonner";
import { Users, UserX, MoreHorizontal, ListChecks } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/badges";
import { InitialsAvatar } from "@/components/sales/initials-avatar";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { DonutBreakdownChart } from "@/components/sales/charts/donut-breakdown-chart";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MOCK_ENROLLMENTS, MOCK_SEQUENCES, sequenceById, enrollmentStatusBreakdown } from "@/lib/mock-data/sales";
import { MOCK_CONTACTS } from "@/lib/mock-data/contacts";
import { RelativeTime } from "@/components/shared/relative-time";

export default function EnrollmentsPage() {
  const [search, setSearch] = React.useState("");
  const [sequenceFilter, setSequenceFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [unsubscribed, setUnsubscribed] = React.useState<Record<string, boolean>>({});

  const enrollments = MOCK_ENROLLMENTS;

  const activeCount = enrollments.filter((e) => e.status === "active").length;
  const repliedCount = enrollments.filter((e) => e.status === "replied").length;
  const unsubRate = Math.round(
    (enrollments.filter((e) => e.status === "unsubscribed").length / enrollments.length) * 100
  );
  const statusBreakdown = React.useMemo(() => enrollmentStatusBreakdown(enrollments), [enrollments]);

  const filtered = enrollments.filter((e) => {
    const contact = MOCK_CONTACTS.find((c) => c.id === e.contactId);
    if (sequenceFilter !== "all" && e.sequenceId !== sequenceFilter) return false;
    const status = unsubscribed[e.id] ? "unsubscribed" : e.status;
    if (statusFilter !== "all" && status !== statusFilter) return false;
    if (search && !contact?.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        title="Enrollments"
        description="Contacts currently moving through Outreach sequences."
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Active enrollments" value={String(activeCount)} context="In progress" icon={<ListChecks className="size-4" />} />
        <KpiCard label="Replied" value={String(repliedCount)} context="Responded to outreach" trend="up" trendValue="+4" icon={<Users className="size-4" />} />
        <KpiCard label="Unsubscribe rate" value={`${unsubRate}%`} context="Of all enrollments" trend="flat" trendValue="0pts" icon={<UserX className="size-4" />} />
      </div>

      <Card className="mb-6">
        <CardContent className="px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold">Enrollment status breakdown</h3>
          <DonutBreakdownChart data={statusBreakdown} height={180} />
        </CardContent>
      </Card>

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search contact name...">
        <Select value={sequenceFilter} onValueChange={setSequenceFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sequence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sequences</SelectItem>
            {MOCK_SEQUENCES.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
          </SelectContent>
        </Select>
      </ListToolbar>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No enrollments match your filters" description="Try a different sequence or status filter." />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Sequence</TableHead>
                <TableHead>Current step</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => {
                const contact = MOCK_CONTACTS.find((c) => c.id === e.contactId);
                const sequence = sequenceById(e.sequenceId);
                const status = unsubscribed[e.id] ? "unsubscribed" : e.status;
                if (!contact || !sequence) return null;
                return (
                  <TableRow key={e.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <InitialsAvatar name={contact.name} size="sm" />
                        <span className="font-medium">{contact.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{sequence.name}</TableCell>
                    <TableCell>
                      {e.currentStep} / {sequence.steps.length}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground"><RelativeTime iso={e.enrolledAt} /></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.success(`Paused enrollment for ${contact.name}`)}>
                            Pause
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            disabled={status === "unsubscribed"}
                            onClick={() => {
                              setUnsubscribed((prev) => ({ ...prev, [e.id]: true }));
                              toast.success(`${contact.name} unsubscribed / opted out`, {
                                description: "They will not receive further sequence messages.",
                              });
                            }}
                          >
                            Unsubscribe / opt-out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
