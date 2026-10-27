"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { AccountBadge } from "@/components/sales/outreach-system/account-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { MOCK_EMAIL_BOUNCES, EMAIL_METRICS } from "@/lib/mock-data/outreach-system";

export default function EmailBouncesPage() {
  const [search, setSearch] = React.useState("");

  const filtered = MOCK_EMAIL_BOUNCES.filter(
    (e) =>
      e.recipient.toLowerCase().includes(search.toLowerCase()) ||
      e.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Bounces"
        description={`${EMAIL_METRICS.bounced.toLocaleString()} bounced sends total — showing a recent sample log.`}
      />

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search recipient or company..." />

      <Card>
        <CardContent className="px-0 py-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Recipient</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Account</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Reason</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Bounced</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <p className="font-medium">{row.recipient}</p>
                      <p className="text-xs text-muted-foreground">{row.company}</p>
                    </TableCell>
                    <TableCell><AccountBadge account={row.account} /></TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-0 bg-destructive/15 text-destructive">
                        {row.reason}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(row.bouncedAt).toLocaleString()}
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
