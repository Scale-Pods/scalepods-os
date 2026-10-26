"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_USAGE_PER_DAY } from "@/lib/mock-data/approvals";

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export function UsageTrendChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Usage over time, last 30 days</CardTitle>
      </CardHeader>
      <CardContent className="h-56 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_USAGE_PER_DAY} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="aiActionsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="outboundMsgFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              interval={3}
            />
            <YAxis tickLine={false} axisLine={false} width={32} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name) => [value, name === "aiActions" ? "AI actions" : "Outbound messages"]}
            />
            <Area
              type="monotone"
              dataKey="aiActions"
              name="AI actions"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#aiActionsFill)"
            />
            <Area
              type="monotone"
              dataKey="outboundMessages"
              name="Outbound messages"
              stroke="var(--accent)"
              strokeWidth={2}
              fill="url(#outboundMsgFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-1 flex flex-wrap justify-center gap-4">
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="size-2 rounded-full bg-primary" />
            AI actions
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="size-2 rounded-full bg-accent" />
            Outbound messages
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
