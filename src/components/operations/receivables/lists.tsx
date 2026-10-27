"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BillDetailDialog } from "./bill-detail-dialog";
import { EmptyRow, RecoveryBadge, SentimentPill, StatusPill, TwoLine, fmtDateTime, inr } from "./shared";
import { MOCK_OUTREACH, type ConversationEntry, type RecoveryOutreachRow } from "@/lib/mock-data/receivables";

function ListShell({
  headers,
  footer,
  children,
}: {
  headers: string[];
  footer: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="px-0 py-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((h) => (
                  <TableHead key={h} className="text-[11px] uppercase text-muted-foreground">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>{children}</TableBody>
          </Table>
        </div>
        <div className="border-t bg-muted/30 px-4 py-3 text-xs text-muted-foreground">{footer}</div>
      </CardContent>
    </Card>
  );
}

const matches = (r: RecoveryOutreachRow, q: string) =>
  !q || r.party_name.toLowerCase().includes(q.toLowerCase()) || r.bill_no.toLowerCase().includes(q.toLowerCase());

const emailEntries = (r: RecoveryOutreachRow): ConversationEntry[] => r.email_conversation;

/* ---------------------------------------------------------------- Email Sent */

export function EmailSentPage() {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState<string | null>(null);

  const sends = MOCK_OUTREACH.filter((r) => matches(r, search)).flatMap((r) =>
    ([
      [1, r.email_1_sent_at, r.email_1_content],
      [2, r.email_2_sent_at, r.email_2_content],
      [3, r.email_3_sent_at, r.email_3_content],
    ] as const)
      .filter(([, at]) => at)
      .map(([n, at, content]) => ({ row: r, n, at: at as string, content: content ?? "" }))
  );
  sends.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <>
      <PageHeader title="Sent Emails" description="Every cadence email sent from recovery_outreach (email_1 – email_3)." />
      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search party or bill..." />
      <ListShell headers={["Party", "Step", "Message", "Sent", "Status"]} footer={`Showing ${sends.length} emails`}>
        {sends.length === 0 ? (
          <EmptyRow colSpan={5} message="No emails sent yet." />
        ) : (
          sends.map(({ row, n, at, content }) => (
            <TableRow key={`${row.id}-${n}`} className="cursor-pointer" onClick={() => setOpen(row.bill_no)}>
              <TableCell>
                <TwoLine primary={row.party_name} secondary={row.email} />
              </TableCell>
              <TableCell>
                <RecoveryBadge label={`Email ${n}`} accent="blue" />
              </TableCell>
              <TableCell className="max-w-md truncate text-sm text-muted-foreground">{content}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{fmtDateTime(at)}</TableCell>
              <TableCell>
                <StatusPill status={row.status} />
              </TableCell>
            </TableRow>
          ))
        )}
      </ListShell>
      <BillDetailDialog billNo={open} tab="email" onClose={() => setOpen(null)} />
    </>
  );
}

/* -------------------------------------------------------------- Email Received */

export function EmailReceivedPage() {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState<string | null>(null);

  const inbound = MOCK_OUTREACH.filter((r) => r.email_replied && matches(r, search)).map((r) => {
    const msgs = emailEntries(r).filter((m) => m.role === "user");
    return { row: r, last: msgs[msgs.length - 1] };
  });

  return (
    <>
      <PageHeader title="Received Emails" description="Parties that replied by email, with the AI read of each reply." />
      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search party or bill..." />
      <ListShell headers={["Party", "Reply", "Intent", "Sentiment", "Received"]} footer={`Showing ${inbound.length} replies`}>
        {inbound.length === 0 ? (
          <EmptyRow colSpan={5} message="No email replies yet." />
        ) : (
          inbound.map(({ row, last }) => (
            <TableRow key={row.id} className="cursor-pointer" onClick={() => setOpen(row.bill_no)}>
              <TableCell>
                <TwoLine primary={row.party_name} secondary={row.bill_no} />
              </TableCell>
              <TableCell className="max-w-md truncate text-sm">{last?.message}</TableCell>
              <TableCell className="text-sm">{row.intent ?? "—"}</TableCell>
              <TableCell>
                <SentimentPill sentiment={row.sentiment} />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{fmtDateTime(last?.timestamp)}</TableCell>
            </TableRow>
          ))
        )}
      </ListShell>
      <BillDetailDialog billNo={open} tab="email" onClose={() => setOpen(null)} />
    </>
  );
}

/* --------------------------------------------------------------- WhatsApp Leads */

const STAGES = ["all", "WhatsApp 1", "Email 2", "WhatsApp 2", "Call 1", "Email 3", "WhatsApp 3", "Call 2", "Recovered"];

export function WhatsAppLeadsPage() {
  const [search, setSearch] = React.useState("");
  const [stage, setStage] = React.useState("all");
  const [open, setOpen] = React.useState<string | null>(null);

  const leads = MOCK_OUTREACH.filter(
    (r) => r.wa_1_sent_at && matches(r, search) && (stage === "all" || r.current_stage === stage)
  );

  return (
    <>
      <PageHeader title="WhatsApp Leads" description="Parties contacted on WhatsApp and where each one sits in the cadence." />
      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search party or bill...">
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STAGES.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All stages" : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ListToolbar>
      <ListShell headers={["Party", "Outstanding", "Stage", "Status", "Sentiment"]} footer={`Showing ${leads.length} leads`}>
        {leads.length === 0 ? (
          <EmptyRow colSpan={5} message="No WhatsApp leads in this stage." />
        ) : (
          leads.map((r) => (
            <TableRow key={r.id} className="cursor-pointer" onClick={() => setOpen(r.bill_no)}>
              <TableCell>
                <TwoLine primary={r.party_name} secondary={r.phone} />
              </TableCell>
              <TableCell className="tabular-nums">{inr(r.total_outstanding)}</TableCell>
              <TableCell className="text-sm">{r.current_stage}</TableCell>
              <TableCell>
                <StatusPill status={r.status} />
              </TableCell>
              <TableCell>
                <SentimentPill sentiment={r.sentiment} />
              </TableCell>
            </TableRow>
          ))
        )}
      </ListShell>
      <BillDetailDialog billNo={open} tab="whatsapp" onClose={() => setOpen(null)} />
    </>
  );
}
