import type { Organization, Member } from "@/lib/types/core";

export const ORGS: Organization[] = [
  {
    id: "org-staffing-co",
    name: "Demo Staffing Co",
    slug: "demo-staffing-co",
    plan: "growth",
    industryTemplate: "staffing",
    region: "india",
    installedApps: [
      "home-dashboard",
      "home-executive-board",
      "hr-recruit",
      "sales-outreach-system",
      "marketing-content-os",
      "ops-customer-care",
      "ops-receivables",
      "ops-audit-checker",
      "custom-studio-inventory-intel",
    ],
  },
  {
    id: "org-demo-realty",
    name: "Demo Realty",
    slug: "demo-realty",
    plan: "basic",
    industryTemplate: "realty",
    region: "uae",
    installedApps: [
      "home-dashboard",
      "home-executive-board",
      "hr-recruit",
      "sales-outreach-system",
      "marketing-content-os",
      "ops-customer-care",
      "ops-receivables",
      "ops-audit-checker",
      "custom-studio-inventory-intel",
    ],
  },
];

export const MEMBERS: Member[] = [
  { id: "mem-1", orgId: "org-staffing-co", name: "Raunak", email: "raunak@scalepods.co" },
  { id: "mem-2", orgId: "org-staffing-co", name: "Adnan", email: "adnan@scalepods.co" },
  { id: "mem-4", orgId: "org-demo-realty", name: "Raunak", email: "raunak@scalepods.co" },
  { id: "mem-5", orgId: "org-demo-realty", name: "Adnan", email: "adnan@scalepods.co" },
];

export const CURRENT_USER = {
  id: "mem-1",
  name: "Raunak",
  email: "raunak@scalepods.co",
};

export function getOrg(id: string) {
  return ORGS.find((o) => o.id === id);
}

export const DEFAULT_ORG_ID = "org-staffing-co";
