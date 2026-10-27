"use client";

import * as React from "react";
import { Search, Bot, User, ScrollText } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { AuditLogCharts } from "@/components/settings/audit-log-charts";
import { RelativeTime } from "@/components/shared/relative-time";
import { MOCK_AUDIT_LOG } from "@/lib/mock-data/approvals";

export function AuditLogTable() {
  const [search, setSearch] = React.useState("");
  const [actorFilter, setActorFilter] = React.useState("all");

  const filtered = MOCK_AUDIT_LOG.filter((entry) => {
    if (actorFilter !== "all" && entry.actorType !== actorFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !entry.actorName.toLowerCase().includes(q) &&
        !entry.action.toLowerCase().includes(q) &&
        !entry.targetType.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <>
      <PageHeader title="Audit Log" description="Every user change and AI agent action, with cost where applicable." />

      <AuditLogCharts />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search actor, action, target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>
        <Select value={actorFilter} onValueChange={setActorFilter}>
          <SelectTrigger size="sm" className="h-8 w-40 text-xs">
            <SelectValue placeholder="Actor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actors</SelectItem>
            <SelectItem value="user">Users</SelectItem>
            <SelectItem value="agent">AI agents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ScrollText} title="No matching log entries" description="Try a different search or filter." />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="flex items-center gap-1.5 font-medium">
                    {entry.actorType === "agent" ? (
                      <Bot className="size-3.5 text-accent" />
                    ) : (
                      <User className="size-3.5 text-primary" />
                    )}
                    {entry.actorName}
                  </TableCell>
                  <TableCell className="capitalize">{entry.action}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {entry.targetType} · {entry.targetId}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {entry.costUsd ? `$${entry.costUsd.toFixed(4)}` : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground"><RelativeTime iso={entry.createdAt} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
