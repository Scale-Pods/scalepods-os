import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "custom-studio-inventory-intel",
  name: "Inventory Intel",
  pod: "custom",
  description: "Example client-specific module: SKUs, stock levels, low-stock alerts",
  icon: "Blocks",
  basePath: "/custom/inventory-intel",
  nav: [{ label: "Inventory", path: "/inventory" }],
  requiredPlan: "enterprise",
  permissions: ["custom.read"],
  dashboardWidgets: ["custom.low-stock-count"],
  featureFlags: [],
  status: "scaffold",
  badge: "Demo adapter",
};
