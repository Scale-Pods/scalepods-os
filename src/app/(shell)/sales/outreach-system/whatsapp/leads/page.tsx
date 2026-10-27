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
  MOCK_WHATSAPP_LEADS,
  MOCK_WHATSAPP_THREADS,
  type WhatsappLead,
} from "@/lib/mock-data/outreach-system";

const STATUS_VARIANT: Record<WhatsappLead["status"], string> = {
  new: "bg-primary/15 text-primary border-0",
  engaged: "bg-warning/15 text-warning border-0",
  replied: "bg-success/15 text-success border-0",
  unresponsive: "bg-muted text-muted-foreground border-0",
};

export default function WhatsappLeadsPage() {
  const [search, setSearch] = React.useState("");
  const [active, setActive] = React.useState<WhatsappLead | null>(null);

  const filtered = MOCK_WHATSAPP_LEADS.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()));

  const activeThread = active ? MOCK_WHATSAPP_THREADS.find((t) => t.id === active.threadId) : null;

  return (
    <>
      <PageHeader title="WhatsApp Leads" description="Every lead engaged across registered WhatsApp numbers." />

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search name..." />

      <Card>
        <CardContent className="px-0 py-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Name</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Phone</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Status</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Account</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Last Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id} className="cursor-pointer" onClick={() => setActive(row)}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{row.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize ${STATUS_VARIANT[row.status]}`}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell><AccountBadge account={row.account} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(row.lastActivityAt).toLocaleString()}
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
                <DialogTitle>{active.name}</DialogTitle>
              </DialogHeader>
              <p className="text-xs text-muted-foreground">{active.phone}</p>
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
