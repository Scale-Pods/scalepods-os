import { agoIso, aheadIso } from "@/lib/mock-data/marketing";
import type { ContentFormat, ContentPlatform } from "@/lib/mock-data/marketing";

/**
 * Secondary Content OS data (board, strategy, research, studios, publishing,
 * settings). Fully static and deterministic: dates come from the fixed
 * reference instant in marketing.ts.
 */

// ---------------------------------------------------------------------------
// Board (maker-checker kanban)
// ---------------------------------------------------------------------------

export type TicketType = "task" | "design" | "copy" | "video" | "blog";
export type TicketPriority = "highest" | "high" | "medium" | "low";
export type BoardColumnId = "backlog" | "progress" | "review" | "done";

export interface BoardColumn {
  id: BoardColumnId;
  label: string;
  hint: string;
  terminal?: boolean;
}

export const BOARD_COLUMNS: BoardColumn[] = [
  { id: "backlog", label: "Backlog", hint: "Briefed, not started" },
  { id: "progress", label: "In progress", hint: "Maker is working" },
  { id: "review", label: "In review", hint: "Checker decides" },
  { id: "done", label: "Done", hint: "Accepted by the reviewer", terminal: true },
];

export interface TicketActivity {
  at: string;
  actor: string;
  action: string;
}

export interface BoardTicket {
  id: string;
  key: string;
  title: string;
  description: string;
  type: TicketType;
  priority: TicketPriority;
  column: BoardColumnId;
  assignee: string;
  reviewerIdx: number;
  labels: string[];
  dueDate: string;
  linkedDraftId?: string;
  rejectionNote?: string;
  acceptedAt?: string;
  activity: TicketActivity[];
}

