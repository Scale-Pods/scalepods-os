"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  SKUS, abcClass, daysCover, monthlyRevenue, stockStatus, totalStock, type AbcClass,
} from "@/lib/mock-data/inventory";
import { ChartCard, BarRow, StockPill, inrCompact, num } from "./shared";
import { SkuDetailDialog } from "./sku-detail-dialog";

const CLASSES: { cls: AbcClass; accent: string; text: string; desc: string }[] = [
  { cls: "A", accent: "border-t-success", text: "text-success", desc: "High-value SKUs driving most revenue. Prioritise availability and monitor daily." },
  { cls: "B", accent: "border-t-warning", text: "text-warning", desc: "Mid-tier SKUs. Review weekly and hold 45 days of safety stock." },
  { cls: "C", accent: "border-t-muted-foreground", text: "text-muted-foreground", desc: "Low-value or slow-moving SKUs. Minimise overstock; bundle or promote to liquidate." },
];

export function AbcAnalysisPage() {
  const [skuId, setSkuId] = React.useState<string | null>(null);
  const totalRev = SKUS.reduce((a, s) => a + monthlyRevenue(s), 0);
  const sorted = [...SKUS].sort((a, b) => monthlyRevenue(b) - monthlyRevenue(a));
  const pareto = sorted.slice(0, 12).map((s, i) => ({
    s,
    pct: (sorted.slice(0, i + 1).reduce((a, x) => a + monthlyRevenue(x), 0) / totalRev) * 100,
  }));

  return (
    <>
      <PageHeader title="ABC Analysis" description="SKUs classified by monthly revenue: A at 150K or more, B at 50K or more, C below." />
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        {CLASSES.map(({ cls, accent, text, desc }) => {
          const group = SKUS.filter((s) => abcClass(s) === cls).sort((a, b) => monthlyRevenue(b) - monthlyRevenue(a));
          const rev = group.reduce((a, s) => a + monthlyRevenue(s), 0);
          return (
            <Card key={cls} className={`gap-3 border-t-4 py-4 ${accent}`}>
              <CardContent className="space-y-3 px-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-2xl font-bold ${text}`}>Class {cls}</p>
                    <p className="text-xs text-muted-foreground">{group.length} SKUs · {((rev / totalRev) * 100).toFixed(1)}% of revenue</p>
                  </div>
                  <span className="text-sm font-semibold">{inrCompact(rev)}/mo</span>
                </div>
                <p className="text-xs text-muted-foreground">{desc}</p>
                <div className="max-h-80 space-y-1.5 overflow-y-auto">
                  {group.map((s) => (
                    <button key={s.id} type="button" onClick={() => setSkuId(s.id)} className="w-full rounded-lg bg-muted/40 p-2 text-left hover:bg-muted">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="truncate font-medium">{s.name}</span>
                        <StockPill status={stockStatus(s)} />
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{num(s.avgMonthlySales)}/mo · {inrCompact(monthlyRevenue(s))} · {num(totalStock(s))} units · {daysCover(s) >= 999 ? "no sales" : `${daysCover(s)}d cover`}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <ChartCard title="Revenue concentration" description="Top 12 SKUs by monthly revenue with cumulative share">
        <div className="space-y-1.5">
          {pareto.map(({ s, pct }) => (
            <BarRow key={s.id} label={s.name} value={monthlyRevenue(s)} max={monthlyRevenue(sorted[0])} display={`${inrCompact(monthlyRevenue(s))} · ${pct.toFixed(0)}% cum.`} onClick={() => setSkuId(s.id)} />
          ))}
        </div>
      </ChartCard>
      <SkuDetailDialog skuId={skuId} onClose={() => setSkuId(null)} />
    </>
  );
}
