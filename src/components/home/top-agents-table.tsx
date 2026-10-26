"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TopAgentRow } from "@/lib/mock-data/executive-metrics";

export function TopAgentsTable({ rows }: { rows: TopAgentRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top agents by cost</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>App / Pod</TableHead>
              <TableHead className="text-right">Calls</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Avg / call</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={row.agentName}>
                <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="font-medium">{row.agentName}</TableCell>
                <TableCell className="text-muted-foreground">
                  {row.app} <span className="text-xs">· {row.pod}</span>
                </TableCell>
                <TableCell className="text-right">{row.calls.toLocaleString()}</TableCell>
                <TableCell className="text-right font-medium">${row.costUsd.toFixed(2)}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  ${row.avgCostPerCall.toFixed(4)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
