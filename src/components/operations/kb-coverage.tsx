"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_KB_CHUNK_TREND, MOCK_KB_DOC_TYPE_BREAKDOWN } from "@/lib/mock-data/operations";

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export function KbCoverageSummary() {
  return (
    <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Chunk count trend</CardTitle>
        </CardHeader>
        <CardContent className="h-44 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_KB_CHUNK_TREND} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="kbChunkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                interval={1}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={36}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [value, "Total chunks"]} />
              <Area type="monotone" dataKey="totalChunks" stroke="var(--accent)" strokeWidth={2} fill="url(#kbChunkFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Doc-type breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-44 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_KB_DOC_TYPE_BREAKDOWN} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="type"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={36}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => [value, name === "chunkCount" ? "Chunks" : "Docs"]}
              />
              <Bar dataKey="count" name="Docs" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="chunkCount" name="Chunks" fill="var(--accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
