"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChannelWeekPoint } from "@/lib/mock-data/analytics";

const CHANNEL_META: { key: keyof Omit<ChannelWeekPoint, "week">; label: string; color: string }[] = [
  { key: "whatsapp", label: "WhatsApp", color: "var(--success)" },
  { key: "email", label: "Email", color: "var(--primary)" },
  { key: "web_chat", label: "Web chat", color: "var(--accent)" },
  { key: "sms", label: "SMS", color: "var(--warning)" },
];

export function MessagesByChannelChart({ data }: { data: ChannelWeekPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages sent by channel, per week</CardTitle>
      </CardHeader>
      <CardContent className="h-72 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              interval={1}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={36}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {CHANNEL_META.map((c) => (
              <Bar key={c.key} dataKey={c.key} name={c.label} stackId="channels" fill={c.color} radius={[0, 0, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
