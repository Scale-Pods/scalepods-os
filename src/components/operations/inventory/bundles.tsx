"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, Tag } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { BUNDLES, SKU_BY_ID, daysCover, stockStatus, totalStock } from "@/lib/mock-data/inventory";
import { Field, Pill, StockPill, inr, num } from "./shared";

export function BundlesPage() {
  const [id, setId] = React.useState<string | null>(null);
  const b = BUNDLES.find((x) => x.id === id);
  const disc = (m: number, p: number) => Math.round((1 - p / m) * 100);

  return (
    <>
      <PageHeader
        title="Bundle Kits"
        description="Pair dead or slow stock with fast movers to clear inventory and lift order value."
        actions={<Button size="sm" onClick={() => toast.success("Bundle kit draft created")}><Plus className="size-3.5" /> Create bundle</Button>}
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {BUNDLES.map((k) => (
          <Card key={k.id} className="cursor-pointer gap-3 py-4 transition-shadow hover:shadow-md" onClick={() => setId(k.id)}>
            <CardContent className="space-y-3 px-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold">{k.name}</p>
                <Pill tone={k.status === "Active" ? "green" : "neutral"}>{k.status}</Pill>
              </div>
              <ul className="space-y-0.5 text-xs text-muted-foreground">
                {k.skuIds.map((sid) => <li key={sid} className="flex items-center gap-1"><Tag className="size-3" />{SKU_BY_ID[sid].name}</li>)}
              </ul>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div><p className="text-muted-foreground">MRP sum</p><p className="font-semibold">{inr(k.mrp)}</p></div>
                <div><p className="text-muted-foreground">Bundle</p><p className="font-semibold text-success">{inr(k.bundlePrice)}</p></div>
                <div><p className="text-muted-foreground">Discount</p><p className="font-semibold text-warning">{disc(k.mrp, k.bundlePrice)}%</p></div>
                <div><p className="text-muted-foreground">Kits</p><p className="font-semibold">{k.kitsAvailable}</p></div>
              </div>
              <p className="text-xs text-muted-foreground">{k.reason}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={!!b} onOpenChange={(o) => !o && setId(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {b && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">{b.name} <Pill tone={b.status === "Active" ? "green" : "neutral"}>{b.status}</Pill></DialogTitle>
                <DialogDescription>{b.reason}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="pricing">
                <TabsList><TabsTrigger value="pricing">Pricing</TabsTrigger><TabsTrigger value="components">Components</TabsTrigger><TabsTrigger value="distribution">Distribution</TabsTrigger></TabsList>
                <TabsContent value="pricing" className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <Field label="MRP sum" value={inr(b.mrp)} />
                  <Field label="Bundle price" value={inr(b.bundlePrice)} />
                  <Field label="Discount" value={`${disc(b.mrp, b.bundlePrice)}%`} />
                  <Field label="Kits available" value={num(b.kitsAvailable)} />
                  <Field label="Sold last 30 days" value={num(b.soldLast30)} />
                  <Field label="Revenue last 30 days" value={inr(b.soldLast30 * b.bundlePrice)} />
                </TabsContent>
                <TabsContent value="components" className="mt-4">
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader><TableRow><TableHead>SKU</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Stock</TableHead><TableHead className="text-right">Cover</TableHead><TableHead className="text-right">MRP</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {b.skuIds.map((sid) => {
                          const s = SKU_BY_ID[sid];
                          return (
                            <TableRow key={sid}>
                              <TableCell><p className="text-sm font-medium">{s.name}</p><p className="text-[10px] text-muted-foreground">{s.sku}</p></TableCell>
                              <TableCell><StockPill status={stockStatus(s)} /></TableCell>
                              <TableCell className="text-right tabular-nums">{num(totalStock(s))}</TableCell>
                              <TableCell className="text-right tabular-nums">{daysCover(s) >= 999 ? "∞" : `${daysCover(s)}d`}</TableCell>
                              <TableCell className="text-right tabular-nums">{inr(s.price)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                <TabsContent value="distribution" className="mt-4 space-y-3">
                  <div className="flex flex-wrap gap-1.5">{b.channels.map((c) => <Pill key={c} tone="blue">{c}</Pill>)}</div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => toast.success(`${b.name} pushed live to Shopify`)}>Push live</Button>
                    <Button size="sm" variant="outline" onClick={() => toast.success(`WhatsApp promo sent for ${b.name}`)}>Send WhatsApp promo</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
