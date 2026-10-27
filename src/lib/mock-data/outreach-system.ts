import type { BreakdownSlice } from "@/lib/mock-data/sales";

// ---------------------------------------------------------------------------
// Deterministic PRNG (same formula used throughout src/lib/mock-data/sales.ts)
// ---------------------------------------------------------------------------

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pick<T>(arr: T[], r: () => number): T {
  return arr[Math.floor(r() * arr.length)];
}

const FIRST = [
  "Aarav", "Vivian", "Noah", "Fatima", "Liam", "Sara", "Mateo", "Zara",
  "Ethan", "Priya", "Omar", "Maya", "Rohan", "Lena", "Yusuf", "Ananya",
  "Kabir", "Nora", "Arjun", "Hana", "Dev", "Layla", "Karan", "Mira",
];
const LAST = [
  "Shah", "Khan", "Patel", "Haddad", "Mehta", "Al Farsi", "Nair", "Rossi",
  "Kumar", "Hassan", "Singh", "Qureshi", "Verma", "Saleh", "Chopra", "Reddy",
];
const COMPANIES = [
  "Nimbus Logistics", "Orbit Fintech", "Vertex Retail Group", "Solara Energy",
  "Pinnacle Health", "Marina Towers Developers", "Palm Residences", "Atlas Freight Co",
  "Crescent Capital", "Bluewave Manufacturing", "Harborline Shipping", "Granite Partners",
];

function fullName(r: () => number) {
  return `${pick(FIRST, r)} ${pick(LAST, r)}`;
}

// ---------------------------------------------------------------------------
// Overview — Cold Outreach Bot / Hot CRM Outreach Bot
// ---------------------------------------------------------------------------

export const COLD_OUTREACH_SUMMARY = {
  totalLeads: 3022,
  emailsSent: 8640,
  whatsappChats: 410,
  voiceCalls: 915,
  totalReplies: 187,
};

export const HOT_CRM_SUMMARY = {
  totalLeads: 1180,
  emailsSent: 2460,
  whatsappChats: 560,
  voiceCalls: 340,
  totalReplies: 96,
};

export interface ReplyEntry {
  id: string;
  name: string;
  company: string;
  channel: "email" | "whatsapp" | "voice" | "linkedin";
  snippet: string;
}

const REPLY_SNIPPETS = [
  "Thanks for reaching out — can you send over pricing details?",
  "Not interested right now, maybe check back in Q3.",
  "Yes, let's set up a call next week.",
  "Who gave you this number?",
  "Can you tell me more about the onboarding process?",
  "We already have a vendor for this, but open to hearing more.",
  "Please remove me from this list.",
  "This looks interesting, forwarding to my manager.",
  "What's the minimum contract size?",
  "Can we do a demo tomorrow afternoon?",
  "I'm the wrong person for this, try our ops team.",
  "Sounds good, sending a calendar invite.",
  "How is this different from what we use today?",
  "Following up — any update on the proposal?",
  "Yes please, interested in a trial.",
];

const CHANNELS_ALL: ReplyEntry["channel"][] = ["email", "whatsapp", "voice", "linkedin"];

export const MOCK_REPLIES: ReplyEntry[] = Array.from({ length: 14 }, (_, i) => {
  const r = seededRandom(i * 19 + 11);
  return {
    id: `reply-${i + 1}`,
    name: fullName(r),
    company: pick(COMPANIES, r),
    channel: CHANNELS_ALL[i % CHANNELS_ALL.length],
    snippet: REPLY_SNIPPETS[i % REPLY_SNIPPETS.length],
  };
});

export const CHANNEL_DISTRIBUTION: BreakdownSlice[] = [
  { label: "Email", value: 8640 },
  { label: "WhatsApp", value: 410 },
  { label: "Voice", value: 915 },
  { label: "LinkedIn", value: 560 },
];

export interface DailyAcquisitionPoint {
  label: string;
  leads: number;
}

export function dailyAcquisitionTrend(days = 30): DailyAcquisitionPoint[] {
  const now = Date.now();
  return Array.from({ length: days }, (_, i) => {
    const dayOffset = days - 1 - i;
    const date = new Date(now - dayOffset * 86400000);
    const r = seededRandom(dayOffset * 31 + 7);
    const trendBase = 70 + (days - dayOffset) * 1.6;
    const leads = Math.max(20, Math.round(trendBase + (r() - 0.45) * 40));
    return {
      label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      leads,
    };
  });
}