export const BOARD_TICKETS: BoardTicket[] = [
  {
    id: "t1", key: "SP-101", title: "Write Silent Payroll Killer carousel copy", description: "6-slide carousel for Ops leaders. Use only approved Ops Pod stats.",
    type: "copy", priority: "high", column: "done", assignee: "Content Agent", reviewerIdx: 1, labels: ["carousel", "ops-pod"], dueDate: aheadIso(-2), linkedDraftId: "draft-2", acceptedAt: agoIso(2),
    activity: [
      { at: agoIso(5), actor: "Content Agent", action: "Created ticket" },
      { at: agoIso(3), actor: "Content Agent", action: "Moved to In review" },
      { at: agoIso(2), actor: "Reviewer", action: "Accepted and moved to Done" },
    ],
  },
  {
    id: "t2", key: "SP-102", title: "Review: 35,000 Leads. 0 New Hires.", description: "Case-study carousel for sales leaders; verify 30% / 55% figures.",
    type: "copy", priority: "highest", column: "review", assignee: "Content Agent", reviewerIdx: 0, labels: ["carousel", "case-study"], dueDate: aheadIso(1), linkedDraftId: "draft-3",
    activity: [
      { at: agoIso(2, 4), actor: "Content Agent", action: "Created ticket" },
      { at: agoIso(0, 3), actor: "Content Agent", action: "Submitted for review" },
    ],
  },
  {
    id: "t3", key: "SP-103", title: "Fix 'Marketing Pod' image headline claim", description: "Reviewer sent back: remove the unapproved timeframe on the 10x claim.",
    type: "design", priority: "high", column: "progress", assignee: "Content Agent", reviewerIdx: 0, labels: ["image", "rework"], dueDate: aheadIso(2), linkedDraftId: "draft-13",
    rejectionNote: "\"10x output in a week\" is not an approved claim. Use the approved 10x content production output stat without a timeframe.",
    activity: [
      { at: agoIso(6), actor: "Content Agent", action: "Created ticket" },
      { at: agoIso(1, 4), actor: "Reviewer", action: "Sent back to In progress" },
    ],
  },
  {
    id: "t4", key: "SP-104", title: "Blog: qualify inbound leads without headcount", description: "880-word SEO article with CTA card variant (dark banner).",
    type: "blog", priority: "medium", column: "review", assignee: "Content Agent", reviewerIdx: 0, labels: ["blog", "seo"], dueDate: aheadIso(4), linkedDraftId: "draft-9",
    activity: [
      { at: agoIso(3, 5), actor: "Content Agent", action: "Created ticket" },
      { at: agoIso(1, 1), actor: "Reviewer", action: "Commented: shorten meta description" },
    ],
  },
  {
    id: "t5", key: "SP-105", title: "Invoice audit 14-field checklist article", description: "Evergreen how-to for Ops audience.",
    type: "blog", priority: "medium", column: "backlog", assignee: "Unassigned", reviewerIdx: 1, labels: ["blog", "ops-pod"], dueDate: aheadIso(8), linkedDraftId: "draft-10",
    activity: [{ at: agoIso(0, 10), actor: "Content Agent", action: "Created ticket" }],
  },
  {
    id: "t6", key: "SP-106", title: "UGC reel: 45-minute invoice check", description: "Generate and review the Ops UGC testimonial reel.",
    type: "video", priority: "high", column: "review", assignee: "Video Studio", reviewerIdx: 1, labels: ["ugc", "reel"], dueDate: aheadIso(2), linkedDraftId: "draft-v1",
    activity: [
      { at: agoIso(2, 5), actor: "Video Studio", action: "Storyboard approved, render started" },
      { at: agoIso(0, 4), actor: "Video Studio", action: "Submitted for review" },
    ],
  },
  {
    id: "t7", key: "SP-107", title: "UGC reel: 8 hours of CRM updates", description: "Sales rep persona reel. Approved, waiting on publish slot.",
    type: "video", priority: "medium", column: "done", assignee: "Video Studio", reviewerIdx: 0, labels: ["ugc", "reel"], dueDate: aheadIso(3), linkedDraftId: "draft-v2", acceptedAt: agoIso(1, 6),
    activity: [
      { at: agoIso(5, 3), actor: "Video Studio", action: "Created ticket" },
      { at: agoIso(1, 6), actor: "Reviewer", action: "Accepted and moved to Done" },
    ],
  },
  {
    id: "t8", key: "SP-108", title: "Billboard 2: tighten hook and CTA", description: "Hook is too long for a 3-second read at billboard size.",
    type: "video", priority: "medium", column: "progress", assignee: "Video Studio", reviewerIdx: 1, labels: ["billboard"], dueDate: aheadIso(5), linkedDraftId: "draft-v4",
    activity: [{ at: agoIso(1, 6), actor: "Video Studio", action: "Moved to In progress" }],
  },
  {
    id: "t9", key: "SP-109", title: "Turmeric reel: new opening frame", description: "Open on the golden swirl, drop the pricing card.",
    type: "video", priority: "high", column: "progress", assignee: "Video Studio", reviewerIdx: 1, labels: ["product-ad", "rework"], dueDate: aheadIso(3), linkedDraftId: "draft-v6",
    rejectionNote: "Open on the golden swirl instead of the pack shot and remove the pricing card.",
    activity: [{ at: agoIso(2, 2), actor: "Reviewer", action: "Sent back to In progress" }],
  },
  {
    id: "t10", key: "SP-110", title: "Powered by Claude partner badge image", description: "Terracotta badge, partner-only usage.",
    type: "design", priority: "low", column: "backlog", assignee: "Unassigned", reviewerIdx: 0, labels: ["image", "partner"], dueDate: aheadIso(7), linkedDraftId: "draft-14",
    activity: [{ at: agoIso(0, 5), actor: "Content Agent", action: "Created ticket" }],
  },
  {
    id: "t11", key: "SP-111", title: "Weekly LinkedIn: 3 seconds lead response", description: "Thought-leadership post for Sales Pod audience.",
    type: "copy", priority: "medium", column: "done", assignee: "Content Agent", reviewerIdx: 1, labels: ["linkedin"], dueDate: aheadIso(2), linkedDraftId: "draft-12", acceptedAt: agoIso(2, 3),
    activity: [{ at: agoIso(2, 3), actor: "Reviewer", action: "Accepted and moved to Done" }],
  },
  {
    id: "t12", key: "SP-112", title: "YouTube description for founder take", description: "Chapters + CTA. Video itself is manual (HeyGen).",
    type: "task", priority: "low", column: "backlog", assignee: "Unassigned", reviewerIdx: 0, labels: ["youtube"], dueDate: aheadIso(10), linkedDraftId: "draft-18",
    activity: [{ at: agoIso(0, 8), actor: "Content Agent", action: "Created ticket" }],
  },
];

