"use client";

import * as React from "react";
import { toast } from "sonner";
import { ExternalLink, FileText, Newspaper } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { ContentStatusPill, Field, Pill } from "@/components/marketing/shared";
import { useContentStore } from "@/components/marketing/store";
import { BLOG_CATEGORIES } from "@/components/marketing/mock/workspace";
import { compact, fmtDate, getPillar, type ContentDraft } from "@/lib/mock-data/marketing";

type Filter = "all" | "draft" | "published";

function categoryFor(d: ContentDraft) {
  return d.tags.includes("case-study") ? BLOG_CATEGORIES[0] : d.tags.includes("seo") && d.title.startsWith("How") ? BLOG_CATEGORIES[1] : BLOG_CATEGORIES[2];
}

export function BlogView() {
  const { drafts, setStatus } = useContentStore();
  const posts = drafts.filter((d) => d.platform === "blog");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [openId, setOpenId] = React.useState<string | null>(null);

  const shown = posts.filter((p) => filter === "all" || (filter === "published" ? p.status === "published" : p.status !== "published"));
  const open = posts.find((p) => p.id === openId) ?? null;
  const live = posts.filter((p) => p.status === "published");

  return (
    <>
      <PageHeader
        title="Blog"
        description="Long-form articles that publish to scalepods.co/blog through a dedicated API contract, not a social API."
        actions={
          <Button variant="outline" onClick={() => toast.info("New blog drafts are created by the Content Factory or the manual editor.")}>
            New post
          </Button>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <KpiCard label="Posts" value={String(posts.length)} context="Drafts and published" trend="up" trendValue="+2" icon={<Newspaper className="size-4" />} />
        <KpiCard label="Live on scalepods.co" value={String(live.length)} context="Published articles" trend="flat" trendValue="0" icon={<ExternalLink className="size-4" />} />
        <KpiCard label="Article views" value={compact(live.reduce((s, p) => s + (p.metrics?.views ?? 0), 0))} context="Last 30 days" trend="up" trendValue="+9%" icon={<FileText className="size-4" />} />
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)} className="mb-3">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <button key={p.id} type="button" onClick={() => setOpenId(p.id)} className="text-left">
            <Card className="h-full gap-2 py-4 transition-colors hover:border-ring/40">
              <CardContent className="space-y-2 px-4">
                <div className="flex items-center justify-between">
                  <ContentStatusPill status={p.status} />
                  <Pill label={categoryFor(p)} />
                </div>
                <div className="flex h-24 items-center justify-center rounded-lg bg-muted/50">
                  <FileText className="size-5 text-muted-foreground" />
                </div>
                <p className="line-clamp-2 text-sm font-semibold">{p.title}</p>
                <p className="text-xs text-muted-foreground">
                  {p.wordCount} words · {getPillar(p.pillarId)?.label}
                </p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {open && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <ContentStatusPill status={open.status} />
                  <Pill label={categoryFor(open)} />
                </div>
                <DialogTitle className="mt-1 text-lg">{open.title}</DialogTitle>
                <DialogDescription>{open.hook}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="content">
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO and publishing</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="pt-2">
                  <div className="space-y-2 rounded-lg border p-4 text-sm">
                    {open.body.split("\n").map((line, i) =>
                      line.startsWith("## ") ? (
                        <h4 key={i} className="pt-1 font-semibold">
                          {line.replace("## ", "")}
                        </h4>
                      ) : line.trim() ? (
                        <p key={i} className="text-muted-foreground">
                          {line}
                        </p>
                      ) : null
                    )}
                    <p className="rounded-md bg-primary/10 px-3 py-2 text-primary">CTA card: {open.cta}</p>
                  </div>
                </TabsContent>
                <TabsContent value="seo" className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Slug</label>
                    <Input readOnly value={open.blogSlug ?? ""} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Meta description (155 characters max)</label>
                    <Input readOnly value={open.hook.slice(0, 155)} />
                  </div>
                  <div className="divide-y rounded-lg border px-3 text-sm">
                    <Field label="Destination">scalepods.co/blog/{open.blogSlug}</Field>
                    <Field label="Category">{categoryFor(open)}</Field>
                    <Field label="CTA banner">Dark variant</Field>
                    <Field label="Target date">{fmtDate(open.targetDate)}</Field>
                  </div>
                </TabsContent>
                <TabsContent value="performance" className="pt-2">
                  {open.metrics ? (
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <Card className="py-3"><CardContent className="px-4"><p className="text-xs text-muted-foreground">Views</p><p className="text-lg font-semibold">{compact(open.metrics.views ?? 0)}</p></CardContent></Card>
                      <Card className="py-3"><CardContent className="px-4"><p className="text-xs text-muted-foreground">CTA clicks</p><p className="text-lg font-semibold">{open.metrics.clicks}</p></CardContent></Card>
                      <Card className="py-3"><CardContent className="px-4"><p className="text-xs text-muted-foreground">Shares</p><p className="text-lg font-semibold">{open.metrics.shares}</p></CardContent></Card>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not published yet, so there is nothing to measure.</p>
                  )}
                </TabsContent>
              </Tabs>
              <DialogFooter>
                {open.status === "published" ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatus(open.id, "draft");
                      toast.info("Unpublished", { description: "DELETE /api/blog/publish would be called; simulated here." });
                    }}
                  >
                    Unpublish
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setStatus(open.id, "published");
                      toast.success("Published to scalepods.co (simulated)");
                    }}
                  >
                    Publish
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