// ---------------------------------------------------------------------------
// Shared: Account / Sender identity
// ---------------------------------------------------------------------------

export interface AccountIdentity {
  id: string;
  label: string;
  colorVar: string; // CSS variable token
}

const ACCOUNT_COLORS = ["var(--primary)", "var(--accent)", "var(--success)", "var(--warning)"];

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------

export const EMAIL_METRICS = {
  totalSent: 8640,
  opened: 3542,
  replied: 318,
  bounced: 212,
  unsubscribed: 64,
  openRatePct: 41,
};

export const EMAIL_STATUS_BREAKDOWN: BreakdownSlice[] = [
  { label: "Delivered", value: 8428 },
  { label: "Bounced", value: 212 },
];

export const EMAIL_ACCOUNTS: AccountIdentity[] = [
  { id: "em-1", label: "hello@scalepods-outbound.com", colorVar: ACCOUNT_COLORS[0] },
  { id: "em-2", label: "sales@scalepods-outbound.com", colorVar: ACCOUNT_COLORS[1] },
];

export interface EmailAccountStats {
  account: AccountIdentity;
  sent: number;
  opened: number;
  replied: number;
  bounced: number;
  dailyCap: number;
  sentToday: number;
}

export const EMAIL_ACCOUNT_STATS: EmailAccountStats[] = [
  { account: EMAIL_ACCOUNTS[0], sent: 4980, opened: 2041, replied: 184, bounced: 122, dailyCap: 300, sentToday: 214 },
  { account: EMAIL_ACCOUNTS[1], sent: 3660, opened: 1501, replied: 134, bounced: 90, dailyCap: 300, sentToday: 168 },
];

export const EMAIL_WARMUP_PCT = 72;

export interface EmailReply {
  id: string;
  name: string;
  company: string;
  account: AccountIdentity;
  snippet: string;
}

export const EMAIL_REPLIES: EmailReply[] = Array.from({ length: 8 }, (_, i) => {
  const r = seededRandom(i * 23 + 3);
  return {
    id: `email-reply-${i + 1}`,
    name: fullName(r),
    company: pick(COMPANIES, r),
    account: EMAIL_ACCOUNTS[i % EMAIL_ACCOUNTS.length],
    snippet: REPLY_SNIPPETS[(i + 2) % REPLY_SNIPPETS.length],
  };
});

export interface EmailLogEntry {
  id: string;
  recipient: string;
  company: string;
  subject: string;
  account: AccountIdentity;
  status: "delivered" | "opened" | "replied" | "bounced";
  sentAt: string;
  threadId: string;
}

const EMAIL_SUBJECTS = [
  "Quick question about your hiring plans",
  "Staffing partner for Q2 expansion?",
  "Following up on our last conversation",
  "Case study: how we cut time-to-hire by 40%",
  "Open to a 15-min call this week?",
  "Re: your recent LinkedIn post",
  "Pricing for bulk contractor staffing",
];

export const MOCK_EMAIL_LOG: EmailLogEntry[] = Array.from({ length: 24 }, (_, i) => {
  const r = seededRandom(i * 29 + 41);
  const statuses: EmailLogEntry["status"][] = ["delivered", "delivered", "opened", "opened", "replied", "bounced"];
  return {
    id: `email-log-${i + 1}`,
    recipient: fullName(r),
    company: pick(COMPANIES, r),
    subject: EMAIL_SUBJECTS[i % EMAIL_SUBJECTS.length],
    account: EMAIL_ACCOUNTS[i % EMAIL_ACCOUNTS.length],
    status: statuses[i % statuses.length],
    sentAt: new Date(Date.now() - i * 1000 * 60 * 95).toISOString(),
    threadId: `email-thread-${(i % 10) + 1}`,
  };
});

// ---------------------------------------------------------------------------
// WhatsApp
// ---------------------------------------------------------------------------

export const WHATSAPP_METRICS = {
  totalChats: 410,
  activeLeads: 128,
  messagesSent: 1860,
  replies: 142,
  responseRatePct: 35,
};

