"use client";

import { useRouter } from "next/navigation";
import { Megaphone, Users, Radio, Percent } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { ChannelBadge } from "@/components/sales/outreach-system/channel-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data/outreach-system";

export default function CampaignsPage() {
  const router = useRouter();
  const totalLeads = MOCK_CAMPAIGNS.reduce((s, c) => s + c.leadsAssigned, 0);
  const avgReplyRate = Math.round(
    MOCK_CAMPAIGNS.reduce((s, c) => s + c.replyRatePct, 0) / MOCK_CAMPAIGNS.length
  );
  const channelsUsed = new Set(MOCK_CAMPAIGNS.flatMap((c) => c.channels)).size;

  return (
    <>
      <PageHeader
        title="Campaigns"
        description="Multi-channel campaigns and the reps running them."
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Campaigns" value={String(MOCK_CAMPAIGNS.length)} icon={<Megaphone className="size-4" />} />
        <KpiCard label="Leads Assigned" value={totalLeads.toLocaleString()} icon={<Users className="size-4" />} />
        <KpiCard label="Channels in Use" value={String(channelsUsed)} icon={<Radio className="size-4" />} />
        <KpiCard label="Avg Reply Rate" value={`${avgReplyRate}%`} icon={<Percent className="size-4" />} trend="up" trendValue="+2pts" />
      </div>

      <Card>
        <CardContent className="px-0 py-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Campaign</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Rep</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Channels</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Leads</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Reply Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_CAMPAIGNS.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/sales/outreach-system/campaigns/${c.id}`)}
                  >
                    <TableCell className="font-medium hover:underline">{c.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{c.rep}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {c.channels.map((ch) => (
                          <ChannelBadge key={ch} channel={ch} withLabel={false} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{c.leadsAssigned.toLocaleString()}</TableCell>
                    <TableCell className="font-medium text-success">{c.replyRatePct}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="border-t bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            Showing {MOCK_CAMPAIGNS.length} results
          </div>
        </CardContent>
      </Card>
    </>
  );
}
