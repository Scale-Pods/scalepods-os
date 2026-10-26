"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileSignature, Download } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/lib/format";
import { format } from "date-fns";

interface GenerateOfferDialogProps {
  candidateName?: string;
  jobTitle?: string;
  compMinor?: number;
  currency?: "INR" | "USD";
  startDate?: string;
  trigger?: React.ReactNode;
}

export function GenerateOfferDialog({
  candidateName = "the candidate",
  jobTitle = "the role",
  compMinor = 220000000,
  currency = "INR",
  startDate,
  trigger,
}: GenerateOfferDialogProps) {
  const [open, setOpen] = useState(false);
  const [defaultStart] = useState(() => new Date(Date.now() + 21 * 86400000).toISOString());
  const resolvedStart = startDate ?? defaultStart;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" className="gap-1.5">
            <FileSignature className="size-3.5" />
            Generate offer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Offer letter preview</DialogTitle>
          <DialogDescription>
            Generated from the standard template plus the approved compensation band.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 rounded-lg border bg-muted/30 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Candidate</span>
            <span className="font-medium">{candidateName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Role</span>
            <span className="font-medium">{jobTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Annual compensation</span>
            <span className="font-medium">{formatMoney(compMinor, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Proposed start date</span>
            <span className="font-medium">{format(new Date(resolvedStart), "MMM d, yyyy")}</span>
          </div>
          <Separator />
          <p className="text-muted-foreground">
            Dear {candidateName}, we are delighted to offer you the position of {jobTitle}. This letter outlines
            the terms of your employment, including compensation, start date and benefits. Please review and
            respond within 7 days of receipt...
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => toast.success("PDF exported (demo)", { description: "The offer letter PDF has been generated." })}
          >
            <Download className="size-3.5" />
            Export PDF
          </Button>
          <Button
            onClick={() => {
              toast.success("Offer sent", { description: `${candidateName} will receive the offer by email.` });
              setOpen(false);
            }}
          >
            Send offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
