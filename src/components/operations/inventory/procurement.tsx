"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, Truck } from "lucide-react";
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
import { PURCHASE_ORDERS, SUPPLIERS, SUPPLIER_BY_ID, WAREHOUSES, type PoStatus } from "@/lib/mock-data/inventory";
import { Pill, PoPill, fmtDate, inrCompact, num } from "./shared";
import { PoDetailDialog, SupplierFields } from "./po-detail-dialog";

export function PurchaseOrdersPage() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [supplier, setSupplier] = React.useState("all");
  const [poId, setPoId] = React.useState<string | null>(null);
  const q = search.toLowerCase();
  const rows = PURCHASE_ORDERS.filter(
    (p) => (status === "all" || p.status === status) && (supplier === "all" || p.supplierId === supplier) && (!q || p.id.toLowerCase().includes(q) || SUPPLIER_BY_ID[p.supplierId].name.toLowerCase().includes(q)),
  );
  const open = PURCHASE_ORDERS.filter((p) => ["Ordered", "In Transit", "Delayed"].includes(p.status));
  const statuses: PoStatus[] = ["Draft", "Ordered", "In Transit", "Delayed", "Received", "Cancelled"];

  return (
    <>
      <PageHeader
        title="Purchase Orders"
        description="Replenishment orders to suppliers in India, China and Korea."
        actions={<Button size="sm" onClick={() => toast.success("New draft PO created")}><Plus className="size-3.5" /> New PO</Button>}
      />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Open POs" value={String(open.length)} context="Ordered, in transit, delayed" icon={<Truck className="size-4" />} />
        <KpiCard label="On order value" value={inrCompact(open.reduce((a, p) => a + p.totalValue, 0))} context={`${num(open.reduce((a, p) => a + p.totalQty, 0))} units inbound`} />
        <KpiCard label="Delayed" value={String(PURCHASE_ORDERS.filter((p) => p.status === "Delayed").length)} context="Past supplier promise" trend="up" trendValue="escalate" trendGood={false} />
        <KpiCard label="Drafts to approve" value={String(PURCHASE_ORDERS.filter((p) => p.status === "Draft").length)} context="Awaiting founder approval" />
      </div>
      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search PO or supplier...">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger size="sm" className="h-8 w-36 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All statuses</SelectItem>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={supplier} onValueChange={setSupplier}>
          <SelectTrigger size="sm" className="h-8 w-52 text-xs"><SelectValue placeholder="Supplier" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All suppliers</SelectItem>{SUPPLIERS.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">{rows.length} orders</span>
      </ListToolbar>
      {rows.length === 0 ? (
        <EmptyState icon={Truck} title="No purchase orders" description="Try a different filter." />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow><TableHead>PO</TableHead><TableHead>Supplier</TableHead><TableHead>Status</TableHead><TableHead>Ordered</TableHead><TableHead>ETA</TableHead><TableHead>Deliver to</TableHead><TableHead className="text-right">Units</TableHead><TableHead className="text-right">Value</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => setPoId(p.id)}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="text-sm">{SUPPLIER_BY_ID[p.supplierId].name}</TableCell>
                  <TableCell><PoPill status={p.status} /></TableCell>
                  <TableCell className="text-xs">{fmtDate(p.orderDate)}</TableCell>
                  <TableCell className="text-xs">{fmtDate(p.receivedDate ?? p.eta)}</TableCell>
                  <TableCell className="text-xs">{WAREHOUSES.find((w) => w.id === p.destination)?.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{num(p.totalQty)}</TableCell>
                  <TableCell className="text-right tabular-nums">{inrCompact(p.totalValue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <PoDetailDialog poId={poId} onClose={() => setPoId(null)} />
    </>
  );
}

export function SuppliersPage() {
  const [id, setId] = React.useState<string | null>(null);
  const sup = SUPPLIERS.find((s) => s.id === id);
  return (
    <>
      <PageHeader title="Suppliers" description="Vendor performance, lead times and terms." />
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Supplier</TableHead><TableHead>Country</TableHead><TableHead className="text-right">Lead time</TableHead><TableHead className="text-right">On-time</TableHead><TableHead className="text-right">Quality</TableHead><TableHead className="text-right">Open POs</TableHead><TableHead>Terms</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {SUPPLIERS.map((s) => (
              <TableRow key={s.id} className="cursor-pointer" onClick={() => setId(s.id)}>
                <TableCell><p className="text-sm font-medium">{s.name}</p><p className="text-[10px] text-muted-foreground">{s.contact}</p></TableCell>
                <TableCell>{s.country}</TableCell>
                <TableCell className="text-right tabular-nums">{s.leadTimeDays}d</TableCell>
                <TableCell className="text-right"><Pill tone={s.onTimePct >= 90 ? "green" : s.onTimePct >= 85 ? "orange" : "red"}>{s.onTimePct}%</Pill></TableCell>
                <TableCell className="text-right tabular-nums">{s.qualityPct}%</TableCell>
                <TableCell className="text-right tabular-nums">{s.openPos}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{s.paymentTerms}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={!!sup} onOpenChange={(o) => !o && setId(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {sup && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">{sup.name}</DialogTitle>
                <DialogDescription>{sup.country} · {sup.openPos} open purchase orders</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="profile">
                <TabsList><TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="orders">Orders</TabsTrigger></TabsList>
                <TabsContent value="profile" className="mt-4"><SupplierFields s={sup} /></TabsContent>
                <TabsContent value="orders" className="mt-4">
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader><TableRow><TableHead>PO</TableHead><TableHead>Status</TableHead><TableHead>ETA</TableHead><TableHead className="text-right">Value</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {PURCHASE_ORDERS.filter((p) => p.supplierId === sup.id).map((p) => (
                          <TableRow key={p.id}><TableCell className="font-mono text-xs">{p.id}</TableCell><TableCell><PoPill status={p.status} /></TableCell><TableCell className="text-xs">{fmtDate(p.receivedDate ?? p.eta)}</TableCell><TableCell className="text-right tabular-nums">{inrCompact(p.totalValue)}</TableCell></TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
