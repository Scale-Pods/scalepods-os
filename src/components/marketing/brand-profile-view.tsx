"use client";

import * as React from "react";
import { Globe, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { useOrg } from "@/lib/org-context";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import { Field, Pill, SectionCard } from "@/components/marketing/shared";
import { useContentStore } from "@/components/marketing/store";
import { BRAND_PROFILE, compact, type BrandPillar } from "@/lib/mock-data/marketing";

export function BrandProfileView() {
  const { org } = useOrg();
  const { drafts } = useContentStore();
  const b = BRAND_PROFILE;
  const [pillar, setPillar] = React.useState<BrandPillar | null>(null);
  const [competitor, setCompetitor] = React.useState<(typeof b.competitors)[number] | null>(null);

  return (
    <>
      <PageHeader
        title="Brand Profile"
        description={`The business profile every generator reads before writing. Active workspace: ${org.name}.`}
        badge={
          <Badge variant="secondary" className="gap-1 text-[10px]">
            <Globe className="size-2.5" />
            {b.websiteUrl.replace("https://", "")}
          </Badge>
        }
      />

      <Tabs defaultValue="voice">
        <TabsList className="flex-wrap">
          <TabsTrigger value="voice">Voice and audience</TabsTrigger>
          <TabsTrigger value="pillars">Pillars</TabsTrigger>
          <TabsTrigger value="visual">Visual identity</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="guardrails">Guardrails</TabsTrigger>
        </TabsList>

        <TabsContent value="voice" className="grid gap-4 pt-2 md:grid-cols-2">
          <SectionCard title="Positioning">
            <p className="text-sm">{b.oneLiner}</p>
            <div className="mt-3 divide-y rounded-lg border px-3">
              <Field label="Name">{b.name}</Field>
              <Field label="Website">{b.websiteUrl}</Field>
              <Field label="Tone">{b.tone}</Field>
            </div>
          </SectionCard>
          <SectionCard title="Target audience">
            <p className="text-sm text-muted-foreground">{b.targetAudience}</p>
          </SectionCard>
          <SectionCard title="Voice" className="md:col-span-2">
            <p className="text-sm italic text-muted-foreground">&ldquo;{b.voiceSnippet}&rdquo;</p>
          </SectionCard>
        </TabsContent>

        <TabsContent value="pillars" className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          {b.pillars.map((p) => (
            <button key={p.id} type="button" onClick={() => setPillar(p)} className="text-left">
              <Card className="h-full py-4 transition-colors hover:border-ring/40">
                <CardContent className="space-y-1 px-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{p.label}</p>
                    <Pill label={`${drafts.filter((d) => d.pillarId === p.id).length} pieces`} tone={p.accent === "sage" ? "green" : "blue"} />
                  </div>
                  <p className="text-xs italic text-muted-foreground">{p.tagline}</p>
                  <p className="pt-1 text-xs text-muted-foreground">{p.stats[0]}</p>
                </CardContent>
              </Card>
            </button>
          ))}
        </TabsContent>

        <TabsContent value="visual" className="grid gap-4 pt-2 md:grid-cols-2">
          <SectionCard title="Colour tokens">
            <div className="space-y-2">
              {b.colors.map((c) => (
                <div key={c.hex} className="flex items-center gap-3 text-sm">
                  <span className="size-7 shrink-0 rounded-md border" style={{ backgroundColor: c.hex }} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {c.name} <span className="font-mono text-xs text-muted-foreground">{c.hex}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{c.use}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
          <div className="space-y-4">
            <SectionCard title="Typography">
              <div className="divide-y rounded-lg border px-3">
                {b.fonts.map((f) => (
                  <Field key={f.name} label={f.name}>
                    {f.use}
                  </Field>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Output formats">
              <div className="divide-y rounded-lg border px-3">
                {b.formats.map((f) => (
                  <Field key={f.label} label={f.label}>
                    {f.ratio} · {f.size}
                  </Field>
                ))}
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="channels" className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          {b.handles.map((h) => (
            <Card key={h.platform} className="py-3">
              <CardContent className="flex items-center justify-between px-4 text-sm">
                <div>
                  <PlatformBadge platform={h.platform} />
                  <p className="mt-1.5 font-medium">{h.handle}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{compact(h.followers)}</p>
                  <p className="text-xs text-muted-foreground">{h.platform === "blog" ? "monthly readers" : "followers"}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="competitors" className="grid gap-3 pt-2 md:grid-cols-3">
          {b.competitors.map((c) => (
            <button key={c.name} type="button" onClick={() => setCompetitor(c)} className="text-left">
              <Card className="h-full py-4 transition-colors hover:border-ring/40">
                <CardContent className="space-y-1 px-4 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{c.name}</p>
                    <Pill label={`${c.threat} threat`} tone={c.threat === "High" ? "red" : c.threat === "Medium" ? "orange" : "green"} />
                  </div>
                  <p className="text-muted-foreground">{c.angle}</p>
                </CardContent>
              </Card>
            </button>
          ))}
        </TabsContent>

        <TabsContent value="guardrails" className="grid gap-4 pt-2 md:grid-cols-2">
          <SectionCard title="Approved CTAs (exact wording)">
            <ul className="space-y-2 text-sm">
              {b.approvedCtas.map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-success" />
                  {c}
                </li>
              ))}
            </ul>
          </SectionCard>
          <SectionCard title="Banned words and phrases">
            <div className="flex flex-wrap gap-1.5">
              {b.bannedWords.map((w) => (
                <Pill key={w} label={w} tone="red" />
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{b.doNotInvent}</p>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <Dialog open={!!pillar} onOpenChange={(o) => !o && setPillar(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {pillar && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{pillar.label}</DialogTitle>
                <DialogDescription>{pillar.tagline}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="stats">
                <TabsList>
                  <TabsTrigger value="stats">Approved stats</TabsTrigger>
                  <TabsTrigger value="content">Content ({drafts.filter((d) => d.pillarId === pillar.id).length})</TabsTrigger>
                </TabsList>
                <TabsContent value="stats" className="pt-2">
                  <ul className="list-disc space-y-1.5 pl-5 text-sm">
                    {pillar.stats.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-muted-foreground">Generators may only quote figures from this list.</p>
                </TabsContent>
                <TabsContent value="content" className="pt-2">
                  <ul className="divide-y text-sm">
                    {drafts
                      .filter((d) => d.pillarId === pillar.id)
                      .map((d) => (
                        <li key={d.id} className="flex items-center justify-between gap-2 py-2">
                          <span className="truncate">{d.title}</span>
                          <PlatformBadge platform={d.platform} />
                        </li>
                      ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!competitor} onOpenChange={(o) => !o && setCompetitor(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {competitor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{competitor.name}</DialogTitle>
                <DialogDescription>Competitor positioning notes</DialogDescription>
              </DialogHeader>
              <div className="divide-y rounded-lg border px-3 text-sm">
                <Field label="Threat level">{competitor.threat}</Field>
                <Field label="Their angle">{competitor.angle}</Field>
                <Field label="Our counter-position">Audit trail, compliance and ongoing optimisation, never price comparisons.</Field>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
