"use client";

import * as React from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_ASSIGNABLE_LEADS } from "@/lib/mock-data/outreach-system";
import { MEMBERS } from "@/lib/mock-data/orgs";

const REPS = MEMBERS.filter((m) => m.orgId === "org-staffing-co");

export default function CampaignAssignPersonPage() {
  const [assignments, setAssignments] = React.useState<Record<string, string | null>>(
    () => Object.fromEntries(MOCK_ASSIGNABLE_LEADS.map((l) => [l.id, l.assignedMemberId]))
  );

  function assign(leadId: string, memberId: string) {
    setAssignments((prev) => ({ ...prev, [leadId]: memberId }));
    const rep = REPS.find((r) => r.id === memberId);
    toast.success(`Assigned to ${rep?.name ?? "rep"}`);
  }

  return (
    <>
      <PageHeader title="Assign Person" description="Assign unassigned campaign leads to a rep." />

      <Card>
        <CardContent className="px-0 py-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Lead</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Company</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Campaign</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Assigned Rep</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_ASSIGNABLE_LEADS.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{lead.company}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{lead.campaignName}</TableCell>
                    <TableCell>
                      <Select
                        value={assignments[lead.id] ?? undefined}
                        onValueChange={(v) => assign(lead.id, v)}
                      >
                        <SelectTrigger size="sm" className="w-40">
                          <SelectValue placeholder="Unassigned" />
                        </SelectTrigger>
                        <SelectContent>
                          {REPS.map((rep) => (
                            <SelectItem key={rep.id} value={rep.id}>
                              {rep.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="border-t bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            Showing {MOCK_ASSIGNABLE_LEADS.length} results
          </div>
        </CardContent>
      </Card>
    </>
  );
}
