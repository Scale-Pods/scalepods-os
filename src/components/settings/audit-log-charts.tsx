"use client";

import { Bar, BarChart, Cell, Pie, PieChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_ACTIONS_PER_DAY, MOCK_ACTOR_TYPE_SPLIT } from "@/lib/mock-data/approvals";

const ACTOR_COLORS: Record<string, string> = {
  agent: "var(--accent)",
  user: "var(--primary)",
};

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export function AuditLogCharts() {
  return (
    <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Actions per day, last 14 days</CardTitle>
        </CardHeader>
        <CardContent className="h-48 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_ACTIONS_PER_DAY} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                interval={1}
              />
              <YAxis tickLine={false} axisLine={false} width={32} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [value, "Actions"]} />
              <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Actor type split</CardTitle>
        </CardHeader>
        <CardContent className="h-48 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOCK_ACTOR_TYPE_SPLIT}
                dataKey="count"
                nameKey="label"
                innerRadius={40}
                outerRadius={64}
                paddingAngle={2}
                strokeWidth={0}
              >
                {MOCK_ACTOR_TYPE_SPLIT.map((d) => (
                  <Cell key={d.actorType} fill={ACTOR_COLORS[d.actorType]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value, _name, item) => [value, item.payload.label]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 flex flex-wrap justify-center gap-3">
            {MOCK_ACTOR_TYPE_SPLIT.map((d) => (
              <span key={d.actorType} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="size-2 rounded-full" style={{ background: ACTOR_COLORS[d.actorType] }} />
                {d.label} ({d.count})
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
