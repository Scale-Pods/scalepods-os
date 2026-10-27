"use client";

import { Send, Users, MessageSquareReply, BadgeCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SegmentedBar, SummaryStats, ACCENT, CHANNEL_META } from "./shared";
import { RecentActivityTable } from "./recent-activity";
import { lastActivity } from "./dashboard";
import { channelStats } from "@/lib/mock-data/receivables";

export function ChannelDashboardPage({ channel }: { channel: "email" | "whatsapp" }) {
  const meta = CHANNEL_META[channel];
  const s = channelStats(channel);
  const awaiting = s.reached.length - s.repliedRows.length;
  const recent = [...s.reached].sort((a, b) => lastActivity(b) - lastActivity(a)).slice(0, 8);
  const noun = channel === "email" ? "Emails" : "Messages";
  const replyPct = s.reached.length ? Math.round((s.repliedRows.length / s.reached.length) * 100) : 0;

  return (
    <>
      <PageHeader
        title={`${meta.label} Dashboard`}
        description={`Live from recovery_outreach — ${channel === "email" ? "email_N_*" : "wa_N_*"} step fields and conversation threads.`}
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label={`${noun} Sent`} value={String(s.messagesSent)} icon={<Send className="size-4" />} iconClassName={ACCENT[meta.accent]} context="across all cadence steps" />
        <KpiCard label="Parties Reached" value={String(s.reached.length)} icon={<Users className="size-4" />} iconClassName={ACCENT[meta.accent]} context="at least one step delivered" />
        <KpiCard label="Replies" value={String(s.repliedRows.length)} icon={<MessageSquareReply className="size-4" />} iconClassName={ACCENT.orange} context={`${replyPct}% reply rate`} />
        <KpiCard label="Closed" value={String(s.closed.length)} icon={<BadgeCheck className="size-4" />} iconClassName={ACCENT.green} context="repliers who paid" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SegmentedBar
            title="Reply outcome"
            segments={[
              { label: "Closed", value: s.closed.length, color: "bg-success" },
              { label: "Replied, still open", value: s.repliedRows.length - s.closed.length, color: "bg-blue-500" },
              { label: "No reply yet", value: awaiting, color: "bg-warning" },
            ]}
          />
        </div>
        <SummaryStats
          stats={[
            { label: "Threads", value: String(s.threads.length), note: "replied or multi-step" },
            { label: "Avg steps / party", value: s.reached.length ? (s.messagesSent / s.reached.length).toFixed(1) : "0", note: "of 3 scheduled" },
          ]}
        />
      </div>

      <RecentActivityTable rows={recent} emptyMessage={`No ${meta.label.toLowerCase()} outreach yet.`} />
    </>
  );
}
