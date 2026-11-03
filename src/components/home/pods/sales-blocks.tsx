"use client";

import { Users, Mail, MessageCircle, Phone, MessageSquareReply } from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { AppBlock, BarList, Columns, KpiRow, MiniList, Panel, Pill, TONE, num } from "./pod-ui";
import type { AppManifest } from "@/lib/types/manifest";
import {
  COLD_OUTREACH_SUMMARY,
  EMAIL_METRICS,
  LINKEDIN_METRICS,
  MOCK_CAMPAIGNS,
  MOCK_REPLIES,
  VOICE_METRICS,
  WHATSAPP_METRICS,
  dailyAcquisitionTrend,
} from "@/lib/mock-data/outreach-system";

const CHANNEL_TONE = { email: "blue", whatsapp: "green", voice: "purple", linkedin: "neutral" } as const;

export function OutreachBlock({ app }: { app: AppManifest }) {
  const s = COLD_OUTREACH_SUMMARY;
  const replyRate = EMAIL_METRICS.totalSent ? Math.round((EMAIL_METRICS.replied / EMAIL_METRICS.totalSent) * 1000) / 10 : 0;
  const trend = dailyAcquisitionTrend(14).map((p) => ({ label: p.label, a: p.leads }));

  return (
    <AppBlock app={app}>
      <KpiRow cols={5}>
        <KpiCard label="Total leads" value={num(s.totalLeads)} icon={<Users className="size-4" />} iconClassName={TONE.blue} context="across all channels" />
        <KpiCard label="Emails sent" value={num(s.emailsSent)} icon={<Mail className="size-4" />} iconClassName={TONE.blue} context={`${EMAIL_METRICS.openRatePct}% open rate`} />
        <KpiCard label="WhatsApp chats" value={num(s.whatsappChats)} icon={<MessageCircle className="size-4" />} iconClassName={TONE.green} context={`${num(WHATSAPP_METRICS.activeLeads)} active leads`} />
        <KpiCard label="Voice calls" value={num(s.voiceCalls)} icon={<Phone className="size-4" />} iconClassName={TONE.purple} context={`${num(VOICE_METRICS.connected)} connected`} />
        <KpiCard label="Total replies" value={num(s.totalReplies)} icon={<MessageSquareReply className="size-4" />} iconClassName={TONE.orange} context="all channels" />
      </KpiRow>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Channel performance" subtitle="Rate of the primary success metric per channel">
          <BarList
            max={100}
            rows={[
              { label: "Email open rate", value: EMAIL_METRICS.openRatePct, display: `${EMAIL_METRICS.openRatePct}%`, color: "bg-blue-500" },
              { label: "Email reply rate", value: replyRate, display: `${replyRate}%`, color: "bg-blue-500" },
              { label: "WhatsApp response", value: WHATSAPP_METRICS.responseRatePct, display: `${WHATSAPP_METRICS.responseRatePct}%`, color: "bg-success" },
              { label: "Voice connect rate", value: VOICE_METRICS.successRatePct, display: `${VOICE_METRICS.successRatePct}%`, color: "bg-purple-500" },
              { label: "LinkedIn connection", value: LINKEDIN_METRICS.connectionRatePct, display: `${LINKEDIN_METRICS.connectionRatePct}%`, color: "bg-muted-foreground/60" },
            ]}
          />
        </Panel>
        <Panel title="New leads, last 14 days" subtitle="Daily acquisition">
          <Columns data={trend} aLabel="Leads" />
        </Panel>
        <Panel title="Campaigns" subtitle="Reply rate by campaign">
          <MiniList
            rows={MOCK_CAMPAIGNS.slice(0, 5).map((c) => ({
              key: c.id,
              primary: c.name,
              secondary: `${c.rep} · ${num(c.leadsAssigned)} leads`,
              right: `${c.replyRatePct}%`,
            }))}
          />
        </Panel>
      </div>

      <Panel title="Latest replies" subtitle="Most recent responses across channels">
        <MiniList
          rows={MOCK_REPLIES.slice(0, 5).map((r) => ({
            key: r.id,
            primary: `${r.name} · ${r.company}`,
            secondary: r.snippet,
            right: <Pill label={r.channel} tone={CHANNEL_TONE[r.channel]} />,
          }))}
        />
      </Panel>
    </AppBlock>
  );
}
