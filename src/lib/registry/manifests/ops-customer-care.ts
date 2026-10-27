import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "ops-customer-care",
  name: "Customer Care",
  pod: "operations",
  description: "AI support inbox, order lifecycle WhatsApp automation, carrier tracking, review interception and SLA monitoring",
  icon: "Headset",
  basePath: "/operations/customer-care",
  nav: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Support Inbox", path: "/inbox" },
    { label: "Order Lifecycle", path: "/order-lifecycle" },
    { label: "Carrier Tracking", path: "/carrier-tracking" },
    { label: "Review Engine", path: "/reviews" },
    { label: "SLA Dashboard", path: "/sla" },
    { label: "Knowledge Base", path: "/knowledge-base" },
    { label: "Analytics", path: "/analytics" },
  ],
  requiredPlan: "basic",
  permissions: ["ops.read", "ops.write"],
  dashboardWidgets: ["ops.open-conversations", "ops.negative-sentiment"],
  featureFlags: [],
  status: "basic",
};
