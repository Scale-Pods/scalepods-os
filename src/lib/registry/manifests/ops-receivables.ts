import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "ops-receivables",
  name: "Receivables Recovery",
  pod: "operations",
  description: "Invoices, overdue tracking, AI reminder sequences",
  icon: "ReceiptText",
  basePath: "/operations/receivables",
  nav: [
    { label: "Invoices", path: "/invoices" },
    { label: "Reminder Sequences", path: "/sequences" },
  ],
  requiredPlan: "basic",
  permissions: ["ops.read", "ops.write"],
  dashboardWidgets: ["ops.outstanding-amount", "ops.overdue-count"],
  featureFlags: [],
  status: "basic",
};
