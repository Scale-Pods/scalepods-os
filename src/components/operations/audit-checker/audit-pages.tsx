"use client";

import { FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PURCHASE_AUDITS, SALES_AUDITS, QUICK_AUDITS, auditStats, type AuditRecord } from "@/lib/mock-data/audit-checker";
import { AuditTable } from "./audit-table";
import { ACCENT, inrCompact } from "./shared";

function Kpis({ list }: { list: AuditRecord[] }) {
  const s = auditStats(list);
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard label="Audits Run" value={String(s.total)} context={`${inrCompact(s.value)} audited`} />
      <KpiCard label="Fully Matched" value={`${s.passRate}%`} iconClassName={ACCENT.green} context={`${s.matched} of ${s.total}`} />
      <KpiCard label="Discrepancies" value={String(s.mismatched + s.critical)} context={`${s.partial} partial matches`} />
      <KpiCard label="Pending Decision" value={String(s.pending)} context={`avg score ${s.avgScore}%`} />
    </div>
  );
}

function UploadCard({ docs, button }: { docs: { name: string; hint: string }[]; button: string }) {
  return (
    <Card className="mb-6 gap-3 py-4">
      <CardContent className="px-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold">Run a new audit</h3>
            <p className="text-xs text-muted-foreground">Upload the documents below; every field is lined up and compared automatically.</p>
          </div>
          <Button size="sm" onClick={() => toast.info("Upload is simulated in the demo. Sample audits are listed below.")}>
            <Upload className="size-3.5" />{button}
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {docs.map((d) => (
            <div key={d.name} className="flex items-start gap-2 rounded-lg border border-dashed p-3">
              <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div><p className="text-sm font-medium">{d.name}</p><p className="text-xs text-muted-foreground">{d.hint}</p></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PurchaseAuditPage() {
  return (
    <>
      <PageHeader title="Purchase Audit" description="Invoice, E-Way Bill, LR copy and GRN reconciled across 14 fields when goods reach the warehouse." />
      <UploadCard
        button="Upload documents"
        docs={[
          { name: "Invoice", hint: "Supplier bill with GSTIN, HSN, amount" },
          { name: "E-Way Bill", hint: "Transport permit, vehicle, weight" },
          { name: "LR Copy", hint: "Lorry receipt from the transporter" },
          { name: "GRN", hint: "Warehouse receipt with batch / coil numbers" },
        ]}
      />
      <Kpis list={PURCHASE_AUDITS} />
      <AuditTable audits={PURCHASE_AUDITS} partyLabel="Supplier" />
    </>
  );
}

export function SalesLedgerPage() {
  return (
    <>
      <PageHeader title="Sales Audit: Invoice vs Sheet" description="Sales invoice compared with the internal sheet on order, party, broker, rate, quantity, terms and dimensions." />
      <UploadCard
        button="Upload invoice and sheet"
        docs={[
          { name: "Sales Invoice", hint: "Invoice raised for the customer" },
          { name: "Sheet", hint: "Internal record for the same sale" },
        ]}
      />
      <Kpis list={SALES_AUDITS} />
      <AuditTable audits={SALES_AUDITS} partyLabel="Customer" />
    </>
  );
}

export function QuickCheckPage() {
  return (
    <>
      <PageHeader title="Sales Audit: Quick Check" description="Fast sales order vs purchase order verification, held in its own ledger (Audit Checker Sales_QC)." />
      <UploadCard
        button="Start quick check"
        docs={[
          { name: "Sales Order", hint: "Order confirmation sent to the customer" },
          { name: "Purchase Order", hint: "Customer's own purchase order" },
        ]}
      />
      <Kpis list={QUICK_AUDITS} />
      <AuditTable audits={QUICK_AUDITS} partyLabel="Customer" />
    </>
  );
}
