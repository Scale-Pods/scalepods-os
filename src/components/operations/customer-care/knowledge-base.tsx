"use client";

import * as React from "react";
import { BookOpen, Bot, FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/badges";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { CC_CASES, CC_KB_ARTICLES, CC_TOPIC_BREAKDOWN, ccFmtDate } from "@/lib/mock-data/customer-care";
import { Bar, Field, Pill } from "./shared";

export function KnowledgeBasePage() {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("all");
  const [openId, setOpenId] = React.useState<string | null>(null);
  const cats = [...new Set(CC_KB_ARTICLES.map((a) => a.category))];
  const rows = CC_KB_ARTICLES.filter((a) => (cat === "all" || a.category === cat) && (!q.trim() || a.title.toLowerCase().includes(q.toLowerCase()) || a.summary.toLowerCase().includes(q.toLowerCase())));
  const art = CC_KB_ARTICLES.find((a) => a.id === openId) ?? null;
  const covered = CC_TOPIC_BREAKDOWN.filter((t) => CC_KB_ARTICLES.some((a) => a.linkedTopics.includes(t.topic) && a.status !== "draft"));
  const coveredCases = CC_CASES.filter((c) => covered.some((t) => t.topic === c.topic)).length;
  const coveragePct = Math.round((coveredCases / CC_CASES.length) * 100);
  const totalCites = CC_KB_ARTICLES.reduce((s, a) => s + a.aiCitations, 0);

  return (
    <>
      <PageHeader title="Knowledge Base" description="Articles the AI agent cites when answering customers." />
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Articles" value={String(CC_KB_ARTICLES.length)} context={`${CC_KB_ARTICLES.filter((a) => a.status === "published").length} published`} icon={<BookOpen className="size-4" />} />
        <KpiCard label="AI citations" value={totalCites.toLocaleString("en-IN")} context="Answers grounded in KB" icon={<Bot className="size-4" />} />
        <KpiCard label="Case coverage" value={`${coveragePct}%`} context={`${coveredCases} of ${CC_CASES.length} cases map to a live article`} icon={<FileText className="size-4" />} />
      </div>

      <div className="mt-4">
        <ListToolbar searchValue={q} onSearchChange={setQ} placeholder="Search articles...">
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {cats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </ListToolbar>
        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead>
                <TableHead className="text-right">Views</TableHead><TableHead className="text-right">AI cites</TableHead>
                <TableHead className="text-right">Helpful</TableHead><TableHead className="text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((a) => (
                <TableRow key={a.id} className="cursor-pointer" onClick={() => setOpenId(a.id)}>
                  <TableCell><div className="font-medium">{a.title}</div><div className="text-xs text-muted-foreground">{a.summary}</div></TableCell>
                  <TableCell className="text-xs">{a.category}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell className="text-right">{a.views.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right">{a.aiCitations}</TableCell>
                  <TableCell className="text-right">{a.status === "draft" ? "-" : `${a.helpfulPct}%`}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">{ccFmtDate(a.updatedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {art && (
        <Dialog open onOpenChange={(o) => !o && setOpenId(null)}>
          <DialogContent className={DETAIL_DIALOG_CLASS}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">{art.title} <StatusBadge status={art.status} /></DialogTitle>
              <DialogDescription>{art.category} · by {art.author} · updated {ccFmtDate(art.updatedAt)}</DialogDescription>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">{art.summary}</p>
            <div className="space-y-2 rounded-lg border p-4 text-sm">
              {art.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Views">{art.views.toLocaleString("en-IN")}</Field>
              <Field label="AI citations">{art.aiCitations}</Field>
              <Field label="Helpful">{art.status === "draft" ? "-" : `${art.helpfulPct}%`}</Field>
            </div>
            {art.status !== "draft" && <Bar pct={art.helpfulPct} tone={art.helpfulPct >= 85 ? "green" : "orange"} />}
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Answers these case topics</p>
              <div className="flex flex-wrap gap-1.5">
                {art.linkedTopics.map((t) => <Pill key={t} tone="blue">{t} ({CC_CASES.filter((c) => c.topic === t).length})</Pill>)}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
