import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "custom-studio-inventory-intel",
  name: "Inventory Intel",
  pod: "operations",
  description: "Multi-channel stock intelligence: SKUs, warehouses, ABC analysis, purchase orders, movements and alerts",
  icon: "Boxes",
  basePath: "/operations/inventory",
  nav: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "SKU Table", path: "/skus" },
    { label: "Channel View", path: "/channels" },
    { label: "Warehouses", path: "/warehouses" },
    { label: "ABC Analysis", path: "/abc" },
    {
      label: "Procurement",
      path: "/procurement",
      children: [
        { label: "Purchase Orders", path: "/procurement/orders" },
        { label: "Suppliers", path: "/procurement/suppliers" },
      ],
    },
    { label: "Movements", path: "/movements" },
    { label: "Alerts", path: "/alerts" },
    { label: "Bundle Kits", path: "/bundles" },
  ],
  requiredPlan: "enterprise",
  permissions: ["custom.read"],
  dashboardWidgets: ["custom.low-stock-count"],
  featureFlags: [],
  status: "full",
};
