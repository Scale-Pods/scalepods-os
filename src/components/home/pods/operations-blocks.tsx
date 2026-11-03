"use client";

import {
  Headset, Smile, Timer, Bot, AlertTriangle, IndianRupee, BadgeCheck, FileClock, Percent,
  ClipboardCheck, ShieldCheck, Gauge, Flag, Boxes, PackageX, PackageSearch, Truck, Warehouse,
} from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { AppBlock, BarList, Columns, KpiRow, MiniList, Panel, Pill, StackBar, TONE, inrCompact, num } from "./pod-ui";
import type { AppManifest } from "@/lib/types/manifest";
import { CC_CASES, CC_STATS, CC_TOPIC_BREAKDOWN, CC_VOLUME_14D, ccAgo, ccChannelLabel } from "@/lib/mock-data/customer-care";
import { MOCK_OUTREACH, MOCK_PARTY_LEDGER, recoveryStats } from "@/lib/mock-data/receivables";
import { ALL_AUDITS, auditStats, dailyTrend, partyRisk } from "@/lib/mock-data/audit-checker";
import { ALERTS, CHANNEL_LABELS, INV_TOTALS, PURCHASE_ORDERS, channelTotals, warehouseTotals } from "@/lib/mock-data/inventory";

/* ------------------------------------------------------------ Customer Care */

const PRIORITY_TONE = { urgent: "red", high: "orange", medium: "blue", low: "neutral" } as const;

export function CustomerCareBlock({ app }: { app: AppManifest }) {
  const urgent = CC_CASES.filter((c) => c.status === "Open")
    .sort((a, b) => ["urgent", "high", "medium", "low"].indexOf(a.priority) - ["urgent", "high", "medium", "low"].indexOf(b.priority))
    .slice(0, 5);
  const volume = CC_VOLUME_14D.map((d) => ({ label: d.label, a: d.ai, b: d.human }));
  const sentiments = (["positive", "neutral", "negative"] as const).map((s) => CC_CASES.filter((c) => c.sentiment === s).length);

  return (
    <AppBlock app={app}>
      <KpiRow cols={6}>
        <KpiCard label="Open cases" value={String(CC_STATS.openCases)} icon={<Headset className="size-4" />} iconClassName={TONE.orange} context={`${CC_STATS.resolvedCases} resolved`} />
        <KpiCard label="CSAT" value={CC_STATS.csat.toFixed(2)} icon={<Smile className="size-4" />} iconClassName={TONE.green} context="out of 5" />
        <KpiCard label="First response" value={`${CC_STATS.avgFirstResponse}m`} icon={<Timer className="size-4" />} iconClassName={TONE.blue} context="average" />
        <KpiCard label="Auto-resolved" value={`${CC_STATS.autoResolvedPct}%`} icon={<Bot className="size-4" />} iconClassName={TONE.purple} context="handled by AI" />
        <KpiCard label="Negative flags" value={String(CC_STATS.negativeCases)} icon={<AlertTriangle className="size-4" />} iconClassName={TONE.red} context={`${CC_STATS.escalated} escalated`} />
        <KpiCard label="Avg. rating" value={CC_STATS.avgRating.toFixed(1)} icon={<Smile className="size-4" />} iconClassName={TONE.neutral} context={`${CC_STATS.totalReviews} reviews`} />
      </KpiRow>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Ticket volume" subtitle="AI-handled vs human, last 14 days">
          <Columns data={volume} aLabel="AI" bLabel="Human" aColor="bg-purple-500" bColor="bg-primary/35" />
        </Panel>
        <Panel title="Sentiment mix" subtitle="All cases">
          <StackBar
            segments={[
              { label: "Positive", value: sentiments[0], color: "bg-success" },
              { label: "Neutral", value: sentiments[1], color: "bg-muted-foreground/40" },
              { label: "Negative", value: sentiments[2], color: "bg-destructive" },
            ]}
          />
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Top topics</p>
            <BarList rows={CC_TOPIC_BREAKDOWN.slice(0, 4).map((t) => ({ label: t.topic, value: t.count }))} />
          </div>
        </Panel>
        <Panel title="Needs attention" subtitle="Open cases by priority">
          <MiniList
            rows={urgent.map((c) => ({
              key: c.id,
              primary: c.subject,
              secondary: `${c.customer} · ${ccChannelLabel(c.channel)} · ${ccAgo(c.updatedAt)}`,
              right: <Pill label={c.priority} tone={PRIORITY_TONE[c.priority]} />,
            }))}
          />
        </Panel>
      </div>
    </AppBlock>
  );
}

