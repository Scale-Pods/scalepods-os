import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "hr-recruit",
  name: "Recruit",
  pod: "hr",
  description: "Jobs, candidates, AI screening and ranking, outreach, interviews, offers",
  icon: "Users",
  basePath: "/hr/recruit",
  nav: [
    { label: "Jobs", path: "/jobs" },
    { label: "Candidates", path: "/candidates" },
    { label: "Pipeline", path: "/pipeline" },
    { label: "Analytics", path: "/analytics" },
    { label: "Interviews", path: "/interviews" },
    { label: "Offers", path: "/offers" },
    { label: "Clients", path: "/clients" },
    { label: "Requisitions", path: "/requisitions" },
    { label: "Submissions", path: "/submissions" },
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
