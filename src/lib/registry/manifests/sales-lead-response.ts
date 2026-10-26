import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "sales-lead-response",
  name: "Lead Response",
  pod: "sales",
  description: "Instant AI reply to inbound leads across channels",
  icon: "Zap",
  basePath: "/sales/lead-response",
  nav: [
    { label: "Live Feed", path: "/feed" },
    { label: "Agent Settings", path: "/settings" },
  ],
  requiredPlan: "basic",
  permissions: ["sales.read", "sales.write", "agents.manage"],
  dashboardWidgets: ["sales.median-response-time"],
  featureFlags: [],
  status: "full",
};
