import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "sales-rep-activity",
  name: "Rep Activity",
  pod: "sales",
  description: "Calls, emails and meetings per rep; response-time leaderboard",
  icon: "Activity",
  basePath: "/sales/rep-activity",
  nav: [{ label: "Leaderboard", path: "/leaderboard" }],
  requiredPlan: "basic",
  permissions: ["sales.read"],
  dashboardWidgets: [],
  featureFlags: [],
  status: "full",
};
