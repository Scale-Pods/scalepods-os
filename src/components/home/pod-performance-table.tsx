"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { PodPerformanceRow } from "@/lib/mock-data/analytics";

export function PodPerformanceTable({ rows }: { rows: PodPerformanceRow[] }) {
  const totalActions = rows.reduce((sum, r) => sum + r.aiActionsThisMonth, 0);
  const totalCost = rows.reduce((sum, r) => sum + r.costUsd, 0);
  const totalApprovals = rows.reduce((sum, r) => sum + r.approvalsPending, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pod performance</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pod</TableHead>
              <TableHead className="text-right">AI actions this month</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Approvals pending</TableHead>
              <TableHead className="text-right">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.pod}>
                <TableCell className="font-medium">{row.label}</TableCell>
                <TableCell className="text-right">{row.aiActionsThisMonth.toLocaleString()}</TableCell>
                <TableCell className="text-right">${row.costUsd.toFixed(2)}</TableCell>
                <TableCell className="text-right">{row.approvalsPending}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "inline-flex items-center justify-end gap-0.5 text-xs font-medium",
                      row.trend === "up" && "text-success",
                      row.trend === "down" && "text-destructive",
                      row.trend === "flat" && "text-muted-foreground"
                    )}
                  >
                    {row.trend === "up" && <ArrowUpRight className="size-3" />}
                    {row.trend === "down" && <ArrowDownRight className="size-3" />}
                    {row.trend === "flat" && <Minus className="size-3" />}
                    {row.trendValue}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between border-t px-4 pt-3 text-sm">
          <span className="text-muted-foreground">Total across pods</span>
          <span className="font-semibold">
            {totalActions.toLocaleString()} actions · ${totalCost.toFixed(2)} · {totalApprovals} pending
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