export const PRIORITY_TONE: Record<TicketPriority, string> = {
  highest: "bg-destructive/15 text-destructive",
  high: "bg-warning/15 text-warning",
  medium: "bg-primary/15 text-primary",
  low: "bg-muted text-muted-foreground",
};

// ---------------------------------------------------------------------------
// Strategy
// ---------------------------------------------------------------------------

export interface Campaign {
  id: string;
  name: string;
  goal: string;
  pillarId: string;
  status: "Active" | "Planned" | "Completed";
  start: string;
  end: string;
  channels: ContentPlatform[];
  plannedPieces: number;
  producedPieces: number;
  kpi: string;
  progress: number;
}

export const CAMPAIGNS: Campaign[] = [
  { id: "cmp-1", name: "Scale capacity, not payroll", goal: "Brand awareness among ops and sales leaders", pillarId: "pillar-marketing", status: "Active", start: agoIso(21), end: aheadIso(24), channels: ["linkedin", "instagram", "x", "facebook"], plannedPieces: 24, producedPieces: 15, kpi: "250k impressions", progress: 62 },
  { id: "cmp-2", name: "Automation Audit pipeline", goal: "Book Automation Audit calls from LinkedIn and Instagram", pillarId: "pillar-sales", status: "Active", start: agoIso(10), end: aheadIso(35), channels: ["linkedin", "instagram"], plannedPieces: 18, producedPieces: 8, kpi: "40 audit bookings", progress: 38 },
  { id: "cmp-3", name: "Case-study proof series", goal: "Turn the three verified case studies into carousels, posts and blog articles", pillarId: "pillar-proof", status: "Active", start: agoIso(14), end: aheadIso(14), channels: ["linkedin", "instagram", "blog"], plannedPieces: 12, producedPieces: 9, kpi: "12 pieces published", progress: 75 },
  { id: "cmp-4", name: "Pod-by-Pod launch: HR + Ops", goal: "Dedicated 4-week sequence per Pod", pillarId: "pillar-hr", status: "Planned", start: aheadIso(30), end: aheadIso(58), channels: ["linkedin", "instagram", "youtube"], plannedPieces: 16, producedPieces: 0, kpi: "Pod page visits +40%", progress: 0 },
  { id: "cmp-5", name: "Q3 recap: expo follow-ups", goal: "Event ROI storytelling", pillarId: "pillar-proof", status: "Completed", start: agoIso(70), end: agoIso(35), channels: ["linkedin", "facebook"], plannedPieces: 10, producedPieces: 10, kpi: "65% event ROI story", progress: 100 },
];

export interface WeeklySlot {
  day: string;
  platform: ContentPlatform;
  format: ContentFormat;
  topic: string;
  pillarId: string;
  status: "Generated" | "In review" | "Planned" | "Manual only";
}

export const WEEKLY_PLAN: WeeklySlot[] = [
  { day: "Mon", platform: "linkedin", format: "text", topic: "Case study: 35,000 leads, zero hires", pillarId: "pillar-proof", status: "Generated" },
  { day: "Mon", platform: "x", format: "text", topic: "Scale capacity, not payroll", pillarId: "pillar-marketing", status: "Generated" },
  { day: "Tue", platform: "instagram", format: "carousel", topic: "The Silent Payroll Killer", pillarId: "pillar-ops", status: "Generated" },
  { day: "Wed", platform: "linkedin", format: "text", topic: "What 45 minutes of invoice checking costs", pillarId: "pillar-ops", status: "In review" },
  { day: "Wed", platform: "blog", format: "blog", topic: "Qualify inbound leads without headcount", pillarId: "pillar-sales", status: "In review" },
  { day: "Thu", platform: "instagram", format: "ugc", topic: "UGC reel: invoice check in under 60s", pillarId: "pillar-ops", status: "In review" },
  { day: "Thu", platform: "facebook", format: "image", topic: "Expo leads followed up in 30 seconds", pillarId: "pillar-proof", status: "Generated" },
  { day: "Fri", platform: "linkedin", format: "billboard", topic: "Billboard: Scale capacity, not payroll", pillarId: "pillar-marketing", status: "Generated" },
  { day: "Fri", platform: "youtube", format: "video", topic: "Founder take: why we call them Pods", pillarId: "pillar-marketing", status: "Manual only" },
  { day: "Sat", platform: "instagram", format: "carousel", topic: "How to shortlist candidates in 5 days", pillarId: "pillar-hr", status: "Planned" },
];

