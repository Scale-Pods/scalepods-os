"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReviewerWorkload } from "@/lib/mock-data/marketing";

export function ReviewerWorkloadChart({ data }: { data: ReviewerWorkload[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviewer workload</CardTitle>
      </CardHeader>
      <CardContent className="h-64 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={28}
              allowDecimals={false}
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
            <Bar dataKey="approved" name="Approved" stackId="workload" fill="var(--success)" />
            <Bar dataKey="pending" name="Pending" stackId="workload" fill="var(--warning)" />
            <Bar dataKey="rejected" name="Rejected" stackId="workload" fill="var(--destructive)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
