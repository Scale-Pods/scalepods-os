"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BillDetailDialog } from "./bill-detail-dialog";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { EmptyRow, TwoLine, fmtDate, inr } from "./shared";
import { cn } from "@/lib/utils";
import { MOCK_PARTY_LEDGER, type PartyLedgerRow } from "@/lib/mock-data/receivables";

export function PartyLedgerPage() {
  const [rows, setRows] = React.useState<PartyLedgerRow[]>(MOCK_PARTY_LEDGER);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [confirming, setConfirming] = React.useState<PartyLedgerRow | null>(null);
  const [pending, setPending] = React.useState(false);
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [viewing, setViewing] = React.useState<string | null>(null);

  const parties = Array.from(new Set(MOCK_PARTY_LEDGER.map((r) => r.party_name)));

  const filtered = rows.filter((r) => {
    if (filter === "open" && r.closed) return false;
    if (filter === "closed" && !r.closed) return false;
    const q = search.toLowerCase();
    return !q || r.party_name.toLowerCase().includes(q) || r.bill_no.toLowerCase().includes(q) || r.gstin.toLowerCase().includes(q);
  });

  async function confirmClose() {
    if (!confirming) return;
    setPending(true);
    // Stands in for the "mark closed" webhook call.
    await new Promise((res) => setTimeout(res, 900));
    const target = confirming;
    setRows((prev) =>
      prev.map((r) =>
        r.id === target.id
          ? { ...r, closed: true, credit: r.debit, Final_Amount: 0, Payment_Date: new Date().toISOString() }
          : r
      )
    );
    setPending(false);
    setConfirming(null);
    toast.success(`Bill ${target.bill_no} marked as closed`);
  }

  function reopen(row: PartyLedgerRow) {
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, closed: false, credit: 0, Final_Amount: r.debit, Payment_Date: null } : r))
    );
    toast(`Bill ${row.bill_no} reopened`);
  }

  return (
    <>
      <PageHeader
        title="Party Ledger"
        description="party_ledger table — every bill by party. Click a row for the invoice, customer and every message; use Yes/No to close out."
        actions={
          <Button size="sm" onClick={() => setUploadOpen(true)}>
            <Upload className="size-3.5" /> Upload invoice
          </Button>
        }
      />

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search party, bill or GSTIN...">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All bills</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </ListToolbar>

      <Card>
        <CardContent className="px-0 py-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {["Party", "Bill / Voucher", "Billed", "Outstanding", "Running balance", "Invoice date", "Closed"].map((h) => (
                    <TableHead key={h} className="text-[11px] uppercase text-muted-foreground">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <EmptyRow colSpan={7} message="No bills match your search." />
                ) : (
                  filtered.map((r) => (
                    <TableRow key={r.id} className="cursor-pointer" onClick={() => setViewing(r.bill_no)}>
                      <TableCell>
                        <TwoLine primary={r.party_name} secondary={r.gstin} />
                      </TableCell>
                      <TableCell>
                        <TwoLine primary={r.bill_no} secondary={r.voucher_no} />
                      </TableCell>
                      <TableCell className="tabular-nums">{inr(r.debit)}</TableCell>
                      <TableCell className={cn("tabular-nums", r.Final_Amount > 0 && "font-medium")}>{inr(r.Final_Amount)}</TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">{inr(r.running_balance)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{fmtDate(r.created_at)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Button
                            size="xs"
                            variant={r.closed ? "default" : "outline"}
                            className={cn(r.closed && "bg-success text-white hover:bg-success/90")}
                            disabled={r.closed}
                            onClick={() => setConfirming(r)}
                          >
                            Yes
                          </Button>
                          <Button
                            size="xs"
                            variant={r.closed ? "outline" : "secondary"}
                            disabled={!r.closed}
                            onClick={() => reopen(r)}
                          >
                            No
                          </Button>
                        </div>
                        {r.Payment_Date && <p className="mt-1 text-[10px] text-muted-foreground">Paid {fmtDate(r.Payment_Date)}</p>}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="border-t bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            Showing {filtered.length} of {rows.length} bills across {parties.length} parties
          </div>
        </CardContent>
      </Card>

      {/* Confirm-close dialog — the only confirmation modal in this module */}
      <Dialog open={!!confirming} onOpenChange={(o) => !o && !pending && setConfirming(null)}>
        <DialogContent className="max-w-sm">
          {confirming && (
            <>
              <DialogHeader>
                <DialogTitle>Mark bill as closed?</DialogTitle>
                <DialogDescription>
                  This tells the recovery workflow that {confirming.party_name} has paid bill {confirming.bill_no}. Reminders will stop.
                </DialogDescription>
              </DialogHeader>
              <dl className="grid grid-cols-2 gap-y-1.5 rounded-lg border bg-muted/40 p-3 text-sm">
                <dt className="text-muted-foreground">Party</dt>
                <dd className="text-right font-medium">{confirming.party_name}</dd>
                <dt className="text-muted-foreground">Bill</dt>
                <dd className="text-right font-medium">{confirming.bill_no}</dd>
                <dt className="text-muted-foreground">Amount</dt>
                <dd className="text-right font-medium tabular-nums">{inr(confirming.Final_Amount)}</dd>
              </dl>
              <DialogFooter>
                <Button variant="outline" disabled={pending} onClick={() => setConfirming(null)}>
                  Cancel
                </Button>
                <Button className="bg-success text-white hover:bg-success/90" disabled={pending} onClick={confirmClose}>
                  {pending && <Loader2 className="size-3.5 animate-spin" />}
                  {pending ? "Closing…" : "Yes, mark closed"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BillDetailDialog billNo={viewing} tab="invoice" onClose={() => setViewing(null)} />
      <UploadInvoiceDialog open={uploadOpen} onOpenChange={setUploadOpen} parties={parties} />
    </>
  );
}

function UploadInvoiceDialog({
  open,
  onOpenChange,
  parties,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  parties: string[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DETAIL_DIALOG_CLASS}>
        <DialogHeader>
          <DialogTitle>Upload invoice</DialogTitle>
          <DialogDescription>Adds a new bill to the party ledger and queues it for the recovery cadence.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            onOpenChange(false);
            toast.success("Invoice uploaded (demo — not persisted)");
          }}
        >
          <div className="space-y-1.5">
            <Label>Party</Label>
            <Select defaultValue={parties[0]}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {parties.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bill_no">Bill no</Label>
              <Input id="bill_no" required placeholder="SH/25-26/0150" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="voucher_no">Voucher no</Label>
              <Input id="voucher_no" placeholder="VCH-2640" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input id="amount" type="number" min={1} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv_date">Invoice date</Label>
              <Input id="inv_date" type="date" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="narration">Narration</Label>
            <Input id="narration" placeholder="Goods supplied against PO…" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="file">Invoice PDF</Label>
            <Input id="file" type="file" accept="application/pdf" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Upload</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