export const CTA_STRATEGY = [
  { cta: "Comment SCALEPODS to evaluate your workflow", where: "Instagram carousels and reels", intent: "Low-friction lead capture via comments", ctr: "4.2% comment rate" },
  { cta: "Book an Automation Audit", where: "LinkedIn posts, blog end-cards, billboards", intent: "High-intent booking", ctr: "2.8% click-through" },
  { cta: "Link in bio to book a demo", where: "Instagram reels and stories, X", intent: "Demo requests", ctr: "1.9% profile-to-site" },
];

export const LEAD_GEN = [
  { id: "lg-1", name: "Comment-to-DM: SCALEPODS keyword", channel: "Instagram", leads: 74, qualified: 31, conversion: "42%", status: "Running" },
  { id: "lg-2", name: "Automation Audit booking page", channel: "LinkedIn", leads: 38, qualified: 22, conversion: "58%", status: "Running" },
  { id: "lg-3", name: "Blog end-card to demo form", channel: "Blog", leads: 26, qualified: 9, conversion: "35%", status: "Running" },
  { id: "lg-4", name: "Expo follow-up playbook download", channel: "Facebook", leads: 12, qualified: 4, conversion: "33%", status: "Paused" },
];

// ---------------------------------------------------------------------------
// Research: trends, alerts, intelligence
// ---------------------------------------------------------------------------

export type TrendSource = "Reddit" | "Instagram" | "YouTube" | "Google Search" | "Google Trends";

export interface TrendSignal {
  id: string;
  source: TrendSource;
  title: string;
  summary: string;
  relevance: number;
  velocity: "Rising" | "Steady" | "Spiking";
  detectedAt: string;
  pillarId: string;
  suggestedAngle: string;
  engagement: string;
}

export const TREND_SIGNALS: TrendSignal[] = [
  { id: "tr-1", source: "Reddit", title: "r/sales: \"Our reps spend more time in the CRM than on calls\"", summary: "Thread with 1.2k upvotes on CRM admin burden; top comments ask for automated field updates.", relevance: 94, velocity: "Spiking", detectedAt: agoIso(0, 6), pillarId: "pillar-sales", suggestedAngle: "8 hours saved per rep, 3-second CRM updates", engagement: "1.2k upvotes, 340 comments" },
  { id: "tr-2", source: "Google Trends", title: "\"AI agents for operations\" search interest up 38% in 30 days", summary: "Steady climb among US/UK/UAE; related queries include invoice automation and AP agents.", relevance: 91, velocity: "Rising", detectedAt: agoIso(0, 10), pillarId: "pillar-ops", suggestedAngle: "Invoice audit in under 60 seconds", engagement: "+38% interest" },
  { id: "tr-3", source: "YouTube", title: "Recruiter-tech breakdowns: ATS screening automation", summary: "Three top videos this week cover resume parsing agents; comments complain about scheduling ping-pong.", relevance: 86, velocity: "Rising", detectedAt: agoIso(1, 2), pillarId: "pillar-hr", suggestedAngle: "14 days to 5 days case study", engagement: "212k views combined" },
  { id: "tr-4", source: "Instagram", title: "Carousel format: \"X vs Y\" comparison cards trending in B2B", summary: "Cream-background comparison carousels outperform dark stat cards in saves.", relevance: 79, velocity: "Steady", detectedAt: agoIso(1, 8), pillarId: "pillar-marketing", suggestedAngle: "Manual validation vs Ops Pod comparison carousel", engagement: "Avg 9.4% save rate" },
  { id: "tr-5", source: "Google Search", title: "\"how to qualify inbound leads without hiring\"", summary: "Low competition, high commercial intent. Blog opportunity.", relevance: 88, velocity: "Rising", detectedAt: agoIso(2), pillarId: "pillar-sales", suggestedAngle: "Blog: inbound lead qualification blueprint", engagement: "2.4k monthly searches" },
  { id: "tr-6", source: "Reddit", title: "r/startups: lean-team playbooks after 2026 hiring freezes", summary: "Founders discuss keeping output flat while headcount is frozen.", relevance: 83, velocity: "Steady", detectedAt: agoIso(3), pillarId: "pillar-marketing", suggestedAngle: "Scale capacity, not payroll", engagement: "640 upvotes" },
  { id: "tr-7", source: "YouTube", title: "Claude-powered agent workflows going viral in dev circles", summary: "Developer-first audience curious about reliability and audit logging.", relevance: 76, velocity: "Rising", detectedAt: agoIso(3, 6), pillarId: "pillar-marketing", suggestedAngle: "Powered by Claude: security and audit logs", engagement: "98k views" },
  { id: "tr-8", source: "Instagram", title: "UGC testimonial reels with on-screen captions beat polished ads", summary: "Phone-filmed, person-to-camera reels get 2x watch time in B2B SaaS.", relevance: 81, velocity: "Rising", detectedAt: agoIso(4), pillarId: "pillar-ops", suggestedAngle: "UGC reels: invoice check, CRM updates", engagement: "2x watch time" },
];

