"use client";

import * as React from "react";
import { Search, Boxes, AlertTriangle, XCircle, Blocks } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge, DemoAdapterBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { InventoryAnalytics } from "@/components/custom/inventory-analytics";
import { cn } from "@/lib/utils";
import { MOCK_INVENTORY } from "@/lib/mock-data/custom";

export function InventoryTable() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const totalSkus = MOCK_INVENTORY.length;
  const lowStock = MOCK_INVENTORY.filter((i) => i.status === "low-stock").length;
  const outOfStock = MOCK_INVENTORY.filter((i) => i.status === "out-of-stock").length;

  const filtered = MOCK_INVENTORY.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!item.sku.toLowerCase().includes(q) && !item.productName.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <>
      <PageHeader
        title="Inventory"
        description="SKU-level stock levels and reorder alerts."
      />

      <Card className="mb-4 border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 px-4 py-3">
          <Blocks className="mt-0.5 size-4 shrink-0 text-primary" />
          <div className="flex-1">
            <p className="text-sm">
              This is an example custom module (<span className="font-medium">Inventory Intel</span>) added
              purely through the app manifest system — no shell code was changed to add it. It demonstrates
              how a client-specific app plugs into the sidebar, app switcher and Master Dashboard.
            </p>
            <div className="mt-1.5">
              <DemoAdapterBadge />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Total SKUs" value={String(totalSkus)} context="Tracked across 3 warehouses" icon={<Boxes className="size-4" />} />
        <KpiCard
          label="Low-stock SKUs"
          value={String(lowStock)}
          context="Below reorder threshold"
          trend="up"
          trendValue={`${lowStock}`}
          trendGood={false}
          icon={<AlertTriangle className="size-4" />}
        />
        <KpiCard
          label="Out-of-stock SKUs"
          value={String(outOfStock)}
          context="Needs immediate reorder"
          trend="up"
          trendValue={`${outOfStock}`}
          trendGood={false}
          icon={<XCircle className="size-4" />}
        />
      </div>

      <InventoryAnalytics />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search SKU or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger size="sm" className="h-8 w-44 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="in-stock">In stock</SelectItem>
            <SelectItem value="low-stock">Low stock</SelectItem>
            <SelectItem value="out-of-stock">Out of stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No SKUs found"
          description="Try a different search term or filter."
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Reorder threshold</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell
                    className={cn(
                      item.status === "low-stock" && "font-medium text-warning",
                      item.status === "out-of-stock" && "font-medium text-destructive"
                    )}
                  >
                    {item.stockLevel}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.reorderThreshold}</TableCell>
                  <TableCell className="text-muted-foreground">{item.warehouseLocation}</TableCell>
                  <TableCell>
                    <StatusBadge
                      status={
                        item.status === "in-stock"
                          ? "resolved"
                          : item.status === "low-stock"
                            ? "pending"
                            : "overdue"
                      }
                    />
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
