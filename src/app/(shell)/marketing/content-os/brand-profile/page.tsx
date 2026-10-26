"use client";

import * as React from "react";
import { toast } from "sonner";
import { Globe, Plus, X, Sparkles, Save } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AiGeneratedBadge } from "@/components/shared/badges";
import { PillarPerformanceChart } from "@/components/marketing/pillar-performance-chart";
import {
  BRAND_PROFILE,
  getPillarPerformance,
  type BrandPillar,
  type BrandProfile,
} from "@/lib/mock-data/marketing";

const TONE_OPTIONS: BrandProfile["tone"][] = [
  "Professional",
  "Friendly",
  "Bold",
  "Technical",
  "Playful",
];

let pillarSeq = 100;

export default function BrandProfilePage() {
  const [websiteUrl, setWebsiteUrl] = React.useState(BRAND_PROFILE.websiteUrl);
  const [tone, setTone] = React.useState<BrandProfile["tone"]>(BRAND_PROFILE.tone);
  const [audience, setAudience] = React.useState(BRAND_PROFILE.targetAudience);
  const [pillars, setPillars] = React.useState<BrandPillar[]>(BRAND_PROFILE.pillars);
  const [newPillar, setNewPillar] = React.useState("");
  const [voiceSnippet, setVoiceSnippet] = React.useState(BRAND_PROFILE.voiceSnippet);
  const [saving, setSaving] = React.useState(false);

  const pillarPerformance = getPillarPerformance(pillars);

  function addPillar() {
    const label = newPillar.trim();
    if (!label) return;
    if (pillars.some((p) => p.label.toLowerCase() === label.toLowerCase())) {
      toast.error("That content pillar already exists.");
      return;
    }
    setPillars((prev) => [...prev, { id: `pillar-${++pillarSeq}`, label }]);
    setNewPillar("");
  }

  function removePillar(id: string) {
    setPillars((prev) => prev.filter((p) => p.id !== id));
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Brand profile saved", {
        description: "New AI drafts will use these settings going forward.",
      });
    }, 500);
  }

  return (
    <>
      <PageHeader
        title="Brand Profile"
        description="This profile steers every AI-generated draft — tone, audience and the content pillars Content OS rotates through."
        actions={
          <Button onClick={handleSave} disabled={saving}>
            <Save className="size-4" />
            {saving ? "Saving..." : "Save profile"}
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Identity</CardTitle>
              <CardDescription>Where to pull context from, and how drafts should sound.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="website">Website URL</Label>
                <div className="relative">
                  <Globe className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="website"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  The content agent crawls this site to stay current on offerings and messaging.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tone">Tone of voice</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as BrandProfile["tone"])}>
                  <SelectTrigger id="tone" className="w-full sm:w-64">
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TONE_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="audience">Target audience</Label>
                <Textarea
                  id="audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  rows={3}
                  placeholder="Who is this content for?"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content pillars</CardTitle>
              <CardDescription>
                The recurring themes AI drafts rotate through. Aim for 4-5 pillars.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {pillars.map((pillar) => (
                  <Badge key={pillar.id} variant="secondary" className="gap-1.5 py-1.5 pl-3 pr-2 text-sm">
                    {pillar.label}
                    <button
                      type="button"
                      onClick={() => removePillar(pillar.id)}
                      className="rounded-full p-0.5 text-muted-foreground hover:bg-background hover:text-foreground"
                      aria-label={`Remove ${pillar.label}`}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
                {pillars.length === 0 && (
                  <p className="text-sm text-muted-foreground">No pillars yet — add your first one below.</p>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newPillar}
                  onChange={(e) => setNewPillar(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPillar();
                    }
                  }}
                  placeholder="Add a content pillar, e.g. Customer stories"
                />
                <Button type="button" variant="outline" onClick={addPillar}>
                  <Plus className="size-4" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Brand voice example
                <AiGeneratedBadge />
              </CardTitle>
              <CardDescription>
                A reference snippet the content agent matches against for tone and vocabulary.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={voiceSnippet}
                onChange={(e) => setVoiceSnippet(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="size-4 text-accent" />
                How this is used
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Every new AI draft in Content OS is generated using:</p>
              <ul className="list-disc space-y-1.5 pl-4">
                <li>Your selected tone: <span className="font-medium text-foreground">{tone}</span></li>
                <li>{pillars.length} active content pillar{pillars.length === 1 ? "" : "s"}</li>
                <li>The audience description above</li>
                <li>The brand voice example as a style reference</li>
              </ul>
              <Separator />
              <p>
                Changes here apply to new drafts only — existing drafts in review keep their original
                context for consistency.
              </p>
            </CardContent>
          </Card>

          <PillarPerformanceChart data={pillarPerformance} />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Preview</CardTitle>
              <CardDescription>How a new draft would open, with current settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/40 p-3 text-sm italic text-muted-foreground">
                &ldquo;{voiceSnippet.slice(0, 160)}
                {voiceSnippet.length > 160 ? "..." : ""}&rdquo;
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
