"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BillDetailDialog, type BillTab } from "./bill-detail-dialog";
import { EmptyRow, StatusPill, TwoLine, fmtDate, inr } from "./shared";
import type { RecoveryOutreachRow } from "@/lib/mock-data/receivables";

export function RecentActivityTable({
  rows,
  tab = "overview",
  emptyMessage = "No outreach activity yet.",
}: {
  rows: RecoveryOutreachRow[];
  tab?: BillTab;
  emptyMessage?: string;
}) {
  const [open, setOpen] = React.useState<string | null>(null);

  return (
    <>
      <Card>
        <CardContent className="px-0 py-0">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Recent activity</h3>
            <p className="text-xs text-muted-foreground">Click a row to open the bill, customer and every message.</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {["Party", "Outstanding", "Stage", "Status", "Next action"].map((h) => (
                    <TableHead key={h} className="text-[11px] uppercase text-muted-foreground">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <EmptyRow colSpan={5} message={emptyMessage} />
                ) : (
                  rows.map((r) => (
                    <TableRow key={r.id} className="cursor-pointer" onClick={() => setOpen(r.bill_no)}>
                      <TableCell>
                        <TwoLine primary={r.party_name} secondary={r.bill_no} />
                      </TableCell>
                      <TableCell className="tabular-nums">{inr(r.total_outstanding)}</TableCell>
                      <TableCell className="text-sm">{r.current_stage}</TableCell>
                      <TableCell>
                        <StatusPill status={r.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {r.next_action}
                        {r.next_action_date ? ` · ${fmtDate(r.next_action_date)}` : ""}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <BillDetailDialog billNo={open} tab={tab} onClose={() => setOpen(null)} />
    </>
  );
}
