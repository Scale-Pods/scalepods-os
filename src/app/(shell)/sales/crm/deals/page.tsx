"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, LayoutGrid, Table2, TrendingUp, ArrowUpDown } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/badges";
import { DealCard } from "@/components/sales/deal-card";
import { StageValueBarChart } from "@/components/sales/charts/stage-value-bar-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrg } from "@/lib/org-context";
import { DEAL_STAGES, dealsByOrg, pipelineValueByStage, averageDealCycleDays } from "@/lib/mock-data/sales";
import { getCompany, MOCK_CONTACTS } from "@/lib/mock-data/contacts";
import { MEMBERS } from "@/lib/mock-data/orgs";
import { formatMoney } from "@/lib/format";

export default function DealsPage() {
  const { org } = useOrg();
  const deals = React.useMemo(() => dealsByOrg(org.id), [org.id]);
  const [view, setView] = React.useState<"kanban" | "table">("kanban");
  const [newDealOpen, setNewDealOpen] = React.useState(false);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");

  const openDeals = deals.filter((d) => d.stage !== "won" && d.stage !== "lost");
  const pipelineValue = openDeals.reduce((sum, d) => sum + d.valueMinor, 0);
  const wonDeals = deals.filter((d) => d.stage === "won");
  const winRate = deals.length ? Math.round((wonDeals.length / deals.length) * 100) : 0;
  const stageValueData = React.useMemo(() => pipelineValueByStage(deals), [deals]);
  const avgCycleDays = React.useMemo(() => averageDealCycleDays(deals), [deals]);

  const sortedDeals = React.useMemo(
    () =>
      [...deals].sort((a, b) =>
        sortDir === "asc" ? a.valueMinor - b.valueMinor : b.valueMinor - a.valueMinor
      ),
    [deals, sortDir]
  );

  function handleCreateDeal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = form.get("title") as string;
    toast.success(`Deal "${title}" created`, { description: "Added to the New stage." });
    setNewDealOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Deals"
        description="Pipeline across every active opportunity."
        actions={
          <>
            <div className="flex items-center rounded-lg border p-0.5">
              <Button
                variant={view === "kanban" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("kanban")}
              >
                <LayoutGrid className="size-3.5" />
                Pipeline
              </Button>
              <Button
                variant={view === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("table")}
              >
                <Table2 className="size-3.5" />
                Table
              </Button>
            </div>
            <Dialog open={newDealOpen} onOpenChange={setNewDealOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="size-4" />
                  New Deal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleCreateDeal}>
                  <DialogHeader>
                    <DialogTitle>New deal</DialogTitle>
                    <DialogDescription>Add a new opportunity to the pipeline.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 py-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="title">Deal title</Label>
                      <Input id="title" name="title" placeholder="Bulk staffing contract" required />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="value">Value (INR)</Label>
                      <Input id="value" name="value" type="number" placeholder="150000" required />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="stage">Stage</Label>
                      <Select name="stage" defaultValue="new">
                        <SelectTrigger id="stage">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DEAL_STAGES.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create deal</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Pipeline value" value={formatMoney(pipelineValue, "INR")} context={`${openDeals.length} open deals`} trend="up" trendValue="+9.2%" icon={<TrendingUp className="size-4" />} />
        <KpiCard label="Win rate" value={`${winRate}%`} context={`${wonDeals.length} won of ${deals.length}`} trend="up" trendValue="+4pts" icon={<TrendingUp className="size-4" />} />
        <KpiCard label="Avg. deal size" value={formatMoney(deals.length ? Math.round(deals.reduce((s, d) => s + d.valueMinor, 0) / deals.length) : 0, "INR")} context="Across all deals" icon={<TrendingUp className="size-4" />} />
        <KpiCard label="Avg. deal cycle" value={`${avgCycleDays}d`} context="Created to close, won + lost" icon={<TrendingUp className="size-4" />} />
      </div>

      <Card className="mb-6">
        <CardContent className="px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold">Pipeline value by stage</h3>
          <StageValueBarChart data={stageValueData} />
        </CardContent>
      </Card>

      {view === "kanban" ? (
        <div className="grid grid-cols-1 gap-3 overflow-x-auto sm:grid-cols-3 lg:grid-cols-6">
          {DEAL_STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.id);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.valueMinor, 0);
            return (
              <div key={stage.id} className="min-w-[220px] rounded-lg bg-muted/40 p-2">
                <div className="mb-2 flex items-center justify-between px-1">
                  <p className="text-xs font-semibold">{stage.label}</p>
                  <span className="text-[11px] text-muted-foreground">{stageDeals.length}</span>
                </div>
                <p className="mb-2 px-1 text-[11px] text-muted-foreground">{formatMoney(stageValue, "INR")}</p>
                <div className="space-y-2">
                  {stageDeals.map((d) => (
                    <DealCard key={d.id} deal={d} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1"
                    onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                  >
                    Value <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Expected close</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDeals.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.title}</TableCell>
                  <TableCell>{getCompany(d.companyId)?.name ?? "—"}</TableCell>
                  <TableCell>{MOCK_CONTACTS.find((c) => c.id === d.contactId)?.name ?? "—"}</TableCell>
                  <TableCell className="font-medium">{formatMoney(d.valueMinor, d.currency)}</TableCell>
                  <TableCell>
                    <StatusBadge status={d.stage} />
                  </TableCell>
                  <TableCell>{MEMBERS.find((m) => m.id === d.ownerId)?.name ?? "—"}</TableCell>
                  <TableCell>{new Date(d.expectedCloseDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
