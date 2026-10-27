import { Check, FileEdit, Eye, CalendarClock, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTENT_STAGES, STATUS_LABEL, type ContentStatus } from "@/lib/mock-data/marketing";

const ICON: Record<string, typeof FileEdit> = {
  draft: FileEdit,
  review: Eye,
  approved: Check,
  scheduled: CalendarClock,
  published: Send,
};

export function ApprovalStepper({ current, className }: { current: ContentStatus; className?: string }) {
  const sentBack = current === "sent_back";
  const effective: ContentStatus = sentBack ? "review" : current;
  const currentIndex = CONTENT_STAGES.indexOf(effective);
  return (
    <div className={cn("flex items-center", className)}>
      {CONTENT_STAGES.map((stage, i) => {
        const Icon = ICON[stage];
        const isDone = i < currentIndex || (i === currentIndex && stage === "published");
        const isCurrent = i === currentIndex && !isDone;
        const isLast = i === CONTENT_STAGES.length - 1;
        const bad = isCurrent && sentBack;
        return (
          <div key={stage} className="flex flex-1 items-center last:flex-initial">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                  isDone && "border-success bg-success/15 text-success",
                  isCurrent && !bad && "border-primary bg-primary/15 text-primary",
                  bad && "border-destructive bg-destructive/15 text-destructive",
                  !isDone && !isCurrent && "border-border bg-muted text-muted-foreground"
                )}
              >
                <Icon className="size-3.5" />
              </div>
              <span className={cn("text-xs font-medium", isDone || isCurrent ? "text-foreground" : "text-muted-foreground")}>
                {bad ? "Sent back" : stage === "review" ? "Review" : STATUS_LABEL[stage]}
              </span>
            </div>
            {!isLast && <div className={cn("mx-2 h-0.5 flex-1 rounded-full", isDone ? "bg-success" : "bg-border")} />}
          </div>
        );
      })}
    </div>
  );
}