export const WHATSAPP_STATUS_BREAKDOWN: BreakdownSlice[] = [
  { label: "Delivered", value: 1744 },
  { label: "Failed", value: 116 },
];

export const WHATSAPP_ACCOUNTS: AccountIdentity[] = [
  { id: "wa-1", label: "+971 50 123 4567", colorVar: ACCOUNT_COLORS[0] },
  { id: "wa-2", label: "+91 98 765 43210", colorVar: ACCOUNT_COLORS[1] },
];

export interface WhatsappAccountStats {
  account: AccountIdentity;
  chats: number;
  messagesSent: number;
  replies: number;
  failed: number;
}

export const WHATSAPP_ACCOUNT_STATS: WhatsappAccountStats[] = [
  { account: WHATSAPP_ACCOUNTS[0], chats: 238, messagesSent: 1072, replies: 84, failed: 64 },
  { account: WHATSAPP_ACCOUNTS[1], chats: 172, messagesSent: 788, replies: 58, failed: 52 },
];

export interface WhatsappReply {
  id: string;
  name: string;
  company: string;
  account: AccountIdentity;
  snippet: string;
}

export const WHATSAPP_REPLIES: WhatsappReply[] = Array.from({ length: 7 }, (_, i) => {
  const r = seededRandom(i * 17 + 53);
  return {
    id: `wa-reply-${i + 1}`,
    name: fullName(r),
    company: pick(COMPANIES, r),
    account: WHATSAPP_ACCOUNTS[i % WHATSAPP_ACCOUNTS.length],
    snippet: REPLY_SNIPPETS[(i + 5) % REPLY_SNIPPETS.length],
  };
});

// ---------------------------------------------------------------------------
// Voice
// ---------------------------------------------------------------------------

export const VOICE_METRICS = {
  totalCalls: 915,
  connected: 288,
  avgDurationSeconds: 94,
  totalCostUsd: 142.3,
  successRatePct: 31,
};

export const VOICE_STATUS_BREAKDOWN: BreakdownSlice[] = [
  { label: "Connected", value: 288 },
  { label: "No answer", value: 512 },
  { label: "Failed", value: 115 },
];

export const VOICE_ACCOUNTS: AccountIdentity[] = [
  { id: "vo-1", label: "US +1 415 555 0142", colorVar: ACCOUNT_COLORS[0] },
  { id: "vo-2", label: "UK +44 20 7946 0958", colorVar: ACCOUNT_COLORS[1] },
];

export interface VoiceAccountStats {
  account: AccountIdentity;
  totalCalls: number;
  connected: number;
  failed: number;
  dailyCap: number;
  callsToday: number;
}

export const VOICE_ACCOUNT_STATS: VoiceAccountStats[] = [
  { account: VOICE_ACCOUNTS[0], totalCalls: 528, connected: 168, failed: 360, dailyCap: 120, callsToday: 94 },
  { account: VOICE_ACCOUNTS[1], totalCalls: 387, connected: 120, failed: 267, dailyCap: 120, callsToday: 71 },
];

export const VOICE_DAILY_CAP_PCT = 79;

export interface VoiceLogEntry {
  id: string;
  contact: string;
  company: string;
  account: AccountIdentity;
  direction: "inbound" | "outbound";
  status: "completed" | "no_answer" | "failed";
  durationSeconds: number;
  recording: "available" | "processing" | "none";
  transcript?: string;
  calledAt: string;
  campaignType: "cold" | "warm";
}

const CALL_TRANSCRIPTS = [
  "Agent: Hi, this is Alex calling from ScalePods, do you have a quick minute?\nContact: Sure, what's this about?\nAgent: We help teams automate outbound hiring campaigns — are you currently handling staffing in-house?\nContact: We are, but it's pretty manual right now.\nAgent: Got it. Would it help to see a quick demo this week?\nContact: Yeah, send me something and I'll take a look.",
  "Agent: Hi, is this Priya? Calling from ScalePods about the staffing inquiry you submitted.\nContact: Oh yes, hi.\nAgent: Great — can you tell me roughly how many roles you're looking to fill this quarter?\nContact: Around 15, mostly contract roles.\nAgent: Perfect, I can get a specialist to follow up with options today.\nContact: Sounds good, thanks.",
  "Agent: Hello, calling from ScalePods regarding your RPO pricing question.\nContact: Right, I had a few questions on that.\nAgent: Happy to help — what's the approximate headcount you're planning for?\nContact: Maybe 40 over the next two quarters.\nAgent: Noted, I'll have someone send a tailored proposal.\nContact: Appreciate it.",
  "Agent: Hi, this is calling from ScalePods following up on your website inquiry.\nContact: Hi, yes I filled that out last week.\nAgent: Apologies for the delay — are you still looking for warehouse staffing support?\nContact: We are, it's getting urgent actually.\nAgent: Understood, let me flag this as priority and get a callback scheduled today.",
];

