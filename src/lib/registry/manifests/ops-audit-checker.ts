import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "ops-audit-checker",
  name: "Audit Checker",
  pod: "operations",
  description: "Purchase and sales document reconciliation with scoring, approve / reject workflow and analytics",
  icon: "ClipboardCheck",
  basePath: "/operations/audit-checker",
  nav: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Purchase Audit", path: "/purchase" },
    {
      label: "Sales Audit",
      path: "/sales",
      children: [
        { label: "Invoice vs Sheet", path: "/sales/ledger" },
        { label: "Quick Check", path: "/sales/quick-check" },
      ],
    },
    { label: "History", path: "/history" },
    { label: "Analytics", path: "/analytics" },
    { label: "Users", path: "/users" },
  ],
  requiredPlan: "free",
  permissions: ["ops.read", "ops.write"],
  dashboardWidgets: [],
  featureFlags: [],
  status: "full",
};
