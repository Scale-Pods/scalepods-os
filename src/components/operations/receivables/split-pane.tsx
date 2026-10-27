"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BillDetailDialog, type BillTab } from "./bill-detail-dialog";
import { StatusPill, TwoLine, fmtDateTime, inr } from "./shared";
import type { RecoveryOutreachRow } from "@/lib/mock-data/receivables";

/** Two-pane shell: ~320px selectable list on the left, flexible detail on the right. */
export function SplitPane({
  rows,
  preview,
  emptyDetail,
  detail,
  detailTab,
}: {
  rows: RecoveryOutreachRow[];
  preview: (r: RecoveryOutreachRow) => { text: string; at?: string };
  emptyDetail: string;
  detail: (r: RecoveryOutreachRow) => React.ReactNode;
  detailTab: BillTab;
}) {
  const [search, setSearch] = React.useState("");
  const [viewing, setViewing] = React.useState<string | null>(null);
  const [activeId, setActiveId] = React.useState<number | null>(rows[0]?.id ?? null);

  const filtered = rows.filter(
    (r) => !search || r.party_name.toLowerCase().includes(search.toLowerCase()) || r.bill_no.toLowerCase().includes(search.toLowerCase())
  );
  const active = rows.find((r) => r.id === activeId) ?? null;

  return (
    <div className="grid h-[calc(100vh-14rem)] min-h-[480px] grid-cols-1 overflow-hidden rounded-xl border bg-card md:grid-cols-[320px_1fr]">
      <div className="flex min-h-0 flex-col border-b md:border-b-0 md:border-r">
        <div className="relative border-b p-3">
          <Search className="absolute left-5.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search party or bill..." className="pl-8" />
        </div>
        <div className="min-h-0 flex-1 divide-y overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No conversations found.</p>
          ) : (
            filtered.map((r) => {
              const p = preview(r);
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setActiveId(r.id)}
                  className={cn("block w-full px-4 py-3 text-left hover:bg-muted/50", r.id === activeId && "bg-muted")}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-medium">{r.party_name}</p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{fmtDateTime(p.at)}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{p.text}</p>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-col">
        {active ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
              <TwoLine primary={active.party_name} secondary={`${active.bill_no} · ${inr(active.total_outstanding)}`} />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{active.current_stage}</span>
                <StatusPill status={active.status} />
                <Button size="xs" variant="outline" onClick={() => setViewing(active.bill_no)}>
                  Bill &amp; customer
                </Button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">{detail(active)}</div>
          </>
        ) : (
          <p className="m-auto text-sm text-muted-foreground">{emptyDetail}</p>
        )}
      </div>
      <BillDetailDialog billNo={viewing} tab={detailTab} onClose={() => setViewing(null)} />
    </div>
  );
}