export interface WatchItem {
  id: string;
  name: string;
  keywords: string[];
  sources: string[];
  status: "Active" | "Paused" | "Last check failed";
  matches7d: number;
  spike: boolean;
  lastCheck: string;
  alertRule: string;
  budgetUsed: number;
}

export const WATCH_ITEMS: WatchItem[] = [
  { id: "w-1", name: "ScalePods brand mentions", keywords: ["ScalePods", "scalepods.co"], sources: ["News", "Reddit", "Web"], status: "Active", matches7d: 14, spike: false, lastCheck: agoIso(0, 2), alertRule: "Email on any mention", budgetUsed: 22 },
  { id: "w-2", name: "AI agents for operations", keywords: ["AI agent invoice", "AP automation", "ops agents"], sources: ["News", "YouTube", "Web"], status: "Active", matches7d: 63, spike: true, lastCheck: agoIso(0, 3), alertRule: "Slack on spike above 2x baseline", budgetUsed: 61 },
  { id: "w-3", name: "Competitor: freelance automation shops", keywords: ["n8n agency", "Zapier consultant"], sources: ["Web", "Reddit"], status: "Active", matches7d: 29, spike: false, lastCheck: agoIso(0, 5), alertRule: "Weekly digest", budgetUsed: 35 },
  { id: "w-4", name: "Hiring automation market", keywords: ["resume screening AI", "ATS automation"], sources: ["News", "YouTube"], status: "Paused", matches7d: 0, spike: false, lastCheck: agoIso(6), alertRule: "Weekly digest", budgetUsed: 12 },
  { id: "w-5", name: "Anthropic / Claude announcements", keywords: ["Claude", "Anthropic"], sources: ["News", "Reddit"], status: "Last check failed", matches7d: 8, spike: false, lastCheck: agoIso(1, 4), alertRule: "Email on high importance", budgetUsed: 48 },
];

export const ALERT_EVENTS = [
  { id: "ae-1", watchId: "w-2", title: "Spike: \"AI invoice agent\" coverage up 3.1x", source: "News", importance: "High", at: agoIso(0, 3) },
  { id: "ae-2", watchId: "w-1", title: "ScalePods mentioned in r/Entrepreneur automation thread", source: "Reddit", importance: "Medium", at: agoIso(0, 9) },
  { id: "ae-3", watchId: "w-3", title: "Agency launches flat-fee n8n retainer", source: "Web", importance: "Medium", at: agoIso(1, 2) },
  { id: "ae-4", watchId: "w-5", title: "Anthropic ships longer-context update", source: "News", importance: "High", at: agoIso(2, 5) },
  { id: "ae-5", watchId: "w-2", title: "YouTube explainer on AP automation passes 100k views", source: "YouTube", importance: "Low", at: agoIso(3) },
];

export interface IntelligenceSection {
  id: string;
  name: string;
  status: "Completed" | "Processing" | "Pending" | "Failed";
  score: number;
  summary: string;
  findings: string[];
}

