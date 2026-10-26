import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  context?: string;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
  trendGood?: boolean; // whether "up" is good (default true)
  icon?: React.ReactNode;
}

export function KpiCard({
  label,
  value,
  context,
  trend,
  trendValue,
  trendGood = true,
  icon,
}: KpiCardProps) {
  const isPositive = trend === "up" ? trendGood : trend === "down" ? !trendGood : null;

  return (
    <Card className="gap-2 py-4">
      <CardContent className="px-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {trend && trendValue && (
            <span
              className={cn(
                "flex items-center gap-0.5 text-xs font-medium",
                isPositive === true && "text-success",
                isPositive === false && "text-destructive",
                isPositive === null && "text-muted-foreground"
              )}
            >
              {trend === "up" && <ArrowUpRight className="size-3" />}
              {trend === "down" && <ArrowDownRight className="size-3" />}
              {trend === "flat" && <Minus className="size-3" />}
              {trendValue}
            </span>
          )}
        </div>
        {context && (
          <p className="mt-1 text-xs text-muted-foreground">{context}</p>
        )}
      </CardContent>
    </Card>
  );
}
