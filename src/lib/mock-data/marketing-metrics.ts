import { MOCK_CONTENT_DRAFTS } from "@/lib/mock-data/marketing";

export interface MarketingMetric {
  value: string;
  context: string;
  trend: "up" | "down" | "flat";
  trendValue: string;
}

const awaitingReview = MOCK_CONTENT_DRAFTS.filter((d) => d.status === "review");
const byPlatform = awaitingReview.reduce<Record<string, number>>((acc, d) => {
  acc[d.platform] = (acc[d.platform] ?? 0) + 1;
  return acc;
}, {});

const contextParts = Object.entries(byPlatform)
  .map(([platform, count]) => `${count} ${platform === "linkedin" ? "LinkedIn" : platform === "instagram" ? "Instagram" : "Blog"}`)
  .join(", ");

/**
 * Mock value for the "marketing.content-awaiting-review" dashboard widget,
 * consumed by the Master Dashboard (src/lib/registry/dashboard-widgets.tsx).
 * Shape matches DashboardMetric's {value, context, trend, trendValue}.
 * Numbers are derived from the same MOCK_CONTENT_DRAFTS the Content OS
 * screens render, so they always match what's shown in Drafts/Calendar.
 */
export const MARKETING_DASHBOARD_METRICS: Record<string, MarketingMetric> = {
  "marketing.content-awaiting-review": {
    value: String(awaitingReview.length),
    context: contextParts || "No drafts awaiting review",
    trend: "flat",
    trendValue: "0",
  },
};
