import { HR_DASHBOARD_METRICS } from "@/lib/mock-data/hr-metrics";
import { SALES_METRICS } from "@/lib/mock-data/sales-metrics";
import { MARKETING_DASHBOARD_METRICS } from "@/lib/mock-data/marketing-metrics";
import { OPERATIONS_METRICS } from "@/lib/mock-data/operations-metrics";
import { CUSTOM_METRICS } from "@/lib/mock-data/custom-metrics";

export interface DashboardMetric {
  label: string;
  value: string;
  context: string;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
  trendGood?: boolean;
  icon: string;
}

/**
 * Baseline label/icon per widget id, with value/context/trend overridden
 * below by each pod's own metrics file — those are derived live from the
 * same mock data each pod's screens render, so dashboard tiles always
 * agree with the numbers shown inside the app itself.
 */
const BASE_METRICS: Record<string, DashboardMetric> = {
  "hr.open-roles": {
    label: "Open roles",
    value: "14",
    context: "4 added this week",
    trend: "up",
    trendValue: "+4",
    icon: "Briefcase",
  },
  "hr.candidates-in-pipeline": {
    label: "Candidates in pipeline",
    value: "286",
    context: "Across 14 active roles",
    trend: "up",
    trendValue: "+32",
    icon: "Users",
  },
  "hr.avg-fit-score": {
    label: "Avg. fit score",
    value: "76",
    context: "Out of 100, last 30 days",
    trend: "up",
    trendValue: "+3 pts",
    icon: "Gauge",
  },
  "hr.time-to-shortlist": {
    label: "Time to shortlist",
    value: "1.8 days",
    context: "From application to shortlist",
    trend: "down",
    trendValue: "-0.4d",
    trendGood: true,
    icon: "Timer",
  },
  "hr.interviews-this-week": {
    label: "Interviews this week",
    value: "23",
    context: "9 scheduled, 14 completed",
    trend: "up",
    trendValue: "+6",
    icon: "CalendarCheck",
  },
  "sales.new-leads": {
    label: "New leads",
    value: "142",
    context: "Last 30 days",
    trend: "up",
    trendValue: "+18%",
    icon: "UserPlus",
  },
  "sales.pipeline-value": {
    label: "Pipeline value",
    value: "$486K",
    context: "58 open deals",
    trend: "up",
    trendValue: "+9.2%",
    icon: "TrendingUp",
  },
  "sales.qualified-leads": {
    label: "Qualified leads",
    value: "97",
    context: "68% of new leads",
    trend: "up",
    trendValue: "+11",
    icon: "BadgeCheck",
  },
  "sales.median-response-time": {
    label: "Median response time",
    value: "42s",
    context: "Inbound leads, last 7 days",
    trend: "down",
    trendValue: "-8s",
    trendGood: true,
    icon: "Zap",
  },
  "sales.meetings-booked": {
    label: "Meetings booked",
    value: "34",
    context: "Via Outreach sequences",
    trend: "up",
    trendValue: "+6",
    icon: "CalendarClock",
  },
  "marketing.content-awaiting-review": {
    label: "Content awaiting review",
    value: "7",
    context: "3 LinkedIn, 2 Instagram, 2 blog",
    trend: "flat",
    trendValue: "0",
    icon: "FileClock",
  },
  "ops.open-conversations": {
    label: "Open conversations",
    value: "31",
    context: "Across WhatsApp, email, web chat",
    trend: "down",
    trendValue: "-5",
    trendGood: true,
    icon: "MessagesSquare",
  },
  "ops.negative-sentiment": {
    label: "Negative sentiment flags",
    value: "4",
    context: "Intercepted in last 7 days",
    trend: "down",
    trendValue: "-2",
    trendGood: true,
    icon: "AlertTriangle",
  },
  "ops.outstanding-amount": {
    label: "Outstanding amount",
    value: "$58.4K",
    context: "26 open invoices",
    trend: "down",
    trendValue: "-6.1%",
    trendGood: true,
    icon: "Wallet",
  },
  "ops.overdue-count": {
    label: "Overdue invoices",
    value: "9",
    context: "Avg. 14 days overdue",
    trend: "up",
    trendValue: "+2",
    trendGood: false,
    icon: "ReceiptText",
  },
  "custom.low-stock-count": {
    label: "Low-stock SKUs",
    value: "12",
    context: "Below reorder threshold",
    trend: "up",
    trendValue: "+3",
    trendGood: false,
    icon: "PackageSearch",
  },
};

const DERIVED_SOURCES: Record<
  string,
  { value: string; context: string; trend?: "up" | "down" | "flat"; trendValue?: string }
>[] = [HR_DASHBOARD_METRICS, SALES_METRICS, MARKETING_DASHBOARD_METRICS, OPERATIONS_METRICS, CUSTOM_METRICS];

function buildDashboardMetrics(): Record<string, DashboardMetric> {
  const merged: Record<string, DashboardMetric> = { ...BASE_METRICS };
  for (const source of DERIVED_SOURCES) {
    for (const [id, derived] of Object.entries(source)) {
      merged[id] = { ...merged[id], ...derived };
    }
  }
  return merged;
}

export const DASHBOARD_METRICS: Record<string, DashboardMetric> = buildDashboardMetrics();
