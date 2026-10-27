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
      "ops-receivables",
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
      "sales-outreach-system",
      "marketing-content-os",
      "ops-customer-care",
      "ops-receivables",
    ],
  },
];

export const MEMBERS: Member[] = [
  { id: "mem-1", orgId: "org-staffing-co", name: "Aisha Khan", email: "aisha@demostaffing.co", role: "owner" },
  { id: "mem-2", orgId: "org-staffing-co", name: "Rohan Mehta", email: "rohan@demostaffing.co", role: "manager" },
  { id: "mem-3", orgId: "org-staffing-co", name: "Priya Nair", email: "priya@demostaffing.co", role: "member" },
  { id: "mem-4", orgId: "org-demo-realty", name: "Omar Al Farsi", email: "omar@demorealty.ae", role: "owner" },
  { id: "mem-5", orgId: "org-demo-realty", name: "Lina Haddad", email: "lina@demorealty.ae", role: "manager" },
];

export const CURRENT_USER = {
  id: "mem-1",
  name: "Aisha Khan",
  email: "aisha@demostaffing.co",
  role: "owner" as const,
};

export function getOrg(id: string) {
  return ORGS.find((o) => o.id === id);
}

export const DEFAULT_ORG_ID = "org-staffing-co";
