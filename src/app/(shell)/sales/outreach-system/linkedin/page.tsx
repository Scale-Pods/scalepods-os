"use client";

import { Share2, UserCheck, UserX, MessageSquareReply, Percent, MessagesSquare } from "lucide-react";
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
  LINKEDIN_METRICS,
  LINKEDIN_STATUS_BREAKDOWN,
  LINKEDIN_ACCOUNT_STATS,
  LINKEDIN_DAILY_INVITE_CAP_PCT,
} from "@/lib/mock-data/outreach-system";

export default function LinkedinOverviewPage() {
  return (
    <>
      <PageHeader
        title="LinkedIn Outreach Center"
        description="Connection requests and conversations across sender identities."
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <KpiCard label="Total Leads" value={LINKEDIN_METRICS.totalLeads.toLocaleString()} icon={<Share2 className="size-4" />} />
        <KpiCard label="Connected" value={LINKEDIN_METRICS.connected.toLocaleString()} icon={<UserCheck className="size-4" />} />
        <KpiCard label="Not Connected" value={LINKEDIN_METRICS.notConnected.toLocaleString()} icon={<UserX className="size-4" />} />
        <KpiCard label="Replied" value={LINKEDIN_METRICS.replied.toLocaleString()} icon={<MessageSquareReply className="size-4" />} />
        <KpiCard label="Connection Rate" value={`${LINKEDIN_METRICS.connectionRatePct}%`} icon={<Percent className="size-4" />} trend="up" trendValue="+1pt" />
        <KpiCard label="Conversations" value={LINKEDIN_METRICS.conversations.toLocaleString()} icon={<MessagesSquare className="size-4" />} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StatusBreakdownCard title="Connection status" data={LINKEDIN_STATUS_BREAKDOWN} />
        <UsageCard
          title="Daily invite cap usage"
          stats={[
            { label: "Senders", value: String(LINKEDIN_ACCOUNT_STATS.length) },
            { label: "Avg. daily cap", value: "80" },
            { label: "Invites today", value: "130" },
          ]}
          usagePct={LINKEDIN_DAILY_INVITE_CAP_PCT}
          usageLabel="Daily invite cap"
        />
      </div>

      <Card className="mb-6">
        <CardContent className="px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold">Bifurcation by sender account</h3>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase">Sender</TableHead>
                  <TableHead className="text-[11px] uppercase">Invites Sent</TableHead>
                  <TableHead className="text-[11px] uppercase">Connected</TableHead>
                  <TableHead className="text-[11px] uppercase">Not Connected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LINKEDIN_ACCOUNT_STATS.map((row) => (
                  <TableRow key={row.account.id} style={accountRowTint(row.account)}>
                    <TableCell><AccountBadge account={row.account} /></TableCell>
                    <TableCell>{row.invitesSent.toLocaleString()}</TableCell>
                    <TableCell>{row.connected.toLocaleString()}</TableCell>
                    <TableCell>{row.notConnected.toLocaleString()}</TableCell>
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
          <EmptyState
            icon={MessageSquareReply}
            title="No replies yet"
            description="Connected leads haven't started a conversation yet — check back soon."
          />
        </CardContent>
      </Card>
    </>
  );
}
