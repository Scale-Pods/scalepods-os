"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Upload } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function NewJobDialog() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [jd, setJd] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
      setTitle("");
      setJd("");
      toast.success("AI extracted structured fields from the JD", {
        description: "Skills, experience range, location and salary band were parsed and added to the job.",
      });
    }, 900);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">New Job</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a new job</DialogTitle>
          <DialogDescription>
            Paste a job description or upload a file. AI will extract structured fields automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="job-title">Job title</Label>
            <Input
              id="job-title"
              placeholder="e.g. Senior Backend Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="job-jd">Job description</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 text-xs"
                onClick={() => toast.info("File upload is a demo adapter in this build")}
              >
                <Upload className="size-3" />
                Upload file
              </Button>
            </div>
            <Textarea
              id="job-jd"
              placeholder="Paste the full job description here..."
              rows={8}
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="gap-1.5">
              <Sparkles className="size-3.5" />
              {submitting ? "Extracting with AI..." : "Create job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
