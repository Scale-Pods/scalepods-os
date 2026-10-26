"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AiGeneratedBadge } from "@/components/shared/badges";
import type { Job } from "@/lib/mock-data/hr";

interface InterviewQuestionsDialogProps {
  candidateName: string;
  job?: Job;
}

function buildQuestions(job?: Job) {
  const skills = job?.aiExtracted.skills ?? ["core skills"];
  return [
    `Walk us through a project where you used ${skills[0]} and ${skills[1] ?? skills[0]} together to solve a hard problem.`,
    `What's the most challenging ${job?.department.toLowerCase() ?? "technical"} decision you've made in the last year, and how did it play out?`,
    `How would you approach ramping up on ${job?.title ?? "this role"} in your first 30 days?`,
    "Tell us about a time you disagreed with a stakeholder's decision. How did you handle it?",
    `Given the experience band for this role (${job ? `${job.aiExtracted.experienceMin}-${job.aiExtracted.experienceMax} yrs` : "mid-senior"}), where do you feel strongest and where would you need the most support?`,
  ];
}

export function InterviewQuestionsDialog({ candidateName, job }: InterviewQuestionsDialogProps) {
  const [open, setOpen] = useState(false);
  const questions = useMemo(() => buildQuestions(job), [job]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Sparkles className="size-3.5" />
          Generate questions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Interview guide
            <AiGeneratedBadge />
          </DialogTitle>
          <DialogDescription>
            Role- and candidate-specific questions for {candidateName}, applying for {job?.title ?? "this role"}.
          </DialogDescription>
        </DialogHeader>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Suggested questions</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            {questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        </div>

        <Separator />

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Scorecard template</p>
          <div className="space-y-2 text-sm">
            {["Technical depth", "Problem solving", "Communication", "Culture fit"].map((row) => (
              <div key={row} className="flex items-center justify-between rounded-md border px-3 py-2">
                <span>{row}</span>
                <span className="text-xs text-muted-foreground">Rate 1-5</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
