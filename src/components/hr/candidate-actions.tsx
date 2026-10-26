"use client";

import { toast } from "sonner";
import { Mail, CalendarClock, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CandidateActions({ candidateName }: { candidateName: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="gap-1.5"
        onClick={() =>
          toast.success("AI-drafted outreach queued for approval", {
            description: `A personalised invite for ${candidateName} is waiting in Approvals.`,
          })
        }
      >
        <Mail className="size-3.5" />
        Send outreach
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="gap-1.5"
        onClick={() =>
          toast.success("Interview slots sent", {
            description: `${candidateName} will receive available Google Calendar slots.`,
          })
        }
      >
        <CalendarClock className="size-3.5" />
        Schedule interview
      </Button>
      <Button
        size="sm"
        className="gap-1.5"
        onClick={() =>
          toast.success("Offer draft generated", {
            description: `A compensation offer draft for ${candidateName} is ready to review.`,
          })
        }
      >
        <FileSignature className="size-3.5" />
        Generate offer
      </Button>
    </div>
  );
}
