import type { Conversation, Message, MessageChannel } from "@/lib/types/core";
import { MOCK_CONTACTS, getCompany } from "@/lib/mock-data/contacts";

/* ------------------------------------------------------------------ */
/* Customer Care — Inbox                                               */
/* ------------------------------------------------------------------ */

export interface OpsConversation extends Conversation {
  contactName: string;
  companyName?: string;
  lastMessageSnippet: string;
  sentimentFlag?: "negative" | "neutral" | "positive";
  assigneeName?: string;
}

export interface OpsMessage extends Message {
  authorName?: string;
}

const REALTY_CONTACTS = MOCK_CONTACTS.filter((c) => c.orgId === "org-demo-realty").slice(0, 30);

const CHANNELS: MessageChannel[] = ["whatsapp", "email", "web_chat"];
const STATUSES: Conversation["status"][] = ["open", "pending", "resolved", "escalated"];
const ASSIGNEES = ["Omar Al Farsi", "Lina Haddad", "Unassigned"];

const SNIPPETS: { subject?: string; snippet: string; sentiment?: "negative" | "neutral" | "positive" }[] = [
  { snippet: "Hi, is the 2BR unit in Marina still available for viewing this weekend?", sentiment: "neutral" },
  { snippet: "Thanks for the quick response! We'd like to schedule a viewing on Thursday.", sentiment: "positive" },
  { snippet: "This is the third time I've asked about my deposit refund and no one has replied.", sentiment: "negative" },
  { snippet: "Can you send me the floor plan for the Palm Residences unit?", sentiment: "neutral" },
  { snippet: "The agent who showed us the apartment was extremely rude and unhelpful.", sentiment: "negative" },
  { snippet: "What's the service charge for Downtown Dubai units this year?", sentiment: "neutral" },
  { snippet: "We loved the property, sending over our documents for the application now.", sentiment: "positive" },
  { snippet: "I was promised a callback yesterday and nobody called. Very disappointed.", sentiment: "negative" },
  { snippet: "Is parking included with the JBR listing?", sentiment: "neutral" },
  { snippet: "Could you confirm the maintenance request has been logged?", sentiment: "neutral" },
  { snippet: "Great experience overall, thank you for helping us close so fast!", sentiment: "positive" },
  { snippet: "The AC in the viewing unit wasn't working, please fix before next visit.", sentiment: "negative" },
  { snippet: "Can someone from the team call me back regarding financing options?", sentiment: "neutral" },
  { snippet: "Just confirming our 4pm viewing appointment tomorrow.", sentiment: "neutral" },
  { snippet: "Your WhatsApp bot gave me completely wrong information about pricing.", sentiment: "negative" },
  { snippet: "Appreciate the fast turnaround on the lease agreement draft.", sentiment: "positive" },
  { snippet: "Do you have any villas available in the Palm Jumeirah area?", sentiment: "neutral" },
  { snippet: "Following up on the brochure you promised to send last week.", sentiment: "neutral" },
  { snippet: "I want to file a complaint about how my inquiry was handled.", sentiment: "negative" },
  { snippet: "Loved the virtual tour, when can we do an in-person visit?", sentiment: "positive" },
  { snippet: "What documents do I need for the tenancy contract?", sentiment: "neutral" },
  { snippet: "Still waiting on a reply from 2 days ago about the studio listing.", sentiment: "negative" },
  { snippet: "Perfect, see you at the office on Monday at 11am.", sentiment: "positive" },
  { snippet: "Is the price negotiable for the Downtown Dubai 1BR?", sentiment: "neutral" },
  { snippet: "Can you escalate this to a manager? I'm not happy with the service.", sentiment: "negative" },
  { snippet: "Sending the signed NOC document as requested.", sentiment: "neutral" },
  { snippet: "Thanks, the AI assistant answered all my questions instantly!", sentiment: "positive" },
  { snippet: "Need urgent help — the keys handover got cancelled without notice.", sentiment: "negative" },
];

