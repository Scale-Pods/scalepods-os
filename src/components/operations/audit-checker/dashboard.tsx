"use client";

import * as React from "react";
import { AlertOctagon, CheckCircle2, ClipboardCheck, IndianRupee, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ALL_AUDITS, PURCHASE_AUDITS, SALES_AUDITS, QUICK_AUDITS, KIND_LABEL, auditStats, dailyTrend, userName, type AuditRecord,
} from "@/lib/mock-data/audit-checker";
import { AuditDetailDialog } from "./audit-detail-dialog";
import { ACCENT, ChartCard, DecisionPill, Pill, ScoreBadge, SegmentedBar, StackedColumns, StatusPill, STATUS_BAR, KIND_ACCENT, fmtDate, inr, inrCompact } from "./shared";

const SCOPES: Record<string, { label: string; list: AuditRecord[] }> = {
  all: { label: "All audits", list: ALL_AUDITS },
  purchase: { label: "Purchase", list: PURCHASE_AUDITS },
  sales: { label: "Sales", list: [...SALES_AUDITS, ...QUICK_AUDITS] },
};

export function AuditDashboardPage() {
  const [scope, setScope] = React.useState("all");
  const [open, setOpen] = React.useState<string | null>(null);
  const list = SCOPES[scope].list;
  const s = auditStats(list);
  const trend = dailyTrend(list, 14);
  const flagged = list.filter((a) => a.flagged && a.decision === "Pending").slice(0, 6);
  const recent = list.slice(0, 10);
  const selected = ALL_AUDITS.find((a) => a.id === open) ?? null;

  return (
    <>
      <PageHeader
        title="Executive Overview"
        description="Compliance data from the audit ledger: purchase document reconciliation and sales order verification."
        actions={
          <Tabs value={scope} onValueChange={setScope}>
            <TabsList>
              {Object.entries(SCOPES).map(([k, v]) => (<TabsTrigger key={k} value={k}>{v.label}</TabsTrigger>))}
            </TabsList>
          </Tabs>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Documents Audited" value={String(s.total)} icon={<ClipboardCheck className="size-4" />} iconClassName={ACCENT.blue} context={`avg score ${s.avgScore}%`} />
        <KpiCard label="Compliance Match Rate" value={`${s.passRate}%`} icon={<CheckCircle2 className="size-4" />} iconClassName={ACCENT.green} context={`${s.matched} fully matched`} trend="up" trendValue="+3.2%" />
        <KpiCard label="Audit Discrepancies" value={String(s.mismatched + s.critical)} icon={<AlertOctagon className="size-4" />} iconClassName={ACCENT.red} context={`${s.critical} critical (GSTIN)`} trend="down" trendValue="-1.4%" trendGood />
        <KpiCard label="Total Audit Value" value={inrCompact(s.value)} icon={<IndianRupee className="size-4" />} iconClassName={ACCENT.purple} context={`${inrCompact(s.atRisk)} at risk`} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Pending Decisions" value={String(s.pending)} icon={<ShieldAlert className="size-4" />} iconClassName={ACCENT.orange} context="awaiting approve / reject" />
        <KpiCard label="Approved" value={String(s.approved)} context="signed off by reviewers" />
        <KpiCard label="Rejected" value={String(s.rejected)} context="sent back for correction" />
        <KpiCard label="Flagged Items" value={String(s.flagged)} context="critical or unresolved mismatches" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Audit Activity" subtitle="Audits per day, last 14 days" className="lg:col-span-2">
          <StackedColumns data={trend.map((d) => ({ label: d.label, a: d.clean, b: d.issues }))} />
        </ChartCard>
        <ChartCard title="Verification Status" subtitle="Result of the field-by-field check">
          <SegmentedBar
            segments={[
              { label: "Match", value: s.matched, className: STATUS_BAR.Match },
              { label: "Partial", value: s.partial, className: STATUS_BAR["Partial Match"] },
              { label: "Mismatch", value: s.mismatched, className: STATUS_BAR.Mismatch },
              { label: "Critical", value: s.critical, className: STATUS_BAR.Critical },
            ]}
          />
          <div className="mt-5 space-y-1.5 text-xs">
            {(["purchase", "sales", "quick"] as const).map((k) => {
              const ks = auditStats(ALL_AUDITS.filter((a) => a.kind === k));
              return (
                <div key={k} className="flex items-center justify-between rounded-md bg-muted/40 px-2.5 py-1.5">
                  <Pill label={KIND_LABEL[k]} accent={KIND_ACCENT[k]} />
                  <span className="text-muted-foreground">{ks.total} audits · {ks.passRate}% clean · avg {ks.avgScore}%</span>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {flagged.length > 0 && (
        <ChartCard title="Needs attention" subtitle="Flagged audits waiting for a decision" className="mb-6">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {flagged.map((a) => (
              <button key={a.id} type="button" onClick={() => setOpen(a.id)} className="flex items-center justify-between gap-3 rounded-lg border p-2.5 text-left hover:bg-muted/50">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.ref}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.party} · {inr(a.amount)}</p>
                </div>
                <StatusPill status={a.status} />
              </button>
            ))}
          </div>
        </ChartCard>
      )}

      <ChartCard title="Recent audits" subtitle="Click a row for the full reconciliation">
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead><TableHead>Type</TableHead><TableHead>Party</TableHead><TableHead>Date</TableHead>
                <TableHead>Score</TableHead><TableHead>Result</TableHead><TableHead>Decision</TableHead><TableHead>Run by</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((a) => (
                <TableRow key={a.id} className="cursor-pointer" onClick={() => setOpen(a.id)}>
                  <TableCell className="font-medium">{a.ref}</TableCell>
                  <TableCell><Pill label={KIND_LABEL[a.kind]} accent={KIND_ACCENT[a.kind]} /></TableCell>
                  <TableCell className="max-w-56 truncate">{a.party}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{fmtDate(a.createdAt)}</TableCell>
                  <TableCell><ScoreBadge score={a.score} /></TableCell>
                  <TableCell><StatusPill status={a.status} /></TableCell>
                  <TableCell><DecisionPill decision={a.decision} /></TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{userName(a.reviewerId)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ChartCard>
      <AuditDetailDialog audit={selected} onClose={() => setOpen(null)} />
    </>
  );
}
