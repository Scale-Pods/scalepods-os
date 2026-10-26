import { cn } from "@/lib/utils";

function scoreColor(score: number) {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
}

function scoreBarColor(score: number) {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-warning";
  return "bg-destructive";
}

export function FitScoreBar({ score, className }: { score: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full", scoreBarColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("text-xs font-semibold tabular-nums", scoreColor(score))}>{score}</span>
    </div>
  );
}

export function FitScoreBadge({ score, className }: { score: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums",
        score >= 80 && "bg-success/15 text-success",
        score >= 60 && score < 80 && "bg-warning/15 text-warning",
        score < 60 && "bg-destructive/15 text-destructive",
        className
      )}
    >
      {score}
    </span>
  );
}
