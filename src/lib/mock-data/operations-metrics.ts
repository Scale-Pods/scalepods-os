import type { DashboardMetric } from "@/lib/mock-data/dashboard-metrics";
import { MOCK_CONVERSATIONS, MOCK_INVOICES } from "@/lib/mock-data/operations";

/**
 * Mock values for the Operations Pod's dashboard widgets, in the same
 * {value, context, trend, trendValue} shape used by
 * src/lib/mock-data/dashboard-metrics.ts (which the Master Dashboard reads
 * from). Numbers here are kept internally consistent with the mock
 * conversations and invoices in src/lib/mock-data/operations.ts.
 */

const openConversations = MOCK_CONVERSATIONS.filter(
  (c) => c.status === "open" || c.status === "pending"
).length;

const negativeFlags = MOCK_CONVERSATIONS.filter((c) => c.sentimentFlag === "negative").length;

const overdueInvoices = MOCK_INVOICES.filter((i) => i.status === "overdue");
const outstandingInvoices = MOCK_INVOICES.filter((i) => i.status === "overdue" || i.status === "sent");

const avgDaysOverdue = overdueInvoices.length
  ? Math.round(
      overdueInvoices.reduce((sum, i) => sum + (i.daysOverdue ?? 0), 0) / overdueInvoices.length
    )
  : 0;

function toUsd(amountMinor: number, currency: "INR" | "USD" | "AED") {
  const rates: Record<string, number> = { USD: 1, INR: 1 / 83, AED: 1 / 3.67 };
  return (amountMinor / 100) * rates[currency];
}

const outstandingUsd = Math.round(
  outstandingInvoices.reduce((sum, i) => sum + toUsd(i.amountMinor, i.currency), 0)
);

export const OPERATIONS_METRICS: Record<string, DashboardMetric> = {
  "ops.open-conversations": {
    label: "Open conversations",
    value: String(openConversations),
    context: "Across WhatsApp, email, web chat",
    trend: "down",
    trendValue: "-5",
    trendGood: true,
    icon: "MessagesSquare",
  },
  "ops.negative-sentiment": {
    label: "Negative sentiment flags",
    value: String(negativeFlags),
    context: "Intercepted in last 7 days",
    trend: "down",
    trendValue: "-2",
    trendGood: true,
    icon: "AlertTriangle",
  },
  "ops.outstanding-amount": {
    label: "Outstanding amount",
    value: `$${(outstandingUsd / 1000).toFixed(1)}K`,
    context: `${outstandingInvoices.length} open invoices`,
    trend: "down",
    trendValue: "-6.1%",
    trendGood: true,
    icon: "Wallet",
  },
  "ops.overdue-count": {
    label: "Overdue invoices",
    value: String(overdueInvoices.length),
    context: `Avg. ${avgDaysOverdue} days overdue`,
    trend: "up",
    trendValue: "+2",
    trendGood: false,
    icon: "ReceiptText",
  },
};
