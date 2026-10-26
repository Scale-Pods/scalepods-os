import { Sparkles, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DemoAdapterBadge({ className }: { className?: string }) {
  return (
    <Badge variant="outline" className={cn("gap-1 text-[10px] text-muted-foreground", className)}>
      <FlaskConical className="size-2.5" />
      Demo adapter
    </Badge>
  );
}

export function AiGeneratedBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn("gap-1 bg-accent/15 text-accent text-[10px] hover:bg-accent/15", className)}
    >
      <Sparkles className="size-2.5" />
      AI generated
    </Badge>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-success/15 text-success",
    running: "bg-success/15 text-success",
    open: "bg-primary/15 text-primary",
    pending: "bg-warning/15 text-warning",
    pending_approval: "bg-warning/15 text-warning",
    idle: "bg-muted text-muted-foreground",
    resolved: "bg-success/15 text-success",
    escalated: "bg-destructive/15 text-destructive",
    overdue: "bg-destructive/15 text-destructive",
    failed: "bg-destructive/15 text-destructive",
    draft: "bg-muted text-muted-foreground",
    approved: "bg-success/15 text-success",
    rejected: "bg-destructive/15 text-destructive",
    scheduled: "bg-primary/15 text-primary",
    paused: "bg-warning/15 text-warning",
    completed: "bg-primary/15 text-primary",
    replied: "bg-success/15 text-success",
    unsubscribed: "bg-destructive/15 text-destructive",
    "auto-send": "bg-success/15 text-success",
    approval: "bg-warning/15 text-warning",
    lead: "bg-primary/15 text-primary",
    customer: "bg-success/15 text-success",
    candidate: "bg-accent/15 text-accent",
    client_contact: "bg-muted text-muted-foreground",
    meeting_booked: "bg-success/15 text-success",
    handed_to_human: "bg-primary/15 text-primary",
    low_confidence_handoff: "bg-warning/15 text-warning",
    qualified_nurture: "bg-accent/15 text-accent",
    won: "bg-success/15 text-success",
    lost: "bg-destructive/15 text-destructive",
  };
  return (
    <Badge variant="outline" className={cn("border-0 text-[11px] capitalize", map[status] ?? "bg-muted text-muted-foreground")}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
