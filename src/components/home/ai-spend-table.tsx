import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AiSpendRow } from "@/lib/mock-data/executive-metrics";

export function AiSpendTable({ rows }: { rows: AiSpendRow[] }) {
  const totalCalls = rows.reduce((sum, r) => sum + r.calls, 0);
  const totalCost = rows.reduce((sum, r) => sum + r.costUsd, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI spend breakdown</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>App</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead className="text-right">Calls</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={`${row.app}-${row.agentType}`}>
                <TableCell className="font-medium">{row.app}</TableCell>
                <TableCell className="text-muted-foreground">{row.agentType}</TableCell>
                <TableCell className="text-right">{row.calls.toLocaleString()}</TableCell>
                <TableCell className="text-right">${row.costUsd.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between border-t px-4 pt-3 text-sm">
          <span className="text-muted-foreground">Total this month</span>
          <span className="font-semibold">
            {totalCalls.toLocaleString()} calls · ${totalCost.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