export const MOCK_CONVERSATIONS: OpsConversation[] = REALTY_CONTACTS.map((contact, i) => {
  const channel = CHANNELS[i % CHANNELS.length];
  const snippetData = SNIPPETS[i % SNIPPETS.length];
  const status = STATUSES[i % STATUSES.length];
  const company = getCompany(contact.companyId);
  const hoursAgo = i * 3 + 1;
  return {
    id: `conv-${i + 1}`,
    orgId: "org-demo-realty",
    contactId: contact.id,
    contactName: contact.name,
    companyName: company?.name,
    channel,
    subject: channel === "email" ? "Re: Property inquiry — " + (company?.name ?? "listing") : undefined,
    status,
    assignedTo: ASSIGNEES[i % ASSIGNEES.length],
    assigneeName: ASSIGNEES[i % ASSIGNEES.length],
    lastMessageAt: new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString(),
    unread: i % 4 === 0,
    lastMessageSnippet: snippetData.snippet,
    sentimentFlag: snippetData.sentiment,
  };
});

function buildThread(conv: OpsConversation): OpsMessage[] {
  const base = Date.now() - 1000 * 60 * 60 * 6;
  const thread: OpsMessage[] = [
    {
      id: `${conv.id}-m1`,
      orgId: conv.orgId,
      conversationId: conv.id,
      channel: conv.channel,
      direction: "inbound",
      status: "delivered",
      body: conv.lastMessageSnippet,
      aiGenerated: false,
      createdAt: new Date(base).toISOString(),
      sentimentFlag: conv.sentimentFlag,
      authorName: conv.contactName,
    },
    {
      id: `${conv.id}-m2`,
      orgId: conv.orgId,
      conversationId: conv.id,
      channel: conv.channel,
      direction: "outbound",
      status: "sent",
      body:
        conv.sentimentFlag === "negative"
          ? "I'm really sorry to hear about this experience. I've flagged this for our team lead and we'll get back to you within the hour with a resolution."
          : "Thanks for reaching out! Let me pull up the details for you — one moment.",
      aiGenerated: true,
      approvedBy: conv.sentimentFlag === "negative" ? "Omar Al Farsi" : undefined,
      createdAt: new Date(base + 1000 * 60 * 6).toISOString(),
      authorName: "AI Assistant",
    },
    {
      id: `${conv.id}-m3`,
      orgId: conv.orgId,
      conversationId: conv.id,
      channel: conv.channel,
      direction: "inbound",
      status: "delivered",
      body:
        conv.sentimentFlag === "negative"
          ? "Okay, I'll wait — please make sure someone actually follows up this time."
          : "Sounds good, thank you!",
      aiGenerated: false,
      createdAt: new Date(base + 1000 * 60 * 40).toISOString(),
      authorName: conv.contactName,
    },
  ];
  return thread;
}

export const MOCK_MESSAGES_BY_CONVERSATION: Record<string, OpsMessage[]> = Object.fromEntries(
  MOCK_CONVERSATIONS.map((c) => [c.id, buildThread(c)])
);

export const AI_SUGGESTED_REPLY =
  "Hi {{name}}, thanks for your patience! I've checked and can confirm the unit is available — would you like me to lock in a viewing slot for you this week?";

/* ------------------------------------------------------------------ */
/* Customer Care — Knowledge Base                                      */
/* ------------------------------------------------------------------ */

export interface KbDocument {
  id: string;
  name: string;
  type: "PDF" | "DOCX" | "URL";
  chunkCount: number;
  lastUpdated: string;
  status: "indexed" | "processing";
}

