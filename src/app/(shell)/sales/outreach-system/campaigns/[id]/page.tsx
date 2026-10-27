"use client";

import { notFound, useParams } from "next/navigation";
import { Users, Radio, Percent } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { ChannelBadge } from "@/components/sales/outreach-system/channel-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { campaignById, campaignChannelBreakdown } from "@/lib/mock-data/outreach-system";

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const campaign = campaignById(params.id);
  if (!campaign) notFound();

  const breakdown = campaignChannelBreakdown(campaign);

  return (
    <>
      <PageHeader
        title={campaign.name}
        description="Campaign performance across every channel it uses."
        badge={<Badge variant="outline">{campaign.rep}</Badge>}
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Leads Assigned" value={campaign.leadsAssigned.toLocaleString()} icon={<Users className="size-4" />} />
        <KpiCard label="Channels Used" value={String(campaign.channels.length)} icon={<Radio className="size-4" />} />
        <KpiCard label="Reply Rate" value={`${campaign.replyRatePct}%`} icon={<Percent className="size-4" />} trend="up" trendValue="steady" />
      </div>

      <Card>
        <CardContent className="px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold">Breakdown by channel</h3>
          <div className="space-y-2">
            {breakdown.map((row) => (
              <div key={row.channel} className="flex items-center justify-between rounded-lg border px-3 py-2.5">
                <ChannelBadge channel={row.channel} />
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-semibold">{row.sent.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">sent</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">{row.replies.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">replies</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
