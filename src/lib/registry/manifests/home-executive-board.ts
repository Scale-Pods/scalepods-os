import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "home-executive-board",
  name: "Executive Board",
  pod: "home",
  description: "Founder view: pipeline value, hiring, response time, receivables, AI spend",
  icon: "Presentation",
  basePath: "/home/executive-board",
  nav: [],
  requiredPlan: "growth",
  permissions: ["exec.read"],
  dashboardWidgets: [],
  featureFlags: [],
  status: "full",
};
