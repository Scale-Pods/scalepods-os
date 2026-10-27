"use client";

import * as React from "react";
import { SearchX } from "lucide-react";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { EmptyState } from "@/components/shared/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KIND_LABEL, userName, type AuditRecord } from "@/lib/mock-data/audit-checker";
import { AuditDetailDialog } from "./audit-detail-dialog";
import { DecisionPill, KIND_ACCENT, Pill, ScoreBadge, StatusPill, fmtDate, inr } from "./shared";

const STATUSES = ["All statuses", "Match", "Partial Match", "Mismatch", "Critical"];
const DECISIONS = ["All decisions", "Pending", "Approved", "Rejected"];
const TIERS = ["All scores", "90+", "75-89", "60-74", "Below 60"];

const inTier = (s: number, t: string) =>
  t === "All scores" || (t === "90+" ? s >= 90 : t === "75-89" ? s >= 75 && s < 90 : t === "60-74" ? s >= 60 && s < 75 : s < 60);

function Filter({ value, onChange, options, width = "w-40" }: { value: string; onChange: (v: string) => void; options: string[]; width?: string }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={width}><SelectValue /></SelectTrigger>
      <SelectContent>
        {options.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
      </SelectContent>
    </Select>
  );
}

/** Searchable, filterable audit ledger. Rows open the shared detail dialog. */
export function AuditTable({ audits, showKind = false, partyLabel = "Party", initialStatus = "All statuses", pageSize = 20 }: { audits: AuditRecord[]; showKind?: boolean; partyLabel?: string; initialStatus?: string; pageSize?: number }) {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState(initialStatus);
  const [decision, setDecision] = React.useState("All decisions");
  const [tier, setTier] = React.useState("All scores");
  const [kind, setKind] = React.useState("All types");
  const [limit, setLimit] = React.useState(pageSize);
  const [open, setOpen] = React.useState<string | null>(null);

  const rows = audits.filter((a) => {
    if (status !== "All statuses" && a.status !== status) return false;
    if (decision !== "All decisions" && a.decision !== decision) return false;
    if (kind !== "All types" && KIND_LABEL[a.kind] !== kind) return false;
    if (!inTier(a.score, tier)) return false;
    const s = q.trim().toLowerCase();
    return !s || [a.ref, a.party, a.product, a.id, a.gstin].some((x) => x.toLowerCase().includes(s));
  });
  const selected = audits.find((a) => a.id === open) ?? null;

  return (
    <>
      <ListToolbar searchValue={q} onSearchChange={(v) => { setQ(v); setLimit(pageSize); }} placeholder="Search reference, party, product, GSTIN...">
        {showKind && <Filter value={kind} onChange={setKind} options={["All types", "Purchase", "Sales", "Quick Check"]} width="w-36" />}
        <Filter value={status} onChange={setStatus} options={STATUSES} />
        <Filter value={decision} onChange={setDecision} options={DECISIONS} />
        <Filter value={tier} onChange={setTier} options={TIERS} width="w-32" />
        <span className="ml-auto text-xs text-muted-foreground">{rows.length} of {audits.length} audits</span>
      </ListToolbar>

      {rows.length === 0 ? (
        <EmptyState icon={SearchX} title="No audits match" description="Try clearing a filter or searching a different reference." />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                {showKind && <TableHead>Type</TableHead>}
                <TableHead>{partyLabel}</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Decision</TableHead>
                <TableHead>Run by</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, limit).map((a) => (
                <TableRow key={a.id} className="cursor-pointer" onClick={() => setOpen(a.id)}>
                  <TableCell className="font-medium">{a.ref}</TableCell>
                  {showKind && <TableCell><Pill label={KIND_LABEL[a.kind]} accent={KIND_ACCENT[a.kind]} /></TableCell>}
                  <TableCell className="max-w-56 truncate">{a.party}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{fmtDate(a.createdAt)}</TableCell>
                  <TableCell className="text-right tabular-nums">{inr(a.amount)}</TableCell>
                  <TableCell><ScoreBadge score={a.score} /></TableCell>
                  <TableCell><StatusPill status={a.status} /></TableCell>
                  <TableCell><DecisionPill decision={a.decision} /></TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{userName(a.reviewerId)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {rows.length > limit && (
        <button type="button" onClick={() => setLimit(limit + pageSize)} className="mt-3 w-full rounded-lg border py-2 text-xs text-muted-foreground hover:bg-muted/50">
          Show more ({rows.length - limit} remaining)
        </button>
      )}
      <AuditDetailDialog audit={selected} onClose={() => setOpen(null)} />
    </>
  );
}
