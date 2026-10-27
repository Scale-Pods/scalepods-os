"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { PURCHASE_ORDERS, SKU_BY_ID, SUPPLIER_BY_ID, WAREHOUSES, SUPPLIERS, type Supplier } from "@/lib/mock-data/inventory";
import { Field, PoPill, Pill, Section, fmtDate, inr, num } from "./shared";

export function PoDetailDialog({ poId, onClose }: { poId: string | null; onClose: () => void }) {
  const po = poId ? PURCHASE_ORDERS.find((p) => p.id === poId) : undefined;
  const sup = po ? SUPPLIER_BY_ID[po.supplierId] : undefined;
  return (
    <Dialog open={!!po} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={DETAIL_DIALOG_CLASS}>
        {po && sup && (
          <>
            <DialogHeader>
              <DialogTitle className="flex flex-wrap items-center gap-2 text-base">{po.id} <PoPill status={po.status} /></DialogTitle>
              <DialogDescription>{sup.name} · Deliver to {WAREHOUSES.find((w) => w.id === po.destination)?.name}</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="lines">
              <TabsList>
                <TabsTrigger value="lines">Line items ({po.lines.length})</TabsTrigger>
                <TabsTrigger value="shipment">Shipment</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="supplier">Supplier</TabsTrigger>
              </TabsList>
              <TabsContent value="lines" className="mt-4">
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader><TableRow><TableHead>SKU</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Unit cost</TableHead><TableHead className="text-right">Line total</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {po.lines.map((l) => (
                        <TableRow key={l.skuId}>
                          <TableCell><p className="text-sm font-medium">{SKU_BY_ID[l.skuId].name}</p><p className="text-[10px] text-muted-foreground">{SKU_BY_ID[l.skuId].sku}</p></TableCell>
                          <TableCell className="text-right tabular-nums">{num(l.qty)}</TableCell>
                          <TableCell className="text-right tabular-nums">{inr(l.unitCost)}</TableCell>
                          <TableCell className="text-right tabular-nums">{inr(l.qty * l.unitCost)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow><TableCell>Total</TableCell><TableCell className="text-right tabular-nums">{num(po.totalQty)}</TableCell><TableCell /><TableCell className="text-right tabular-nums">{inr(po.totalValue)}</TableCell></TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="shipment" className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <Field label="Order date" value={fmtDate(po.orderDate)} />
                  <Field label="ETA" value={fmtDate(po.eta)} />
                  <Field label="Received" value={fmtDate(po.receivedDate)} />
                  <Field label="Incoterm" value={po.incoterm} />
                  <Field label="Freight" value={inr(po.freight)} />
                  <Field label="Landed value" value={inr(po.totalValue + po.freight)} />
                </div>
                <Section title="Notes"><p className="rounded-lg border p-3 text-sm">{po.notes}</p></Section>
              </TabsContent>
              <TabsContent value="timeline" className="mt-4">
                <ol className="space-y-3 border-l pl-4">
                  {po.timeline.map((t, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-primary" />
                      <p className="text-xs text-muted-foreground">{fmtDate(t.date)}</p>
                      <p className="text-sm">{t.event}</p>
                    </li>
                  ))}
                </ol>
              </TabsContent>
              <TabsContent value="supplier" className="mt-4"><SupplierFields s={sup} /></TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function SupplierFields({ s }: { s: Supplier }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      <Field label="Country" value={s.country} />
      <Field label="Contact" value={s.contact} />
      <Field label="Email" value={s.email} />
      <Field label="Lead time" value={`${s.leadTimeDays} days`} />
      <Field label="On-time delivery" value={`${s.onTimePct}%`} />
      <Field label="Quality pass rate" value={`${s.qualityPct}%`} />
      <Field label="Payment terms" value={s.paymentTerms} />
      <Field label="Rating" value={`${s.rating} / 5`} />
      <Field label="Categories" value={<span className="flex flex-wrap gap-1">{s.categories.map((c) => <Pill key={c}>{c}</Pill>)}</span>} />
    </div>
  );
}

export const ALL_SUPPLIERS = SUPPLIERS;
