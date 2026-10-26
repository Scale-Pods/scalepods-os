"use client";

import * as React from "react";
import {
  Zap,
  Users,
  CalendarClock,
  ArrowRightLeft,
  Inbox,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge, AiGeneratedBadge } from "@/components/shared/badges";
import { ChannelIcon } from "@/components/sales/channel-icon";
import { InitialsAvatar } from "@/components/sales/initials-avatar";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { TrendLineChart } from "@/components/sales/charts/trend-line-chart";
import { DonutBreakdownChart } from "@/components/sales/charts/donut-breakdown-chart";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_LEAD_RESPONSE_FEED, responseTimeTrend, channelVolumeBreakdown } from "@/lib/mock-data/sales";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

const OUTCOME_LABEL: Record<string, string> = {
  meeting_booked: "Meeting booked",
  handed_to_human: "Handed to human",
  low_confidence_handoff: "Low confidence handoff",
  qualified_nurture: "Qualified · nurturing",
};

export default function LiveFeedPage() {
  const [channelFilter, setChannelFilter] = React.useState("all");
  const [outcomeFilter, setOutcomeFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [now] = React.useState(() => Date.now());

  const feed = MOCK_LEAD_RESPONSE_FEED;
  const responseTrend = React.useMemo(() => responseTimeTrend(now), [now]);
  const channelBreakdown = React.useMemo(() => channelVolumeBreakdown(feed), [feed]);

  const newToday = feed.length;
  const sortedTimes = [...feed.map((f) => f.responseTimeSeconds)].sort((a, b) => a - b);
  const median = sortedTimes[Math.floor(sortedTimes.length / 2)];
  const meetingsBooked = feed.filter((f) => f.outcome === "meeting_booked").length;
  const handoffs = feed.filter((f) => f.outcome === "handed_to_human" || f.outcome === "low_confidence_handoff").length;
  const handoffRate = Math.round((handoffs / feed.length) * 100);

  const filtered = feed.filter((e) => {
    if (channelFilter !== "all" && e.channel !== channelFilter) return false;
    if (outcomeFilter !== "all" && e.outcome !== outcomeFilter) return false;
    if (search && !e.leadName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        title="Live Feed"
        description="Inbound leads and the AI Lead Response agent's replies, newest first."
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <KpiCard label="New leads today" value={String(newToday)} context="Across web, WhatsApp, email" icon={<Users className="size-4" />} trend="up" trendValue="+6" />
        <KpiCard label="Median response time" value={`${median}s`} context="Goal: under 60s" trend="down" trendValue="-8s" trendGood icon={<Zap className="size-4" />} />
        <KpiCard label="Meetings booked" value={String(meetingsBooked)} context="Booked automatically" trend="up" trendValue="+3" icon={<CalendarClock className="size-4" />} />
        <KpiCard label="Handoff rate" value={`${handoffRate}%`} context="To human or low confidence" trend="flat" trendValue="0pts" icon={<ArrowRightLeft className="size-4" />} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-3 text-sm font-semibold">Median response time — last 14 days</h3>
            <TrendLineChart
              data={responseTrend}
              xKey="label"
              yKey="medianSeconds"
              valueFormatter={(v) => `${v}s`}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-3 text-sm font-semibold">Channel breakdown</h3>
            <DonutBreakdownChart data={channelBreakdown} height={180} />
          </CardContent>
        </Card>
      </div>

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search lead name...">
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All channels</SelectItem>
            <SelectItem value="web_chat">Web form</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
        <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Outcome" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All outcomes</SelectItem>
            <SelectItem value="meeting_booked">Meeting booked</SelectItem>
            <SelectItem value="handed_to_human">Handed to human</SelectItem>
            <SelectItem value="low_confidence_handoff">Low confidence handoff</SelectItem>
            <SelectItem value="qualified_nurture">Qualified · nurturing</SelectItem>
          </SelectContent>
        </Select>
      </ListToolbar>

      {filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="No events match your filters" description="Try a different channel or outcome filter." />
      ) : (
        <div className="space-y-3">
          {filtered.map((event) => {
            const fast = event.responseTimeSeconds < 60;
            return (
              <Card key={event.id}>
                <CardContent className="px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <InitialsAvatar name={event.leadName} size="sm" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{event.leadName}</p>
                          <ChannelIcon channel={event.channel} withLabel />
                        </div>
                        <p className="text-xs text-muted-foreground">{formatRelative(event.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-0 font-mono text-xs font-semibold",
                          fast ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                        )}
                      >
                        <Zap className="mr-1 size-3" />
                        {event.responseTimeSeconds}s
                      </Badge>
                      <StatusBadge status={event.outcome} />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="rounded-md bg-muted/50 px-3 py-2">
                      <p className="text-[10px] font-medium uppercase text-muted-foreground">Inbound</p>
                      <p className="mt-0.5 text-sm">{event.inboundSnippet}</p>
                    </div>
                    <div className="rounded-md bg-accent/10 px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[10px] font-medium uppercase text-muted-foreground">AI reply</p>
                        <AiGeneratedBadge />
                      </div>
                      <p className="mt-0.5 text-sm">{event.aiReplySnippet}</p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Qualification score</span>
                    <span className="font-semibold text-foreground">{event.qualificationScore}/100</span>
                    <span>·</span>
                    <span>{OUTCOME_LABEL[event.outcome]}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
