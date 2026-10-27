"use client";

import * as React from "react";
import { toast } from "sonner";
import { Clapperboard, DollarSign, Factory, GalleryHorizontal, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import { Field, Pill, VideoPlayer, type Tone } from "@/components/marketing/shared";
import { DraftDetailDialog } from "@/components/marketing/draft-detail-dialog";
import {
  CAROUSEL_JOBS,
  FACTORY_QUEUE,
  IMAGE_REQUESTS,
  STUDIO_STYLES,
  VIDEO_JOBS,
  VIDEO_TYPES,
} from "@/components/marketing/mock/workspace";
import { VIDEO_ASSETS, fmtDateTime, getContentDraft, getVideo, relativeToRef } from "@/lib/mock-data/marketing";

const JOB_TONE: Record<string, Tone> = {
  done: "green",
  draft_ready: "orange",
  rendering: "blue",
  Chosen: "green",
  "Sent back": "red",
  "Awaiting pick": "orange",
  Generated: "green",
  Generating: "blue",
  Queued: "neutral",
  "Awaiting review": "orange",
  Approved: "green",
  Scheduled: "blue",
  Draft: "neutral",
  Published: "purple",
};

// ---------------------------------------------------------------------------
// Content Factory
// ---------------------------------------------------------------------------

export function ContentFactoryView() {
  const [draftId, setDraftId] = React.useState<string | null>(null);
  const cost = FACTORY_QUEUE.reduce((s, q) => s + q.cost, 0);
  return (
    <>
      <PageHeader
        title="Content Factory"
        description="GPT-4o copy, gpt-image-1 images and the brand overlay, generated from the approved weekly plan. Video is manual-only and never enters this pipeline."
        actions={<Button variant="outline" onClick={() => toast.info("GENERATION_ENABLED is off, so this run is simulated")}>Generate this week</Button>}
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <KpiCard label="Slots this week" value={String(FACTORY_QUEUE.length)} context="From the approved plan" trend="flat" trendValue="0" icon={<Factory className="size-4" />} />
        <KpiCard label="Generated" value={String(FACTORY_QUEUE.filter((q) => q.status === "Generated").length)} context="Ready for review" trend="up" trendValue="+4" icon={<Wand2 className="size-4" />} />
        <KpiCard label="Estimated cost" value={`$${cost.toFixed(2)}`} context="Copy and image spend" trend="flat" trendValue="0" trendGood={false} icon={<DollarSign className="size-4" />} />
      </div>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slot</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FACTORY_QUEUE.map((q) => (
              <TableRow key={q.id} className="cursor-pointer" onClick={() => setDraftId({ "cf-1": "draft-1", "cf-2": "draft-2", "cf-3": "draft-6", "cf-4": "draft-5", "cf-5": "draft-15", "cf-6": "draft-4" }[q.id] ?? null)}>
                <TableCell className="font-medium">{q.slot}</TableCell>
                <TableCell><PlatformBadge platform={q.platform} /></TableCell>
                <TableCell className="font-mono text-xs">{q.type}</TableCell>
                <TableCell>{q.topic}</TableCell>
                <TableCell><Pill label={q.status} tone={JOB_TONE[q.status]} /></TableCell>
                <TableCell className="text-right">${q.cost.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <p className="mt-2 text-xs text-muted-foreground">Only static_image, carousel and social_caption types can be auto-generated here.</p>
      <DraftDetailDialog draftId={draftId} open={draftId !== null} onOpenChange={(o) => !o && setDraftId(null)} />
    </>
  );
}

// ---------------------------------------------------------------------------
// AI Studio
// ---------------------------------------------------------------------------

export function AiStudioView() {
  const [prompt, setPrompt] = React.useState("");
  const [style, setStyle] = React.useState(STUDIO_STYLES[0].id);
  const [sel, setSel] = React.useState<(typeof IMAGE_REQUESTS)[number] | null>(null);
  const [draftId, setDraftId] = React.useState<string | null>(null);

  return (
    <>
      <PageHeader title="AI Studio" description="Pick a look, review the prompt, and choose from several options. A real-cost confirmation shows before any image spend." />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <KpiCard label="Requests" value={String(IMAGE_REQUESTS.length)} context="Last 30 days" trend="up" trendValue="+2" icon={<Wand2 className="size-4" />} />
        <KpiCard label="Styles" value={String(STUDIO_STYLES.length)} context="Brand-safe looks" trend="flat" trendValue="0" icon={<GalleryHorizontal className="size-4" />} />
        <KpiCard label="Spend" value={`$${IMAGE_REQUESTS.reduce((s, r) => s + r.cost, 0).toFixed(2)}`} context="gpt-image-1" trend="flat" trendValue="0" trendGood={false} icon={<DollarSign className="size-4" />} />
      </div>
      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="history">History ({IMAGE_REQUESTS.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="create" className="space-y-4 pt-2">
          <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} placeholder="Describe the image: e.g. Stat card with '14+ fields' in Sage Green on deep green" />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {STUDIO_STYLES.map((s) => (
              <button key={s.id} type="button" onClick={() => setStyle(s.id)} className="text-left">
                <Card className={`h-full py-3 transition-colors ${style === s.id ? "border-primary" : "hover:border-ring/40"}`}>
                  <CardContent className="px-3 text-sm">
                    <p className="font-semibold">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.bestFor}</p>
                    <Pill label={s.ratio} className="mt-1.5" />
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
          <Button onClick={() => toast.info("Estimated $0.16 for 4 options. GENERATION_ENABLED is off, so nothing was spent.")}>Generate 4 options</Button>
        </TabsContent>
        <TabsContent value="history" className="pt-2">
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prompt</TableHead>
                  <TableHead>Style</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {IMAGE_REQUESTS.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" onClick={() => setSel(r)}>
                    <TableCell className="max-w-72 truncate font-medium">{r.prompt}</TableCell>
                    <TableCell>{STUDIO_STYLES.find((s) => s.id === r.style)?.label}</TableCell>
                    <TableCell><Pill label={r.status} tone={JOB_TONE[r.status]} /></TableCell>
                    <TableCell className="text-right">${r.cost.toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground">{relativeToRef(r.at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {sel && (
            <>
              <DialogHeader>
                <Pill label={sel.status} tone={JOB_TONE[sel.status]} className="w-fit" />
                <DialogTitle className="mt-1 text-lg">Image request</DialogTitle>
                <DialogDescription>{sel.prompt}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {Array.from({ length: sel.options }).map((_, i) => (
                  <div key={i} className="flex aspect-square items-center justify-center rounded-lg border border-dashed bg-muted/40 text-xs text-muted-foreground">
                    Option {i + 1}
                  </div>
                ))}
              </div>
              <div className="divide-y rounded-lg border px-3 text-sm">
                <Field label="Style">{STUDIO_STYLES.find((s) => s.id === sel.style)?.label}</Field>
                <Field label="Cost">${sel.cost.toFixed(2)}</Field>
                <Field label="Created">{fmtDateTime(sel.at)}</Field>
                <Field label="Linked draft">{getContentDraft(sel.draftId)?.title}</Field>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { const id = sel.draftId; setSel(null); setDraftId(id); }}>Open linked draft</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      <DraftDetailDialog draftId={draftId} open={draftId !== null} onOpenChange={(o) => !o && setDraftId(null)} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Carousel Studio
// ---------------------------------------------------------------------------

export function CarouselStudioView() {
  const [topic, setTopic] = React.useState("");
  const [sel, setSel] = React.useState<(typeof CAROUSEL_JOBS)[number] | null>(null);
  const draft = sel?.draftId ? getContentDraft(sel.draftId) : undefined;
  return (
    <>
      <PageHeader title="Carousel Studio" description="Topic in, outline out, then a deterministic headless-Chrome + FFmpeg render on the Railway worker. A full 5-slide render takes around 10 minutes." />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <KpiCard label="Carousels" value={String(CAROUSEL_JOBS.length)} context="This month" trend="up" trendValue="+1" icon={<GalleryHorizontal className="size-4" />} />
        <KpiCard label="Rendering" value={String(CAROUSEL_JOBS.filter((j) => j.status === "rendering").length)} context="On the worker now" trend="flat" trendValue="0" icon={<Clapperboard className="size-4" />} />
        <KpiCard label="Avg. render" value="10 min" context="5 slides, 30fps" trend="flat" trendValue="0" trendGood={false} icon={<Wand2 className="size-4" />} />
      </div>
      <div className="mb-5 flex gap-2">
        <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Carousel topic, e.g. Audit. Build. Scale." />
        <Button onClick={() => toast.info("Outline generation simulated (GENERATION_ENABLED off)")}>Draft outline</Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {CAROUSEL_JOBS.map((j) => (
          <button key={j.id} type="button" onClick={() => setSel(j)} className="text-left">
            <Card className="h-full py-4 transition-colors hover:border-ring/40">
              <CardContent className="space-y-2 px-4 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{j.topic}</p>
                  <Pill label={j.status.replace("_", " ")} tone={JOB_TONE[j.status]} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {j.slides} slides · comment keyword {j.keyword} · {relativeToRef(j.at)}
                </p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {sel && (
            <>
              <DialogHeader>
                <Pill label={sel.status.replace("_", " ")} tone={JOB_TONE[sel.status]} className="w-fit" />
                <DialogTitle className="mt-1 text-lg">{sel.topic}</DialogTitle>
                <DialogDescription>Carousel job {sel.id}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="outline">
                <TabsList>
                  <TabsTrigger value="outline">Outline</TabsTrigger>
                  <TabsTrigger value="render">Render</TabsTrigger>
                </TabsList>
                <TabsContent value="outline" className="pt-2">
                  {draft?.slides ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {draft.slides.map((s, i) => (
                        <div key={i} className="flex aspect-[4/5] flex-col justify-between rounded-md border bg-muted/40 p-2 text-[11px]">
                          <span className="font-semibold uppercase text-muted-foreground">{s.type}</span>
                          <span className="text-xs font-semibold">{s.headline}</span>
                          <span className="line-clamp-3 text-muted-foreground">{s.body}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Outline is still being drafted.</p>
                  )}
                </TabsContent>
                <TabsContent value="render" className="pt-2">
                  <div className="divide-y rounded-lg border px-3 text-sm">
                    <Field label="Status">{sel.status.replace("_", " ")}</Field>
                    <Field label="Slides">{sel.slides}</Field>
                    <Field label="Render time">{sel.renderMin ? `${sel.renderMin} min` : "Not started"}</Field>
                    <Field label="Comment keyword">{sel.keyword}</Field>
                    <Field label="Started">{fmtDateTime(sel.at)}</Field>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ---------------------------------------------------------------------------
// Video Studio
// ---------------------------------------------------------------------------

export function VideoStudioView() {
  const [sel, setSel] = React.useState<(typeof VIDEO_JOBS)[number] | null>(null);
  const video = sel ? getVideo(sel.videoId) : undefined;
  const spend = VIDEO_JOBS.reduce((s, j) => s + j.costUsd, 0);
  return (
    <>
      <PageHeader title="Video Studio" description="Six video types, a storyboard review gate and a hard $5 per-video ceiling. Video generation is only ever started by an explicit human click." />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <KpiCard label="Video jobs" value={String(VIDEO_JOBS.length)} context={`${VIDEO_ASSETS.length} playable clips`} trend="up" trendValue="+2" icon={<Clapperboard className="size-4" />} />
        <KpiCard label="Spend" value={`$${spend.toFixed(2)}`} context="Veo / Kling / avatar" trend="flat" trendValue="0" trendGood={false} icon={<DollarSign className="size-4" />} />
        <KpiCard label="Ceiling per video" value="$5.00" context="PER_VIDEO_CEILING_USD" trend="flat" trendValue="0" icon={<Wand2 className="size-4" />} />
      </div>
      <Tabs defaultValue="jobs">
        <TabsList>
          <TabsTrigger value="jobs">Jobs ({VIDEO_JOBS.length})</TabsTrigger>
          <TabsTrigger value="types">Video types ({VIDEO_TYPES.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="jobs" className="pt-2">
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Shots</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {VIDEO_JOBS.map((j) => (
                  <TableRow key={j.id} className="cursor-pointer" onClick={() => setSel(j)}>
                    <TableCell className="max-w-72 truncate font-medium">{j.title}</TableCell>
                    <TableCell>{j.type}</TableCell>
                    <TableCell><Pill label={j.status} tone={JOB_TONE[j.status]} /></TableCell>
                    <TableCell className="text-right">{j.shots}</TableCell>
                    <TableCell className="text-right">${j.costUsd.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="types" className="grid gap-3 pt-2 md:grid-cols-2 lg:grid-cols-3">
          {VIDEO_TYPES.map((t) => (
            <Card key={t.id} className="py-4">
              <CardContent className="space-y-1.5 px-4 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{t.label}</p>
                  {t.manual && <Pill label="Manual only" tone="orange" />}
                </div>
                <p className="text-xs text-muted-foreground">{t.bestFor}</p>
                <p className="text-xs">{t.length} · {t.engine}</p>
                <Pill label={t.vo ? "Voiceover needed" : "Voiceover optional"} />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {sel && (
            <>
              <DialogHeader>
                <Pill label={sel.status} tone={JOB_TONE[sel.status]} className="w-fit" />
                <DialogTitle className="mt-1 text-lg">{sel.title}</DialogTitle>
                <DialogDescription>{sel.type}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="preview">
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="storyboard">Storyboard</TabsTrigger>
                  <TabsTrigger value="cost">Cost</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="pt-2">
                  {video ? <VideoPlayer src={video.src} aspect={video.aspect} /> : <p className="text-sm text-muted-foreground">No render yet.</p>}
                </TabsContent>
                <TabsContent value="storyboard" className="pt-2">
                  <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                    {(video?.script ?? []).map((l) => <li key={l}>{l}</li>)}
                  </ol>
                </TabsContent>
                <TabsContent value="cost" className="pt-2">
                  <div className="divide-y rounded-lg border px-3 text-sm">
                    <Field label="Engine">{video?.engine}</Field>
                    <Field label="Spent">${sel.costUsd.toFixed(2)}</Field>
                    <Field label="Ceiling">${sel.ceilingUsd.toFixed(2)}</Field>
                    <Field label="Shots">{sel.shots}</Field>
                    <Field label="Started">{fmtDateTime(sel.at)}</Field>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
