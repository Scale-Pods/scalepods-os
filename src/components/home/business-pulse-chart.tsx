"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompact } from "@/lib/format";
import type { PulseWeekPoint } from "@/lib/mock-data/analytics";

export function BusinessPulseChart({ data }: { data: PulseWeekPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads, deals &amp; candidates — last 12 weeks</CardTitle>
      </CardHeader>
      <CardContent className="h-72 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={40}
              tickFormatter={(v: number) => formatCompact(v)}
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
            <Area
              type="monotone"
              dataKey="leads"
              name="Leads"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#leadsFill)"
            />
            <Line
              type="monotone"
              dataKey="deals"
              name="Deals"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="candidates"
              name="Candidates"
              stroke="var(--success)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="4 3"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-1 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <LegendDot color="var(--primary)" label="Leads" />
          <LegendDot color="var(--accent)" label="Deals" />
          <LegendDot color="var(--success)" label="Candidates" dashed />
        </div>
      </CardContent>
    </Card>
  );
}

function LegendDot({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block h-0.5 w-3"
        style={{ backgroundColor: dashed ? "transparent" : color, borderTop: dashed ? `2px dashed ${color}` : undefined }}
      />
      {label}
    </span>
  );
}
