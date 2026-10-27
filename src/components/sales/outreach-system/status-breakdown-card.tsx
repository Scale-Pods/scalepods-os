import { Card, CardContent } from "@/components/ui/card";
import type { BreakdownSlice } from "@/lib/mock-data/sales";

const SEGMENT_COLORS = ["var(--success)", "var(--warning)", "var(--destructive)", "var(--muted-foreground)"];

export function StatusBreakdownCard({ title, data }: { title: string; data: BreakdownSlice[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardContent className="px-4 py-4">
        <h3 className="mb-3 text-sm font-semibold">{title}</h3>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
          {data.map((d, i) => (
            <div
              key={d.label}
              style={{
                width: `${total ? (d.value / total) * 100 : 0}%`,
                backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
              }}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
          {data.map((d, i) => (
            <span key={d.label} className="flex items-center gap-1.5 text-xs">
              <span
                className="size-2 shrink-0 rounded-sm"
                style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
              />
              <span className="text-muted-foreground">{d.label}</span>
              <span className="font-medium">{d.value}</span>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
