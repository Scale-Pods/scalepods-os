import type { DashboardMetric } from "@/lib/mock-data/dashboard-metrics";
import { MOCK_INVENTORY } from "@/lib/mock-data/custom";

const lowStockCount = MOCK_INVENTORY.filter((i) => i.status === "low-stock").length;
const outOfStockCount = MOCK_INVENTORY.filter((i) => i.status === "out-of-stock").length;

/**
 * Mock value for the Custom Studio's dashboard widget, in the same
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
