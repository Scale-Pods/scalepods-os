import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "sales-crm",
  name: "Leads & CRM",
  pod: "sales",
  description: "Contacts, companies, deals pipeline, activities",
  icon: "Contact",
  basePath: "/sales/crm",
  nav: [
    { label: "Contacts", path: "/contacts" },
    { label: "Companies", path: "/companies" },
    { label: "Deals", path: "/deals" },
    { label: "Analytics", path: "/analytics" },
  ],
  requiredPlan: "free",
  permissions: ["sales.read", "sales.write"],
  dashboardWidgets: ["sales.new-leads", "sales.pipeline-value", "sales.qualified-leads"],
  featureFlags: [],
  status: "full",
};
