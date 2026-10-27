"use client";

import { IndianRupee, BadgeCheck, FileClock, Percent } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { RecentActivityTable } from "./recent-activity";
import { SegmentedBar, SummaryStats, ACCENT, inr } from "./shared";
import { MOCK_OUTREACH, recoveryStats, type RecoveryOutreachRow } from "@/lib/mock-data/receivables";

export function lastActivity(r: RecoveryOutreachRow) {
  const stamps = [
    r.email_1_sent_at, r.wa_1_sent_at, r.email_2_sent_at, r.wa_2_sent_at,
    r.call_1_sent_at, r.email_3_sent_at, r.wa_3_sent_at, r.call_2_sent_at,
  ].filter(Boolean) as string[];
  return stamps.length ? Math.max(...stamps.map((s) => new Date(s).getTime())) : 0;
}

export function RecoveryDashboardPage() {
  const s = recoveryStats();
  const count = (status: string) => MOCK_OUTREACH.filter((r) => r.status === status).length;
  const recent = [...MOCK_OUTREACH].sort((a, b) => lastActivity(b) - lastActivity(a)).slice(0, 8);

  return (
    <>
      <PageHeader
        title="Receivables Recovery"
        description="Live from party_ledger and recovery_outreach — outstanding dues and the automated email, WhatsApp and call cadence."
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Outstanding"
          value={inr(s.outstandingAmt)}
          icon={<IndianRupee className="size-4" />}
          iconClassName={ACCENT.orange}
          context={`across ${s.openBills} open bills`}
        />
        <KpiCard
          label="Recovered"
          value={inr(s.recoveredAmt)}
          icon={<BadgeCheck className="size-4" />}
          iconClassName={ACCENT.green}
          context="bills marked closed"
        />
        <KpiCard
          label="Open Bills"
          value={String(s.openBills)}
          icon={<FileClock className="size-4" />}
          iconClassName={ACCENT.blue}
          context={`${s.parties} parties in ledger`}
        />
        <KpiCard
          label="Recovery Rate"
          value={`${s.recoveryRate}%`}
          icon={<Percent className="size-4" />}
          iconClassName={ACCENT.purple}
          context={`${s.closed} of ${s.sent} outreach cycles closed`}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SegmentedBar
            title="Outreach by status"
            segments={[
              { label: "Closed", value: count("Closed"), color: "bg-success" },
              { label: "Replied", value: count("Replied"), color: "bg-blue-500" },
              { label: "Active", value: count("Active"), color: "bg-purple-500" },
              { label: "Awaiting reply", value: count("Awaiting Reply"), color: "bg-warning" },
              { label: "Disputed / founder", value: count("Disputed") + count("Founder Review"), color: "bg-destructive" },
              { label: "Queued", value: count("Queued"), color: "bg-muted-foreground/40" },
            ]}
          />
        </div>
        <SummaryStats
          stats={[
            { label: "Reply rate", value: `${s.replyRate}%`, note: `${s.replied} of ${s.sent} contacted` },
            { label: "Needs a human", value: String(s.disputes + s.founderReview), note: `${s.disputes} dispute · ${s.founderReview} founder` },
          ]}
        />
      </div>

      <RecentActivityTable rows={recent} />
    </>
  );
}