export const MOCK_KB_DOCUMENTS: KbDocument[] = [
  { id: "kb-1", name: "Marina Towers — Floor Plans & Pricing.pdf", type: "PDF", chunkCount: 142, lastUpdated: "2026-10-18T09:00:00Z", status: "indexed" },
  { id: "kb-2", name: "Palm Residences — FAQ.docx", type: "DOCX", chunkCount: 58, lastUpdated: "2026-10-15T14:30:00Z", status: "indexed" },
  { id: "kb-3", name: "Tenancy Contract Guidelines (Dubai Land Dept).pdf", type: "PDF", chunkCount: 211, lastUpdated: "2026-10-10T11:00:00Z", status: "indexed" },
  { id: "kb-4", name: "demorealty.ae/service-charges", type: "URL", chunkCount: 24, lastUpdated: "2026-10-20T08:15:00Z", status: "indexed" },
  { id: "kb-5", name: "Downtown Dubai — Amenities Brochure.pdf", type: "PDF", chunkCount: 76, lastUpdated: "2026-10-05T16:45:00Z", status: "indexed" },
  { id: "kb-6", name: "Maintenance Request Process.docx", type: "DOCX", chunkCount: 33, lastUpdated: "2026-10-22T10:00:00Z", status: "processing" },
  { id: "kb-7", name: "demorealty.ae/mortgage-partners", type: "URL", chunkCount: 19, lastUpdated: "2026-10-12T13:20:00Z", status: "indexed" },
  { id: "kb-8", name: "JBR Listings — Q4 2026 Pricing.pdf", type: "PDF", chunkCount: 97, lastUpdated: "2026-10-23T17:10:00Z", status: "processing" },
];

/* ------------------------------------------------------------------ */
/* Receivables Recovery — Invoices                                     */
/* ------------------------------------------------------------------ */

export type InvoiceCurrency = "INR" | "USD" | "AED";
export type InvoiceStatus = "draft" | "sent" | "overdue" | "paid";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  companyName?: string;
  amountMinor: number;
  currency: InvoiceCurrency;
  issuedDate: string;
  dueDate: string;
  status: InvoiceStatus;
  daysOverdue?: number;
  paidDate?: string;
}

const STAFFING_CONTACTS = MOCK_CONTACTS.filter((c) => c.orgId === "org-staffing-co");

const INVOICE_SEED: { status: InvoiceStatus; currency: InvoiceCurrency; amount: number; dueOffsetDays: number }[] = [
  { status: "paid", currency: "INR", amount: 185000, dueOffsetDays: -20 },
  { status: "paid", currency: "USD", amount: 4200, dueOffsetDays: -18 },
  { status: "overdue", currency: "USD", amount: 7600, dueOffsetDays: 18 },
  { status: "overdue", currency: "INR", amount: 92000, dueOffsetDays: 9 },
  { status: "sent", currency: "AED", amount: 15400, dueOffsetDays: -5 },
  { status: "overdue", currency: "AED", amount: 22000, dueOffsetDays: 31 },
  { status: "paid", currency: "INR", amount: 134000, dueOffsetDays: -12 },
  { status: "sent", currency: "USD", amount: 3100, dueOffsetDays: -2 },
  { status: "overdue", currency: "USD", amount: 5400, dueOffsetDays: 5 },
  { status: "draft", currency: "INR", amount: 76000, dueOffsetDays: -30 },
  { status: "paid", currency: "AED", amount: 9800, dueOffsetDays: -25 },
  { status: "overdue", currency: "INR", amount: 158000, dueOffsetDays: 22 },
  { status: "sent", currency: "USD", amount: 6200, dueOffsetDays: -8 },
  { status: "paid", currency: "USD", amount: 2900, dueOffsetDays: -15 },
  { status: "overdue", currency: "AED", amount: 41000, dueOffsetDays: 14 },
  { status: "sent", currency: "INR", amount: 112000, dueOffsetDays: -3 },
  { status: "overdue", currency: "USD", amount: 8800, dueOffsetDays: 27 },
  { status: "draft", currency: "AED", amount: 18600, dueOffsetDays: -28 },
  { status: "paid", currency: "INR", amount: 203000, dueOffsetDays: -22 },
  { status: "overdue", currency: "INR", amount: 67000, dueOffsetDays: 11 },
  { status: "sent", currency: "USD", amount: 5100, dueOffsetDays: -6 },
  { status: "paid", currency: "AED", amount: 13200, dueOffsetDays: -19 },
  { status: "overdue", currency: "USD", amount: 9600, dueOffsetDays: 8 },
];

