"use client";

import { Bar, BarChart, Cell, Pie, PieChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_SPEND_BY_AGENT_TYPE, MOCK_SPEND_BY_MODEL } from "@/lib/mock-data/approvals";

const MODEL_COLORS = ["var(--primary)", "var(--accent)", "var(--success)", "var(--warning)", "var(--destructive)"];

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export function AiSpendCharts() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Spend by model</CardTitle>
        </CardHeader>
        <CardContent className="h-56 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOCK_SPEND_BY_MODEL}
                dataKey="spendUsd"
                nameKey="model"
                innerRadius={44}
                outerRadius={70}
                paddingAngle={2}
                strokeWidth={0}
              >
                {MOCK_SPEND_BY_MODEL.map((d, i) => (
                  <Cell key={d.model} fill={MODEL_COLORS[i % MODEL_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, _name, item) => [`$${Number(value).toFixed(2)}`, item.payload.model]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 flex flex-wrap justify-center gap-3">
            {MOCK_SPEND_BY_MODEL.map((d, i) => (
              <span key={d.model} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="size-2 rounded-full" style={{ background: MODEL_COLORS[i % MODEL_COLORS.length] }} />
                {d.model} (${d.spendUsd.toFixed(2)})
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Spend by agent type</CardTitle>
        </CardHeader>
        <CardContent className="h-56 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_SPEND_BY_AGENT_TYPE} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={46}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={40}
                tickFormatter={(v: number) => `$${v}`}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`$${Number(value).toFixed(2)}`, "Spend"]} />
              <Bar dataKey="spendUsd" fill="var(--accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