const VOICEMAIL_TRANSCRIPTS = [
  "[Call rang out — voicemail greeting played]\nAgent: Hi, this is Alex from ScalePods. I'm following up on your enquiry about staffing support. I'll send a short note over email, and please call me back on this number when you have a minute. Thanks!",
  "[No pickup — went to voicemail]\nAgent: Hello, this is calling from ScalePods. Sorry we missed you. We help teams automate outbound hiring and I'd love to share a two-minute overview. I'll try again tomorrow morning. Have a good day.",
  "[Line busy, redial connected to voicemail]\nAgent: Hi, Alex from ScalePods again. We tried earlier today as well. No pressure — I've emailed a summary and a link to book a demo whenever suits you.",
];

const FAILED_TRANSCRIPTS = [
  "[Call dropped after 6 seconds — network error]\nAgent: Hi, this is Alex from ScalePods, can you he—\n[Connection lost. Auto-redial scheduled]",
  "[Call failed — number not reachable]\nSystem: The number you have dialled is currently switched off or out of coverage area. Retry queued for the next window.",
];

export const MOCK_VOICE_LOG: VoiceLogEntry[] = Array.from({ length: 22 }, (_, i) => {
  const r = seededRandom(i * 37 + 71);
  const statuses: VoiceLogEntry["status"][] = ["completed", "no_answer", "no_answer", "completed", "failed"];
  const status = statuses[i % statuses.length];
  // Every call keeps a recording + transcript: connected calls have the full conversation,
  // unanswered calls have the voicemail left, failed calls have the dropped-call capture.
  const transcript =
    status === "completed"
      ? CALL_TRANSCRIPTS[i % CALL_TRANSCRIPTS.length]
      : status === "no_answer"
        ? VOICEMAIL_TRANSCRIPTS[i % VOICEMAIL_TRANSCRIPTS.length]
        : FAILED_TRANSCRIPTS[i % FAILED_TRANSCRIPTS.length];
  const durationSeconds =
    status === "completed" ? 35 + Math.floor(r() * 220) : status === "no_answer" ? 18 + Math.floor(r() * 22) : 4 + Math.floor(r() * 5);
  return {
    id: `voice-log-${i + 1}`,
    contact: fullName(r),
    company: pick(COMPANIES, r),
    account: VOICE_ACCOUNTS[i % VOICE_ACCOUNTS.length],
    direction: i % 4 === 0 ? "inbound" : "outbound",
    status,
    durationSeconds,
    recording: "available",
    transcript,
    calledAt: new Date(Date.now() - i * 1000 * 60 * 63).toISOString(),
    // Inbound calls are never cold outbound dials; most outbound dials in this mock are cold.
    campaignType: i % 4 === 0 ? "warm" : i % 7 === 0 ? "warm" : "cold",
  };
});

export function coldVoiceCallLog(): VoiceLogEntry[] {
  return MOCK_VOICE_LOG.filter((c) => c.campaignType === "cold");
}

// ---------------------------------------------------------------------------
// LinkedIn
// ---------------------------------------------------------------------------

export const LINKEDIN_METRICS = {
  totalLeads: 560,
  connected: 214,
  notConnected: 346,
  replied: 0,
  connectionRatePct: 38,
  conversations: 0,
};

export const LINKEDIN_STATUS_BREAKDOWN: BreakdownSlice[] = [
  { label: "Connected", value: 214 },
  { label: "Not connected", value: 346 },
];

