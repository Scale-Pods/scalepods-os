"use client";

import * as React from "react";
import { ArrowLeftRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { MOVEMENTS, SKU_BY_ID, type MovementType } from "@/lib/mock-data/inventory";
import { Field, Pill, fmtDate, num, type Tone } from "./shared";
import { SkuDetailDialog } from "./sku-detail-dialog";

const TYPE_TONE: Record<MovementType, Tone> = { Receipt: "green", Sale: "blue", Transfer: "purple", Adjustment: "orange", Return: "neutral", Damage: "red" };
const TYPES: MovementType[] = ["Receipt", "Sale", "Transfer", "Adjustment", "Return", "Damage"];

export function MovementsPage() {
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("all");
  const [mvId, setMvId] = React.useState<string | null>(null);
  const [skuId, setSkuId] = React.useState<string | null>(null);
  const q = search.toLowerCase();
  const rows = MOVEMENTS.filter((m) => (type === "all" || m.type === type) && (!q || m.reference.toLowerCase().includes(q) || SKU_BY_ID[m.skuId].name.toLowerCase().includes(q) || SKU_BY_ID[m.skuId].sku.toLowerCase().includes(q)));
  const mv = MOVEMENTS.find((m) => m.id === mvId);
  const sum = (t: MovementType) => MOVEMENTS.filter((m) => m.type === t).reduce((a, m) => a + Math.abs(m.qty), 0);

  return (
    <>
      <PageHeader title="Stock Movements" description="Ledger of receipts, sales, transfers, returns and adjustments over the last 30 days." />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Movements" value={String(MOVEMENTS.length)} context="Last 30 days" icon={<ArrowLeftRight className="size-4" />} />
        <KpiCard label="Units received" value={num(sum("Receipt"))} context="Against POs" />
        <KpiCard label="Units sold" value={num(sum("Sale"))} context="Across channels" />
        <KpiCard label="Damage and adjustments" value={num(sum("Damage") + sum("Adjustment"))} context="Shrinkage units" trendGood={false} />
      </div>
      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search reference or SKU...">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger size="sm" className="h-8 w-40 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All types</SelectItem>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">{rows.length} movements</span>
      </ListToolbar>
      {rows.length === 0 ? (
        <EmptyState icon={ArrowLeftRight} title="No movements" description="Try a different filter." />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Date</TableHead><TableHead>SKU</TableHead><TableHead>Type</TableHead><TableHead>From to</TableHead><TableHead>Reference</TableHead><TableHead className="text-right">Qty</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((m) => (
                <TableRow key={m.id} className="cursor-pointer" onClick={() => setMvId(m.id)}>
                  <TableCell className="text-xs">{fmtDate(m.date)} <span className="text-muted-foreground">{m.time}</span></TableCell>
                  <TableCell><p className="text-sm font-medium">{SKU_BY_ID[m.skuId].name}</p><p className="text-[10px] text-muted-foreground">{SKU_BY_ID[m.skuId].sku}</p></TableCell>
                  <TableCell><Pill tone={TYPE_TONE[m.type]}>{m.type}</Pill></TableCell>
                  <TableCell className="text-xs">{m.from} → {m.to}</TableCell>
                  <TableCell className="font-mono text-xs">{m.reference}</TableCell>
                  <TableCell className={`text-right tabular-nums ${m.qty < 0 ? "text-destructive" : m.qty > 0 ? "text-success" : ""}`}>{m.qty > 0 ? `+${m.qty}` : m.qty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Dialog open={!!mv} onOpenChange={(o) => !o && setMvId(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {mv && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">{mv.id} <Pill tone={TYPE_TONE[mv.type]}>{mv.type}</Pill></DialogTitle>
                <DialogDescription>{mv.reference} · {fmtDate(mv.date)} {mv.time}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="details">
                <TabsList><TabsTrigger value="details">Details</TabsTrigger><TabsTrigger value="sku">SKU</TabsTrigger></TabsList>
                <TabsContent value="details" className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <Field label="Quantity effect" value={mv.qty > 0 ? `+${mv.qty}` : String(mv.qty)} />
                  <Field label="From" value={mv.from} />
                  <Field label="To" value={mv.to} />
                  <Field label="Recorded by" value={mv.user} />
                  <Field label="Reference" value={mv.reference} />
                  <Field label="Note" value={mv.note} />
                </TabsContent>
                <TabsContent value="sku" className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <Field label="Product" value={SKU_BY_ID[mv.skuId].name} />
                    <Field label="SKU" value={SKU_BY_ID[mv.skuId].sku} />
                    <Field label="Category" value={SKU_BY_ID[mv.skuId].category} />
                  </div>
                  <button type="button" className="text-sm text-primary underline" onClick={() => { setSkuId(mv.skuId); setMvId(null); }}>Open full SKU detail</button>
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
