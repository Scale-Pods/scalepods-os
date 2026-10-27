"use client";

import * as React from "react";
import { Activity, IndianRupee, ShieldCheck, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import {
  ALL_AUDITS, SCORE_BUCKETS, auditStats, dailyTrend, fieldErrorRates, partyRisk, weeklyScores,
} from "@/lib/mock-data/audit-checker";
import { AuditDetailDialog } from "./audit-detail-dialog";
import { ACCENT, ChartCard, DecisionPill, Field, HBar, ScoreBadge, STATUS_BAR, StackedColumns, StatusPill, fmtDate, inr, inrCompact } from "./shared";

export function AuditAnalyticsPage() {
  const [party, setParty] = React.useState<string | null>(null);
  const [auditId, setAuditId] = React.useState<string | null>(null);
  const s = auditStats(ALL_AUDITS);
  const errRate = Math.round(((s.mismatched + s.critical) / s.total) * 1000) / 10;
  const trend = dailyTrend(ALL_AUDITS, 21);
  const weekly = weeklyScores(ALL_AUDITS, 8);
  const fields = fieldErrorRates(ALL_AUDITS);
  const purchaseFields = fields.filter((f) => f.kind === "purchase").slice(0, 8);
  const salesFields = fields.filter((f) => f.kind !== "purchase").slice(0, 8);
  const risk = partyRisk(ALL_AUDITS).slice(0, 12);
  const buckets = SCORE_BUCKETS.map((b) => ({ ...b, n: ALL_AUDITS.filter((a) => a.score >= b.min && a.score <= b.max).length }));
  const maxBucket = Math.max(...buckets.map((b) => b.n));
  const maxField = Math.max(1, ...fields.map((f) => f.errorRate));
  const partyAudits = party ? ALL_AUDITS.filter((a) => a.party === party) : [];
  const ps = auditStats(partyAudits);
  const selectedAudit = ALL_AUDITS.find((a) => a.id === auditId) ?? null;

  return (
    <>
      <PageHeader title="Analytics" description="Which fields fail most, how mismatch rates are moving, and where the exposure sits." />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Audits Analysed" value={String(s.total)} icon={<Activity className="size-4" />} iconClassName={ACCENT.blue} context="purchase, sales and quick checks" />
        <KpiCard label="Mismatch Rate" value={`${errRate}%`} icon={<TrendingUp className="size-4" />} iconClassName={ACCENT.red} context={`${s.mismatched + s.critical} audits with errors`} trend="down" trendValue="-0.8 pts" />
        <KpiCard label="Health Score" value={`${s.avgScore}%`} icon={<ShieldCheck className="size-4" />} iconClassName={ACCENT.green} context="average audit score" trend="up" trendValue="+1.9 pts" />
        <KpiCard label="Value At Risk" value={inrCompact(s.atRisk)} icon={<IndianRupee className="size-4" />} iconClassName={ACCENT.orange} context="documents with mismatches" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Mismatch trend" subtitle="Daily audits, last 21 days" className="lg:col-span-2">
          <StackedColumns data={trend.map((d) => ({ label: d.label, a: d.clean, b: d.issues }))} />
        </ChartCard>
        <ChartCard title="Score distribution" subtitle="Audits by overall score">
          <div className="space-y-3">
            {buckets.map((b, i) => (
              <HBar key={b.label} label={b.label} value={b.n} max={maxBucket} className={["bg-success", "bg-blue-500", "bg-warning", "bg-destructive/70"][i]} />
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Weekly average score</p>
          <div className="mt-2 flex h-20 items-end gap-1.5">
            {weekly.map((w) => (
              <div key={w.label} className="flex flex-1 flex-col items-center justify-end gap-1" title={`${w.label}: ${w.avg}% (${w.count} audits)`}>
                <span className="text-[9px] tabular-nums text-muted-foreground">{w.avg || ""}</span>
                <div className="w-full rounded-t bg-primary/70" style={{ height: `${w.avg * 0.55}%` }} />
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Purchase: field error rate" subtitle="Share of audits where the field mismatched">
          <div className="space-y-2.5">
            {purchaseFields.map((f) => (
              <HBar key={f.label} label={f.label} value={f.errorRate} max={maxField} display={`${f.errorRate}%`} className={f.critical > 0 ? STATUS_BAR.Critical : STATUS_BAR.Mismatch} sub={`${f.mismatch + f.critical} of ${f.checked}${f.critical ? " · critical" : ""}`} />
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Sales: field error rate" subtitle="Invoice vs sheet and SO vs PO checks">
          <div className="space-y-2.5">
            {salesFields.map((f) => (
              <HBar key={f.label} label={f.label} value={f.errorRate} max={maxField} display={`${f.errorRate}%`} className={STATUS_BAR.Mismatch} sub={`${f.mismatch} of ${f.checked}`} />
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Party risk" subtitle="Suppliers and customers ranked by audits with errors. Click for their audits.">
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Party</TableHead><TableHead className="text-right">Audits</TableHead><TableHead className="text-right">With errors</TableHead><TableHead>Avg score</TableHead><TableHead className="text-right">Value</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {risk.map((r) => (
                <TableRow key={r.party} className="cursor-pointer" onClick={() => setParty(r.party)}>
                  <TableCell className="font-medium">{r.party}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.audits}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.issues}</TableCell>
                  <TableCell><ScoreBadge score={r.avgScore} /></TableCell>
                  <TableCell className="text-right tabular-nums">{inrCompact(r.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ChartCard>

      <Dialog open={!!party} onOpenChange={(o) => !o && setParty(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {party && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">{party}</DialogTitle>
                <DialogDescription>{ps.total} audits · average score {ps.avgScore}%</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="summary">
                <TabsList>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="audits">Audits ({ps.total})</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="mt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <Field label="Audited value" value={inr(ps.value)} />
                    <Field label="Match rate" value={`${ps.passRate}%`} />
                    <Field label="Errors" value={ps.mismatched + ps.critical} />
                    <Field label="Pending" value={ps.pending} />
                  </div>
                  <div className="space-y-2">
                    <HBar label="Match" value={ps.matched} max={ps.total} className={STATUS_BAR.Match} />
                    <HBar label="Partial" value={ps.partial} max={ps.total} className={STATUS_BAR["Partial Match"]} />
                    <HBar label="Mismatch" value={ps.mismatched} max={ps.total} className={STATUS_BAR.Mismatch} />
                    <HBar label="Critical" value={ps.critical} max={ps.total} className={STATUS_BAR.Critical} />
                  </div>
                </TabsContent>
                <TabsContent value="audits" className="mt-3">
                  <div className="overflow-x-auto rounded-lg border">
                    <Table>
                      <TableHeader><TableRow><TableHead>Reference</TableHead><TableHead>Date</TableHead><TableHead>Score</TableHead><TableHead>Result</TableHead><TableHead>Decision</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {partyAudits.map((a) => (
                          <TableRow key={a.id} className="cursor-pointer" onClick={() => { setParty(null); setAuditId(a.id); }}>
                            <TableCell className="font-medium">{a.ref}</TableCell>
                            <TableCell className="text-muted-foreground">{fmtDate(a.createdAt)}</TableCell>
                            <TableCell><ScoreBadge score={a.score} /></TableCell>
                            <TableCell><StatusPill status={a.status} /></TableCell>
                            <TableCell><DecisionPill decision={a.decision} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
      <AuditDetailDialog audit={selectedAudit} onClose={() => setAuditId(null)} />
    </>
  );
}
