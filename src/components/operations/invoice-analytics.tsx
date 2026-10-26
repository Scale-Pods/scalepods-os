"use client";

import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MOCK_AGING_BUCKETS,
  MOCK_COLLECTIONS_TREND,
  MOCK_CURRENCY_BREAKDOWN,
} from "@/lib/mock-data/operations";

const CURRENCY_COLORS: Record<string, string> = {
  INR: "var(--primary)",
  USD: "var(--success)",
  AED: "var(--accent)",
};

const AGING_COLORS: Record<string, string> = {
  "0-30": "var(--success)",
  "31-60": "var(--warning)",
  "61-90": "var(--accent)",
  "90+": "var(--destructive)",
};

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export function InvoiceAnalytics() {
  return (
    <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Aging buckets (overdue)</CardTitle>
        </CardHeader>
        <CardContent className="h-48 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_AGING_BUCKETS} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={32}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => [name === "amountUsd" ? `$${value}` : value, name === "amountUsd" ? "Amount" : "Invoices"]}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {MOCK_AGING_BUCKETS.map((d) => (
                  <Cell key={d.bucket} fill={AGING_COLORS[d.bucket]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Collections, last 8 weeks</CardTitle>
        </CardHeader>
        <CardContent className="h-48 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_COLLECTIONS_TREND} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={40}
                tickFormatter={(v: number) => `$${Math.round(v / 1000)}K`}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`$${Number(value).toLocaleString()}`, "Collected"]} />
              <Line type="monotone" dataKey="amountUsd" stroke="var(--success)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Currency breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-48 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOCK_CURRENCY_BREAKDOWN}
                dataKey="amountUsd"
                nameKey="currency"
                innerRadius={40}
                outerRadius={64}
                paddingAngle={2}
                strokeWidth={0}
              >
                {MOCK_CURRENCY_BREAKDOWN.map((d) => (
                  <Cell key={d.currency} fill={CURRENCY_COLORS[d.currency]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, _name, item) => [`$${Number(value).toLocaleString()}`, item.payload.currency]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 flex flex-wrap justify-center gap-3">
            {MOCK_CURRENCY_BREAKDOWN.map((d) => (
              <span key={d.currency} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="size-2 rounded-full" style={{ background: CURRENCY_COLORS[d.currency] }} />
                {d.currency} ({d.count})
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
