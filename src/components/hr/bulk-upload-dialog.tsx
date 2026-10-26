"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UploadCloud, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function BulkUploadDialog() {
  const [open, setOpen] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  function startParsing() {
    setParsing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 18 + 8;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setParsing(false);
            setOpen(false);
            setProgress(0);
            toast.success("Parsed 20 CVs", {
              description: "AI extracted candidate profiles, de-duplicated against existing contacts, and scored fit for the selected job.",
            });
          }, 300);
          return 100;
        }
        return next;
      });
    }, 350);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !parsing && setOpen(v)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Bulk upload CVs</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk upload CVs</DialogTitle>
          <DialogDescription>
            Drop PDF or DOCX resumes. AI will parse each one into a structured profile and score fit against your open roles.
          </DialogDescription>
        </DialogHeader>

        {!parsing ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              startParsing();
            }}
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors",
              dragOver ? "border-primary bg-primary/5" : "border-border"
            )}
          >
            <UploadCloud className="mb-2 size-7 text-muted-foreground" />
            <p className="text-sm font-medium">Drag and drop CVs here</p>
            <p className="mt-1 text-xs text-muted-foreground">or click browse to select files (PDF, DOCX)</p>
            <Button size="sm" variant="outline" className="mt-4" onClick={startParsing}>
              Browse files
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
            <Sparkles className="size-6 animate-pulse text-primary" />
            <p className="text-sm font-medium">Parsing 20 CVs...</p>
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-muted-foreground">Extracting skills, experience and scoring fit against open roles</p>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" disabled={parsing} onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
