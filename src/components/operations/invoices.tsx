"use client";

import * as React from "react";
import { toast } from "sonner";
import { Search, Upload, Receipt, Wallet, AlertTriangle, TrendingUp, Timer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { InvoiceAnalytics } from "@/components/operations/invoice-analytics";
import { formatMoney } from "@/lib/format";
import { MOCK_INVOICES, type Invoice } from "@/lib/mock-data/operations";

function toUsd(amountMinor: number, currency: Invoice["currency"]) {
  const rates: Record<string, number> = { USD: 1, INR: 1 / 83, AED: 1 / 3.67 };
  return (amountMinor / 100) * rates[currency];
}

export function InvoicesPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [open, setOpen] = React.useState(false);

  const overdue = MOCK_INVOICES.filter((i) => i.status === "overdue");
  const outstanding = MOCK_INVOICES.filter((i) => i.status === "overdue" || i.status === "sent");
  const paidThisMonth = MOCK_INVOICES.filter((i) => i.status === "paid");

  const outstandingUsd = outstanding.reduce((s, i) => s + toUsd(i.amountMinor, i.currency), 0);
  const collectedUsd = paidThisMonth.reduce((s, i) => s + toUsd(i.amountMinor, i.currency), 0);
  const avgDaysToPay = Math.round(
    paidThisMonth.reduce((s, i) => {
      const due = new Date(i.dueDate).getTime();
      const paid = i.paidDate ? new Date(i.paidDate).getTime() : due;
      return s + Math.max(0, Math.round((due - paid) / 86400000)) + 28;
    }, 0) / Math.max(1, paidThisMonth.length)
  );

  const filtered = MOCK_INVOICES.filter((i) => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !i.invoiceNumber.toLowerCase().includes(q) &&
        !i.customerName.toLowerCase().includes(q) &&
        !(i.companyName ?? "").toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  function handleImport() {
    toast.success("Invoices imported", { description: "4 invoices were parsed and added to Receivables." });
    setOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Invoices"
        description="Track outstanding invoices and recovery progress."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1.5">
                <Upload className="size-4" />
                Import invoices
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Import invoices</DialogTitle>
                <DialogDescription>Upload a CSV file or enter an invoice manually.</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="csv">
                <TabsList className="w-full">
                  <TabsTrigger value="csv">CSV upload</TabsTrigger>
                  <TabsTrigger value="manual">Manual entry</TabsTrigger>
                </TabsList>
                <TabsContent value="csv" className="pt-3">
                  <button
                    onClick={handleImport}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/40"
                  >
                    <Upload className="size-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to simulate a CSV upload</p>
                    <p className="text-xs text-muted-foreground">Columns: number, customer, amount, currency, due date</p>
                  </button>
                </TabsContent>
                <TabsContent value="manual" className="space-y-3 pt-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="inv-customer">Customer</Label>
                    <Input id="inv-customer" placeholder="Orbit Fintech" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="inv-amount">Amount</Label>
                      <Input id="inv-amount" type="number" placeholder="4200" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Currency</Label>
                      <Select defaultValue="USD">
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="INR">INR</SelectItem>
                          <SelectItem value="AED">AED</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="inv-due">Due date</Label>
                    <Input id="inv-due" type="date" />
                  </div>
                  <Button className="w-full" onClick={handleImport}>
                    Create invoice
                  </Button>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Outstanding amount"
          value={`$${(outstandingUsd / 1000).toFixed(1)}K`}
          context={`${outstanding.length} open invoices`}
          icon={<Wallet className="size-4" />}
        />
        <KpiCard
          label="Overdue count"
          value={String(overdue.length)}
          context="Needs attention"
          trend="up"
          trendValue={`${overdue.length}`}
          trendGood={false}
          icon={<AlertTriangle className="size-4" />}
        />
        <KpiCard
          label="Collected this month"
          value={`$${(collectedUsd / 1000).toFixed(1)}K`}
          context={`${paidThisMonth.length} invoices paid`}
          trend="up"
          trendValue="+12%"
          icon={<TrendingUp className="size-4" />}
        />
        <KpiCard
          label="Avg. days to pay"
          value={`${avgDaysToPay}d`}
          context="Last 30 days"
          trend="down"
          trendValue="-3d"
          trendGood={true}
          icon={<Timer className="size-4" />}
        />
      </div>

      <InvoiceAnalytics />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search invoice, customer, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger size="sm" className="h-8 w-40 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No invoices found"
          description="Try a different search or filter, or import new invoices."
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                  <TableCell>
                    <div>{inv.customerName}</div>
                    <div className="text-xs text-muted-foreground">{inv.companyName}</div>
                  </TableCell>
                  <TableCell>{formatMoney(inv.amountMinor, inv.currency)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(inv.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={inv.status} />
                      {inv.status === "overdue" && inv.daysOverdue && (
                        <span className="text-xs text-destructive">{inv.daysOverdue}d overdue</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
