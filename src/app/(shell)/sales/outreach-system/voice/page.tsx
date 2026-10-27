"use client";

import { Phone, PhoneCall, Clock, DollarSign, Percent } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBreakdownCard } from "@/components/sales/outreach-system/status-breakdown-card";
import { AccountBadge, accountRowTint } from "@/components/sales/outreach-system/account-badge";
import { UsageCard } from "@/components/sales/outreach-system/usage-card";
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
  VOICE_METRICS,
  VOICE_STATUS_BREAKDOWN,
  VOICE_ACCOUNT_STATS,
  VOICE_DAILY_CAP_PCT,
} from "@/lib/mock-data/outreach-system";

export default function VoiceOverviewPage() {
  return (
    <>
      <PageHeader
        title="Voice Outreach"
        description="Cold calling performance across registered caller IDs."
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Total Calls" value={VOICE_METRICS.totalCalls.toLocaleString()} icon={<Phone className="size-4" />} />
        <KpiCard label="Connected" value={VOICE_METRICS.connected.toLocaleString()} icon={<PhoneCall className="size-4" />} />
        <KpiCard label="Avg Duration" value={`${VOICE_METRICS.avgDurationSeconds}s`} icon={<Clock className="size-4" />} />
        <KpiCard label="Total Cost" value={`$${VOICE_METRICS.totalCostUsd.toFixed(2)}`} icon={<DollarSign className="size-4" />} />
        <KpiCard label="Success Rate" value={`${VOICE_METRICS.successRatePct}%`} icon={<Percent className="size-4" />} trend="flat" trendValue="steady" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StatusBreakdownCard title="Call outcomes" data={VOICE_STATUS_BREAKDOWN} />
        <UsageCard
          title="Daily cap usage"
          stats={[
            { label: "Numbers", value: String(VOICE_ACCOUNT_STATS.length) },
            { label: "Avg. daily cap", value: "120" },
            { label: "Calls today", value: String(VOICE_ACCOUNT_STATS.reduce((s, a) => s + a.callsToday, 0)) },
          ]}
          usagePct={VOICE_DAILY_CAP_PCT}
          usageLabel="Daily cap"
        />
      </div>

      <Card>
        <CardContent className="px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold">Bifurcation by caller ID</h3>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase">Number</TableHead>
                  <TableHead className="text-[11px] uppercase">Total Calls</TableHead>
                  <TableHead className="text-[11px] uppercase">Connected</TableHead>
                  <TableHead className="text-[11px] uppercase">Failed</TableHead>
                  <TableHead className="text-[11px] uppercase">Daily Cap</TableHead>
                  <TableHead className="text-[11px] uppercase">Calls Today</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {VOICE_ACCOUNT_STATS.map((row) => (
                  <TableRow key={row.account.id} style={accountRowTint(row.account)}>
                    <TableCell><AccountBadge account={row.account} /></TableCell>
                    <TableCell>{row.totalCalls.toLocaleString()}</TableCell>
                    <TableCell>{row.connected.toLocaleString()}</TableCell>
                    <TableCell>{row.failed.toLocaleString()}</TableCell>
                    <TableCell>{row.dailyCap}</TableCell>
                    <TableCell>{row.callsToday}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
