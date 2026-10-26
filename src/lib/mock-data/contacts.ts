import type { Contact, Company } from "@/lib/types/core";

const FIRST = [
  "Aarav", "Vivian", "Noah", "Fatima", "Liam", "Sara", "Mateo", "Zara",
  "Ethan", "Priya", "Omar", "Maya", "Rohan", "Lena", "Yusuf", "Ananya",
  "Kabir", "Nora", "Arjun", "Hana", "Dev", "Layla", "Karan", "Mira",
];
const LAST = [
  "Shah", "Khan", "Patel", "Haddad", "Mehta", "Al Farsi", "Nair", "Rossi",
  "Kumar", "Hassan", "Singh", "Qureshi", "Verma", "Saleh", "Chopra", "Reddy",
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seededRandom(42);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

export const MOCK_COMPANIES: Company[] = [
  { id: "co-1", orgId: "org-staffing-co", name: "Nimbus Logistics", domain: "nimbuslogistics.com", industry: "Logistics", size: "200-500" },
  { id: "co-2", orgId: "org-staffing-co", name: "Orbit Fintech", domain: "orbitfintech.io", industry: "Fintech", size: "50-200" },
  { id: "co-3", orgId: "org-staffing-co", name: "Vertex Retail Group", domain: "vertexretail.com", industry: "Retail", size: "500-1000" },
  { id: "co-4", orgId: "org-staffing-co", name: "Solara Energy", domain: "solaraenergy.com", industry: "Energy", size: "200-500" },
  { id: "co-5", orgId: "org-staffing-co", name: "Pinnacle Health", domain: "pinnaclehealth.in", industry: "Healthcare", size: "1000+" },
  { id: "co-6", orgId: "org-demo-realty", name: "Marina Towers Developers", domain: "marinatowers.ae", industry: "Real Estate", size: "50-200" },
  { id: "co-7", orgId: "org-demo-realty", name: "Palm Residences", domain: "palmresidences.ae", industry: "Real Estate", size: "10-50" },
];

export const MOCK_CONTACTS: Contact[] = Array.from({ length: 180 }, (_, i) => {
  const isStaffing = i < 150;
  const orgId = isStaffing ? "org-staffing-co" : "org-demo-realty";
  const type = isStaffing
    ? (i % 3 === 0 ? "candidate" : i % 3 === 1 ? "lead" : "client_contact")
    : "lead";
  const first = pick(FIRST);
  const last = pick(LAST);
  const name = `${first} ${last}`;
  const companies = isStaffing
    ? MOCK_COMPANIES.filter((c) => c.orgId === "org-staffing-co")
    : MOCK_COMPANIES.filter((c) => c.orgId === "org-demo-realty");
  const company = pick(companies);
  const daysAgo = Math.floor(rand() * 90);
  const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();

  return {
    id: `contact-${i + 1}`,
    orgId,
    type: type as Contact["type"],
    name,
    email: `${first.toLowerCase()}.${last.toLowerCase().replace(/\s/g, "")}@example.com`,
    phone: `+${isStaffing ? 91 : 971} ${Math.floor(600000000 + rand() * 300000000)}`,
    companyId: company.id,
    tags: isStaffing
      ? [pick(["urgent", "referral", "inbound", "sourced"])]
      : [pick(["hot", "warm", "cold", "inbound"])],
    createdAt,
    updatedAt: createdAt,
    source: pick(["Website", "WhatsApp", "LinkedIn", "Referral", "Email", "Walk-in"]),
    location: isStaffing ? pick(["Mumbai", "Bengaluru", "Delhi NCR", "Pune", "Hyderabad"]) : pick(["Dubai Marina", "Downtown Dubai", "Palm Jumeirah", "JBR"]),
  };
});

export function getCompany(id?: string) {
  return MOCK_COMPANIES.find((c) => c.id === id);
}

export function contactsByOrg(orgId: string) {
  return MOCK_CONTACTS.filter((c) => c.orgId === orgId);
}
