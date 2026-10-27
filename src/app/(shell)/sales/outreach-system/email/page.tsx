"use client";

import { Send, MailOpen, MessageSquareReply, MailWarning, UserX, Percent } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBreakdownCard } from "@/components/sales/outreach-system/status-breakdown-card";
import { AccountBadge, accountRowTint } from "@/components/sales/outreach-system/account-badge";
import { UsageCard } from "@/components/sales/outreach-system/usage-card";
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
  EMAIL_METRICS,
  EMAIL_STATUS_BREAKDOWN,
  EMAIL_ACCOUNT_STATS,
  EMAIL_WARMUP_PCT,
  EMAIL_REPLIES,
} from "@/lib/mock-data/outreach-system";

export default function EmailOverviewPage() {
  return (
    <>
      <PageHeader
        title="Email Outreach"
        description="Cold email sequences, warmup health and deliverability."
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <KpiCard label="Total Sent" value={EMAIL_METRICS.totalSent.toLocaleString()} icon={<Send className="size-4" />} />
        <KpiCard label="Opened" value={EMAIL_METRICS.opened.toLocaleString()} icon={<MailOpen className="size-4" />} />
        <KpiCard label="Replied" value={EMAIL_METRICS.replied.toLocaleString()} icon={<MessageSquareReply className="size-4" />} />
        <KpiCard label="Bounced" value={EMAIL_METRICS.bounced.toLocaleString()} icon={<MailWarning className="size-4" />} />
        <KpiCard label="Unsubscribed" value={EMAIL_METRICS.unsubscribed.toLocaleString()} icon={<UserX className="size-4" />} />
        <KpiCard label="Open Rate" value={`${EMAIL_METRICS.openRatePct}%`} icon={<Percent className="size-4" />} trend="up" trendValue="+2pts" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StatusBreakdownCard title="Delivery status" data={EMAIL_STATUS_BREAKDOWN} />
        <UsageCard
          title="Warmup health"
          stats={[
            { label: "Inboxes", value: String(EMAIL_ACCOUNT_STATS.length) },
            { label: "Avg. daily cap", value: "300" },
            { label: "Sent today", value: String(EMAIL_ACCOUNT_STATS.reduce((s, a) => s + a.sentToday, 0)) },
          ]}
          usagePct={EMAIL_WARMUP_PCT}
          usageLabel="Warmup health"
        />
      </div>

      <Card className="mb-6">
        <CardContent className="px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold">Bifurcation by account</h3>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase">Account</TableHead>
                  <TableHead className="text-[11px] uppercase">Sent</TableHead>
                  <TableHead className="text-[11px] uppercase">Opened</TableHead>
                  <TableHead className="text-[11px] uppercase">Replied</TableHead>
                  <TableHead className="text-[11px] uppercase">Bounced</TableHead>
                  <TableHead className="text-[11px] uppercase">Daily Cap</TableHead>
                  <TableHead className="text-[11px] uppercase">Sent Today</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EMAIL_ACCOUNT_STATS.map((row) => (
                  <TableRow key={row.account.id} style={accountRowTint(row.account)}>
                    <TableCell><AccountBadge account={row.account} /></TableCell>
                    <TableCell>{row.sent.toLocaleString()}</TableCell>
                    <TableCell>{row.opened.toLocaleString()}</TableCell>
                    <TableCell>{row.replied.toLocaleString()}</TableCell>
                    <TableCell>{row.bounced.toLocaleString()}</TableCell>
                    <TableCell>{row.dailyCap}</TableCell>
                    <TableCell>{row.sentToday}</TableCell>
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
          {EMAIL_REPLIES.length === 0 ? (
            <EmptyState icon={MessageSquareReply} title="No replies yet" description="Replies will show up here as they come in." />
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {EMAIL_REPLIES.map((r) => (
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
