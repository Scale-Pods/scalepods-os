import { MOCK_CONTACTS, MOCK_COMPANIES, getCompany } from "@/lib/mock-data/contacts";
import { MEMBERS } from "@/lib/mock-data/orgs";
import type { Activity, Message, MessageChannel } from "@/lib/types/core";

// ---------------------------------------------------------------------------
// Deals / pipeline
// ---------------------------------------------------------------------------

export type DealStage =
  | "new"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export const DEAL_STAGES: { id: DealStage; label: string }[] = [
  { id: "new", label: "New" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];

export interface Deal {
  id: string;
  orgId: string;
  title: string;
  companyId?: string;
  contactId?: string;
  valueMinor: number;
  currency: "INR" | "USD" | "AED";
  stage: DealStage;
  ownerId: string;
  expectedCloseDate: string;
  createdAt: string;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seededRandom(7);
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

const staffingContacts = MOCK_CONTACTS.filter((c) => c.orgId === "org-staffing-co");
const staffingReps = MEMBERS.filter((m) => m.orgId === "org-staffing-co");
const staffingCompanies = MOCK_COMPANIES.filter((c) => c.orgId === "org-staffing-co");

const DEAL_TITLES = [
  "Bulk staffing contract",
  "Contract-to-hire program",
  "Payroll outsourcing deal",
  "Executive search retainer",
  "Seasonal workforce ramp-up",
  "Warehouse staffing renewal",
  "IT contractor bench deal",
  "RPO pilot engagement",
  "Night-shift staffing expansion",
  "Annual staffing MSA",
  "Temp-to-perm pipeline deal",
  "Multi-site staffing rollout",
  "Finance team augmentation",
  "Healthcare staffing contract",
  "Logistics workforce deal",
  "Retail seasonal hiring",
  "Customer support outsourcing",
  "Field sales staffing deal",
  "Back-office support contract",
  "Compliance staffing program",
  "Expansion hiring — Pune site",
  "Expansion hiring — Bengaluru site",
  "Graduate hiring program",
  "Contractor renewal — Orbit Fintech",
  "New client onboarding deal",
];

const DEAL_STAGE_WEIGHTS: DealStage[] = [
  "new", "new", "new", "new",
  "qualified", "qualified", "qualified",
  "proposal", "proposal", "proposal",
  "negotiation", "negotiation",
  "won", "won", "won",
  "lost",
];

export const MOCK_DEALS: Deal[] = DEAL_TITLES.map((title, i) => {
  const contact = pick(staffingContacts);
  const company = getCompany(contact.companyId) ?? pick(staffingCompanies);
  const owner = pick(staffingReps);
  const stage = DEAL_STAGE_WEIGHTS[i % DEAL_STAGE_WEIGHTS.length];
  const daysOut = Math.floor(rand() * 60) - 10;
  const valueMinor = Math.round((15000 + rand() * 185000) * 100);
  const createdDaysAgo = Math.floor(rand() * 75);

  return {
    id: `deal-${i + 1}`,
    orgId: "org-staffing-co",
    title,
    companyId: company?.id,
    contactId: contact.id,
    valueMinor,
    currency: "INR",
    stage,
    ownerId: owner.id,
    expectedCloseDate: new Date(Date.now() + daysOut * 86400000).toISOString(),
    createdAt: new Date(Date.now() - createdDaysAgo * 86400000).toISOString(),
  };
});

export function dealsByOrg(orgId: string) {
  return MOCK_DEALS.filter((d) => d.orgId === orgId);
}

// ---------------------------------------------------------------------------
// Contact activity timeline (for CRM contact detail)
// ---------------------------------------------------------------------------

const ACTIVITY_TEMPLATES: { type: Activity["type"]; title: string; description?: string; aiGenerated?: boolean }[] = [
  { type: "ai_action", title: "AI Lead Response agent replied via WhatsApp", description: "Acknowledged inquiry and asked 2 qualification questions.", aiGenerated: true },
  { type: "email", title: "Sent intro email", description: "Shared staffing capability deck and case studies." },
  { type: "call", title: "Discovery call completed", description: "25 min call — discussed headcount needs for Q1." },
  { type: "whatsapp", title: "WhatsApp follow-up sent", description: "Checked in after proposal was shared." },
  { type: "stage_change", title: "Moved to Qualified", description: "Budget and timeline confirmed." },
  { type: "note", title: "Internal note added", description: "Decision maker is the Head of Ops, loop in by Friday." },
  { type: "meeting", title: "Demo meeting scheduled", description: "Booked via AI agent for Thursday 3pm IST." },
  { type: "ai_action", title: "AI drafted personalised follow-up", description: "Pending approval before send.", aiGenerated: true },
];

export function activitiesForContact(contactId: string, orgId: string): Activity[] {
  const count = 5 + Math.floor(seededRandom(contactId.length * 13)() * 4);
  return Array.from({ length: count }, (_, i) => {
    const template = ACTIVITY_TEMPLATES[i % ACTIVITY_TEMPLATES.length];
    const rep = pick(staffingReps);
    return {
      id: `activity-${contactId}-${i + 1}`,
      orgId,
      contactId,
      type: template.type,
      title: template.title,
      description: template.description,
      repId: template.aiGenerated ? undefined : rep?.id,
      createdAt: new Date(Date.now() - (i + 1) * 1000 * 60 * 60 * (6 + i * 3)).toISOString(),
      aiGenerated: template.aiGenerated,
    };
  });
}

// ---------------------------------------------------------------------------
// Lead Response — Live Feed
// ---------------------------------------------------------------------------

export interface LeadResponseEvent {
  id: string;
  orgId: string;
  channel: MessageChannel;
  leadName: string;
  inboundSnippet: string;
  aiReplySnippet: string;
  responseTimeSeconds: number;
  qualificationScore: number;
  outcome: "meeting_booked" | "handed_to_human" | "low_confidence_handoff" | "qualified_nurture";
  createdAt: string;
}

const INBOUND_SNIPPETS = [
  "Hi, I saw your ad — do you handle warehouse staffing in Pune?",
  "Need 15 contract engineers starting next month, can you help?",
  "What's your pricing for RPO services?",
  "Looking for a staffing partner for our Bengaluru office expansion.",
  "Can someone call me back about bulk hiring for the holiday season?",
  "Do you place candidates for night-shift logistics roles?",
  "Interested in your executive search services for a CFO role.",
  "We need temp-to-perm support staff urgently, how fast can you move?",
  "Is there a minimum contract size for your staffing services?",
  "Hello, following up on the LinkedIn post about RPO pilots.",
  "Can you share case studies for healthcare staffing?",
  "We're scaling our support team, what's your onboarding process?",
  "Do you cover compliance staffing for finance roles?",
  "Hi, I filled your web form — when can we talk?",
  "Need urgent backfill for 3 roles that opened this week.",
  "What industries do you specialize in for staffing?",
  "Can your team manage payroll outsourcing for 40 contractors?",
  "Looking to renew our staffing contract, who do I talk to?",
  "Do you have bench strength for IT contractors in Hyderabad?",
  "Interested in a demo of your staffing dashboard.",
];

const AI_REPLY_SNIPPETS = [
  "Yes! We run active staffing programs in Pune. Can I ask how many roles and what timeline you're working with?",
  "Happy to help — to match the right engineers, could you share the tech stack and contract duration?",
  "Our RPO pricing depends on volume and role mix. What's the approximate headcount you're planning?",
  "We'd love to support your Bengaluru expansion. What functions are you hiring for first?",
  "Absolutely, I can get a specialist to call you. What's the best time to reach you today?",
  "We do place for night-shift logistics roles regularly. How many openings do you have?",
  "Great — for executive search, could you share the reporting structure and target start date?",
  "We can move fast on temp-to-perm. How many roles and by what date do you need coverage?",
  "No fixed minimum — we scale with you. What's the initial headcount you're thinking?",
  "Thanks for following up! Are you looking to pilot RPO for a specific department?",
];

const OUTCOMES: LeadResponseEvent["outcome"][] = [
  "meeting_booked", "meeting_booked", "meeting_booked",
  "qualified_nurture", "qualified_nurture",
  "handed_to_human",
  "low_confidence_handoff",
];

const CHANNELS: MessageChannel[] = ["web_chat", "whatsapp", "email"];

const FEED_NAMES = [
  "Aarav Shah", "Fatima Hassan", "Liam Verma", "Zara Khan", "Ethan Nair",
  "Priya Chopra", "Omar Al Farsi", "Maya Reddy", "Rohan Singh", "Lena Saleh",
  "Yusuf Qureshi", "Ananya Mehta", "Kabir Patel", "Nora Haddad", "Arjun Rossi",
  "Hana Kumar", "Dev Hassan", "Layla Shah", "Karan Nair", "Mira Khan",
];

export const MOCK_LEAD_RESPONSE_FEED: LeadResponseEvent[] = FEED_NAMES.map((leadName, i) => {
  const r2 = seededRandom(i * 31 + 5);
  const channel = CHANNELS[i % CHANNELS.length];
  const fast = r2() > 0.3;
  const responseTimeSeconds = fast
    ? 12 + Math.floor(r2() * 45)
    : 65 + Math.floor(r2() * 180);
  const score = 40 + Math.floor(r2() * 58);
  const outcome = OUTCOMES[i % OUTCOMES.length];
  return {
    id: `lrf-${i + 1}`,
    orgId: "org-staffing-co",
    channel,
    leadName,
    inboundSnippet: INBOUND_SNIPPETS[i % INBOUND_SNIPPETS.length],
    aiReplySnippet: AI_REPLY_SNIPPETS[i % AI_REPLY_SNIPPETS.length],
    responseTimeSeconds,
    qualificationScore: score,
    outcome,
    createdAt: new Date(Date.now() - i * 1000 * 60 * 17).toISOString(),
  };
});

// ---------------------------------------------------------------------------
// Outreach — Sequences
// ---------------------------------------------------------------------------

export interface SequenceStep {
  stepNumber: number;
  channel: MessageChannel;
  delayDays: number;
  condition?: string;
  aiPersonalizationNote: string;
}

export interface Sequence {
  id: string;
  orgId: string;
  name: string;
  steps: SequenceStep[];
  enrolledCount: number;
  replyRatePct: number;
  mode: "auto-send" | "approval";
  createdAt: string;
}

export const MOCK_SEQUENCES: Sequence[] = [
  {
    id: "seq-1",
    orgId: "org-staffing-co",
    name: "Enterprise Cold Outreach",
    mode: "approval",
    enrolledCount: 64,
    replyRatePct: 18,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    steps: [
      { stepNumber: 1, channel: "email", delayDays: 0, aiPersonalizationNote: "References company industry and recent hiring news." },
      { stepNumber: 2, channel: "email", delayDays: 3, condition: "if no reply after 3 days", aiPersonalizationNote: "Adds a relevant case study for their sector." },
      { stepNumber: 3, channel: "whatsapp", delayDays: 5, condition: "if no reply after 2 more days", aiPersonalizationNote: "Shorter, casual nudge referencing the earlier email." },
      { stepNumber: 4, channel: "email", delayDays: 9, condition: "if still no reply", aiPersonalizationNote: "Breakup email offering to close the loop." },
    ],
  },
  {
    id: "seq-2",
    orgId: "org-staffing-co",
    name: "Warm Inbound Nurture",
    mode: "auto-send",
    enrolledCount: 112,
    replyRatePct: 34,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    steps: [
      { stepNumber: 1, channel: "whatsapp", delayDays: 0, aiPersonalizationNote: "Thanks the lead and confirms their stated headcount need." },
      { stepNumber: 2, channel: "email", delayDays: 1, aiPersonalizationNote: "Sends capability deck tailored to their industry." },
      { stepNumber: 3, channel: "whatsapp", delayDays: 4, condition: "if no reply after 3 days", aiPersonalizationNote: "Offers a specific meeting slot." },
    ],
  },
  {
    id: "seq-3",
    orgId: "org-staffing-co",
    name: "Client Renewal Reminder",
    mode: "approval",
    enrolledCount: 28,
    replyRatePct: 52,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    steps: [
      { stepNumber: 1, channel: "email", delayDays: 0, aiPersonalizationNote: "References contract end date and past performance metrics." },
      { stepNumber: 2, channel: "whatsapp", delayDays: 4, condition: "if no reply after 4 days", aiPersonalizationNote: "Friendly nudge with renewal deadline." },
    ],
  },
  {
    id: "seq-4",
    orgId: "org-staffing-co",
    name: "Candidate Re-engagement",
    mode: "auto-send",
    enrolledCount: 89,
    replyRatePct: 21,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    steps: [
      { stepNumber: 1, channel: "email", delayDays: 0, aiPersonalizationNote: "Highlights new roles matching their past profile." },
      { stepNumber: 2, channel: "whatsapp", delayDays: 5, condition: "if no reply after 5 days", aiPersonalizationNote: "Asks if they're still open to new opportunities." },
      { stepNumber: 3, channel: "email", delayDays: 10, condition: "if no reply after 5 more days", aiPersonalizationNote: "Final check-in before archiving." },
    ],
  },
  {
    id: "seq-5",
    orgId: "org-staffing-co",
    name: "Event Follow-up — HR Summit",
    mode: "approval",
    enrolledCount: 46,
    replyRatePct: 29,
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    steps: [
      { stepNumber: 1, channel: "email", delayDays: 0, aiPersonalizationNote: "References the specific session they attended." },
      { stepNumber: 2, channel: "whatsapp", delayDays: 2, condition: "if no reply after 2 days", aiPersonalizationNote: "Offers a quick 15-min call." },
      { stepNumber: 3, channel: "email", delayDays: 7, condition: "if no reply after 5 more days", aiPersonalizationNote: "Shares a relevant resource and leaves door open." },
    ],
  },
];

export function sequenceById(id: string) {
  return MOCK_SEQUENCES.find((s) => s.id === id);
}

// ---------------------------------------------------------------------------
// Outreach — Enrollments
// ---------------------------------------------------------------------------

export interface Enrollment {
  id: string;
  orgId: string;
  contactId: string;
  sequenceId: string;
  currentStep: number;
  status: "active" | "paused" | "completed" | "replied" | "unsubscribed";
  enrolledAt: string;
}

const ENROLLMENT_STATUSES: Enrollment["status"][] = [
  "active", "active", "active",
  "replied", "replied",
  "completed",
  "paused",
  "unsubscribed",
];

export const MOCK_ENROLLMENTS: Enrollment[] = Array.from({ length: 30 }, (_, i) => {
  const r3 = seededRandom(i * 17 + 3);
  const contact = staffingContacts[i % staffingContacts.length];
  const sequence = MOCK_SEQUENCES[i % MOCK_SEQUENCES.length];
  const status = ENROLLMENT_STATUSES[i % ENROLLMENT_STATUSES.length];
  const currentStep = 1 + Math.floor(r3() * sequence.steps.length);
  return {
    id: `enr-${i + 1}`,
    orgId: "org-staffing-co",
    contactId: contact.id,
    sequenceId: sequence.id,
    currentStep: Math.min(currentStep, sequence.steps.length),
    status,
    enrolledAt: new Date(Date.now() - Math.floor(r3() * 20) * 86400000).toISOString(),
  };
});

// ---------------------------------------------------------------------------
// Rep Activity
// ---------------------------------------------------------------------------

export interface RepStats {
  memberId: string;
  name: string;
  emailsSent: number;
  whatsappMessages: number;
  callsLogged: number;
  meetingsBooked: number;
  medianResponseTimeSeconds: number;
}

const EXTRA_REPS = [
  { id: "mem-extra-1", name: "Sana Iqbal" },
  { id: "mem-extra-2", name: "Vikram Joshi" },
];

export const MOCK_REP_STATS: RepStats[] = [
  ...staffingReps.map((m, i) => {
    const r4 = seededRandom(i * 53 + 11);
    return {
      memberId: m.id,
      name: m.name,
      emailsSent: 80 + Math.floor(r4() * 140),
      whatsappMessages: 60 + Math.floor(r4() * 120),
      callsLogged: 20 + Math.floor(r4() * 45),
      meetingsBooked: 6 + Math.floor(r4() * 18),
      medianResponseTimeSeconds: 35 + Math.floor(r4() * 90),
    };
  }),
  ...EXTRA_REPS.map((m, i) => {
    const r4 = seededRandom(i * 71 + 101);
    return {
      memberId: m.id,
      name: m.name,
      emailsSent: 80 + Math.floor(r4() * 140),
      whatsappMessages: 60 + Math.floor(r4() * 120),
      callsLogged: 20 + Math.floor(r4() * 45),
      meetingsBooked: 6 + Math.floor(r4() * 18),
      medianResponseTimeSeconds: 35 + Math.floor(r4() * 90),
    };
  }),
].sort((a, b) => b.meetingsBooked - a.meetingsBooked);

// ---------------------------------------------------------------------------
// Messages (used for contact detail "conversation" style activity if needed)
// ---------------------------------------------------------------------------

export function mockMessagesForContact(contactId: string, orgId: string): Message[] {
  const r5 = seededRandom(contactId.length * 19 + 2);
  const count = 3 + Math.floor(r5() * 3);
  return Array.from({ length: count }, (_, i) => ({
    id: `msg-${contactId}-${i + 1}`,
    orgId,
    conversationId: `conv-${contactId}`,
    channel: pick(CHANNELS),
    direction: i % 2 === 0 ? "inbound" : "outbound",
    status: "sent",
    body: i % 2 === 0 ? "Thanks for reaching out, tell me more about pricing." : "Sure! Here's a breakdown tailored to your headcount.",
    aiGenerated: i % 2 !== 0,
    createdAt: new Date(Date.now() - (count - i) * 1000 * 60 * 60 * 5).toISOString(),
  }));
}

// ---------------------------------------------------------------------------
// Analytics helpers — CRM
// ---------------------------------------------------------------------------

export interface BreakdownSlice {
  label: string;
  value: number;
}

/** Lead source breakdown for a set of contacts (counts by `source`). */
export function leadSourceBreakdown(contacts: { source?: string }[]): BreakdownSlice[] {
  const counts = new Map<string, number>();
  for (const c of contacts) {
    const key = c.source ?? "Unknown";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

/** Contact type breakdown (lead / customer / candidate / client_contact). */
export function contactTypeBreakdown(contacts: { type: string }[]): BreakdownSlice[] {
  const counts = new Map<string, number>();
  for (const c of contacts) {
    counts.set(c.type, (counts.get(c.type) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export interface StageValuePoint {
  stage: DealStage;
  label: string;
  value: number;
  count: number;
}

/** Pipeline value grouped by stage, in display order. */
export function pipelineValueByStage(deals: Deal[]): StageValuePoint[] {
  return DEAL_STAGES.map((stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage.id);
    return {
      stage: stage.id,
      label: stage.label,
      value: stageDeals.reduce((sum, d) => sum + d.valueMinor, 0),
      count: stageDeals.length,
    };
  });
}

/** Average deal cycle time in days, from createdAt to expectedCloseDate, for closed (won/lost) deals. */
export function averageDealCycleDays(deals: Deal[]): number {
  const closed = deals.filter((d) => d.stage === "won" || d.stage === "lost");
  if (closed.length === 0) return 0;
  const totalDays = closed.reduce((sum, d) => {
    const created = new Date(d.createdAt).getTime();
    const closedAt = new Date(d.expectedCloseDate).getTime();
    return sum + Math.max(0, (closedAt - created) / 86400000);
  }, 0);
  return Math.round(totalDays / closed.length);
}

export interface DailyActivityPoint {
  date: string;
  label: string;
  count: number;
}

/**
 * Engagement / activity frequency sparkline data for a contact over the last
 * `days` days. Deterministic per contactId so it's stable across renders.
 */
export function contactEngagementSeries(
  contactId: string,
  referenceTime: number,
  days = 30
): DailyActivityPoint[] {
  const r = seededRandom(contactId.length * 97 + 3);
  return Array.from({ length: days }, (_, i) => {
    const dayOffset = days - 1 - i;
    const date = new Date(referenceTime - dayOffset * 86400000);
    const base = r();
    // Occasional activity bursts, mostly quiet days.
    const count = base > 0.78 ? Math.floor(2 + r() * 4) : base > 0.5 ? 1 : 0;
    return {
      date: date.toISOString(),
      label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      count,
    };
  });
}

/** Deals-by-company summary: value and count of deals linked to a company's contacts. */
export function dealsSummaryForCompany(deals: Deal[], companyId: string): StageValuePoint[] {
  const companyDeals = deals.filter((d) => d.companyId === companyId);
  return pipelineValueByStage(companyDeals);
}

// ---------------------------------------------------------------------------
// Analytics helpers — Lead Response
// ---------------------------------------------------------------------------

export interface DailyResponseTimePoint {
  date: string;
  label: string;
  medianSeconds: number;
}

/**
 * Median response-time trend over the last `days` days, derived deterministically
 * from a seed so the trend line is stable across renders.
 */
export function responseTimeTrend(referenceTime: number, days = 14): DailyResponseTimePoint[] {
  return Array.from({ length: days }, (_, i) => {
    const dayOffset = days - 1 - i;
    const date = new Date(referenceTime - dayOffset * 86400000);
    const r = seededRandom(dayOffset * 61 + 9);
    // Gentle downward trend over the window with daily noise.
    const trendBase = 70 - (days - dayOffset) * 1.4;
    const medianSeconds = Math.max(18, Math.round(trendBase + (r() - 0.5) * 24));
    return {
      date: date.toISOString(),
      label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      medianSeconds,
    };
  });
}

/** Channel volume breakdown (WhatsApp / email / web form) for the lead response feed. */
export function channelVolumeBreakdown(events: { channel: MessageChannel }[]): BreakdownSlice[] {
  const labels: Record<MessageChannel, string> = {
    whatsapp: "WhatsApp",
    email: "Email",
    web_chat: "Web form",
    sms: "SMS",
  };
  const counts = new Map<string, number>();
  for (const e of events) {
    const key = labels[e.channel] ?? e.channel;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export interface AgentWeeklyPerformance {
  handoffRatePct: number;
  handoffRateTrendPct: number;
  qualificationAccuracyPct: number;
  avgResponseSeconds: number;
}

/** Deterministic "this week" summary for the agent settings page. */
export function agentPerformanceThisWeek(referenceTime: number): AgentWeeklyPerformance {
  const r = seededRandom(Math.floor(referenceTime / 86400000) * 13 + 5);
  return {
    handoffRatePct: 18 + Math.floor(r() * 10),
    handoffRateTrendPct: -(2 + Math.floor(r() * 5)),
    qualificationAccuracyPct: 82 + Math.floor(r() * 10),
    avgResponseSeconds: 38 + Math.floor(r() * 20),
  };
}

// ---------------------------------------------------------------------------
// Analytics helpers — Outreach
// ---------------------------------------------------------------------------

export interface SequenceReplyRatePoint {
  id: string;
  name: string;
  replyRatePct: number;
}

/** Sequences ranked by reply rate, descending. */
export function sequenceReplyRateRanking(sequences: Sequence[]): SequenceReplyRatePoint[] {
  return [...sequences]
    .map((s) => ({ id: s.id, name: s.name, replyRatePct: s.replyRatePct }))
    .sort((a, b) => b.replyRatePct - a.replyRatePct);
}

export interface SequenceFunnelPoint {
  stepNumber: number;
  label: string;
  reached: number;
  replied: number;
  droppedOff: number;
}

/**
 * Step-by-step funnel for a sequence: how many enrolled contacts reach each
 * step, how many reply at that step, and how many drop off before the next.
 */
export function sequenceStepFunnel(sequence: Sequence): SequenceFunnelPoint[] {
  const r = seededRandom(sequence.id.length * 83 + 17);
  let remaining = sequence.enrolledCount;
  return sequence.steps.map((step) => {
    const reached = remaining;
    const replyShare = sequence.replyRatePct / 100;
    const replied = Math.round(reached * replyShare * (0.5 + r() * 0.6));
    const dropShare = 0.08 + r() * 0.12;
    const droppedOff = Math.round((reached - replied) * dropShare);
    remaining = Math.max(0, reached - replied - droppedOff);
    return {
      stepNumber: step.stepNumber,
      label: `Step ${step.stepNumber}`,
      reached,
      replied,
      droppedOff,
    };
  });
}

/** Enrollment status breakdown across all enrollments (or a filtered subset). */
export function enrollmentStatusBreakdown(enrollments: Enrollment[]): BreakdownSlice[] {
  const labels: Record<Enrollment["status"], string> = {
    active: "Active",
    paused: "Paused",
    completed: "Completed",
    replied: "Replied",
    unsubscribed: "Unsubscribed",
  };
  const counts = new Map<string, number>();
  for (const e of enrollments) {
    const key = labels[e.status];
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
}

// ---------------------------------------------------------------------------
// Analytics helpers — Rep Activity
// ---------------------------------------------------------------------------

export interface RepResponseTimePoint {
  name: string;
  medianResponseTimeSeconds: number;
}

/** Response-time-by-rep series, sorted fastest first. */
export function repResponseTimeSeries(reps: RepStats[]): RepResponseTimePoint[] {
  return [...reps]
    .map((r) => ({ name: r.name.split(" ")[0], medianResponseTimeSeconds: r.medianResponseTimeSeconds }))
    .sort((a, b) => a.medianResponseTimeSeconds - b.medianResponseTimeSeconds);
}

// ---------------------------------------------------------------------------
// Analytics helpers — Full-funnel Sales Analytics dashboard
// ---------------------------------------------------------------------------

export interface FunnelStagePoint {
  stage: string;
  label: string;
  count: number;
}

/** Lead-to-deal conversion funnel (New -> Qualified -> Proposal -> Negotiation -> Won). */
export function leadToDealFunnel(deals: Deal[]): FunnelStagePoint[] {
  const funnelStages: { id: DealStage; label: string }[] = [
    { id: "new", label: "New" },
    { id: "qualified", label: "Qualified" },
    { id: "proposal", label: "Proposal" },
    { id: "negotiation", label: "Negotiation" },
    { id: "won", label: "Won" },
  ];
  // Cumulative funnel: each stage includes deals that reached at least that stage.
  const order: DealStage[] = ["new", "qualified", "proposal", "negotiation", "won"];
  return funnelStages.map((stage, i) => {
    const reachedStages = new Set(order.slice(i));
    // A deal that is "lost" is treated as having reached up to the stage before loss;
    // for this simplified mock we count any deal whose current stage index >= i,
    // plus all won/lost deals for earlier stages (they passed through).
    const stageIndex = order.indexOf(stage.id);
    const count = deals.filter((d) => {
      if (d.stage === "lost") {
        // Lost deals count toward earlier funnel stages only (new/qualified/proposal),
        // approximating how far they got before being lost.
        return stageIndex <= 2;
      }
      const dIndex = order.indexOf(d.stage);
      return dIndex >= stageIndex || reachedStages.has(d.stage);
    }).length;
    return { stage: stage.id, label: stage.label, count };
  });
}

export interface WeeklyLeadsPoint {
  weekLabel: string;
  weekStart: string;
  newLeads: number;
}

/** New-leads trend over the last `weeks` weeks (deterministic mock series). */
export function newLeadsWeeklyTrend(referenceTime: number, weeks = 12): WeeklyLeadsPoint[] {
  return Array.from({ length: weeks }, (_, i) => {
    const weekOffset = weeks - 1 - i;
    const weekStart = new Date(referenceTime - weekOffset * 7 * 86400000);
    const r = seededRandom(weekOffset * 29 + 41);
    const trendBase = 18 + (weeks - weekOffset) * 0.6;
    const newLeads = Math.max(4, Math.round(trendBase + (r() - 0.4) * 10));
    return {
      weekLabel: weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      weekStart: weekStart.toISOString(),
      newLeads,
    };
  });
}

export interface PipelineValueTrendPoint {
  weekLabel: string;
  weekStart: string;
  pipelineValueMinor: number;
}

/** Pipeline value trend over the last `weeks` weeks (deterministic mock series). */
export function pipelineValueWeeklyTrend(referenceTime: number, weeks = 12): PipelineValueTrendPoint[] {
  return Array.from({ length: weeks }, (_, i) => {
    const weekOffset = weeks - 1 - i;
    const weekStart = new Date(referenceTime - weekOffset * 7 * 86400000);
    const r = seededRandom(weekOffset * 37 + 53);
    const trendBase = 320000 + (weeks - weekOffset) * 9000;
    const pipelineValueMinor = Math.round((trendBase + (r() - 0.5) * 60000) * 100);
    return {
      weekLabel: weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      weekStart: weekStart.toISOString(),
      pipelineValueMinor,
    };
  });
}

const LOSS_REASONS = ["Price", "Timing", "Competitor", "No budget", "Other"] as const;

/** Win/loss breakdown by reason for lost deals (mock reasons assigned deterministically). */
export function lossReasonBreakdown(deals: Deal[]): BreakdownSlice[] {
  const lostDeals = deals.filter((d) => d.stage === "lost");
  const counts = new Map<string, number>();
  for (const reason of LOSS_REASONS) counts.set(reason, 0);
  lostDeals.forEach((d, i) => {
    const r = seededRandom(d.id.length * 101 + i * 7);
    const reason = LOSS_REASONS[Math.floor(r() * LOSS_REASONS.length)];
    counts.set(reason, (counts.get(reason) ?? 0) + 1);
  });
  return Array.from(counts.entries())
    .filter(([, value]) => value > 0)
    .map(([label, value]) => ({ label, value }));
}

/** Revenue (closed-won value) attributed to each lead source. */
export function revenueBySourceAttribution(
  deals: Deal[],
  contacts: { id: string; source?: string }[]
): BreakdownSlice[] {
  const sourceByContact = new Map(contacts.map((c) => [c.id, c.source ?? "Unknown"]));
  const wonDeals = deals.filter((d) => d.stage === "won");
  const counts = new Map<string, number>();
  for (const d of wonDeals) {
    const source = (d.contactId && sourceByContact.get(d.contactId)) || "Unknown";
    counts.set(source, (counts.get(source) ?? 0) + d.valueMinor);
  }
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value: Math.round(value / 100) }))
    .sort((a, b) => b.value - a.value);
}
