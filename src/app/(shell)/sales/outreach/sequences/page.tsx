"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Send, Users, Percent, Mail, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/badges";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { RankingBarChart } from "@/components/sales/charts/ranking-bar-chart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MOCK_SEQUENCES, sequenceReplyRateRanking } from "@/lib/mock-data/sales";

export default function SequencesPage() {
  const [search, setSearch] = React.useState("");
  const [newOpen, setNewOpen] = React.useState(false);
  const [channels, setChannels] = React.useState({ email: true, whatsapp: false });

  const sequences = MOCK_SEQUENCES;
  const filtered = sequences.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const totalEnrolled = sequences.reduce((sum, s) => sum + s.enrolledCount, 0);
  const avgReplyRate = Math.round(sequences.reduce((sum, s) => sum + s.replyRatePct, 0) / sequences.length);
  const replyRateRanking = React.useMemo(
    () => sequenceReplyRateRanking(sequences).map((s) => ({ label: s.name, value: s.replyRatePct })),
    [sequences]
  );

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    toast.success(`Sequence "${name}" created`, { description: "Add steps from the sequence detail page." });
    setNewOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Sequences"
        description="Multi-step email + WhatsApp outreach with AI personalisation."
        actions={
          <Dialog open={newOpen} onOpenChange={setNewOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" />
                New Sequence
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>New sequence</DialogTitle>
                  <DialogDescription>Give it a name and pick which channels to use.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="seq-name">Sequence name</Label>
                    <Input id="seq-name" name="name" placeholder="New client welcome series" required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Channels</Label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={channels.email}
                        onCheckedChange={(v) => setChannels((c) => ({ ...c, email: !!v }))}
                      />
                      Email
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={channels.whatsapp}
                        onCheckedChange={(v) => setChannels((c) => ({ ...c, whatsapp: !!v }))}
                      />
                      WhatsApp
                    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create sequence</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Active sequences" value={String(sequences.length)} context="Running now" icon={<Send className="size-4" />} />
        <KpiCard label="Total enrolled" value={String(totalEnrolled)} context="Contacts across all sequences" icon={<Users className="size-4" />} trend="up" trendValue="+24" />
        <KpiCard label="Avg. reply rate" value={`${avgReplyRate}%`} context="Across all sequences" icon={<Percent className="size-4" />} trend="up" trendValue="+3pts" />
      </div>

      <Card className="mb-6">
        <CardContent className="px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold">Reply rate by sequence</h3>
          <RankingBarChart
            data={replyRateRanking}
            height={Math.max(160, sequences.length * 40)}
            valueLabel="Reply rate"
          />
        </CardContent>
      </Card>

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search sequences..." />

      {filtered.length === 0 ? (
        <EmptyState icon={Send} title="No sequences match your search" description="Try a different search term." />
      ) : (
        <div className="space-y-2">
          {filtered.map((seq) => {
            const channelSet = new Set(seq.steps.map((s) => s.channel));
            return (
              <Link key={seq.id} href={`/sales/outreach/sequences/${seq.id}`}>
                <Card className="transition-colors hover:border-primary/40">
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{seq.name}</p>
                        <StatusBadge status={seq.mode} />
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{seq.steps.length} steps</span>
                        <span className="flex items-center gap-1">
                          {channelSet.has("email") && <Mail className="size-3" />}
                          {channelSet.has("whatsapp") && <MessageCircle className="size-3" />}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="font-semibold">{seq.enrolledCount}</p>
                        <p className="text-xs text-muted-foreground">enrolled</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-success">{seq.replyRatePct}%</p>
                        <p className="text-xs text-muted-foreground">reply rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