export const LINKEDIN_ACCOUNTS: AccountIdentity[] = [
  { id: "li-1", label: "Aisha Rahman", colorVar: ACCOUNT_COLORS[0] },
  { id: "li-2", label: "Daniel Oyelaran", colorVar: ACCOUNT_COLORS[1] },
  { id: "li-3", label: "Farah Idris", colorVar: ACCOUNT_COLORS[2] },
];

export interface LinkedinAccountStats {
  account: AccountIdentity;
  invitesSent: number;
  connected: number;
  notConnected: number;
}

export const LINKEDIN_ACCOUNT_STATS: LinkedinAccountStats[] = [
  { account: LINKEDIN_ACCOUNTS[0], invitesSent: 210, connected: 84, notConnected: 126 },
  { account: LINKEDIN_ACCOUNTS[1], invitesSent: 188, connected: 71, notConnected: 117 },
  { account: LINKEDIN_ACCOUNTS[2], invitesSent: 162, connected: 59, notConnected: 103 },
];

export const LINKEDIN_DAILY_INVITE_CAP_PCT = 54;

// ---------------------------------------------------------------------------
// Campaigns
// ---------------------------------------------------------------------------

export interface Campaign {
  id: string;
  name: string;
  rep: string;
  channels: ("email" | "whatsapp" | "voice" | "linkedin")[];
  leadsAssigned: number;
  replyRatePct: number;
}

export const MOCK_CAMPAIGNS: Campaign[] = [
  { id: "camp-1", name: "Q2 Enterprise Push", rep: "Sana Iqbal", channels: ["email", "voice"], leadsAssigned: 420, replyRatePct: 9 },
  { id: "camp-2", name: "SMB Warehouse Staffing", rep: "Vikram Joshi", channels: ["email", "whatsapp"], leadsAssigned: 310, replyRatePct: 14 },
  { id: "camp-3", name: "RPO Pilot Outreach", rep: "Sana Iqbal", channels: ["linkedin", "email"], leadsAssigned: 265, replyRatePct: 11 },
  { id: "camp-4", name: "Healthcare Vertical Sprint", rep: "Vikram Joshi", channels: ["email", "whatsapp", "voice"], leadsAssigned: 198, replyRatePct: 7 },
  { id: "camp-5", name: "Event Follow-up — HR Summit", rep: "Sana Iqbal", channels: ["email"], leadsAssigned: 140, replyRatePct: 22 },
  { id: "camp-6", name: "LinkedIn Decision-Maker Sweep", rep: "Vikram Joshi", channels: ["linkedin"], leadsAssigned: 560, replyRatePct: 4 },
];

export function campaignById(id: string) {
  return MOCK_CAMPAIGNS.find((c) => c.id === id);
}

export interface CampaignChannelBreakdown {
  channel: Campaign["channels"][number];
  sent: number;
  replies: number;
}

/** Deterministic per-channel split of a campaign's leads, for the campaign detail page. */
export function campaignChannelBreakdown(campaign: Campaign): CampaignChannelBreakdown[] {
  const r = seededRandom(campaign.id.length * 67 + 5);
  return campaign.channels.map((channel) => {
    const share = 1 / campaign.channels.length;
    const sent = Math.round(campaign.leadsAssigned * share * (0.85 + r() * 0.3));
    const replies = Math.max(0, Math.round(sent * (campaign.replyRatePct / 100) * (0.6 + r() * 0.8)));
    return { channel, sent, replies };
  });
}

export interface CampaignUploadSummary {
  fileName: string;
  uploadedAt: string;
  rowsParsed: number;
  duplicatesSkipped: number;
  errors: number;
}

export const LAST_CAMPAIGN_UPLOAD: CampaignUploadSummary = {
  fileName: "q2-enterprise-leads.csv",
  uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  rowsParsed: 452,
  duplicatesSkipped: 28,
  errors: 4,
};

export interface AssignableLead {
  id: string;
  name: string;
  company: string;
  campaignName: string;
  assignedMemberId: string | null;
}

export const MOCK_ASSIGNABLE_LEADS: AssignableLead[] = Array.from({ length: 16 }, (_, i) => {
  const r = seededRandom(i * 43 + 19);
  const campaign = MOCK_CAMPAIGNS[i % MOCK_CAMPAIGNS.length];
  return {
    id: `assign-${i + 1}`,
    name: fullName(r),
    company: pick(COMPANIES, r),
    campaignName: campaign.name,
    assignedMemberId: i % 3 === 0 ? null : null,
  };
});

