"use client";

import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  MOCK_EMAIL_RECEIVED,
  MOCK_EMAIL_THREADS,
  type EmailReceivedEntry,
} from "@/lib/mock-data/outreach-system";

export default function EmailReceivedPage() {
  const [search, setSearch] = React.useState("");
  const [active, setActive] = React.useState<EmailReceivedEntry | null>(null);

  const filtered = MOCK_EMAIL_RECEIVED.filter(
    (e) =>
      e.sender.toLowerCase().includes(search.toLowerCase()) ||
      e.company.toLowerCase().includes(search.toLowerCase())
  );

  const activeThread = active ? MOCK_EMAIL_THREADS.find((t) => t.id === active.threadId) : null;

  return (
    <>
      <PageHeader title="Received Emails" description="Inbound replies and auto-replies across all inboxes." />

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search sender or company..." />

      <Card>
        <CardContent className="px-0 py-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">From</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Subject</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Account</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id} className="cursor-pointer" onClick={() => setActive(row)}>
                    <TableCell>
                      <p className="font-medium">{row.sender}</p>
                      <p className="text-xs text-muted-foreground">{row.company}</p>
                    </TableCell>
                    <TableCell className="max-w-64 truncate">{row.subject}</TableCell>
                    <TableCell><AccountBadge account={row.account} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(row.receivedAt).toLocaleString()}
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

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {active && (
            <>
              <DialogHeader>
                <DialogTitle>{active.sender}</DialogTitle>
              </DialogHeader>
              <p className="text-xs text-muted-foreground">{active.company}</p>
              {activeThread ? (
                <div className="max-h-[55vh] space-y-2 overflow-y-auto py-2">
                  {activeThread.messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn("flex", m.direction === "outbound" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                          m.direction === "outbound" ? "bg-primary/15 text-foreground" : "bg-muted text-foreground"
                        )}
                      >
                        {m.body}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">No messages in this thread yet.</p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
