"use client";

import * as React from "react";
import { toast } from "sonner";
import { BellRing } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { ALERTS, PURCHASE_ORDERS, SKU_BY_ID, type AlertKind } from "@/lib/mock-data/inventory";
import { Field, Pill, SeverityPill, StockPill, fmtDate, num } from "./shared";
import { stockStatus, totalStock, daysCover } from "@/lib/mock-data/inventory";
import { PoDetailDialog } from "./po-detail-dialog";

const KINDS: AlertKind[] = ["Out of Stock", "Low Stock", "Reorder Now", "Dead Stock", "Overstock", "Fast Mover", "PO Delayed"];

export function AlertsPage() {
  const [search, setSearch] = React.useState("");
  const [kind, setKind] = React.useState("all");
  const [state, setState] = React.useState("all");
  const [id, setId] = React.useState<string | null>(null);
  const [poId, setPoId] = React.useState<string | null>(null);
  const q = search.toLowerCase();
  const rows = ALERTS.filter((a) => (kind === "all" || a.kind === kind) && (state === "all" || a.status === state) && (!q || a.title.toLowerCase().includes(q)));
  const alert = ALERTS.find((a) => a.id === id);
  const sku = alert?.skuId ? SKU_BY_ID[alert.skuId] : undefined;
  const po = alert?.poId ? PURCHASE_ORDERS.find((p) => p.id === alert.poId) : undefined;

  return (
    <>
      <PageHeader
        title="Alerts"
        description="Stock, demand and supplier alerts routed to the founder on WhatsApp and to Ops by email."
        actions={<Button size="sm" variant="outline" onClick={() => toast.success("Test alert sent to founder on WhatsApp")}><BellRing className="size-3.5" /> Send test alert</Button>}
      />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Open alerts" value={String(ALERTS.filter((a) => a.status === "Open").length)} context="Awaiting action" />
        <KpiCard label="Critical" value={String(ALERTS.filter((a) => a.severity === "critical" && a.status !== "Resolved").length)} context="Stockout risk" trendGood={false} />
        <KpiCard label="Acknowledged" value={String(ALERTS.filter((a) => a.status === "Acknowledged").length)} context="In progress" />
        <KpiCard label="Resolved" value={String(ALERTS.filter((a) => a.status === "Resolved").length)} context="Closed this month" />
      </div>
      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search alerts...">
        <Select value={kind} onValueChange={setKind}>
          <SelectTrigger size="sm" className="h-8 w-40 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All types</SelectItem>{KINDS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger size="sm" className="h-8 w-36 text-xs"><SelectValue placeholder="State" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All states</SelectItem><SelectItem value="Open">Open</SelectItem><SelectItem value="Acknowledged">Acknowledged</SelectItem><SelectItem value="Resolved">Resolved</SelectItem></SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">{rows.length} alerts</span>
      </ListToolbar>
      {rows.length === 0 ? (
        <EmptyState icon={BellRing} title="No alerts" description="Nothing matches these filters." />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader><TableRow><TableHead>Severity</TableHead><TableHead>Alert</TableHead><TableHead>Type</TableHead><TableHead>Date</TableHead><TableHead>State</TableHead><TableHead>Notified</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((a) => (
                <TableRow key={a.id} className="cursor-pointer" onClick={() => setId(a.id)}>
                  <TableCell><SeverityPill severity={a.severity} /></TableCell>
                  <TableCell><p className="text-sm font-medium">{a.title}</p><p className="max-w-md truncate text-xs text-muted-foreground">{a.detail}</p></TableCell>
                  <TableCell className="text-xs">{a.kind}</TableCell>
                  <TableCell className="text-xs">{fmtDate(a.date)}</TableCell>
                  <TableCell><Pill tone={a.status === "Open" ? "orange" : a.status === "Resolved" ? "green" : "blue"}>{a.status}</Pill></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.notified}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Dialog open={!!alert} onOpenChange={(o) => !o && setId(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {alert && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2 text-base">{alert.title} <SeverityPill severity={alert.severity} /></DialogTitle>
                <DialogDescription>{alert.id} · {alert.kind} · {fmtDate(alert.date)}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="details">
                <TabsList><TabsTrigger value="details">Details</TabsTrigger><TabsTrigger value="context">{po ? "Purchase order" : "SKU context"}</TabsTrigger></TabsList>
                <TabsContent value="details" className="mt-4 space-y-3">
                  <p className="rounded-lg border p-3 text-sm">{alert.detail}</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <Field label="State" value={alert.status} />
                    <Field label="Notified via" value={alert.notified} />
                    <Field label="Recommended action" value={alert.action} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { toast.success("Alert acknowledged"); setId(null); }}>Acknowledge</Button>
                    <Button size="sm" variant="outline" onClick={() => { toast.success("Alert resolved"); setId(null); }}>Mark resolved</Button>
                  </div>
                </TabsContent>
                <TabsContent value="context" className="mt-4 space-y-3">
                  {sku && (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      <Field label="SKU" value={`${sku.name} (${sku.sku})`} />
                      <Field label="Status" value={<StockPill status={stockStatus(sku)} />} />
                      <Field label="Total stock" value={`${num(totalStock(sku))} units`} />
                      <Field label="Days of cover" value={daysCover(sku) >= 999 ? "No sales" : `${daysCover(sku)} days`} />
                      <Field label="Lead time" value={`${sku.leadTime} days`} />
                      <Field label="Avg monthly sales" value={`${num(sku.avgMonthlySales)}`} />
                    </div>
                  )}
                  {po && (
                    <>
                      <p className="text-sm">{po.id} for {num(po.totalQty)} units, ETA {fmtDate(po.eta)}.</p>
                      <button type="button" className="text-sm text-primary underline" onClick={() => { setPoId(po.id); setId(null); }}>Open purchase order</button>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
      <PoDetailDialog poId={poId} onClose={() => setPoId(null)} />
    </>
  );
}