export const MOCK_INVOICES: Invoice[] = INVOICE_SEED.map((seed, i) => {
  const contact = STAFFING_CONTACTS[i % STAFFING_CONTACTS.length];
  const company = getCompany(contact.companyId);
  const now = Date.now();
  const due = new Date(now - seed.dueOffsetDays * 86400000);
  const issued = new Date(due.getTime() - 30 * 86400000);
  return {
    id: `inv-${i + 1}`,
    invoiceNumber: `INV-${2040 + i}`,
    customerName: contact.name,
    companyName: company?.name,
    amountMinor: seed.amount * 100,
    currency: seed.currency,
    issuedDate: issued.toISOString(),
    dueDate: due.toISOString(),
    status: seed.status,
    daysOverdue: seed.status === "overdue" ? seed.dueOffsetDays : undefined,
    paidDate: seed.status === "paid" ? new Date(due.getTime() - 2 * 86400000).toISOString() : undefined,
  };
});

/* ------------------------------------------------------------------ */
/* Receivables Recovery — Reminder Sequences                           */
/* ------------------------------------------------------------------ */

export interface SequenceStep {
  step: number;
  label: string;
  tone: string;
  channel: "email" | "whatsapp";
  preview: string;
}

export interface ReminderSequence {
  id: string;
  name: string;
  trigger: string;
  channel: "email" | "whatsapp" | "both";
  mode: "auto-send" | "approval";
  activeInvoices: number;
  steps: SequenceStep[];
}