// ---------------------------------------------------------------------------
// Email — Received / Bounces / Unsubscribed / Analytics / Warmup
// ---------------------------------------------------------------------------

export interface EmailReceivedEntry {
  id: string;
  sender: string;
  company: string;
  subject: string;
  account: AccountIdentity;
  body: string;
  receivedAt: string;
  threadId: string;
}

const RECEIVED_SUBJECTS = [
  "Re: Quick question about your hiring plans",
  "Re: Staffing partner for Q2 expansion?",
  "Out of office auto-reply",
  "Re: Case study: how we cut time-to-hire by 40%",
  "Re: Open to a 15-min call this week?",
];

export const MOCK_EMAIL_RECEIVED: EmailReceivedEntry[] = Array.from({ length: 16 }, (_, i) => {
  const r = seededRandom(i * 53 + 61);
  return {
    id: `email-recv-${i + 1}`,
    sender: fullName(r),
    company: pick(COMPANIES, r),
    subject: RECEIVED_SUBJECTS[i % RECEIVED_SUBJECTS.length],
    account: EMAIL_ACCOUNTS[i % EMAIL_ACCOUNTS.length],
    body: REPLY_SNIPPETS[i % REPLY_SNIPPETS.length],
    receivedAt: new Date(Date.now() - i * 1000 * 60 * 110).toISOString(),
    threadId: `email-thread-${(i % 10) + 1}`,
  };
});

export interface EmailBounceEntry {
  id: string;
  recipient: string;
  company: string;
  account: AccountIdentity;
  reason: "Mailbox full" | "Invalid address" | "Blocked by spam filter";
  bouncedAt: string;
}

const BOUNCE_REASONS: EmailBounceEntry["reason"][] = ["Invalid address", "Mailbox full", "Blocked by spam filter"];

// 212 total bounces (matches EMAIL_METRICS.bounced); show a representative sample log.
export const MOCK_EMAIL_BOUNCES: EmailBounceEntry[] = Array.from({ length: 18 }, (_, i) => {
  const r = seededRandom(i * 59 + 97);
  return {
    id: `email-bounce-${i + 1}`,
    recipient: fullName(r),
    company: pick(COMPANIES, r),
    account: EMAIL_ACCOUNTS[i % EMAIL_ACCOUNTS.length],
    reason: BOUNCE_REASONS[i % BOUNCE_REASONS.length],
    bouncedAt: new Date(Date.now() - i * 1000 * 60 * 140).toISOString(),
  };
});

export interface EmailUnsubscribeEntry {
  id: string;
  name: string;
  email: string;
  account: AccountIdentity;
  unsubscribedAt: string;
}

