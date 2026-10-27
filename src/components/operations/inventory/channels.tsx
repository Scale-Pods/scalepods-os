"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CHANNEL_KEYS, CHANNEL_LABELS, SKUS, channelTotals, totalStock, type ChannelKey } from "@/lib/mock-data/inventory";
import { ChartCard, BarRow, num } from "./shared";
import { SkuDetailDialog } from "./sku-detail-dialog";

export function ChannelsPage() {
  const [search, setSearch] = React.useState("");
  const [focus, setFocus] = React.useState<ChannelKey | null>(null);
  const [skuId, setSkuId] = React.useState<string | null>(null);
  const totals = channelTotals();
  const all = CHANNEL_KEYS.reduce((a, k) => a + totals[k], 0);
  const q = search.toLowerCase();
  const rows = SKUS.filter((s) => !q || s.name.toLowerCase().includes(q) || s.sku.toLowerCase().includes(q)).filter((s) => !focus || s.channels[focus] > 0);
  const skusZero = (k: ChannelKey) => SKUS.filter((s) => s.channels[k] === 0 && s.avgMonthlySales > 0).length;
  const top = focus ? [...SKUS].sort((a, b) => b.channels[focus] - a.channels[focus]).slice(0, 6) : [];

  return (
    <>
      <PageHeader title="Channel View" description="Stock distribution across the warehouse network and 7 sales channels. Click a channel to focus." />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {CHANNEL_KEYS.map((k) => (
          <Card key={k} className={`cursor-pointer gap-2 py-4 transition-shadow hover:shadow-md ${focus === k ? "ring-2 ring-primary" : ""}`} onClick={() => setFocus(focus === k ? null : k)}>
            <CardContent className="px-4">
              <p className="text-[11px] font-semibold uppercase text-muted-foreground">{CHANNEL_LABELS[k]}</p>
              <p className="text-2xl font-semibold tabular-nums">{num(totals[k])}</p>
              <p className="text-xs text-muted-foreground">{all ? ((totals[k] / all) * 100).toFixed(1) : 0}% of total · {skusZero(k)} SKUs at zero</p>
              <div className="mt-2 h-1 rounded bg-muted"><div className="h-1 rounded bg-primary" style={{ width: `${all ? (totals[k] / all) * 100 : 0}%` }} /></div>
            </CardContent>
          </Card>
        ))}
      </div>
      {focus && (
        <ChartCard title={`Top SKUs on ${CHANNEL_LABELS[focus]}`} className="mb-4">
          <div className="space-y-1.5">
            {top.map((s) => <BarRow key={s.id} label={s.name} value={s.channels[focus]} max={top[0].channels[focus]} onClick={() => setSkuId(s.id)} />)}
          </div>
        </ChartCard>
      )}
      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search SKU or product...">
        <span className="text-xs text-muted-foreground">{rows.length} SKUs{focus ? ` stocked on ${CHANNEL_LABELS[focus]}` : ""}</span>
      </ListToolbar>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              {CHANNEL_KEYS.map((k) => <TableHead key={k} className="text-right">{CHANNEL_LABELS[k]}</TableHead>)}
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((s) => (
              <TableRow key={s.id} className="cursor-pointer" onClick={() => setSkuId(s.id)}>
                <TableCell className="min-w-48"><p className="text-sm font-medium">{s.name}</p><p className="text-[10px] text-muted-foreground">{s.sku}</p></TableCell>
                {CHANNEL_KEYS.map((k) => <TableCell key={k} className={`text-right tabular-nums ${s.channels[k] === 0 ? "text-destructive" : ""}`}>{s.channels[k]}</TableCell>)}
                <TableCell className="text-right font-semibold tabular-nums">{num(totalStock(s))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <SkuDetailDialog skuId={skuId} onClose={() => setSkuId(null)} />
    </>
  );
}