export const MOCK_SEQUENCES: ReminderSequence[] = [
  {
    id: "seq-1",
    name: "Standard 30-Day Recovery",
    trigger: "3 days overdue",
    channel: "both",
    mode: "approval",
    activeInvoices: 6,
    steps: [
      { step: 1, label: "Friendly reminder", tone: "Warm, assumes oversight", channel: "email", preview: "Hi {{name}}, just a friendly note that invoice {{invoice}} for {{amount}} is a few days past due — let us know if you need anything to process payment!" },
      { step: 2, label: "Firm reminder", tone: "Direct, requests a date", channel: "whatsapp", preview: "Hi {{name}}, following up on invoice {{invoice}} ({{amount}}), now {{days}} days overdue. Could you share an expected payment date?" },
      { step: 3, label: "Final notice", tone: "Formal, mentions consequences", channel: "email", preview: "This is a final notice regarding invoice {{invoice}} ({{amount}}), {{days}} days overdue. Please settle within 5 business days to avoid service suspension." },
    ],
  },
  {
    id: "seq-2",
    name: "High-Value Account Recovery",
    trigger: "7 days overdue, amount > $5,000",
    channel: "email",
    mode: "approval",
    activeInvoices: 3,
    steps: [
      { step: 1, label: "Friendly reminder", tone: "Personal, relationship-first", channel: "email", preview: "Hi {{name}}, hope all is well. Wanted to flag invoice {{invoice}} ({{amount}}) which is now overdue — happy to jump on a call if helpful." },
      { step: 2, label: "Firm reminder", tone: "Account-manager tone, offers plan", channel: "email", preview: "Hi {{name}}, invoice {{invoice}} ({{amount}}) is {{days}} days overdue. We can set up a payment plan if that's easier — let us know." },
      { step: 3, label: "Final notice", tone: "Escalation to decision-maker", channel: "email", preview: "Looping in our finance lead. Invoice {{invoice}} ({{amount}}) is significantly overdue at {{days}} days. Please respond within 3 business days." },
    ],
  },
  {
    id: "seq-3",
    name: "WhatsApp Quick Nudge",
    trigger: "1 day overdue, amount < $2,000",
    channel: "whatsapp",
    mode: "auto-send",
    activeInvoices: 8,
    steps: [
      { step: 1, label: "Friendly reminder", tone: "Casual, emoji-light", channel: "whatsapp", preview: "Hey {{name}}! 👋 Quick heads up — invoice {{invoice}} ({{amount}}) is now due. Mind settling it when you get a chance?" },
      { step: 2, label: "Firm reminder", tone: "Slightly more direct", channel: "whatsapp", preview: "Hi {{name}}, invoice {{invoice}} ({{amount}}) is still outstanding ({{days}} days). Could you confirm when payment will go through?" },
      { step: 3, label: "Final notice", tone: "Short, clear deadline", channel: "whatsapp", preview: "{{name}}, invoice {{invoice}} ({{amount}}) remains unpaid at {{days}} days overdue. Please settle by end of week." },
    ],
  },
  {
    id: "seq-4",
    name: "Dormant Account Win-Back Recovery",
    trigger: "45 days overdue",
    channel: "both",
    mode: "approval",
    activeInvoices: 2,
    steps: [
      { step: 1, label: "Friendly reminder", tone: "Re-engagement, no pressure", channel: "email", preview: "Hi {{name}}, we noticed invoice {{invoice}} ({{amount}}) is still open. Is there anything blocking payment we can help resolve?" },
      { step: 2, label: "Firm reminder", tone: "References prior reminders", channel: "whatsapp", preview: "Hi {{name}}, this is a follow-up on invoice {{invoice}} ({{amount}}), now {{days}} days overdue despite earlier reminders." },
      { step: 3, label: "Final notice", tone: "Collections handoff warning", channel: "email", preview: "Invoice {{invoice}} ({{amount}}) is {{days}} days overdue. Without payment within 7 days, this account will be referred to collections." },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Receivables Recovery — Sequence effectiveness                      */
/* ------------------------------------------------------------------ */

export interface SequenceEffectiveness {
  sequenceId: string;
  name: string;
  collectionRatePct: number;
  avgDaysToCollect: number;
}

const SEQUENCE_EFFECTIVENESS_SEED: { collectionRatePct: number; avgDaysToCollect: number }[] = [
  { collectionRatePct: 68, avgDaysToCollect: 9 },
  { collectionRatePct: 81, avgDaysToCollect: 7 },
  { collectionRatePct: 74, avgDaysToCollect: 4 },
  { collectionRatePct: 42, avgDaysToCollect: 18 },
];

export const MOCK_SEQUENCE_EFFECTIVENESS: SequenceEffectiveness[] = MOCK_SEQUENCES.map((seq, i) => ({
  sequenceId: seq.id,
  name: seq.name,
  ...SEQUENCE_EFFECTIVENESS_SEED[i % SEQUENCE_EFFECTIVENESS_SEED.length],
}));

/* ------------------------------------------------------------------ */
/* Customer Care — Analytics helpers                                   */
/* ------------------------------------------------------------------ */

export interface ChannelVolumePoint {
  channel: MessageChannel;
  label: string;
  count: number;
}

export const MOCK_CHANNEL_VOLUME: ChannelVolumePoint[] = (["whatsapp", "email", "web_chat"] as MessageChannel[]).map(
  (channel) => ({
    channel,
    label: channel === "web_chat" ? "Web chat" : channel === "whatsapp" ? "WhatsApp" : "Email",
    count: MOCK_CONVERSATIONS.filter((c) => c.channel === channel).length,
  })
);

export interface SentimentBreakdownPoint {
  sentiment: "positive" | "neutral" | "negative";
  label: string;
  count: number;
}

export const MOCK_SENTIMENT_BREAKDOWN: SentimentBreakdownPoint[] = (
  ["positive", "neutral", "negative"] as const
).map((sentiment) => ({
  sentiment,
  label: sentiment[0].toUpperCase() + sentiment.slice(1),
  count: MOCK_CONVERSATIONS.filter((c) => c.sentimentFlag === sentiment).length,
}));

export interface DayPoint {
  day: string; // short label e.g. "Oct 12"
  isoDate: string;
  value: number;
}

const DAY_MS = 86400000;

function dayLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Deterministic pseudo-random in [0,1) seeded by an integer, for stable mock trend shapes. */
function seededRandom(seed: number) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

/** Response-time trend (minutes), last 14 days — deterministic mock series with a gentle downward drift. */
export const MOCK_RESPONSE_TIME_TREND: DayPoint[] = Array.from({ length: 14 }, (_, i) => {
  const daysAgo = 13 - i;
  const date = new Date(Date.now() - daysAgo * DAY_MS);
  const base = 22 - i * 0.6;
  const noise = seededRandom(i + 1) * 6 - 3;
  return {
    day: dayLabel(date),
    isoDate: date.toISOString(),
    value: Math.max(4, Math.round((base + noise) * 10) / 10),
  };
});

/** Conversation volume trend (count per day), last 14 days. */
export const MOCK_CONVERSATION_VOLUME_TREND: DayPoint[] = Array.from({ length: 14 }, (_, i) => {
  const daysAgo = 13 - i;
  const date = new Date(Date.now() - daysAgo * DAY_MS);
  const base = 14 + Math.round(seededRandom(i + 10) * 10);
  return {
    day: dayLabel(date),
    isoDate: date.toISOString(),
    value: base,
  };
});

/** Resolution-time trend (hours to resolve), last 14 days. */
export const MOCK_RESOLUTION_TIME_TREND: DayPoint[] = Array.from({ length: 14 }, (_, i) => {
  const daysAgo = 13 - i;
  const date = new Date(Date.now() - daysAgo * DAY_MS);
  const base = 6.5 - i * 0.15;
  const noise = seededRandom(i + 30) * 2 - 1;
  return {
    day: dayLabel(date),
    isoDate: date.toISOString(),
    value: Math.max(0.5, Math.round((base + noise) * 10) / 10),
  };
});

export interface SentimentTrendPoint {
  day: string;
  isoDate: string;
  positive: number;
  neutral: number;
  negative: number;
}

/** Sentiment mix trend over last 14 days, counts per bucket per day. */
export const MOCK_SENTIMENT_TREND: SentimentTrendPoint[] = Array.from({ length: 14 }, (_, i) => {
  const daysAgo = 13 - i;
  const date = new Date(Date.now() - daysAgo * DAY_MS);
  const positive = 4 + Math.round(seededRandom(i + 50) * 4);
  const negative = Math.max(0, 3 - Math.round(i / 4) + Math.round(seededRandom(i + 60) * 2));
  const neutral = 6 + Math.round(seededRandom(i + 70) * 3);
  return {
    day: dayLabel(date),
    isoDate: date.toISOString(),
    positive,
    neutral,
    negative,
  };
});

export interface AgentReplyShare {
  label: string;
  value: number;
}

/** AI vs human reply share, derived from the mock conversation threads. */
export const MOCK_AGENT_REPLY_SHARE: AgentReplyShare[] = (() => {
  const allMessages = Object.values(MOCK_MESSAGES_BY_CONVERSATION).flat();
  const outbound = allMessages.filter((m) => m.direction === "outbound");
  const aiCount = outbound.filter((m) => m.aiGenerated).length;
  const humanCount = outbound.length - aiCount;
  return [
    { label: "AI agent", value: aiCount },
    { label: "Human", value: humanCount },
  ];
})();

/* ------------------------------------------------------------------ */
/* Customer Care — Knowledge Base analytics                            */
/* ------------------------------------------------------------------ */

export interface KbChunkTrendPoint {
  day: string;
  isoDate: string;
  totalChunks: number;
}

/** Cumulative KB chunk count trend, last 10 days, ramping up to today's total. */
export const MOCK_KB_CHUNK_TREND: KbChunkTrendPoint[] = (() => {
  const totalChunks = MOCK_KB_DOCUMENTS.reduce((s, d) => s + d.chunkCount, 0);
  const days = 10;
  return Array.from({ length: days }, (_, i) => {
    const daysAgo = days - 1 - i;
    const date = new Date(Date.now() - daysAgo * DAY_MS);
    const progress = (i + 1) / days;
    const eased = Math.pow(progress, 0.85);
    return {
      day: dayLabel(date),
      isoDate: date.toISOString(),
      totalChunks: Math.round(totalChunks * eased),
    };
  });
})();

export interface KbDocTypeBreakdown {
  type: KbDocument["type"];
  count: number;
  chunkCount: number;
}

export const MOCK_KB_DOC_TYPE_BREAKDOWN: KbDocTypeBreakdown[] = (["PDF", "DOCX", "URL"] as const).map((type) => {
  const docs = MOCK_KB_DOCUMENTS.filter((d) => d.type === type);
  return {
    type,
    count: docs.length,
    chunkCount: docs.reduce((s, d) => s + d.chunkCount, 0),
  };
});

/* ------------------------------------------------------------------ */
/* Receivables Recovery — Invoice analytics                            */
/* ------------------------------------------------------------------ */

export interface AgingBucket {
  bucket: "0-30" | "31-60" | "61-90" | "90+";
  label: string;
  count: number;
  amountUsd: number;
}

function invoiceToUsd(amountMinor: number, currency: InvoiceCurrency) {
  const rates: Record<InvoiceCurrency, number> = { USD: 1, INR: 1 / 83, AED: 1 / 3.67 };
  return (amountMinor / 100) * rates[currency];
}

export const MOCK_AGING_BUCKETS: AgingBucket[] = (() => {
  const overdue = MOCK_INVOICES.filter((i) => i.status === "overdue" && i.daysOverdue);
  const ranges: { bucket: AgingBucket["bucket"]; label: string; min: number; max: number }[] = [
    { bucket: "0-30", label: "0-30 days", min: 0, max: 30 },
    { bucket: "31-60", label: "31-60 days", min: 31, max: 60 },
    { bucket: "61-90", label: "61-90 days", min: 61, max: 90 },
    { bucket: "90+", label: "90+ days", min: 91, max: Infinity },
  ];
  return ranges.map(({ bucket, label, min, max }) => {
    const inRange = overdue.filter((i) => (i.daysOverdue ?? 0) >= min && (i.daysOverdue ?? 0) <= max);
    return {
      bucket,
      label,
      count: inRange.length,
      amountUsd: Math.round(inRange.reduce((s, i) => s + invoiceToUsd(i.amountMinor, i.currency), 0)),
    };
  });
})();

export interface CollectionsTrendPoint {
  week: string;
  isoDate: string;
  amountUsd: number;
}

/** Amount collected per week, last 8 weeks — deterministic mock series anchored to current paid-invoice total. */
export const MOCK_COLLECTIONS_TREND: CollectionsTrendPoint[] = (() => {
  const paid = MOCK_INVOICES.filter((i) => i.status === "paid");
  const totalPaidUsd = paid.reduce((s, i) => s + invoiceToUsd(i.amountMinor, i.currency), 0);
  const weeks = 8;
  const weights = Array.from({ length: weeks }, (_, i) => 0.6 + seededRandom(i + 5) * 0.8 + i * 0.05);
  const weightSum = weights.reduce((s, w) => s + w, 0);
  return Array.from({ length: weeks }, (_, i) => {
    const weeksAgo = weeks - 1 - i;
    const date = new Date(Date.now() - weeksAgo * 7 * DAY_MS);
    const share = weights[i] / weightSum;
    return {
      week: `Wk ${i + 1}`,
      isoDate: date.toISOString(),
      amountUsd: Math.round((totalPaidUsd / weeks) * weeks * share),
    };
  });
})();

export interface CurrencyBreakdown {
  currency: InvoiceCurrency;
  count: number;
  amountUsd: number;
}

export const MOCK_CURRENCY_BREAKDOWN: CurrencyBreakdown[] = (["INR", "USD", "AED"] as InvoiceCurrency[]).map(
  (currency) => {
    const invoices = MOCK_INVOICES.filter((i) => i.currency === currency);
    return {
      currency,
      count: invoices.length,
      amountUsd: Math.round(invoices.reduce((s, i) => s + invoiceToUsd(i.amountMinor, i.currency), 0)),
    };
  }
);
