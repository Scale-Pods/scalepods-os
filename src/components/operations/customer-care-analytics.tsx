"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { MessagesSquare, Timer, Smile, Bot } from "lucide-react";
import {
  MOCK_AGENT_REPLY_SHARE,
  MOCK_CONVERSATION_VOLUME_TREND,
  MOCK_RESOLUTION_TIME_TREND,
  MOCK_SENTIMENT_TREND,
} from "@/lib/mock-data/operations";

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

const AGENT_SHARE_COLORS = ["var(--accent)", "var(--primary)"];

export function CustomerCareAnalyticsPage() {
  const totalConversations = MOCK_CONVERSATION_VOLUME_TREND.reduce((s, d) => s + d.value, 0);
  const avgResolution =
    Math.round(
      (MOCK_RESOLUTION_TIME_TREND.reduce((s, d) => s + d.value, 0) / MOCK_RESOLUTION_TIME_TREND.length) * 10
    ) / 10;
  const latestSentiment = MOCK_SENTIMENT_TREND[MOCK_SENTIMENT_TREND.length - 1];
  const negativeShare = latestSentiment
    ? Math.round(
        (latestSentiment.negative / (latestSentiment.positive + latestSentiment.neutral + latestSentiment.negative)) *
          100
      )
    : 0;
  const aiShareTotal = MOCK_AGENT_REPLY_SHARE.reduce((s, d) => s + d.value, 0);
  const aiSharePct = aiShareTotal
    ? Math.round(((MOCK_AGENT_REPLY_SHARE.find((d) => d.label === "AI agent")?.value ?? 0) / aiShareTotal) * 100)
    : 0;

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Conversation volume, resolution speed, sentiment and AI reply share over time."
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Conversations, 14d"
          value={String(totalConversations)}
          context="Across all channels"
          icon={<MessagesSquare className="size-4" />}
        />
        <KpiCard
          label="Avg. resolution time"
          value={`${avgResolution}h`}
          context="Last 14 days"
          trend="down"
          trendValue="improving"
          icon={<Timer className="size-4" />}
        />
        <KpiCard
          label="Negative sentiment"
          value={`${negativeShare}%`}
          context="Share of conversations today"
          trend={negativeShare > 15 ? "up" : "down"}
          trendValue={`${negativeShare}%`}
          trendGood={negativeShare <= 15}
          icon={<Smile className="size-4" />}
        />
        <KpiCard
          label="AI reply share"
          value={`${aiSharePct}%`}
          context="Of outbound replies"
          icon={<Bot className="size-4" />}
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Conversation volume, last 14 days</CardTitle>
          </CardHeader>
          <CardContent className="h-56 px-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CONVERSATION_VOLUME_TREND} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="convVolFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  interval={1}
                />
                <YAxis tickLine={false} axisLine={false} width={32} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [value, "Conversations"]} />
                <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} fill="url(#convVolFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Resolution time, last 14 days</CardTitle>
          </CardHeader>
          <CardContent className="h-56 px-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_RESOLUTION_TIME_TREND} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  interval={1}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={36}
                  tickFormatter={(v: number) => `${v}h`}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}h`, "Resolution time"]} />
                <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Sentiment trend, last 14 days</CardTitle>
          </CardHeader>
          <CardContent className="h-56 px-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_SENTIMENT_TREND} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  interval={1}
                />
                <YAxis tickLine={false} axisLine={false} width={32} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="positive" stackId="s" fill="var(--success)" />
                <Bar dataKey="neutral" stackId="s" fill="var(--muted-foreground)" />
                <Bar dataKey="negative" stackId="s" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">AI vs. human reply share</CardTitle>
          </CardHeader>
          <CardContent className="h-56 px-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_AGENT_REPLY_SHARE}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={44}
                  outerRadius={68}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {MOCK_AGENT_REPLY_SHARE.map((d, i) => (
                    <Cell key={d.label} fill={AGENT_SHARE_COLORS[i % AGENT_SHARE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value, _name, item) => [value, item.payload.label]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-1 flex flex-wrap justify-center gap-3">
              {MOCK_AGENT_REPLY_SHARE.map((d, i) => (
                <span key={d.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ background: AGENT_SHARE_COLORS[i % AGENT_SHARE_COLORS.length] }} />
                  {d.label} ({d.value})
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
