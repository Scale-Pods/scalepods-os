"use client";

import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import * as React from "react";
import { Users, Mail, MessageCircle, Mic, MessageSquareReply } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { ChannelBadge } from "@/components/sales/outreach-system/channel-badge";
import { DonutBreakdownChart } from "@/components/sales/charts/donut-breakdown-chart";
import { AreaTrendChart } from "@/components/sales/charts/area-trend-chart";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  COLD_OUTREACH_SUMMARY,
  HOT_CRM_SUMMARY,
  CHANNEL_DISTRIBUTION,
  dailyAcquisitionTrend,
  MOCK_REPLIES,
} from "@/lib/mock-data/outreach-system";

function MetricRow({
  summary,
  onRepliesClick,
}: {
  summary: typeof COLD_OUTREACH_SUMMARY;
  onRepliesClick: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <KpiCard label="Total Leads" value={summary.totalLeads.toLocaleString()} icon={<Users className="size-4" />} />
      <KpiCard label="Emails Sent" value={summary.emailsSent.toLocaleString()} icon={<Mail className="size-4" />} />
      <KpiCard label="WhatsApp Chats" value={summary.whatsappChats.toLocaleString()} icon={<MessageCircle className="size-4" />} />
      <KpiCard label="Voice Calls" value={summary.voiceCalls.toLocaleString()} icon={<Mic className="size-4" />} />
      <KpiCard
        label="Total Replies"
        value={summary.totalReplies.toLocaleString()}
        context="Click to view"
        icon={<MessageSquareReply className="size-4" />}
        onClick={onRepliesClick}
      />
    </div>
  );
}

export default function OutreachSystemOverviewPage() {
  const [repliesOpen, setRepliesOpen] = React.useState(false);
  const trend = React.useMemo(() => dailyAcquisitionTrend(30), []);

  return (
    <>
      <PageHeader title="Outreach System" description="Multi-channel cold outreach, unified." />

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-xl font-bold">Cold Outreach bot</h2>
          <MetricRow summary={COLD_OUTREACH_SUMMARY} onRepliesClick={() => setRepliesOpen(true)} />
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold">Hot CRM outreach bot</h2>
          <MetricRow summary={HOT_CRM_SUMMARY} onRepliesClick={() => setRepliesOpen(true)} />
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardContent className="px-4 py-4">
              <h3 className="mb-3 text-sm font-semibold">Channel distribution</h3>
              <DonutBreakdownChart data={CHANNEL_DISTRIBUTION} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="px-4 py-4">
              <h3 className="mb-3 text-sm font-semibold">Lead acquisition — last 30 days</h3>
              <AreaTrendChart data={trend} xKey="label" yKey="leads" />
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={repliesOpen} onOpenChange={setRepliesOpen}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          <DialogHeader>
            <DialogTitle>Replied leads</DialogTitle>
            <DialogDescription>Leads who replied across all outreach channels.</DialogDescription>
          </DialogHeader>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {MOCK_REPLIES.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.company}</p>
                </div>
                <ChannelBadge channel={r.channel} />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
