import type { Approval, AuditLogEntry } from "@/lib/types/core";

/** Small deterministic PRNG so the seeded cost values never cause a
 * hydration mismatch between server and client render. */
function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const auditRand = mulberry32(88442);

/** Reference instant the mock audit log is generated relative to. Computed
 * once at module load (not during a component render body), so it stays
 * stable for the lifetime of the process. */
const AUDIT_LOG_EPOCH = Date.now();

export const MOCK_APPROVALS: Approval[] = [
  {
    id: "appr-1",
    orgId: "org-staffing-co",
    appId: "hr-recruit",
    agentType: "outreach",
    title: "Interview invite — Priya Nair",
    description: "AI drafted an interview invite with a Google Calendar booking link for the Senior QA Engineer role.",
    payload: {},
    status: "pending",
    createdAt: new Date(AUDIT_LOG_EPOCH - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "appr-2",
    orgId: "org-staffing-co",
    appId: "sales-outreach",
    agentType: "sequence_step",
    title: "Follow-up #2 — Orbit Fintech",
    description: "Step 2 of 'Enterprise Cold Outreach' sequence is ready to send via email.",
    payload: {},
    status: "pending",
    createdAt: new Date(AUDIT_LOG_EPOCH - 1000 * 60 * 40).toISOString(),
  },
  {
    id: "appr-3",
    orgId: "org-staffing-co",
    appId: "ops-receivables",
    agentType: "payment_reminder",
    title: "Overdue reminder — Vertex Retail Group",
    description: "Escalated-tone reminder for invoice INV-2049 ($4,200, 18 days overdue).",
    payload: {},
    status: "pending",
    createdAt: new Date(AUDIT_LOG_EPOCH - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "appr-4",
    orgId: "org-staffing-co",
    appId: "marketing-content-os",
    agentType: "content_draft",
    title: "LinkedIn post — 'Hiring in 2026'",
    description: "Draft ready for review before scheduling.",
    payload: {},
    status: "pending",
    createdAt: new Date(AUDIT_LOG_EPOCH - 1000 * 60 * 150).toISOString(),
  },
];

/** Model + coarse agent-type bucket per AI actor, used to derive spend-by-model and
 * spend-by-agent-type analytics (Settings → AI). Agent-type ids match AGENT_TYPES
 * in src/components/settings/ai-settings.tsx. */
const AGENT_PROFILES: Record<string, { model: string; agentType: string }> = {
  "Lead Response Agent": { model: "Claude Sonnet", agentType: "lead-response" },
  "CV Screening Agent": { model: "Claude Haiku", agentType: "candidate-outreach" },
  "Outreach Agent": { model: "GPT-4o mini", agentType: "candidate-outreach" },
  "Sequence Personalisation": { model: "Claude Haiku", agentType: "candidate-outreach" },
  "Auto-Reply Agent": { model: "Gemini Flash", agentType: "lead-response" },
  "Payment Reminder Agent": { model: "Claude Sonnet", agentType: "payment-reminders" },
  "Content Draft Agent": { model: "Claude Sonnet", agentType: "content-drafts" },
};

const STAFFING_ACTORS = [
  { type: "agent" as const, name: "Lead Response Agent" },
  { type: "agent" as const, name: "CV Screening Agent" },
  { type: "agent" as const, name: "Outreach Agent" },
  { type: "agent" as const, name: "Sequence Personalisation" },
  { type: "agent" as const, name: "Auto-Reply Agent" },
  { type: "agent" as const, name: "Payment Reminder Agent" },
  { type: "user" as const, name: "Aisha Khan" },
  { type: "user" as const, name: "Rohan Mehta" },
  { type: "user" as const, name: "Priya Nair" },
];

const STAFFING_ACTIONS = [
  "sent WhatsApp reply",
  "scored candidate fit",
  "drafted outreach email",
  "moved stage to Shortlisted",
  "approved content draft",
  "sent payment reminder",
  "booked interview",
  "flagged negative sentiment",
  "replied to inbound lead",
  "scheduled follow-up sequence",
];

const REALTY_ACTORS = [
  { type: "agent" as const, name: "Lead Response Agent" },
  { type: "agent" as const, name: "Auto-Reply Agent" },
  { type: "agent" as const, name: "Content Draft Agent" },
  { type: "user" as const, name: "Omar Al Farsi" },
  { type: "user" as const, name: "Lina Haddad" },
];

const REALTY_ACTIONS = [
  "sent WhatsApp reply",
  "drafted listing description",
  "replied to inbound lead",
  "moved stage to Viewing scheduled",
  "approved content draft",
  "flagged negative sentiment",
];

function buildAuditLog(
  orgId: string,
  actors: typeof STAFFING_ACTORS,
  actions: string[],
  count: number,
  idPrefix: string
): AuditLogEntry[] {
  return Array.from({ length: count }, (_, i) => {
    const actor = actors[i % actors.length];
    const action = actions[i % actions.length];
    const profile = AGENT_PROFILES[actor.name];
    return {
      id: `audit-${idPrefix}-${i + 1}`,
      orgId,
      actorType: actor.type,
      actorName: actor.name,
      action,
      targetType: i % 2 === 0 ? "contact" : "deal",
      targetId: `contact-${(i % 150) + 1}`,
      costUsd: actor.type === "agent" ? Number((auditRand() * 0.08).toFixed(4)) : undefined,
      model: actor.type === "agent" ? profile?.model : undefined,
      agentType: actor.type === "agent" ? profile?.agentType : undefined,
      createdAt: new Date(AUDIT_LOG_EPOCH - i * 1000 * 60 * 23).toISOString(),
    };
  });
}

export const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  ...buildAuditLog("org-staffing-co", STAFFING_ACTORS, STAFFING_ACTIONS, 40, "sc"),
  ...buildAuditLog("org-demo-realty", REALTY_ACTORS, REALTY_ACTIONS, 24, "re"),
];

/* ------------------------------------------------------------------ */
/* Audit log analytics                                                 */
/* ------------------------------------------------------------------ */

export interface SpendByModel {
  model: string;
  spendUsd: number;
}

export const MOCK_SPEND_BY_MODEL: SpendByModel[] = (() => {
  const totals = new Map<string, number>();
  for (const entry of MOCK_AUDIT_LOG) {
    if (!entry.model || !entry.costUsd) continue;
    totals.set(entry.model, (totals.get(entry.model) ?? 0) + entry.costUsd);
  }
  return Array.from(totals.entries())
    .map(([model, spendUsd]) => ({ model, spendUsd: Math.round(spendUsd * 10000) / 10000 }))
    .sort((a, b) => b.spendUsd - a.spendUsd);
})();

export interface SpendByAgentType {
  agentType: string;
  label: string;
  spendUsd: number;
}

const AGENT_TYPE_LABEL: Record<string, string> = {
  "lead-response": "Lead Response",
  "candidate-outreach": "Candidate Outreach",
  "payment-reminders": "Payment Reminders",
  "content-drafts": "Content Drafts",
};

export const MOCK_SPEND_BY_AGENT_TYPE: SpendByAgentType[] = (() => {
  const totals = new Map<string, number>();
  for (const entry of MOCK_AUDIT_LOG) {
    if (!entry.agentType || !entry.costUsd) continue;
    totals.set(entry.agentType, (totals.get(entry.agentType) ?? 0) + entry.costUsd);
  }
  return Array.from(totals.entries())
    .map(([agentType, spendUsd]) => ({
      agentType,
      label: AGENT_TYPE_LABEL[agentType] ?? agentType,
      spendUsd: Math.round(spendUsd * 10000) / 10000,
    }))
    .sort((a, b) => b.spendUsd - a.spendUsd);
})();

const DAY_MS = 86400000;

function dayLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export interface ActionsPerDayPoint {
  day: string;
  isoDate: string;
  count: number;
}

/** Actions-per-day trend, last 14 days. Bucketed from MOCK_AUDIT_LOG's actual createdAt
 * timestamps where available, padded with a deterministic mock baseline for days the
 * generated log (which only spans a few hours) doesn't cover — so the chart reads as a
 * full two-week trend. */
export const MOCK_ACTIONS_PER_DAY: ActionsPerDayPoint[] = (() => {
  const recentCounts = new Map<string, number>();
  for (const entry of MOCK_AUDIT_LOG) {
    const key = new Date(entry.createdAt).toDateString();
    recentCounts.set(key, (recentCounts.get(key) ?? 0) + 1);
  }
  return Array.from({ length: 14 }, (_, i) => {
    const daysAgo = 13 - i;
    const date = new Date(AUDIT_LOG_EPOCH - daysAgo * DAY_MS);
    const key = date.toDateString();
    const actual = recentCounts.get(key);
    const baseline = 8 + Math.round(auditRand() * 12);
    return {
      day: dayLabel(date),
      isoDate: date.toISOString(),
      count: actual ?? baseline,
    };
  });
})();

export interface ActorTypeSplit {
  actorType: "agent" | "user";
  label: string;
  count: number;
}

export const MOCK_ACTOR_TYPE_SPLIT: ActorTypeSplit[] = (["agent", "user"] as const).map((actorType) => ({
  actorType,
  label: actorType === "agent" ? "AI agent" : "Human",
  count: MOCK_AUDIT_LOG.filter((e) => e.actorType === actorType).length,
}));

/* ------------------------------------------------------------------ */
/* Billing — usage over time                                           */
/* ------------------------------------------------------------------ */

export interface UsagePerDayPoint {
  day: string;
  isoDate: string;
  aiActions: number;
  outboundMessages: number;
}

/** AI actions + outbound messages per day, last 30 days — deterministic mock series with a
 * gentle upward trend (usage ramping as agents take on more work through the month). */
export const MOCK_USAGE_PER_DAY: UsagePerDayPoint[] = Array.from({ length: 30 }, (_, i) => {
  const daysAgo = 29 - i;
  const date = new Date(AUDIT_LOG_EPOCH - daysAgo * DAY_MS);
  const progress = i / 29;
  const aiActions = Math.round(12 + progress * 18 + auditRand() * 8);
  const outboundMessages = Math.round(8 + progress * 14 + auditRand() * 6);
  return {
    day: dayLabel(date),
    isoDate: date.toISOString(),
    aiActions,
    outboundMessages,
  };
});
