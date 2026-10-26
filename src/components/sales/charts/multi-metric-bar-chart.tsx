"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { RepStats } from "@/lib/mock-data/sales";

interface MultiMetricBarChartProps {
  reps: RepStats[];
  height?: number;
}

/** Grouped bar chart comparing every rep across emails / calls / meetings. */
export function MultiMetricBarChart({ reps, height = 280 }: MultiMetricBarChartProps) {
  const data = reps.map((r) => ({
    name: r.name.split(" ")[0],
    Emails: r.emailsSent,
    Calls: r.callsLogged,
    Meetings: r.meetingsBooked,
  }));

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Emails" fill="var(--primary)" radius={[3, 3, 0, 0]} maxBarSize={18} />
          <Bar dataKey="Calls" fill="var(--accent)" radius={[3, 3, 0, 0]} maxBarSize={18} />
          <Bar dataKey="Meetings" fill="var(--success)" radius={[3, 3, 0, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
