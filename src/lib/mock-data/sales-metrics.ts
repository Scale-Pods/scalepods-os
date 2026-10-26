/**
 * Mock values for the Sales Pod's dashboardWidgets ids (declared in
 * src/lib/registry/manifests/sales-*.ts). Shape matches what the Master
 * Dashboard expects: {value, context, trend, trendValue}.
 *
 * Mirrors the same ids already present in dashboard-metrics.ts so either
 * file can be read by dashboard tiles without drift.
 */
export interface SalesMetric {
  value: string;
  context: string;
  trend: "up" | "down" | "flat";
  trendValue: string;
}

export const SALES_METRICS: Record<string, SalesMetric> = {
  "sales.new-leads": {
    value: "142",
    context: "Last 30 days",
    trend: "up",
    trendValue: "+18%",
  },
  "sales.pipeline-value": {
    value: "$486K",
    context: "58 open deals",
    trend: "up",
    trendValue: "+9.2%",
  },
  "sales.qualified-leads": {
    value: "97",
    context: "68% of new leads",
    trend: "up",
    trendValue: "+11",
  },
  "sales.median-response-time": {
    value: "42s",
    context: "Inbound leads, last 7 days",
    trend: "down",
    trendValue: "-8s",
  },
  "sales.meetings-booked": {
    value: "34",
    context: "Via Outreach sequences",
    trend: "up",
    trendValue: "+6",
  },
};