export const INTELLIGENCE_SECTIONS: IntelligenceSection[] = [
  { id: "in-1", name: "Website", status: "Completed", score: 84, summary: "Clear Pod structure; case-study proof is buried below the fold.", findings: ["Pod pages load in under 1.8s", "Only one CTA per page: Book an Automation Audit", "Case studies lack a printable PDF"] },
  { id: "in-2", name: "Instagram", status: "Completed", score: 78, summary: "Carousels earn 2.4x the saves of single images; reels are under-used.", findings: ["Best time to post: 12:00-13:00 UTC", "Comment-keyword CTA converts at 4.2%", "UGC reels untested until this sprint"] },
  { id: "in-3", name: "Facebook", status: "Completed", score: 61, summary: "Low reach, but expo case-study post is the best performer.", findings: ["Audience skews to event attendees", "Reuse LinkedIn text posts"] },
  { id: "in-4", name: "LinkedIn", status: "Completed", score: 88, summary: "Primary channel. Case-study text posts drive most Automation Audit clicks.", findings: ["Posts with a single number in the hook get 1.7x impressions", "Tuesday-Thursday mornings perform best"] },
  { id: "in-5", name: "Competitors", status: "Completed", score: 72, summary: "Freelance automation shops win on price, lose on ongoing optimisation.", findings: ["Position on audit trail and compliance", "Avoid price comparisons"] },
  { id: "in-6", name: "SEO", status: "Processing", score: 0, summary: "Crawl in progress: 18 of 26 pages analysed.", findings: [] },
  { id: "in-7", name: "Audience", status: "Pending", score: 0, summary: "Queued after SEO completes.", findings: [] },
];

// ---------------------------------------------------------------------------
// Studios: AI Studio, Carousel Studio, Video Studio, Content Factory
// ---------------------------------------------------------------------------

export const STUDIO_STYLES = [
  { id: "typographic-poster", label: "Typographic poster", bestFor: "Bold single-claim announcements", ratio: "4:5" },
  { id: "data-card", label: "Data card", bestFor: "One verified stat with context", ratio: "1:1" },
  { id: "ui-mockup", label: "UI mockup", bestFor: "Dashboards and audit logs", ratio: "4:5" },
  { id: "isometric-3d", label: "Isometric 3D", bestFor: "Pod architecture and workflows", ratio: "1:1" },
  { id: "neon-tech", label: "Neon tech", bestFor: "Claude / developer audience", ratio: "9:16" },
  { id: "whiteboard-diagram", label: "Whiteboard diagram", bestFor: "3-step methodology", ratio: "4:5" },
  { id: "editorial-photo", label: "Editorial photo", bestFor: "People in work environments", ratio: "4:5" },
  { id: "gradient-mesh", label: "Gradient mesh", bestFor: "Brand backgrounds", ratio: "9:16" },
];

export const IMAGE_REQUESTS = [
  { id: "img-1", prompt: "Stat card: '14+ fields' in Sage Green on deep green", style: "data-card", status: "Chosen", options: 4, cost: 0.16, draftId: "draft-5", at: agoIso(16) },
  { id: "img-2", prompt: "Hub-and-spoke diagram: one asset, five platforms", style: "whiteboard-diagram", status: "Sent back", options: 4, cost: 0.16, draftId: "draft-13", at: agoIso(6) },
  { id: "img-3", prompt: "Before/after card: 2-3 days vs 30 seconds", style: "typographic-poster", status: "Chosen", options: 4, cost: 0.16, draftId: "draft-15", at: agoIso(4, 5) },
  { id: "img-4", prompt: "Terracotta Claude partner badge on dark navy", style: "neon-tech", status: "Awaiting pick", options: 4, cost: 0.16, draftId: "draft-14", at: agoIso(0, 5) },
  { id: "img-5", prompt: "Dashboard audit log mockup, 14 fields highlighted", style: "ui-mockup", status: "Chosen", options: 3, cost: 0.12, draftId: "draft-6", at: agoIso(1, 7) },
];

export const CAROUSEL_JOBS = [
  { id: "cj-1", topic: "The Silent Payroll Killer", keyword: "SCALEPODS", status: "done", slides: 6, renderMin: 11, draftId: "draft-2", at: agoIso(5, 6) },
  { id: "cj-2", topic: "35,000 Leads. 0 New Hires.", keyword: "SCALEPODS", status: "draft_ready", slides: 5, renderMin: 0, draftId: "draft-3", at: agoIso(2, 4) },
  { id: "cj-3", topic: "How to shortlist candidates in 5 days", keyword: "HIRING", status: "done", slides: 5, renderMin: 9, draftId: "draft-4", at: agoIso(4, 2) },
  { id: "cj-4", topic: "Audit. Build. Scale. The 3-step method", keyword: "AUDIT", status: "rendering", slides: 5, renderMin: 4, draftId: "", at: agoIso(0, 1) },
];

