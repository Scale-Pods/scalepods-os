import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
      <p className="text-lg font-semibold tracking-tight">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

interface UsageCardProps {
  title: string;
  stats: { label: string; value: string }[];
  usagePct: number;
  usageLabel: string;
}

export function UsageCard({ title, stats, usagePct, usageLabel }: UsageCardProps) {
  const barColor =
    usagePct >= 90 ? "bg-destructive" : usagePct >= 60 ? "bg-warning" : "bg-success";

  return (
    <Card>
      <CardContent className="px-4 py-4">
        <h3 className="mb-3 text-sm font-semibold">{title}</h3>
        <div className="grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <StatBox key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${usagePct}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {usageLabel} — {usagePct}% used
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
