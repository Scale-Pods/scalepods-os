"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FunnelStage } from "@/lib/mock-data/marketing";

export function ApprovalFunnelChart({ data }: { data: FunnelStage[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Approval funnel</CardTitle>
      </CardHeader>
      <CardContent className="h-48 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <YAxis
              dataKey="stage"
              type="category"
              tickLine={false}
              axisLine={false}
              width={72}
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
            <Bar dataKey="count" name="Drafts" fill="var(--primary)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
