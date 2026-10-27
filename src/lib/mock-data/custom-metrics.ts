import type { DashboardMetric } from "@/lib/mock-data/dashboard-metrics";
import { INV_TOTALS } from "@/lib/mock-data/inventory";

const lowStockCount = INV_TOTALS.counts["Low Stock"] + INV_TOTALS.counts.Critical;
const outOfStockCount = INV_TOTALS.counts["Out of Stock"];

/**
 * Dashboard widget for Inventory Intel, in the same
 * {value, context, trend, trendValue} shape as dashboard-metrics.ts.
 */
export const CUSTOM_METRICS: Record<string, DashboardMetric> = {
  "custom.low-stock-count": {
    label: "Low-stock SKUs",
    value: String(lowStockCount),
    context: `${outOfStockCount} out of stock, below reorder threshold`,
    trend: "up",
    trendValue: `+${Math.max(1, lowStockCount - 2)}`,
    trendGood: false,
    icon: "PackageSearch",
  },
};
