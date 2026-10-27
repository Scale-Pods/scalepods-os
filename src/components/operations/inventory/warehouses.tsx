"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { MOVEMENTS, PURCHASE_ORDERS, SKUS, SKU_BY_ID, WAREHOUSES, warehouseTotals, type Warehouse } from "@/lib/mock-data/inventory";
import { BarRow, Field, Pill, PoPill, fmtDate, inrCompact, num } from "./shared";
import { SkuDetailDialog } from "./sku-detail-dialog";

export function WarehousesPage() {
  const [whId, setWhId] = React.useState<Warehouse["id"] | null>(null);
  const [skuId, setSkuId] = React.useState<string | null>(null);
  const totals = warehouseTotals();
  const wh = WAREHOUSES.find((w) => w.id === whId);
  const value = (id: Warehouse["id"]) => SKUS.reduce((a, s) => a + s.warehouses[id] * s.cost, 0);

  return (
    <>
      <PageHeader title="Warehouses" description="Capacity, utilisation and stock position at each fulfilment site." />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Total warehouse units" value={num(Object.values(totals).reduce((a, b) => a + b, 0))} context="Across 3 sites" />
        <KpiCard label="Warehouse value" value={inrCompact(WAREHOUSES.reduce((a, w) => a + value(w.id), 0))} context="At cost" />
        <KpiCard label="Total capacity" value={num(WAREHOUSES.reduce((a, w) => a + w.capacityUnits, 0))} context="Units" />
        <KpiCard label="Inbound POs" value={String(PURCHASE_ORDERS.filter((p) => ["Ordered", "In Transit", "Delayed"].includes(p.status)).length)} context="Open purchase orders" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {WAREHOUSES.map((w) => {
          const pct = Math.round((totals[w.id] / w.capacityUnits) * 100);
          return (
            <Card key={w.id} className="cursor-pointer gap-3 py-4 transition-shadow hover:shadow-md" onClick={() => setWhId(w.id)}>
              <CardContent className="space-y-3 px-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base font-semibold">{w.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" />{w.city}</p>
                  </div>
                  <Pill tone={w.status === "Active" ? "green" : "orange"}>{w.status}</Pill>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">Utilisation</span><span className="font-medium">{pct}%</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className={`h-2 rounded-full ${pct > 85 ? "bg-warning" : "bg-primary"}`} style={{ width: `${Math.min(100, pct)}%` }} /></div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div><p className="text-muted-foreground">Units</p><p className="font-semibold tabular-nums">{num(totals[w.id])}</p></div>
                  <div><p className="text-muted-foreground">Value</p><p className="font-semibold tabular-nums">{inrCompact(value(w.id))}</p></div>
                  <div><p className="text-muted-foreground">Capacity</p><p className="font-semibold tabular-nums">{num(w.capacityUnits)}</p></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!wh} onOpenChange={(o) => !o && setWhId(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {wh && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">{wh.name} <Pill tone={wh.status === "Active" ? "green" : "orange"}>{wh.status}</Pill></DialogTitle>
                <DialogDescription>{wh.city} · Manager {wh.manager}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="stock">
                <TabsList>
                  <TabsTrigger value="stock">Top SKUs</TabsTrigger>
                  <TabsTrigger value="zones">Zones</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                <TabsContent value="stock" className="mt-4">
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader><TableRow><TableHead>SKU</TableHead><TableHead>Bin</TableHead><TableHead className="text-right">Units</TableHead><TableHead className="text-right">Value</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {[...SKUS].sort((a, b) => b.warehouses[wh.id] - a.warehouses[wh.id]).slice(0, 15).map((s) => (
                          <TableRow key={s.id} className="cursor-pointer" onClick={() => setSkuId(s.id)}>
                            <TableCell><p className="text-sm font-medium">{s.name}</p><p className="text-[10px] text-muted-foreground">{s.sku}</p></TableCell>
                            <TableCell className="font-mono text-xs">{s.bins[wh.id]}</TableCell>
                            <TableCell className="text-right tabular-nums">{num(s.warehouses[wh.id])}</TableCell>
                            <TableCell className="text-right tabular-nums">{inrCompact(s.warehouses[wh.id] * s.cost)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                <TabsContent value="zones" className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <Field label="Capacity" value={`${num(wh.capacityUnits)} units`} />
                    <Field label="On hand" value={`${num(totals[wh.id])} units`} />
                    <Field label="Free space" value={`${num(Math.max(0, wh.capacityUnits - totals[wh.id]))} units`} />
                  </div>
                  <div className="space-y-1.5 rounded-lg border p-3">
                    {wh.zones.map((z, i) => <BarRow key={z} label={z} value={Math.round(totals[wh.id] / (i + 1.6))} max={totals[wh.id]} />)}
                  </div>
                </TabsContent>
                <TabsContent value="activity" className="mt-4 space-y-3">
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>SKU</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Qty</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {MOVEMENTS.filter((m) => m.from === wh.name || m.to === wh.name).slice(0, 10).map((m) => (
                          <TableRow key={m.id}><TableCell className="text-xs">{fmtDate(m.date)}</TableCell><TableCell className="text-xs">{SKU_BY_ID[m.skuId].sku}</TableCell><TableCell><Pill>{m.type}</Pill></TableCell><TableCell className="text-right tabular-nums">{m.qty}</TableCell></TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Inbound POs</p>
                  <div className="flex flex-wrap gap-2">
                    {PURCHASE_ORDERS.filter((p) => p.destination === wh.id && p.status !== "Received" && p.status !== "Cancelled").map((p) => (
                      <span key={p.id} className="flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs"><span className="font-mono">{p.id}</span><PoPill status={p.status} /></span>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
      <SkuDetailDialog skuId={skuId} onClose={() => setSkuId(null)} />
    </>
  );
}
