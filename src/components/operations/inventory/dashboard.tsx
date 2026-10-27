"use client";

import * as React from "react";
import { AlertTriangle, Archive, Boxes, IndianRupee, PackageX, Truck, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ALERTS, CATEGORIES, CHANNEL_KEYS, CHANNEL_LABELS, INV_TOTALS, PURCHASE_ORDERS, SKUS, SUPPLIER_BY_ID,
  channelTotals, daysCover, stockStatus, stockValue, totalStock, type StockStatus,
} from "@/lib/mock-data/inventory";
import { BarRow, ChartCard, PoPill, SeverityPill, StockPill, fmtDate, inrCompact, num } from "./shared";
import { SkuDetailDialog } from "./sku-detail-dialog";
import { PoDetailDialog } from "./po-detail-dialog";

const STATUS_BAR: Record<StockStatus, string> = {
  "Out of Stock": "bg-destructive",
  Critical: "bg-destructive/70",
  "Low Stock": "bg-warning",
  Healthy: "bg-success",
  Overstock: "bg-blue-500",
};

export function InventoryDashboardPage() {
  const [skuId, setSkuId] = React.useState<string | null>(null);
  const [poId, setPoId] = React.useState<string | null>(null);
  const t = INV_TOTALS;
  const ch = channelTotals();
  const maxCh = Math.max(...CHANNEL_KEYS.map((k) => ch[k]));
  const maxStatus = Math.max(...Object.values(t.counts));
  const catData = CATEGORIES.map((c) => ({ c, v: SKUS.filter((s) => s.category === c).reduce((a, s) => a + stockValue(s), 0) }));
  const maxCat = Math.max(...catData.map((d) => d.v));
  const atRisk = SKUS.filter((s) => totalStock(s) > 0 && daysCover(s) <= 25).sort((a, b) => daysCover(a) - daysCover(b)).slice(0, 8);
  const openAlerts = ALERTS.filter((a) => a.status === "Open" && a.severity !== "info").slice(0, 6);
  const activePos = PURCHASE_ORDERS.filter((p) => ["Ordered", "In Transit", "Delayed"].includes(p.status)).slice(0, 6);

  return (
    <>
      <PageHeader title="Inventory Intel" description="Multi-channel stock intelligence across warehouses, marketplaces and quick-commerce." />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total units" value={num(t.units)} context={`${SKUS.length} active SKUs`} icon={<Boxes className="size-4" />} />
        <KpiCard label="Capital locked" value={inrCompact(t.value)} context="Inventory at cost" icon={<IndianRupee className="size-4" />} />
        <KpiCard label="Critical / out" value={String(t.counts.Critical + t.counts["Out of Stock"])} context={`${t.counts["Out of Stock"]} out of stock`} trend="up" trendValue="needs PO" trendGood={false} icon={<PackageX className="size-4" />} />
        <KpiCard label="Low stock" value={String(t.counts["Low Stock"])} context="11 to 25 days cover" icon={<AlertTriangle className="size-4" />} />
        <KpiCard label="Overstock" value={String(t.counts.Overstock)} context={`${t.dead} dead stock SKUs`} icon={<Archive className="size-4" />} />
        <KpiCard label="Open POs" value={String(t.openPos)} context={`${inrCompact(t.onOrderValue)} on order`} icon={<Truck className="size-4" />} />
      </div>

      <div className="mb-4 grid gap-3 lg:grid-cols-3">
        <ChartCard title="Stock health" description="SKUs by cover status">
          <div className="space-y-2">
            {(Object.keys(t.counts) as StockStatus[]).map((k) => (
              <BarRow key={k} label={k} value={t.counts[k]} max={maxStatus} barClass={STATUS_BAR[k]} />
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Units by channel" description="Where stock is positioned">
          <div className="space-y-2">
            {CHANNEL_KEYS.map((k) => (
              <BarRow key={k} label={CHANNEL_LABELS[k]} value={ch[k]} max={maxCh} barClass={k === "warehouse" ? "bg-primary" : "bg-blue-500"} />
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Capital by category" description="Inventory value at cost">
          <div className="space-y-2">
            {catData.map((d) => (
              <BarRow key={d.c} label={d.c} value={d.v} max={maxCat} display={inrCompact(d.v)} barClass="bg-purple-500" />
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="mb-4 grid gap-3 lg:grid-cols-2">
        <ChartCard title="Closest to stockout" description="Click a SKU for detail">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow><TableHead>SKU</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Stock</TableHead><TableHead className="text-right">Cover</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {atRisk.map((s) => (
                  <TableRow key={s.id} className="cursor-pointer" onClick={() => setSkuId(s.id)}>
                    <TableCell><p className="text-sm font-medium">{s.name}</p><p className="text-[10px] text-muted-foreground">{s.sku}</p></TableCell>
                    <TableCell><StockPill status={stockStatus(s)} /></TableCell>
                    <TableCell className="text-right tabular-nums">{num(totalStock(s))}</TableCell>
                    <TableCell className="text-right tabular-nums">{daysCover(s)}d</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ChartCard>
        <ChartCard title="Open alerts" description="Critical and warning items awaiting action">
          <div className="space-y-2">
            {openAlerts.map((a) => (
              <button
                key={a.id}
                type="button"
                className="flex w-full items-start gap-2 rounded-lg border p-2 text-left hover:bg-muted/40"
                onClick={() => (a.skuId ? setSkuId(a.skuId) : a.poId && setPoId(a.poId))}
              >
                <SeverityPill severity={a.severity} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
                </div>
              </button>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Purchase orders in flight" description="Ordered, in transit and delayed">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow><TableHead>PO</TableHead><TableHead>Supplier</TableHead><TableHead>Status</TableHead><TableHead>ETA</TableHead><TableHead className="text-right">Units</TableHead><TableHead className="text-right">Value</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {activePos.map((p) => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => setPoId(p.id)}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell>{SUPPLIER_BY_ID[p.supplierId].name}</TableCell>
                  <TableCell><PoPill status={p.status} /></TableCell>
                  <TableCell className="text-xs">{fmtDate(p.eta)}</TableCell>
                  <TableCell className="text-right tabular-nums">{num(p.totalQty)}</TableCell>
                  <TableCell className="text-right tabular-nums">{inrCompact(p.totalValue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ChartCard>
      <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><TrendingUp className="size-3" /> {t.fast} fast-moving SKUs (over 200 units a month). Data as of {fmtDate("2026-10-27")}.</p>

      <SkuDetailDialog skuId={skuId} onClose={() => setSkuId(null)} />
      <PoDetailDialog poId={poId} onClose={() => setPoId(null)} />
    </>
  );
}
