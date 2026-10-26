import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STAGE_LABELS, type CandidateStage } from "@/lib/mock-data/hr";

const STAGE_COLORS: Record<CandidateStage, string> = {
  sourced: "bg-muted text-muted-foreground",
  screened: "bg-primary/15 text-primary",
  shortlisted: "bg-accent/15 text-accent",
  interview: "bg-warning/15 text-warning",
  offer: "bg-primary/15 text-primary",
  hired: "bg-success/15 text-success",
  rejected: "bg-destructive/15 text-destructive",
};

export function StageBadge({ stage, className }: { stage: CandidateStage; className?: string }) {
  return (
    <Badge variant="outline" className={cn("border-0 text-[11px]", STAGE_COLORS[stage], className)}>
      {STAGE_LABELS[stage]}
    </Badge>
  );
}
