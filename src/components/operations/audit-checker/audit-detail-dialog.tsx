"use client";

import * as React from "react";
import { toast } from "sonner";
import { AlertTriangle, Check, FileText, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { cn } from "@/lib/utils";
import { KIND_LABEL, userName, type AuditRecord } from "@/lib/mock-data/audit-checker";
import {
  DecisionPill, Field, Pill, STATUS_BAR, ScoreBadge, Section, SegmentedBar, StatusPill, KIND_ACCENT, fmtDate, fmtDateTime, inr,
} from "./shared";

export type AuditTab = "intelligence" | "reconciliation" | "documents" | "decision";

const CELL_TONE = {
  Match: "",
  "Partial Match": "bg-warning/10",
  Mismatch: "bg-destructive/10",
  Critical: "bg-destructive/20 font-semibold",
} as const;

export function AuditDetailDialog({ audit, tab = "intelligence", onClose }: { audit: AuditRecord | null; tab?: AuditTab; onClose: () => void }) {
  return (
    <Dialog open={!!audit} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={DETAIL_DIALOG_CLASS}>
        {audit && <AuditDetailBody key={audit.id} audit={audit} tab={tab} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function AuditDetailBody({ audit, tab, onClose }: { audit: AuditRecord; tab: AuditTab; onClose: () => void }) {
  const [active, setActive] = React.useState<string>(tab);
  const [note, setNote] = React.useState("");
  const counts = audit
    ? {
        m: audit.fields.filter((f) => f.status === "Match").length,
        p: audit.fields.filter((f) => f.status === "Partial Match").length,
        x: audit.fields.filter((f) => f.status === "Mismatch").length,
        c: audit.fields.filter((f) => f.status === "Critical").length,
      }
    : { m: 0, p: 0, x: 0, c: 0 };
  const issues = audit ? audit.fields.filter((f) => f.status !== "Match") : [];

  return (
          <>
            <DialogHeader>
              <DialogTitle className="flex flex-wrap items-center gap-2 text-base">
                {audit.ref}
                <StatusPill status={audit.status} />
                <DecisionPill decision={audit.decision} />
                {audit.flagged && <Pill label="Flagged" accent="red" />}
              </DialogTitle>
              <DialogDescription>
                {KIND_LABEL[audit.kind]} audit · {audit.party} · {fmtDate(audit.createdAt)}
              </DialogDescription>
            </DialogHeader>

            <Tabs value={active} onValueChange={setActive}>
              <TabsList>
                <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
                <TabsTrigger value="reconciliation">Raw Data ({audit.fields.length})</TabsTrigger>
                <TabsTrigger value="documents">Documents ({audit.documents.length})</TabsTrigger>
                <TabsTrigger value="decision">Decision &amp; Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="intelligence" className="mt-3 space-y-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Field label="Audit score" value={<ScoreBadge score={audit.score} />} />
                  <Field label="Type" value={<Pill label={KIND_LABEL[audit.kind]} accent={KIND_ACCENT[audit.kind]} />} />
                  <Field label="Value" value={inr(audit.amount)} />
                  <Field label="Quantity" value={`${audit.qty.toFixed(3)} ${audit.qtyUnit}`} />
                  <Field label={audit.kind === "purchase" ? "Supplier" : "Customer"} value={audit.party} />
                  <Field label="Product" value={audit.product} />
                  <Field label="GSTIN" value={<span className="font-mono text-xs">{audit.gstin}</span>} />
                  <Field label="Run by" value={userName(audit.reviewerId)} />
                </div>
                <Section title="Field verification">
                  <SegmentedBar
                    segments={[
                      { label: "Match", value: counts.m, className: STATUS_BAR.Match },
                      { label: "Partial", value: counts.p, className: STATUS_BAR["Partial Match"] },
                      { label: "Mismatch", value: counts.x, className: STATUS_BAR.Mismatch },
                      { label: "Critical", value: counts.c, className: STATUS_BAR.Critical },
                    ]}
                  />
                </Section>
                <Section title={`Issues found (${issues.length})`}>
                  {issues.length === 0 ? (
                    <p className="rounded-lg border bg-success/5 p-3 text-sm text-success">Every field agrees across all documents.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {issues.map((f) => (
                        <li key={f.key} className="flex items-start gap-2 rounded-lg border p-2.5 text-sm">
                          <AlertTriangle className={cn("mt-0.5 size-4 shrink-0", f.status === "Partial Match" ? "text-warning" : "text-destructive")} />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium">{f.label}</span>
                              <StatusPill status={f.status} />
                            </div>
                            <p className="text-xs text-muted-foreground">{f.note}</p>
                            <p className="mt-1 text-xs">
                              {Object.entries(f.values).map(([d, v]) => (
                                <span key={d} className="mr-3 inline-block">
                                  <span className="text-muted-foreground">{d}:</span> {v ?? "—"}
                                </span>
                              ))}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </Section>
              </TabsContent>

              <TabsContent value="reconciliation" className="mt-3">
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        {audit.documents.map((d) => (
                          <TableHead key={d.name}>{d.name}</TableHead>
                        ))}
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {audit.fields.map((f) => (
                        <TableRow key={f.key} title={f.note}>
                          <TableCell className="font-medium">{f.label}</TableCell>
                          {audit.documents.map((d) => {
                            const has = d.name in f.values;
                            return (
                              <TableCell key={d.name} className={cn("text-xs", has && CELL_TONE[f.status])}>
                                {has ? (f.values[d.name] ?? <span className="text-muted-foreground">unreadable</span>) : <span className="text-muted-foreground">n/a</span>}
                              </TableCell>
                            );
                          })}
                          <TableCell><StatusPill status={f.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Shading marks the row that differs. Hover a row for the reason it was flagged.</p>
              </TabsContent>

              <TabsContent value="documents" className="mt-3 space-y-2">
                {audit.documents.map((d) => (
                  <div key={d.name} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-muted"><FileText className="size-4 text-muted-foreground" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{d.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{d.file} · {d.pages} page{d.pages > 1 ? "s" : ""} · {d.sizeKb} KB · uploaded {fmtDateTime(d.uploadedAt)}</p>
                    </div>
                    <Pill label={`OCR ${d.ocrConfidence}%`} accent={d.ocrConfidence >= 95 ? "green" : "orange"} />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="decision" className="mt-3 space-y-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Field label="Decision" value={<DecisionPill decision={audit.decision} />} />
                  <Field label="Decided by" value={userName(audit.decidedById)} />
                  <Field label="Decided at" value={fmtDateTime(audit.decidedAt)} />
                  <Field label="Flagged" value={audit.flagged ? "Yes" : "No"} />
                </div>
                {audit.comment && (
                  <Section title="Reviewer comment">
                    <p className="rounded-lg border bg-muted/30 p-3 text-sm">{audit.comment}</p>
                  </Section>
                )}
                {audit.decision === "Pending" && (
                  <Section title="Record a decision">
                    <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note for the audit trail" rows={2} />
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" onClick={() => { toast.success(`${audit.ref} approved (demo)`); onClose(); }}><Check className="size-3.5" />Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => { toast.error(`${audit.ref} rejected (demo)`); onClose(); }}><X className="size-3.5" />Reject</Button>
                    </div>
                  </Section>
                )}
                <Section title="Activity">
                  <ol className="space-y-2 border-l pl-4">
                    {audit.events.map((e, i) => (
                      <li key={i} className="relative text-sm">
                        <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-primary" />
                        <p>{e.action}</p>
                        <p className="text-xs text-muted-foreground">{e.actor} · {fmtDateTime(e.at)}</p>
                      </li>
                    ))}
                  </ol>
                </Section>
              </TabsContent>
            </Tabs>
          </>
  );
}