export const VIDEO_TYPES = [
  { id: "founder", label: "Founder take", bestFor: "Hot-take to camera", length: "20-60s", engine: "HeyGen / Kling Avatar", vo: true, manual: true },
  { id: "ugc", label: "UGC testimonial", bestFor: "Person-to-camera, phone register", length: "15-45s", engine: "Kling Avatar", vo: true, manual: false },
  { id: "motion", label: "Motion graphics / kinetic text", bestFor: "Billboards and stat reveals, no AI model", length: "10-30s", engine: "HTML + GSAP + FFmpeg", vo: false, manual: false },
  { id: "broll", label: "B-roll + voiceover", bestFor: "Cinematic product and workflow shots", length: "15-45s", engine: "Veo 3.1 multi-shot", vo: true, manual: false },
  { id: "demo", label: "Product / UI demo", bestFor: "Real screenshots animated", length: "15-45s", engine: "Motion graphics + real assets", vo: false, manual: false },
  { id: "hook", label: "Hook cut / myth-buster", bestFor: "3-5 fast shots with big type", length: "10-20s", engine: "Veo / Kling + overlay", vo: false, manual: false },
];

export const VIDEO_JOBS = [
  { id: "vj-1", title: "UGC testimonial: 45-minute invoice check", type: "UGC testimonial", status: "Awaiting review", shots: 1, costUsd: 1.8, ceilingUsd: 5, videoId: "vid-ugc-1", at: agoIso(2, 5) },
  { id: "vj-2", title: "UGC testimonial: 8 hours of CRM updates", type: "UGC testimonial", status: "Approved", shots: 1, costUsd: 1.8, ceilingUsd: 5, videoId: "vid-ugc-2", at: agoIso(5, 3) },
  { id: "vj-3", title: "Billboard: Scale capacity, not payroll", type: "Motion graphics", status: "Scheduled", shots: 4, costUsd: 0, ceilingUsd: 5, videoId: "vid-billboard-1", at: agoIso(7) },
  { id: "vj-4", title: "Billboard: Book an Automation Audit", type: "Motion graphics", status: "Draft", shots: 3, costUsd: 0, ceilingUsd: 5, videoId: "vid-billboard-2", at: agoIso(1, 6) },
  { id: "vj-5", title: "Product ad sample: cold-pressed oil", type: "B-roll + voiceover", status: "Published", shots: 3, costUsd: 3.6, ceilingUsd: 5, videoId: "vid-oil", at: agoIso(14) },
  { id: "vj-6", title: "Product reel sample: turmeric", type: "B-roll + voiceover", status: "Sent back", shots: 3, costUsd: 3.2, ceilingUsd: 5, videoId: "vid-turmeric", at: agoIso(9) },
];

export const FACTORY_QUEUE = [
  { id: "cf-1", slot: "Mon", platform: "linkedin" as ContentPlatform, type: "social_caption", topic: "Case study: 35,000 leads", status: "Generated", cost: 0.02 },
  { id: "cf-2", slot: "Tue", platform: "instagram" as ContentPlatform, type: "carousel", topic: "The Silent Payroll Killer", status: "Generated", cost: 0.31 },
  { id: "cf-3", slot: "Wed", platform: "linkedin" as ContentPlatform, type: "social_caption", topic: "45 minutes of invoice checking", status: "Generated", cost: 0.02 },
  { id: "cf-4", slot: "Thu", platform: "instagram" as ContentPlatform, type: "static_image", topic: "14+ fields. 60 seconds.", status: "Generated", cost: 0.17 },
  { id: "cf-5", slot: "Fri", platform: "facebook" as ContentPlatform, type: "static_image", topic: "Expo leads in 30 seconds", status: "Generating", cost: 0.17 },
  { id: "cf-6", slot: "Sat", platform: "instagram" as ContentPlatform, type: "carousel", topic: "Shortlist candidates in 5 days", status: "Queued", cost: 0.31 },
];

