"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface HorizontalBarDatum {
  label: string;
  value: number;
}

export function HorizontalBarChart({
  data,
  title,
  color = "var(--primary)",
  height = 220,
  valueLabel = "Value",
}: {
  data: HorizontalBarDatum[];
  title: string;
  color?: string;
  height?: number;
  valueLabel?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-2" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 4 }}>
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <YAxis
              type="category"
              dataKey="label"
              width={120}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value) => [value, valueLabel]}
            />
            <Bar dataKey="value" fill={color} radius={[0, 6, 6, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
