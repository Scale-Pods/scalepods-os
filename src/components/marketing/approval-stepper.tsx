import { Check, FileEdit, Eye, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTENT_STAGES, type ContentStatus } from "@/lib/mock-data/marketing";

const STAGE_META: Record<ContentStatus, { label: string; icon: typeof FileEdit }> = {
  draft: { label: "Draft", icon: FileEdit },
  review: { label: "Review", icon: Eye },
  approved: { label: "Approved", icon: Check },
  scheduled: { label: "Scheduled", icon: CalendarClock },
};

export function ApprovalStepper({
  current,
  rejected = false,
  className,
}: {
  current: ContentStatus;
  rejected?: boolean;
  className?: string;
}) {
  const currentIndex = CONTENT_STAGES.indexOf(current);

  return (
    <div className={cn("flex items-center", className)}>
      {CONTENT_STAGES.map((stage, i) => {
        const meta = STAGE_META[stage];
        const Icon = meta.icon;
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isLast = i === CONTENT_STAGES.length - 1;

        return (
          <div key={stage} className="flex flex-1 items-center last:flex-initial">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                  isDone && "border-success bg-success/15 text-success",
                  isCurrent && !rejected && "border-primary bg-primary/15 text-primary",
                  isCurrent && rejected && "border-destructive bg-destructive/15 text-destructive",
                  !isDone && !isCurrent && "border-border bg-muted text-muted-foreground"
                )}
              >
                <Icon className="size-3.5" />
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  (isDone || isCurrent) ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {meta.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1 rounded-full",
                  isDone ? "bg-success" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