// ---------------------------------------------------------------------------
// Publishing + settings
// ---------------------------------------------------------------------------

export const CONNECTIONS = [
  { platform: "linkedin" as ContentPlatform, route: "Buffer (LinkedIn Company Page)", account: "ScalePods", status: "Connected", lastSync: agoIso(0, 2) },
  { platform: "instagram" as ContentPlatform, route: "Meta Graph v22", account: "@scalepods.co", status: "Connected", lastSync: agoIso(0, 2) },
  { platform: "facebook" as ContentPlatform, route: "Meta Graph v22", account: "ScalePods", status: "Connected", lastSync: agoIso(0, 3) },
  { platform: "x" as ContentPlatform, route: "Buffer (flat per-channel pricing)", account: "@scalepods", status: "Connected", lastSync: agoIso(0, 4) },
  { platform: "youtube" as ContentPlatform, route: "YouTube Data v3 (manual only)", account: "ScalePods", status: "Manual only", lastSync: agoIso(5) },
  { platform: "blog" as ContentPlatform, route: "scalepods.co /api/blog/publish", account: "scalepods.co/blog", status: "Connected", lastSync: agoIso(0, 6) },
];

export interface PublishLogEntry {
  id: string;
  draftId: string;
  mode: "Post now" | "Scheduled (best time)";
  status: "Posted" | "Queued" | "Failed";
  at: string;
  note: string;
}

export const PUBLISH_LOG: PublishLogEntry[] = [
  { id: "pl-1", draftId: "draft-1", mode: "Scheduled (best time)", status: "Posted", at: agoIso(9, -1), note: "Published to LinkedIn via Buffer" },
  { id: "pl-2", draftId: "draft-5", mode: "Post now", status: "Posted", at: agoIso(13, -2), note: "Published to Instagram feed" },
  { id: "pl-3", draftId: "draft-8", mode: "Post now", status: "Posted", at: agoIso(8, -3), note: "Published to X via Buffer" },
  { id: "pl-4", draftId: "draft-11", mode: "Scheduled (best time)", status: "Posted", at: agoIso(15, -1), note: "Blog live at scalepods.co/blog/automating-tech-resume-screening" },
  { id: "pl-5", draftId: "draft-v5", mode: "Post now", status: "Posted", at: agoIso(11, -4), note: "Uploaded to YouTube Shorts (manual)" },
  { id: "pl-6", draftId: "draft-16", mode: "Scheduled (best time)", status: "Failed", at: agoIso(17, -2), note: "Facebook token expired; re-posted manually after reconnect" },
  { id: "pl-7", draftId: "draft-2", mode: "Scheduled (best time)", status: "Queued", at: aheadIso(1, 12), note: "Waiting for scheduled slot" },
  { id: "pl-8", draftId: "draft-7", mode: "Scheduled (best time)", status: "Queued", at: aheadIso(0, 15), note: "Waiting for scheduled slot" },
  { id: "pl-9", draftId: "draft-v3", mode: "Scheduled (best time)", status: "Queued", at: aheadIso(1, 9), note: "Billboard motion cut queued for LinkedIn" },
  { id: "pl-10", draftId: "draft-15", mode: "Scheduled (best time)", status: "Queued", at: aheadIso(2, 17), note: "Waiting for scheduled slot" },
];

export const SAFETY_FLAGS = [
  { key: "GENERATION_ENABLED", on: false, note: "Gates real GPT-4o copy and gpt-image-1 spend. Off until a stage is being demoed." },
  { key: "PUBLISHING_ENABLED", on: false, note: "Gates real posts to social APIs. Publishing is simulated while off." },
  { key: "VIDEO_GENERATION_ENABLED", on: false, note: "Separate, stricter gate for per-shot Veo spend. Hard ceiling of $5 per video." },
];

export const ROLE_ACCESS = [
  { role: "owner", board: "Full", content: "Full", settings: "Full" },
  { role: "manager", board: "Full", content: "Edit + approve", settings: "View" },
  { role: "member", board: "Edit (own tickets)", content: "Edit", settings: "None" },
];

export const BLOG_CATEGORIES = ["Case study", "How-to", "Playbook", "Product"];
