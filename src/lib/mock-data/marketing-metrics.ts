import { MOCK_CONTENT_DRAFTS, PLATFORM_LABEL } from "@/lib/mock-data/marketing";

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
  .map(([platform, count]) => `${count} ${PLATFORM_LABEL[platform as keyof typeof PLATFORM_LABEL]}`)
  .join(", ");

/**
 * Mock value for the "marketing.content-awaiting-review" dashboard widget,
 * consumed by the Master Dashboard (src/lib/registry/dashboard-widgets.tsx).
 * Derived from the same MOCK_CONTENT_DRAFTS the Content OS screens render
 * ("review" status = waiting on a checker), so it always matches the
 * Dashboard / Drafts / Review pages.
 */
export const MARKETING_DASHBOARD_METRICS: Record<string, MarketingMetric> = {
  "marketing.content-awaiting-review": {
    value: String(awaitingReview.length),
    context: contextParts || "No drafts awaiting review",
    trend: "flat",
    trendValue: "0",
  },
};
