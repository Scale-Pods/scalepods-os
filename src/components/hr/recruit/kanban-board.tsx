"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MOCK_CAMPAIGNS,
  MOCK_CANDIDATES,
  STAGE_LABELS,
  STAGE_ORDER,
  applyDecision,
  getCandidateStage,
  type Candidate,
  type DecisionValue,
  type StageKey,
} from "@/lib/mock-data/hr";
import { NameAvatar, ScoreNumber, FitBadge } from "./shared";
import { CandidateDialog } from "./candidate-dialog";
import { cn } from "@/lib/utils";

const COL_ACCENT: Record<StageKey, string> = {
  screening: "bg-muted-foreground",
  round1: "bg-primary",
  round2: "bg-accent",
  round3: "bg-warning",
  hired: "bg-success",
  reserve: "bg-warning",
  rejected: "bg-destructive",
};

export function KanbanBoard() {
  const [cands, setCands] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [campaign, setCampaign] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () => (campaign === "all" ? cands : cands.filter((c) => c.campaignId === campaign)),
    [cands, campaign],
  );

  const columns = STAGE_ORDER.map((s) => ({
    key: s,
    items: visible.filter((c) => getCandidateStage(c) === s).sort((a, b) => b.score - a.score),
  }));

  const decide = (cid: string, key: "resume" | 1 | 2 | 3, value: DecisionValue) =>
    setCands((prev) => prev.map((c) => (c.id === cid ? applyDecision(c, key, value) : c)));

  return (
    <>
      <PageHeader
        title="Kanban Pipeline"
        description="Every candidate by current stage. Open a card to review the profile and record decisions."
        actions={
          <Select value={campaign} onValueChange={setCampaign}>
            <SelectTrigger className="h-9 w-[230px]">
              <SelectValue placeholder="All Campaigns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {MOCK_CAMPAIGNS.filter((c) => c.status !== "draft").map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="flex gap-3 overflow-x-auto pb-3">
        {columns.map((col) => (
          <div key={col.key} className="w-64 shrink-0 rounded-xl border bg-muted/30">
            <div className="flex items-center gap-2 border-b px-3 py-2.5">
              <span className={cn("size-2 rounded-full", COL_ACCENT[col.key])} />
              <p className="text-sm font-semibold">{STAGE_LABELS[col.key]}</p>
              <Badge variant="secondary" className="ml-auto text-[10px]">
                {col.items.length}
              </Badge>
            </div>
            <div className="max-h-[65vh] space-y-2 overflow-y-auto p-2">
              {col.items.length === 0 && (
                <p className="py-6 text-center text-xs text-muted-foreground">No candidates</p>
              )}
              {col.items.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setOpenId(c.id)}
                  className="w-full rounded-lg border bg-card p-3 text-left shadow-xs transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <NameAvatar name={c.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{c.role}</p>
                    </div>
                    <ScoreNumber score={c.score} />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <FitBadge fit={c.fit} />
                    <span className="text-[10px] text-muted-foreground">{c.city}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <CandidateDialog
        candidate={cands.find((c) => c.id === openId) ?? null}
        onOpenChange={(o) => !o && setOpenId(null)}
        onDecision={decide}
      />
    </>
  );
}
