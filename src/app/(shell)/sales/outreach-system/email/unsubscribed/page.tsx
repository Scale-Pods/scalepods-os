"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { AccountBadge } from "@/components/sales/outreach-system/account-badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { MOCK_EMAIL_UNSUBSCRIBES, EMAIL_METRICS } from "@/lib/mock-data/outreach-system";

export default function EmailUnsubscribedPage() {
  const [search, setSearch] = React.useState("");

  const filtered = MOCK_EMAIL_UNSUBSCRIBES.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Unsubscribed"
        description={`${EMAIL_METRICS.unsubscribed.toLocaleString()} contacts have opted out — showing a recent sample log.`}
      />

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search name or email..." />

      <Card>
        <CardContent className="px-0 py-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Name</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Email</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Account</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Unsubscribed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{row.email}</TableCell>
                    <TableCell><AccountBadge account={row.account} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(row.unsubscribedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="border-t bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            Showing {filtered.length} results
          </div>
        </CardContent>
      </Card>
    </>
  );
}