// 64 total unsubscribes (matches EMAIL_METRICS.unsubscribed); show a representative sample log.
export const MOCK_EMAIL_UNSUBSCRIBES: EmailUnsubscribeEntry[] = Array.from({ length: 14 }, (_, i) => {
  const r = seededRandom(i * 71 + 131);
  const name = fullName(r);
  return {
    id: `email-unsub-${i + 1}`,
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@${pick(COMPANIES, r).toLowerCase().replace(/\s+/g, "")}.com`,
    account: EMAIL_ACCOUNTS[i % EMAIL_ACCOUNTS.length],
    unsubscribedAt: new Date(Date.now() - i * 1000 * 60 * 220).toISOString(),
  };
});

export interface EmailOpenRateTrendPoint {
  label: string;
  openRatePct: number;
}

export function emailOpenRateTrend(days = 14): EmailOpenRateTrendPoint[] {
  const now = Date.now();
  return Array.from({ length: days }, (_, i) => {
    const dayOffset = days - 1 - i;
    const date = new Date(now - dayOffset * 86400000);
    const r = seededRandom(dayOffset * 43 + 17);
    const trendBase = 32 + (days - dayOffset) * 0.7;
    const openRatePct = Math.max(10, Math.round(trendBase + (r() - 0.5) * 10));
    return { label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }), openRatePct };
  });
}

export const EMAIL_REPLY_RATE_BY_ACCOUNT = EMAIL_ACCOUNT_STATS.map((row) => ({
  label: row.account.label,
  value: Math.round((row.replied / row.sent) * 100),
}));

export const EMAIL_FUNNEL = [
  { label: "Sent", value: EMAIL_METRICS.totalSent },
  { label: "Opened", value: EMAIL_METRICS.opened },
  { label: "Replied", value: EMAIL_METRICS.replied },
];

export interface InboxWarmupStatus {
  account: AccountIdentity;
  warmupPct: number;
  dailyCap: number;
  sentToday: number;
}

export const EMAIL_INBOX_WARMUP: InboxWarmupStatus[] = [
  { account: EMAIL_ACCOUNTS[0], warmupPct: 78, dailyCap: 300, sentToday: 214 },
  { account: EMAIL_ACCOUNTS[1], warmupPct: 66, dailyCap: 300, sentToday: 168 },
  { account: { id: "em-3", label: "outreach@scalepods-outbound.com", colorVar: ACCOUNT_COLORS[2] }, warmupPct: 41, dailyCap: 150, sentToday: 52 },
];

// ---------------------------------------------------------------------------
// WhatsApp — Chat / Leads / Analytics
// ---------------------------------------------------------------------------

export interface ChatMessage {
  id: string;
  direction: "inbound" | "outbound";
  body: string;
  sentAt: string;
}

export interface ChatThread {
  id: string;
  name: string;
  company: string;
  account: AccountIdentity;
  lastMessage: string;
  lastMessageAt: string;
  unread: boolean;
  messages: ChatMessage[];
}

function buildThread(seedBase: number, idx: number, accounts: AccountIdentity[]): ChatThread {
  const r = seededRandom(seedBase + idx * 13);
  const name = fullName(r);
  const company = pick(COMPANIES, r);
  const messageCount = 3 + Math.floor(r() * 4);
  const messages: ChatMessage[] = Array.from({ length: messageCount }, (_, mi) => ({
    id: `msg-${idx}-${mi}`,
    direction: mi % 2 === 0 ? "inbound" : "outbound",
    body:
      mi % 2 === 0
        ? REPLY_SNIPPETS[(idx + mi) % REPLY_SNIPPETS.length]
        : "Thanks for the reply! Happy to share more details — what works best for a quick call?",
    sentAt: new Date(Date.now() - (messageCount - mi) * 1000 * 60 * 40).toISOString(),
  }));
  return {
    id: `thread-${idx + 1}`,
    name,
    company,
    account: accounts[idx % accounts.length],
    lastMessage: messages[messages.length - 1].body,
    lastMessageAt: messages[messages.length - 1].sentAt,
    unread: idx % 4 === 0,
    messages,
  };
}

export const MOCK_WHATSAPP_THREADS: ChatThread[] = Array.from({ length: 10 }, (_, i) =>
  buildThread(300, i, WHATSAPP_ACCOUNTS)
);

export interface WhatsappLead {
  id: string;
  name: string;
  phone: string;
  status: "new" | "engaged" | "replied" | "unresponsive";
  account: AccountIdentity;
  lastActivityAt: string;
  threadId: string;
}

const WA_LEAD_STATUSES: WhatsappLead["status"][] = [
  "unresponsive", "unresponsive", "unresponsive",
  "new", "new", "new",
  "engaged", "engaged",
  "replied",
];

export const MOCK_WHATSAPP_LEADS: WhatsappLead[] = Array.from({ length: 20 }, (_, i) => {
  const r = seededRandom(i * 47 + 83);
  return {
    id: `wa-lead-${i + 1}`,
    name: fullName(r),
    phone: `+${pick(["971 50", "91 98", "44 20", "1 415"], r)} ${Math.floor(1000000 + r() * 8999999)}`,
    status: WA_LEAD_STATUSES[i % WA_LEAD_STATUSES.length],
    account: WHATSAPP_ACCOUNTS[i % WHATSAPP_ACCOUNTS.length],
    lastActivityAt: new Date(Date.now() - i * 1000 * 60 * 75).toISOString(),
    threadId: `thread-${(i % 10) + 1}`,
  };
});

export function whatsappResponseRateTrend(days = 14) {
  const now = Date.now();
  return Array.from({ length: days }, (_, i) => {
    const dayOffset = days - 1 - i;
    const date = new Date(now - dayOffset * 86400000);
    const r = seededRandom(dayOffset * 37 + 29);
    const trendBase = 26 + (days - dayOffset) * 0.6;
    const responseRatePct = Math.max(8, Math.round(trendBase + (r() - 0.5) * 10));
    return { label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }), responseRatePct };
  });
}

export const WHATSAPP_CHATS_BY_ACCOUNT = WHATSAPP_ACCOUNT_STATS.map((row) => ({
  label: row.account.label,
  value: row.chats,
}));

// ---------------------------------------------------------------------------
// Voice — Cold Call Logs / Analytics
// ---------------------------------------------------------------------------

export function voiceCallVolumeTrend(days = 14) {
  const now = Date.now();
  return Array.from({ length: days }, (_, i) => {
    const dayOffset = days - 1 - i;
    const date = new Date(now - dayOffset * 86400000);
    const r = seededRandom(dayOffset * 53 + 61);
    const trendBase = 48 + (days - dayOffset) * 1.1;
    const calls = Math.max(10, Math.round(trendBase + (r() - 0.45) * 20));
    return { label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }), calls };
  });
}

export const VOICE_CONNECT_RATE_BY_NUMBER = VOICE_ACCOUNT_STATS.map((row) => ({
  label: row.account.label,
  value: Math.round((row.connected / row.totalCalls) * 100),
}));

// ---------------------------------------------------------------------------
// LinkedIn — Chat / Leads / Analytics
// ---------------------------------------------------------------------------

export const MOCK_LINKEDIN_THREADS: ChatThread[] = Array.from({ length: 8 }, (_, i) =>
  buildThread(500, i, LINKEDIN_ACCOUNTS)
);

// ---------------------------------------------------------------------------
// Email — conversation threads (for Sent / Received row click-through)
// ---------------------------------------------------------------------------

export const MOCK_EMAIL_THREADS: ChatThread[] = Array.from({ length: 10 }, (_, i) => ({
  ...buildThread(700, i, EMAIL_ACCOUNTS),
  id: `email-thread-${i + 1}`,
}));

export interface LinkedinLead {
  id: string;
  name: string;
  title: string;
  company: string;
  status: "not_connected" | "pending" | "connected" | "replied";
  account: AccountIdentity;
  lastActivityAt: string;
  threadId: string;
}

const TITLES = ["Head of Talent", "VP Operations", "HR Director", "Procurement Lead", "COO", "Founder", "Hiring Manager"];

const LI_LEAD_STATUSES: LinkedinLead["status"][] = [
  "not_connected", "not_connected", "not_connected",
  "pending", "pending",
  "connected", "connected",
  "replied",
];

export const MOCK_LINKEDIN_LEADS: LinkedinLead[] = Array.from({ length: 18 }, (_, i) => {
  const r = seededRandom(i * 61 + 113);
  return {
    id: `li-lead-${i + 1}`,
    name: fullName(r),
    title: pick(TITLES, r),
    company: pick(COMPANIES, r),
    status: LI_LEAD_STATUSES[i % LI_LEAD_STATUSES.length],
    account: LINKEDIN_ACCOUNTS[i % LINKEDIN_ACCOUNTS.length],
    lastActivityAt: new Date(Date.now() - i * 1000 * 60 * 95).toISOString(),
    threadId: `thread-${(i % 8) + 1}`,
  };
});

export function linkedinConnectionRateTrend(days = 14) {
  const now = Date.now();
  return Array.from({ length: days }, (_, i) => {
    const dayOffset = days - 1 - i;
    const date = new Date(now - dayOffset * 86400000);
    const r = seededRandom(dayOffset * 71 + 83);
    const trendBase = 30 + (days - dayOffset) * 0.5;
    const connectionRatePct = Math.max(10, Math.round(trendBase + (r() - 0.5) * 8));
    return { label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }), connectionRatePct };
  });
}

export const LINKEDIN_LEADS_BY_SENDER = LINKEDIN_ACCOUNT_STATS.map((row) => ({
  label: row.account.label,
  value: row.invitesSent,
}));
