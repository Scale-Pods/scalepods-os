"use client";

import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  MOCK_EMAIL_LOG,
  MOCK_EMAIL_THREADS,
  type EmailLogEntry,
} from "@/lib/mock-data/outreach-system";

const STATUS_VARIANT: Record<EmailLogEntry["status"], { label: string; className: string }> = {
  delivered: { label: "Delivered", className: "bg-muted text-muted-foreground border-0" },
  opened: { label: "Opened", className: "bg-primary/15 text-primary border-0" },
  replied: { label: "Replied", className: "bg-success/15 text-success border-0" },
  bounced: { label: "Bounced", className: "bg-destructive/15 text-destructive border-0" },
};

export default function EmailSentLogPage() {
  const [search, setSearch] = React.useState("");
  const [active, setActive] = React.useState<EmailLogEntry | null>(null);

  const filtered = MOCK_EMAIL_LOG.filter(
    (e) =>
      e.recipient.toLowerCase().includes(search.toLowerCase()) ||
      e.company.toLowerCase().includes(search.toLowerCase())
  );

  const activeThread = active ? MOCK_EMAIL_THREADS.find((t) => t.id === active.threadId) : null;

  return (
    <>
      <PageHeader title="Sent Emails" description="Every email sent across all warmup inboxes." />

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search recipient or company..." />

      <Card>
        <CardContent className="px-0 py-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Recipient</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Subject</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Account</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Status</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Sent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id} className="cursor-pointer" onClick={() => setActive(row)}>
                    <TableCell>
                      <p className="font-medium">{row.recipient}</p>
                      <p className="text-xs text-muted-foreground">{row.company}</p>
                    </TableCell>
                    <TableCell className="max-w-64 truncate">{row.subject}</TableCell>
                    <TableCell><AccountBadge account={row.account} /></TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_VARIANT[row.status].className}>
                        {STATUS_VARIANT[row.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(row.sentAt).toLocaleString()}
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
                <DialogTitle>{active.recipient}</DialogTitle>
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
