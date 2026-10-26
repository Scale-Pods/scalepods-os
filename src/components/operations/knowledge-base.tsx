"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  FileText,
  Link2,
  FileType,
  Upload,
  Search,
  Database,
  CloudUpload,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge, DemoAdapterBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { KbCoverageSummary } from "@/components/operations/kb-coverage";
import { formatRelative } from "@/lib/format";
import { MOCK_KB_DOCUMENTS, type KbDocument } from "@/lib/mock-data/operations";

const TYPE_ICON: Record<KbDocument["type"], React.ElementType> = {
  PDF: FileText,
  DOCX: FileType,
  URL: Link2,
};

export function KnowledgeBasePage() {
  const [search, setSearch] = React.useState("");
  const [docs, setDocs] = React.useState(MOCK_KB_DOCUMENTS);
  const [open, setOpen] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const filtered = docs.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  function simulateUpload() {
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 20 + 10;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDocs((d) => [
              {
                id: `kb-${Date.now()}`,
                name: "Client FAQ — New Upload.pdf",
                type: "PDF",
                chunkCount: Math.floor(Math.random() * 80) + 20,
                lastUpdated: new Date().toISOString(),
                status: "indexed",
              },
              ...d,
            ]);
            setUploading(false);
            setOpen(false);
            toast.success("Document indexed", {
              description: "Embeddings generated — the AI auto-reply agent can now use this document.",
            });
          }, 400);
          return 100;
        }
        return next;
      });
    }, 350);
  }

  return (
    <>
      <PageHeader
        title="Knowledge Base"
        description="Documents the AI auto-reply agent references when answering customers."
        actions={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setUploading(false); setProgress(0); } }}>
            <DialogTrigger asChild>
              <Button className="gap-1.5">
                <Upload className="size-4" />
                Upload document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload a knowledge base document</DialogTitle>
                <DialogDescription>
                  PDF, DOCX or a URL to crawl. It will be chunked and embedded for retrieval.
                </DialogDescription>
              </DialogHeader>
              {!uploading ? (
                <button
                  onClick={simulateUpload}
                  className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/40"
                >
                  <CloudUpload className="size-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to simulate a drag &amp; drop upload</p>
                  <p className="text-xs text-muted-foreground">PDF, DOCX up to 20MB, or paste a URL</p>
                </button>
              ) : (
                <div className="space-y-3 rounded-lg border p-4">
                  <p className="text-sm font-medium">
                    {progress < 100 ? "Processing... generating embeddings" : "Done!"}
                  </p>
                  <Progress value={progress} />
                  <p className="text-xs text-muted-foreground">
                    Chunking document and writing vectors to pgvector (simulated in this demo).
                  </p>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={uploading}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="mb-4 border-accent/20 bg-accent/5">
        <CardContent className="flex items-start gap-3 px-4 py-3">
          <Database className="mt-0.5 size-4 shrink-0 text-accent" />
          <div className="flex-1">
            <p className="text-sm">
              This knowledge base powers the AI auto-reply agent via retrieval-augmented generation —
              documents are chunked and embedded (pgvector) so the agent can ground replies in your
              actual FAQs, policies and brochures.
            </p>
            <div className="mt-1.5">
              <DemoAdapterBadge />
              <span className="ml-1.5 text-xs text-muted-foreground">
                Embeddings pipeline is simulated in this demo — no real vectors are generated.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <KbCoverageSummary />

      <div className="relative mb-3 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 pl-8 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents found"
          description="Try a different search term, or upload a new document."
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Chunks</TableHead>
                <TableHead>Last updated</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => {
                const Icon = TYPE_ICON[d.type];
                return (
                  <TableRow key={d.id}>
                    <TableCell className="flex items-center gap-2 font-medium">
                      <Icon className="size-3.5 text-muted-foreground" />
                      {d.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{d.type}</TableCell>
                    <TableCell className="text-muted-foreground">{d.chunkCount}</TableCell>
                    <TableCell className="text-muted-foreground">{formatRelative(d.lastUpdated)}</TableCell>
                    <TableCell>
                      <StatusBadge status={d.status === "indexed" ? "resolved" : "pending"} />
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        {d.status === "indexed" ? "Indexed" : "Processing"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
