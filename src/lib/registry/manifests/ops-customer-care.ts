import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "ops-customer-care",
  name: "Customer Care",
  pod: "operations",
  description: "Unified inbox for WhatsApp, email and web chat with AI-suggested replies",
  icon: "Headset",
  basePath: "/operations/customer-care",
  nav: [
    { label: "Inbox", path: "/inbox" },
    { label: "Knowledge Base", path: "/knowledge-base" },
    { label: "Analytics", path: "/analytics" },
  ],
  requiredPlan: "basic",
  permissions: ["ops.read", "ops.write"],
  dashboardWidgets: ["ops.open-conversations", "ops.negative-sentiment"],
  featureFlags: [],
  status: "basic",
};
