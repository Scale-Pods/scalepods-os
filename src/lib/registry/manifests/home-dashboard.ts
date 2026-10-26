import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "home-dashboard",
  name: "Master Dashboard",
  pod: "home",
  description: "All apps combined — one view of your whole workspace",
  icon: "LayoutDashboard",
  basePath: "/home/dashboard",
  nav: [],
  requiredPlan: "free",
  permissions: [],
  dashboardWidgets: [],
  featureFlags: [],
  status: "full",
};
