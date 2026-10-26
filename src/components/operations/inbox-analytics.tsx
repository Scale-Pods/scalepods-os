"use client";

import {
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
import {
  MOCK_CHANNEL_VOLUME,
  MOCK_RESPONSE_TIME_TREND,
  MOCK_SENTIMENT_BREAKDOWN,
} from "@/lib/mock-data/operations";

const CHANNEL_COLORS: Record<string, string> = {
  whatsapp: "var(--success)",
  email: "var(--primary)",
  web_chat: "var(--accent)",
};

const SENTIMENT_COLORS: Record<string, string> = {
  positive: "var(--success)",
  neutral: "var(--muted-foreground)",
  negative: "var(--destructive)",
};

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export function InboxAnalyticsStrip() {
  return (
    <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Volume by channel</CardTitle>
        </CardHeader>
        <CardContent className="h-48 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOCK_CHANNEL_VOLUME}
                dataKey="count"
                nameKey="label"
                innerRadius={40}
                outerRadius={64}
                paddingAngle={2}
                strokeWidth={0}
              >
                {MOCK_CHANNEL_VOLUME.map((d) => (
                  <Cell key={d.channel} fill={CHANNEL_COLORS[d.channel]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value, _name, item) => [value, item.payload.label]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 flex flex-wrap justify-center gap-3">
            {MOCK_CHANNEL_VOLUME.map((d) => (
              <span key={d.channel} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="size-2 rounded-full" style={{ background: CHANNEL_COLORS[d.channel] }} />
                {d.label} ({d.count})
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Response time, last 14 days</CardTitle>
        </CardHeader>
        <CardContent className="h-48 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_RESPONSE_TIME_TREND} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                interval={2}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={32}
                tickFormatter={(v: number) => `${v}m`}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}m`, "Avg. response"]} />
              <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Sentiment breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-48 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOCK_SENTIMENT_BREAKDOWN}
                dataKey="count"
                nameKey="label"
                innerRadius={40}
                outerRadius={64}
                paddingAngle={2}
                strokeWidth={0}
              >
                {MOCK_SENTIMENT_BREAKDOWN.map((d) => (
                  <Cell key={d.sentiment} fill={SENTIMENT_COLORS[d.sentiment]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value, _name, item) => [value, item.payload.label]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 flex flex-wrap justify-center gap-3">
            {MOCK_SENTIMENT_BREAKDOWN.map((d) => (
              <span key={d.sentiment} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="size-2 rounded-full" style={{ background: SENTIMENT_COLORS[d.sentiment] }} />
                {d.label} ({d.count})
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
