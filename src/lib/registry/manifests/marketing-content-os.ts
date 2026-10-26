import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "marketing-content-os",
  name: "Content OS",
  pod: "marketing",
  description: "AI content drafts, maker-checker approval, content calendar",
  icon: "Megaphone",
  basePath: "/marketing/content-os",
  nav: [
    { label: "Drafts", path: "/drafts" },
    { label: "Calendar", path: "/calendar" },
    { label: "Analytics", path: "/analytics" },
    { label: "Brand Profile", path: "/brand-profile" },
  ],
  requiredPlan: "basic",
  permissions: ["marketing.read", "marketing.write"],
  dashboardWidgets: ["marketing.content-awaiting-review"],
  featureFlags: [],
  status: "basic",
};
