"use client";

import { MessageCircle, Users, Send, MessageSquareReply, Percent } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBreakdownCard } from "@/components/sales/outreach-system/status-breakdown-card";
import { AccountBadge, accountRowTint } from "@/components/sales/outreach-system/account-badge";
import { EmptyState } from "@/components/shared/empty-state";
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
  WHATSAPP_METRICS,
  WHATSAPP_STATUS_BREAKDOWN,
  WHATSAPP_ACCOUNT_STATS,
  WHATSAPP_REPLIES,
} from "@/lib/mock-data/outreach-system";

export default function WhatsappOverviewPage() {
  return (
    <>
      <PageHeader
        title="WhatsApp Outreach"
        description="Active chats, message volume and response rates."
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Total Chats" value={WHATSAPP_METRICS.totalChats.toLocaleString()} icon={<MessageCircle className="size-4" />} />
        <KpiCard label="Active Leads" value={WHATSAPP_METRICS.activeLeads.toLocaleString()} icon={<Users className="size-4" />} />
        <KpiCard label="Messages Sent" value={WHATSAPP_METRICS.messagesSent.toLocaleString()} icon={<Send className="size-4" />} />
        <KpiCard label="Replies" value={WHATSAPP_METRICS.replies.toLocaleString()} icon={<MessageSquareReply className="size-4" />} />
        <KpiCard label="Response Rate" value={`${WHATSAPP_METRICS.responseRatePct}%`} icon={<Percent className="size-4" />} trend="up" trendValue="+4pts" />
      </div>

      <div className="mb-6">
        <StatusBreakdownCard title="Message delivery status" data={WHATSAPP_STATUS_BREAKDOWN} />
      </div>

      <Card className="mb-6">
        <CardContent className="px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold">Bifurcation by account</h3>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase">Account</TableHead>
                  <TableHead className="text-[11px] uppercase">Chats</TableHead>
                  <TableHead className="text-[11px] uppercase">Messages Sent</TableHead>
                  <TableHead className="text-[11px] uppercase">Replies</TableHead>
                  <TableHead className="text-[11px] uppercase">Failed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {WHATSAPP_ACCOUNT_STATS.map((row) => (
                  <TableRow key={row.account.id} style={accountRowTint(row.account)}>
                    <TableCell><AccountBadge account={row.account} /></TableCell>
                    <TableCell>{row.chats.toLocaleString()}</TableCell>
                    <TableCell>{row.messagesSent.toLocaleString()}</TableCell>
                    <TableCell>{row.replies.toLocaleString()}</TableCell>
                    <TableCell>{row.failed.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold">Replies</h3>
          {WHATSAPP_REPLIES.length === 0 ? (
            <EmptyState icon={MessageSquareReply} title="No replies yet" description="Replies will show up here as they come in." />
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {WHATSAPP_REPLIES.map((r) => (
                <div key={r.id} className="rounded-lg border bg-muted/40 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.company}</p>
                    </div>
                    <AccountBadge account={r.account} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.snippet}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
