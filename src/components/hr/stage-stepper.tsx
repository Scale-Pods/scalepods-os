import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGE_LABELS, STAGE_ORDER, type CandidateStage } from "@/lib/mock-data/hr";

export function StageStepper({ stage }: { stage: CandidateStage }) {
  const isTerminalRejected = stage === "rejected";
  const activeSteps = STAGE_ORDER.filter((s) => s !== "rejected");
  const currentIndex = isTerminalRejected ? activeSteps.length - 1 : activeSteps.indexOf(stage);

  return (
    <div className="flex items-center overflow-x-auto">
      {activeSteps.map((step, i) => {
        const done = i < currentIndex || (i === currentIndex && !isTerminalRejected);
        const isCurrent = i === currentIndex;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border text-[10px] font-medium",
                  done && !isTerminalRejected && "border-primary bg-primary text-primary-foreground",
                  isCurrent && isTerminalRejected && "border-destructive bg-destructive text-destructive-foreground",
                  !done && !isCurrent && "border-border text-muted-foreground"
                )}
              >
                {done && !isTerminalRejected ? <Check className="size-3" /> : i + 1}
              </div>
              <span
                className={cn(
                  "whitespace-nowrap text-[11px]",
                  isCurrent ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {isCurrent && isTerminalRejected ? STAGE_LABELS.rejected : STAGE_LABELS[step]}
              </span>
            </div>
            {i < activeSteps.length - 1 && (
              <div className={cn("mx-2 h-px w-8 shrink-0", done ? "bg-primary" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
