"use client";

import * as React from "react";
import { toast } from "sonner";
import { Megaphone, Target, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import { BarRow, Field, FormatBadge, Pill, type Tone } from "@/components/marketing/shared";
import { useContentStore } from "@/components/marketing/store";
import { CAMPAIGNS, CTA_STRATEGY, LEAD_GEN, WEEKLY_PLAN, type Campaign, type WeeklySlot } from "@/components/marketing/mock/workspace";
import { BRAND_PILLARS, fmtDateLong, getPillar } from "@/lib/mock-data/marketing";

const CAMPAIGN_TONE: Record<Campaign["status"], Tone> = { Active: "green", Planned: "blue", Completed: "neutral" };
const SLOT_TONE: Record<WeeklySlot["status"], Tone> = { Generated: "green", "In review": "orange", Planned: "blue", "Manual only": "neutral" };

export function StrategyView() {
  const { drafts } = useContentStore();
  const [campaign, setCampaign] = React.useState<Campaign | null>(null);
  const [slot, setSlot] = React.useState<WeeklySlot | null>(null);
  const maxPillar = Math.max(...BRAND_PILLARS.map((p) => drafts.filter((d) => d.pillarId === p.id).length));

  return (
    <>
      <PageHeader title="Marketing Strategy" description="Campaign planning, the weekly content plan, pillar balance, lead-gen funnels and CTA strategy. The weekly plan feeds the Content Factory." />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <KpiCard label="Active campaigns" value={String(CAMPAIGNS.filter((c) => c.status === "Active").length)} context={`${CAMPAIGNS.length} total`} trend="up" trendValue="+1" icon={<Megaphone className="size-4" />} />
        <KpiCard label="Slots this week" value={String(WEEKLY_PLAN.length)} context={`${WEEKLY_PLAN.filter((s) => s.status === "Generated").length} generated`} trend="flat" trendValue="0" icon={<Target className="size-4" />} />
        <KpiCard label="Leads (30d)" value={String(LEAD_GEN.reduce((s, l) => s + l.leads, 0))} context={`${LEAD_GEN.reduce((s, l) => s + l.qualified, 0)} qualified`} trend="up" trendValue="+14%" icon={<Users className="size-4" />} />
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList className="flex-wrap">
          <TabsTrigger value="campaigns">Campaign planning</TabsTrigger>
          <TabsTrigger value="weekly">Weekly content</TabsTrigger>
          <TabsTrigger value="pillars">Content pillars</TabsTrigger>
          <TabsTrigger value="leadgen">Lead-gen</TabsTrigger>
          <TabsTrigger value="cta">CTA strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="grid gap-3 pt-2 md:grid-cols-2">
          {CAMPAIGNS.map((c) => (
            <button key={c.id} type="button" onClick={() => setCampaign(c)} className="text-left">
              <Card className="h-full py-4 transition-colors hover:border-ring/40">
                <CardContent className="space-y-2 px-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{c.name}</p>
                    <Pill label={c.status} tone={CAMPAIGN_TONE[c.status]} />
                  </div>
                  <p className="text-xs text-muted-foreground">{c.goal}</p>
                  <Progress value={c.progress} />
                  <p className="text-[11px] text-muted-foreground">
                    {c.producedPieces} of {c.plannedPieces} pieces · {c.kpi}
                  </p>
                </CardContent>
              </Card>
            </button>
          ))}
        </TabsContent>

        <TabsContent value="weekly" className="pt-2">
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Pillar</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {WEEKLY_PLAN.map((s, i) => (
                  <TableRow key={i} className="cursor-pointer" onClick={() => setSlot(s)}>
                    <TableCell className="font-medium">{s.day}</TableCell>
                    <TableCell><PlatformBadge platform={s.platform} /></TableCell>
                    <TableCell><FormatBadge format={s.format} /></TableCell>
                    <TableCell className="max-w-72 truncate">{s.topic}</TableCell>
                    <TableCell>{getPillar(s.pillarId)?.label}</TableCell>
                    <TableCell><Pill label={s.status} tone={SLOT_TONE[s.status]} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="pillars" className="pt-2">
          <Card>
            <CardContent className="space-y-3 py-4">
              <p className="text-sm text-muted-foreground">Balance of pieces in the pipeline across the four Pods plus case-study proof.</p>
              {BRAND_PILLARS.map((p) => {
                const n = drafts.filter((d) => d.pillarId === p.id).length;
                return <BarRow key={p.id} label={p.label} value={n} max={maxPillar} display={String(n)} />;
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leadgen" className="pt-2">
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funnel</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-right">Leads</TableHead>
                  <TableHead className="text-right">Qualified</TableHead>
                  <TableHead className="text-right">Conversion</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LEAD_GEN.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.name}</TableCell>
                    <TableCell>{l.channel}</TableCell>
                    <TableCell className="text-right">{l.leads}</TableCell>
                    <TableCell className="text-right">{l.qualified}</TableCell>
                    <TableCell className="text-right">{l.conversion}</TableCell>
                    <TableCell><Pill label={l.status} tone={l.status === "Running" ? "green" : "orange"} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="cta" className="grid gap-3 pt-2 md:grid-cols-3">
          {CTA_STRATEGY.map((c) => (
            <Card key={c.cta} className="py-4">
              <CardContent className="space-y-2 px-4 text-sm">
                <p className="font-semibold">&ldquo;{c.cta}&rdquo;</p>
                <p className="text-muted-foreground">Used on: {c.where}</p>
                <p className="text-muted-foreground">Intent: {c.intent}</p>
                <Pill label={c.ctr} tone="green" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={!!campaign} onOpenChange={(o) => !o && setCampaign(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {campaign && (
            <>
              <DialogHeader>
                <Pill label={campaign.status} tone={CAMPAIGN_TONE[campaign.status]} className="w-fit" />
                <DialogTitle className="mt-1 text-lg">{campaign.name}</DialogTitle>
                <DialogDescription>{campaign.goal}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="pt-2">
                  <div className="divide-y rounded-lg border px-3 text-sm">
                    <Field label="Pillar">{getPillar(campaign.pillarId)?.label}</Field>
                    <Field label="Window">{fmtDateLong(campaign.start)} to {fmtDateLong(campaign.end)}</Field>
                    <Field label="Target KPI">{campaign.kpi}</Field>
                    <Field label="Progress">{campaign.producedPieces} of {campaign.plannedPieces} pieces ({campaign.progress}%)</Field>
                    <Field label="Channels">
                      <span className="flex flex-wrap justify-end gap-1">
                        {campaign.channels.map((c) => <PlatformBadge key={c} platform={c} />)}
                      </span>
                    </Field>
                  </div>
                </TabsContent>
                <TabsContent value="content" className="pt-2">
                  <ul className="divide-y text-sm">
                    {drafts.filter((d) => d.pillarId === campaign.pillarId).slice(0, 6).map((d) => (
                      <li key={d.id} className="flex items-center justify-between gap-2 py-2">
                        <span className="truncate">{d.title}</span>
                        <PlatformBadge platform={d.platform} />
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button onClick={() => toast.success("Campaign brief sent to the Content Factory")}>Send brief to Content Factory</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!slot} onOpenChange={(o) => !o && setSlot(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {slot && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{slot.topic}</DialogTitle>
                <DialogDescription>
                  {slot.day} slot · {getPillar(slot.pillarId)?.label}
                </DialogDescription>
              </DialogHeader>
              <div className="divide-y rounded-lg border px-3 text-sm">
                <Field label="Platform"><PlatformBadge platform={slot.platform} /></Field>
                <Field label="Format"><FormatBadge format={slot.format} /></Field>
                <Field label="Status"><Pill label={slot.status} tone={SLOT_TONE[slot.status]} /></Field>
                <Field label="Generation">{slot.status === "Manual only" ? "Manual composer only, never in the AI auto-engine" : "Content Factory (GPT-4o copy, brand overlay)"}</Field>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
