"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { FunnelRow, CHANNEL_META } from "./shared";
import { channelStats } from "@/lib/mock-data/receivables";

export function ChannelAnalyticsPage({ channel }: { channel: "email" | "whatsapp" }) {
  const meta = CHANNEL_META[channel];
  const s = channelStats(channel);
  const max = s.reached.length;

  const perStep = [0, 1, 2].map(
    (i) =>
      s.reached.filter((r) => {
        const row = r as unknown as Record<string, string | null>;
        return row[`${channel === "email" ? "email" : "wa"}_${i + 1}_sent_at`] !== null;
      }).length
  );

  const sentiments = (["Positive", "Neutral", "Negative"] as const).map((label) => ({
    label,
    value: s.repliedRows.filter((r) => r.sentiment === label).length,
  }));

  return (
    <>
      <PageHeader title={`${meta.label} Analytics`} description="Proportional bars over simple counts — not a time series." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 px-4 py-4">
            <h3 className="text-sm font-semibold">Recovery funnel</h3>
            <FunnelRow label="Parties reached" value={s.reached.length} max={max} color={meta.bar} />
            <FunnelRow label="Active threads" value={s.threads.length} max={max} color={meta.bar} />
            <FunnelRow label="Replied" value={s.repliedRows.length} max={max} color="bg-warning" />
            <FunnelRow label="Closed" value={s.closed.length} max={max} color="bg-success" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 px-4 py-4">
            <h3 className="text-sm font-semibold">Parties reached per cadence step</h3>
            {perStep.map((v, i) => (
              <FunnelRow key={i} label={`${meta.label} ${i + 1}`} value={v} max={max} color={meta.bar} />
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="space-y-3 px-4 py-4">
            <h3 className="text-sm font-semibold">Reply sentiment (AI analysis)</h3>
            {sentiments.map((x) => (
              <FunnelRow
                key={x.label}
                label={x.label}
                value={x.value}
                max={Math.max(1, s.repliedRows.length)}
                color={x.label === "Positive" ? "bg-success" : x.label === "Negative" ? "bg-destructive" : "bg-muted-foreground/50"}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
