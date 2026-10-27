"use client";

import * as React from "react";
import { toast } from "sonner";
import { ArrowRightLeft, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import {
  CHANNEL_KEYS, CHANNEL_LABELS, MOVEMENTS, PURCHASE_ORDERS, SKU_BY_ID, SUPPLIER_BY_ID, WAREHOUSES,
  abcClass, daysCover, daysUntilOrder, grossMargin, isoDay, monthlyRevenue, onOrderQty, skuTrend, stockStatus,
  stockValue, suggestedOrderQty, totalStock,
} from "@/lib/mock-data/inventory";
import { AbcPill, BarRow, Columns, Field, PoPill, Pill, Section, StockPill, fmtDate, inr, inrCompact, num } from "./shared";

export function SkuDetailDialog({ skuId, onClose }: { skuId: string | null; onClose: () => void }) {
  const s = skuId ? SKU_BY_ID[skuId] : undefined;
  return (
    <Dialog open={!!s} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={DETAIL_DIALOG_CLASS}>
        {s && <Body skuId={s.id} />}
      </DialogContent>
    </Dialog>
  );
}

function Body({ skuId }: { skuId: string }) {
  const s = SKU_BY_ID[skuId];
  const total = totalStock(s);
  const days = daysCover(s);
  const sup = SUPPLIER_BY_ID[s.supplierId];
  const moves = MOVEMENTS.filter((m) => m.skuId === s.id);
  const pos = PURCHASE_ORDERS.filter((p) => p.lines.some((l) => l.skuId === s.id));
  const trend = skuTrend(s);
  const qty = suggestedOrderQty(s);
  const maxCh = Math.max(1, ...CHANNEL_KEYS.map((k) => s.channels[k]));
  const orderIn = daysUntilOrder(s);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex flex-wrap items-center gap-2 text-base">
          {s.name}
          <StockPill status={stockStatus(s)} />
          <AbcPill cls={abcClass(s)} />
        </DialogTitle>
        <DialogDescription>{s.sku} · {s.category} · Supplier {sup.name}</DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="locations">Stock locations</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="movements">Movements ({moves.length})</TabsTrigger>
          <TabsTrigger value="procurement">Procurement ({pos.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Field label="Total stock" value={`${num(total)} units`} />
            <Field label="Days of cover" value={days >= 999 ? "No sales" : `${days} days`} />
            <Field label="Avg monthly sales" value={`${num(s.avgMonthlySales)} units`} />
            <Field label="Stock value (cost)" value={inr(stockValue(s))} />
            <Field label="Unit cost / MRP" value={`${inr(s.cost)} / ${inr(s.price)}`} />
            <Field label="Gross margin" value={`${grossMargin(s)}%`} />
            <Field label="Monthly revenue" value={inrCompact(monthlyRevenue(s))} />
            <Field label="On order" value={`${num(onOrderQty(s.id))} units`} />
            <Field label="Reorder point" value={`${num(s.reorderPoint)} units`} />
            <Field label="Safety stock" value={`${num(s.safetyStock)} units`} />
            <Field label="Lead time" value={`${s.leadTime} days`} />
            <Field label="MOQ" value={`${num(s.moq)} units`} />
          </div>
          <Section title="Reorder recommendation">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3">
              <div className="text-sm">
                <p>
                  Suggested order <span className="font-semibold">{num(qty)} units</span> (3 months supply, {inr(qty * s.cost)}).
                </p>
                <p className="text-xs text-muted-foreground">
                  {orderIn <= 0 ? "Order window has passed: place the PO now." : `Order window opens in ${orderIn} days to land before stockout.`}
                </p>
              </div>
              <Button size="sm" onClick={() => toast.success(`Draft PO created for ${num(qty)} x ${s.sku}`)}>
                <ShoppingCart className="size-3.5" /> Create PO
              </Button>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="locations" className="mt-4 space-y-4">
          <Section title="By sales channel">
            <div className="space-y-1.5 rounded-lg border p-3">
              {CHANNEL_KEYS.map((k) => (
                <BarRow key={k} label={CHANNEL_LABELS[k]} value={s.channels[k]} max={maxCh} display={`${num(s.channels[k])} (${total ? Math.round((s.channels[k] / total) * 100) : 0}%)`} barClass={k === "warehouse" ? "bg-primary" : "bg-blue-500"} />
              ))}
            </div>
          </Section>
          <Section title="Warehouse bins">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Warehouse</TableHead><TableHead>Bin</TableHead><TableHead className="text-right">Units</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {WAREHOUSES.map((w) => (
                    <TableRow key={w.id}><TableCell>{w.name}</TableCell><TableCell className="font-mono text-xs">{s.bins[w.id]}</TableCell><TableCell className="text-right tabular-nums">{num(s.warehouses[w.id])}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Section>
          <Button size="sm" variant="outline" onClick={() => toast.success("Channel transfer request queued")}>
            <ArrowRightLeft className="size-3.5" /> Reallocate between channels
          </Button>
        </TabsContent>

        <TabsContent value="forecast" className="mt-4 space-y-3">
          <Section title="Units sold: 6 months actual and 3 months forecast">
            <div className="rounded-lg border p-3">
              <Columns data={trend.map((t) => ({ label: t.label, value: t.units, className: t.forecast ? "bg-primary/35" : "bg-primary/80" }))} />
              <p className="mt-2 text-xs text-muted-foreground">Lighter bars are forecast. Trend {s.growthPct >= 0 ? "+" : ""}{s.growthPct}% month over month.</p>
            </div>
          </Section>
          <div className="grid grid-cols-3 gap-2">
            <Field label="Next 30d demand" value={`${num(trend[6].units)} units`} />
            <Field label="Next 90d demand" value={`${num(trend[6].units + trend[7].units + trend[8].units)} units`} />
            <Field label="Projected stockout" value={days >= 999 ? "None" : fmtDate(isoDay(days))} />
          </div>
        </TabsContent>

        <TabsContent value="movements" className="mt-4">
          {moves.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No movements recorded in the last 30 days.</p>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Route</TableHead><TableHead>Ref</TableHead><TableHead className="text-right">Qty</TableHead></TableRow></TableHeader>
                <TableBody>
                  {moves.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="text-xs">{fmtDate(m.date)}</TableCell>
                      <TableCell><Pill>{m.type}</Pill></TableCell>
                      <TableCell className="text-xs">{m.from} → {m.to}</TableCell>
                      <TableCell className="font-mono text-xs">{m.reference}</TableCell>
                      <TableCell className={`text-right tabular-nums ${m.qty < 0 ? "text-destructive" : m.qty > 0 ? "text-success" : ""}`}>{m.qty > 0 ? `+${m.qty}` : m.qty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="procurement" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Field label="Supplier" value={sup.name} />
            <Field label="Country" value={sup.country} />
            <Field label="On-time delivery" value={`${sup.onTimePct}%`} />
            <Field label="Payment terms" value={sup.paymentTerms} />
          </div>
          {pos.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No purchase orders include this SKU.</p>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader><TableRow><TableHead>PO</TableHead><TableHead>Status</TableHead><TableHead>ETA</TableHead><TableHead className="text-right">Qty</TableHead></TableRow></TableHeader>
                <TableBody>
                  {pos.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.id}</TableCell>
                      <TableCell><PoPill status={p.status} /></TableCell>
                      <TableCell className="text-xs">{fmtDate(p.receivedDate ?? p.eta)}</TableCell>
                      <TableCell className="text-right tabular-nums">{num(p.lines.find((l) => l.skuId === s.id)!.qty)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