/* ------------------------------------------------------ Receivables Recovery */

export function ReceivablesBlock({ app }: { app: AppManifest }) {
  const s = recoveryStats();
  const byParty = new Map<string, number>();
  MOCK_PARTY_LEDGER.filter((l) => !l.closed).forEach((l) => byParty.set(l.party_name, (byParty.get(l.party_name) ?? 0) + l.Final_Amount));
  const top = [...byParty.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const count = (st: string) => MOCK_OUTREACH.filter((r) => r.status === st).length;

  return (
    <AppBlock app={app}>
      <KpiRow cols={5}>
        <KpiCard label="Outstanding" value={inrCompact(s.outstandingAmt)} icon={<IndianRupee className="size-4" />} iconClassName={TONE.orange} context={`${s.openBills} open bills`} />
        <KpiCard label="Recovered" value={inrCompact(s.recoveredAmt)} icon={<BadgeCheck className="size-4" />} iconClassName={TONE.green} context="bills closed" />
        <KpiCard label="Parties" value={String(s.parties)} icon={<FileClock className="size-4" />} iconClassName={TONE.blue} context={`${s.totalBills} bills in ledger`} />
        <KpiCard label="Reply rate" value={`${s.replyRate}%`} icon={<Percent className="size-4" />} iconClassName={TONE.purple} context={`${s.replied} of ${s.sent} contacted`} />
        <KpiCard label="Recovery rate" value={`${s.recoveryRate}%`} icon={<Percent className="size-4" />} iconClassName={TONE.green} context={`${s.closed} cycles closed`} />
      </KpiRow>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Recovery funnel" subtitle="Outreach sent → replied → closed">
          <BarList
            rows={[
              { label: "Outreach rows", value: s.outreachRows, color: "bg-blue-500" },
              { label: "Contacted", value: s.sent, color: "bg-blue-500" },
              { label: "Active threads", value: s.threads, color: "bg-purple-500" },
              { label: "Replied", value: s.replied, color: "bg-warning" },
              { label: "Closed", value: s.closed, color: "bg-success" },
            ]}
          />
        </Panel>
        <Panel title="Outreach by status">
          <StackBar
            segments={[
              { label: "Closed", value: count("Closed"), color: "bg-success" },
              { label: "Replied", value: count("Replied"), color: "bg-blue-500" },
              { label: "Active", value: count("Active"), color: "bg-purple-500" },
              { label: "Awaiting", value: count("Awaiting Reply"), color: "bg-warning" },
              { label: "Disputed / founder", value: count("Disputed") + count("Founder Review"), color: "bg-destructive" },
              { label: "Queued", value: count("Queued"), color: "bg-muted-foreground/40" },
            ]}
          />
        </Panel>
        <Panel title="Largest outstanding" subtitle="By party, open bills only">
          <MiniList rows={top.map(([party, amt]) => ({ key: party, primary: party, right: inrCompact(amt) }))} />
        </Panel>
      </div>
    </AppBlock>
  );
}

/* ------------------------------------------------------------ Audit Checker */

export function AuditBlock({ app }: { app: AppManifest }) {
  const s = auditStats(ALL_AUDITS);
  const trend = dailyTrend(ALL_AUDITS, 14).map((d) => ({ label: d.label, a: d.clean, b: d.issues }));
  const risky = partyRisk(ALL_AUDITS).slice(0, 5);

  return (
    <AppBlock app={app}>
      <KpiRow cols={6}>
        <KpiCard label="Audits" value={String(s.total)} icon={<ClipboardCheck className="size-4" />} iconClassName={TONE.blue} context="purchase, sales, quick" />
        <KpiCard label="Pass rate" value={`${s.passRate}%`} icon={<ShieldCheck className="size-4" />} iconClassName={TONE.green} context={`${s.matched} full matches`} />
        <KpiCard label="Avg. score" value={String(s.avgScore)} icon={<Gauge className="size-4" />} iconClassName={TONE.purple} context="out of 100" />
        <KpiCard label="Pending review" value={String(s.pending)} icon={<FileClock className="size-4" />} iconClassName={TONE.orange} context={`${s.approved} approved`} />
        <KpiCard label="Flagged" value={String(s.flagged)} icon={<Flag className="size-4" />} iconClassName={TONE.red} context={`${s.critical} critical`} />
        <KpiCard label="Value at risk" value={inrCompact(s.atRisk)} icon={<AlertTriangle className="size-4" />} iconClassName={TONE.red} context="mismatch + critical" />
      </KpiRow>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Audit activity" subtitle="Clean vs issues, last 14 days">
          <Columns data={trend} aLabel="Clean" bLabel="With issues" aColor="bg-success" bColor="bg-destructive/70" />
        </Panel>
        <Panel title="Verification status">
          <StackBar
            segments={[
              { label: "Match", value: s.matched, color: "bg-success" },
              { label: "Partial", value: s.partial, color: "bg-warning" },
              { label: "Mismatch", value: s.mismatched, color: "bg-orange-500" },
              { label: "Critical", value: s.critical, color: "bg-destructive" },
            ]}
          />
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Decisions</p>
            <BarList
              rows={[
                { label: "Approved", value: s.approved, color: "bg-success" },
                { label: "Pending", value: s.pending, color: "bg-warning" },
                { label: "Rejected", value: s.rejected, color: "bg-destructive" },
              ]}
            />
          </div>
        </Panel>
        <Panel title="Highest-risk parties" subtitle="Most failed audits">
          <MiniList
            rows={risky.map((r) => ({
              key: r.party,
              primary: r.party,
              secondary: `${r.audits} audits · avg score ${r.avgScore}`,
              right: <Pill label={`${r.issues} issues`} tone={r.issues > 2 ? "red" : "orange"} />,
            }))}
          />
        </Panel>
      </div>
    </AppBlock>
  );
}

/* ---------------------------------------------------------------- Inventory */

export function InventoryBlock({ app }: { app: AppManifest }) {
  const t = INV_TOTALS;
  const channels = Object.entries(channelTotals()).map(([k, v]) => ({ label: CHANNEL_LABELS[k as keyof typeof CHANNEL_LABELS] ?? k, value: v }));
  const warehouses = Object.entries(warehouseTotals()).map(([k, v]) => ({ label: k[0].toUpperCase() + k.slice(1), value: v }));
  const alerts = ALERTS.filter((a) => a.status === "Open")
    .sort((a, b) => ["critical", "warning", "info"].indexOf(a.severity) - ["critical", "warning", "info"].indexOf(b.severity))
    .slice(0, 5);
  const poInFlight = PURCHASE_ORDERS.filter((p) => ["Ordered", "In Transit", "Delayed"].includes(p.status)).length;

  return (
    <AppBlock app={app}>
      <KpiRow cols={6}>
        <KpiCard label="Units in stock" value={num(t.units)} icon={<Boxes className="size-4" />} iconClassName={TONE.blue} context="all channels + warehouses" />
        <KpiCard label="Stock value" value={inrCompact(t.value)} icon={<IndianRupee className="size-4" />} iconClassName={TONE.green} context="at cost" />
        <KpiCard label="Critical / out" value={String(t.counts.Critical + t.counts["Out of Stock"])} icon={<PackageX className="size-4" />} iconClassName={TONE.red} context={`${t.counts["Out of Stock"]} out of stock`} />
        <KpiCard label="Low stock" value={String(t.counts["Low Stock"])} icon={<PackageSearch className="size-4" />} iconClassName={TONE.orange} context="below reorder point" />
        <KpiCard label="Open POs" value={String(poInFlight)} icon={<Truck className="size-4" />} iconClassName={TONE.purple} context={`${inrCompact(t.onOrderValue)} on order`} />
        <KpiCard label="Open alerts" value={String(t.openAlerts)} icon={<AlertTriangle className="size-4" />} iconClassName={TONE.orange} context={`${t.dead} dead-stock SKUs`} />
      </KpiRow>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Stock health" subtitle="SKUs by status">
          <StackBar
            segments={[
              { label: "Healthy", value: t.counts.Healthy, color: "bg-success" },
              { label: "Overstock", value: t.counts.Overstock, color: "bg-blue-500" },
              { label: "Low", value: t.counts["Low Stock"], color: "bg-warning" },
              { label: "Critical", value: t.counts.Critical, color: "bg-orange-500" },
              { label: "Out", value: t.counts["Out of Stock"], color: "bg-destructive" },
            ]}
          />
          <div className="mt-5">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Warehouse className="size-3.5" /> Units by warehouse</p>
            <BarList rows={warehouses} />
          </div>
        </Panel>
        <Panel title="Units by channel">
          <BarList rows={channels.sort((a, b) => b.value - a.value)} />
        </Panel>
        <Panel title="Open alerts" subtitle="Most severe first">
          <MiniList
            rows={alerts.map((a) => ({
              key: a.id,
              primary: a.title,
              secondary: a.kind,
              right: <Pill label={a.severity} tone={a.severity === "critical" ? "red" : a.severity === "warning" ? "orange" : "blue"} />,
            }))}
          />
        </Panel>
      </div>
    </AppBlock>
  );
}
