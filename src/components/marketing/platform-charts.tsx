"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PLATFORMS,
  PLATFORM_COLOR_CLASS,
  PLATFORM_LABEL,
  type OutputTrendPoint,
  type PlatformCount,
  type WeeklyScheduledPoint,
} from "@/lib/mock-data/marketing";

const TOOLTIP_STYLE = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};
const AXIS_TICK = { fontSize: 11, fill: "var(--muted-foreground)" };

export function PlatformBreakdownDonut({ data }: { data: PlatformCount[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Platform breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-48 px-2">
        <div className="relative h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="count" nameKey="label" innerRadius="55%" outerRadius="85%" paddingAngle={2} strokeWidth={0}>
                {data.map((entry) => (
                  <Cell key={entry.platform} fill={PLATFORM_COLOR_CLASS[entry.platform].hex} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-lg font-semibold">{total}</p>
          </div>
        </div>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
          {data.map((d) => (
            <span key={d.platform} className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full" style={{ backgroundColor: PLATFORM_COLOR_CLASS[d.platform].hex }} />
              {d.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function WeeklyScheduledChart({ data }: { data: WeeklyScheduledPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Pipeline due: next 4 weeks</CardTitle>
      </CardHeader>
      <CardContent className="h-56 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
            <YAxis tickLine={false} axisLine={false} width={24} allowDecimals={false} tick={AXIS_TICK} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            {PLATFORMS.map((p) => (
              <Bar key={p} dataKey={p} name={PLATFORM_LABEL[p]} stackId="platforms" fill={PLATFORM_COLOR_CLASS[p].hex} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function OutputTrendStackedArea({ data }: { data: OutputTrendPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content output by platform, last 12 weeks</CardTitle>
      </CardHeader>
      <CardContent className="h-72 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tick={AXIS_TICK} interval={1} />
            <YAxis tickLine={false} axisLine={false} width={28} allowDecimals={false} tick={AXIS_TICK} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {PLATFORMS.map((p) => (
              <Area
                key={p}
                type="monotone"
                dataKey={p}
                name={PLATFORM_LABEL[p]}
                stackId="output"
                stroke={PLATFORM_COLOR_CLASS[p].hex}
                fill={PLATFORM_COLOR_CLASS[p].hex}
                fillOpacity={0.5}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
