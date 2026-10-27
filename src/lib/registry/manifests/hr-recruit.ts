import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "hr-recruit",
  name: "Recruit",
  pod: "hr",
  description: "Hiring campaigns, AI resume scoring, multi-round interviews, reschedules and offer letters",
  icon: "Users",
  basePath: "/hr/recruit",
  nav: [
    { label: "Dashboard", path: "/dashboard" },
    {
      label: "Campaigns",
      path: "/campaigns",
      children: [
        { label: "All Campaigns", path: "/campaigns" },
        { label: "Create Campaign", path: "/campaigns/new" },
      ],
    },
    { label: "Interview Center", path: "/interviews" },
    { label: "Kanban", path: "/kanban" },
    { label: "Offer Letter", path: "/offer-letter" },
    { label: "Users", path: "/users" },
  ],
  requiredPlan: "basic",
  permissions: ["hr.read", "hr.write"],
  dashboardWidgets: [
    "hr.open-roles",
    "hr.candidates-in-pipeline",
    "hr.avg-fit-score",
    "hr.time-to-shortlist",
    "hr.interviews-this-week",
  ],
  featureFlags: ["staffing_mode"],
  status: "full",
};
