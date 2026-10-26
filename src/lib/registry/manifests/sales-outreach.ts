import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "sales-outreach",
  name: "Outreach",
  pod: "sales",
  description: "Multi-step email + WhatsApp sequences with AI personalisation",
  icon: "Send",
  basePath: "/sales/outreach",
  nav: [
    { label: "Sequences", path: "/sequences" },
    { label: "Enrollments", path: "/enrollments" },
  ],
  requiredPlan: "growth",
  permissions: ["sales.read", "sales.write", "agents.manage"],
  dashboardWidgets: ["sales.meetings-booked"],
  featureFlags: [],
  status: "full",
};
