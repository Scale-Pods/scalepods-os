import { MEMBERS } from "@/lib/mock-data/orgs";

/**
 * ScalePods Content OS (Growth OS) mock data.
 *
 * Mirrors the reference Marketing Engine: platforms Instagram / YouTube /
 * Facebook / LinkedIn / X / Blog, content pillars = the four Pods, a
 * maker-checker approval flow and a UGC & video library backed by real mp4
 * files from /public.
 *
 * Everything here is deterministic: all dates are derived from the fixed
 * REF_ISO reference instant (never Date.now()) and all "random" numbers come
 * from pure index functions, so server and client render identical output.
 * The same dataset is served for every organisation; only reviewer assignment
 * is resolved per org (see reviewersFor / reviewerFor).
 */

// ---------------------------------------------------------------------------
// Reference time + deterministic helpers
// ---------------------------------------------------------------------------

export const REF_ISO = "2026-10-27T09:00:00.000Z";
export const REF_MS = Date.parse(REF_ISO);
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;
const MS_PER_WEEK = MS_PER_DAY * 7;

export function agoIso(days: number, hours = 0) {
  return new Date(REF_MS - days * MS_PER_DAY - hours * MS_PER_HOUR).toISOString();
}

/** `days` after the reference day, at `hour` UTC. */
export function aheadIso(days: number, hour = 10) {
  const d = new Date(REF_MS + days * MS_PER_DAY);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
}

/** Deterministic pseudo-random in [0, 1), seeded by an integer. */
export function seeded(seed: number) {
  const x = Math.sin(seed * 999.17) * 10000;
  return x - Math.floor(x);
}

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });

export const fmtDateLong = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }) + " UTC";

/** Relative to the fixed reference instant, e.g. "2d ago" / "in 3d". */
export function relativeToRef(iso: string) {
  const diff = Date.parse(iso) - REF_MS;
  const abs = Math.abs(diff);
  const label =
    abs < MS_PER_HOUR
      ? `${Math.max(1, Math.round(abs / 60000))}m`
      : abs < MS_PER_DAY
        ? `${Math.round(abs / MS_PER_HOUR)}h`
        : `${Math.round(abs / MS_PER_DAY)}d`;
  return diff <= 0 ? `${label} ago` : `in ${label}`;
}

export const compact = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ContentPlatform = "linkedin" | "instagram" | "x" | "youtube" | "facebook" | "blog";

export type ContentFormat = "text" | "image" | "carousel" | "video" | "ugc" | "billboard" | "blog";

export type ContentStatus = "draft" | "review" | "sent_back" | "approved" | "scheduled" | "published";

export interface ContentComment {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
  type: "change_request" | "note";
}

export interface CarouselSlide {
  type: "cover" | "step" | "stat" | "cta";
  eyebrow?: string;
  headline: string;
  body?: string;
}

export interface DraftMetrics {
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  views?: number;
  avgWatchPct?: number;
}

export interface ContentDraft {
  id: string;
  platform: ContentPlatform;
  format: ContentFormat;
  title: string;
  hook: string;
  body: string;
  status: ContentStatus;
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  reviewerIdx: number;
  authorLabel: string;
  pillarId: string;
  tags: string[];
  /** Target publish date: scheduled / published date, or the planned slot for earlier stages. */
  targetDate: string;
  hashtags: string[];
  cta: string;
  imagePrompt?: string;
  wordCount: number;
  slides?: CarouselSlide[];
  videoId?: string;
  blogSlug?: string;
  flag?: string;
  metrics?: DraftMetrics;
  comments: ContentComment[];
}

export interface BrandPillar {
  id: string;
  label: string;
  tagline: string;
  accent: "sage" | "blue";
  stats: string[];
}

// ---------------------------------------------------------------------------
// Reviewers (per org)
// ---------------------------------------------------------------------------

export function reviewersFor(orgId: string) {
  const own = MEMBERS.filter((m) => m.orgId === orgId);
  const pool = own.filter((m) => m.role === "owner" || m.role === "manager");
  return pool.length > 0 ? pool : own.length > 0 ? own : MEMBERS;
}

export function reviewerFor(orgId: string, idx: number) {
  const pool = reviewersFor(orgId);
  return pool[idx % pool.length];
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ---------------------------------------------------------------------------
// Brand profile (from brand-kit/BRAND-REPORT.md + BUSINESS-KNOWLEDGE-BASE.md)
// ---------------------------------------------------------------------------

export const BRAND_PILLARS: BrandPillar[] = [
  {
    id: "pillar-hr",
    label: "HR Pod",
    tagline: "Screen. Shortlist. Hire.",
    accent: "sage",
    stats: ["10x faster candidate screening", "80% less manual scheduling", "5 hours saved per recruiter, every week", "48 hours from brief to booked interviews"],
  },
  {
    id: "pillar-sales",
    label: "Sales Pod",
    tagline: "Outreach. Engage. Book.",
    accent: "blue",
    stats: ["500+ CRM records qualified automatically", "70% faster inbound response", "8 hours saved per rep, every week", "3x reply rate with LinkedIn + email sequencing"],
  },
  {
    id: "pillar-ops",
    label: "Ops Pod",
    tagline: "Upload. Verify. Approve.",
    accent: "sage",
    stats: ["90% faster document verification", "Zero compliance slippages", "<60 seconds to verify a transaction", "14+ data fields cross-checked per record"],
  },
  {
    id: "pillar-marketing",
    label: "Marketing Pod",
    tagline: "Brief. Produce. Publish.",
    accent: "blue",
    stats: ["10x content production output", "80% less platform coordination", "<24 hours from brief to multi-platform publish", "3x social coverage without extra writers"],
  },
  {
    id: "pillar-proof",
    label: "Case studies & proof",
    tagline: "Problem to outcome, with numbers.",
    accent: "sage",
    stats: ["35,000 inbound leads qualified, zero added headcount", "3,500+ resumes screened, 14 days down to 5", "Expo follow-ups in 30 seconds, +65% event ROI"],
  },
];

export interface BrandProfile {
  name: string;
  websiteUrl: string;
  oneLiner: string;
  tone: string;
  targetAudience: string;
  voiceSnippet: string;
  approvedCtas: string[];
  bannedWords: string[];
  doNotInvent: string;
  colors: { name: string; hex: string; use: string }[];
  fonts: { name: string; use: string }[];
  handles: { platform: ContentPlatform; handle: string; followers: number }[];
  formats: { label: string; ratio: string; size: string }[];
  competitors: { name: string; angle: string; threat: "Low" | "Medium" | "High" }[];
  pillars: BrandPillar[];
}

export const BRAND_PROFILE: BrandProfile = {
  name: "ScalePods",
  websiteUrl: "https://scalepods.co",
  oneLiner: "We build smart workflows that automate the repetitive, reduce overheads, and keep teams lean.",
  tone: "Developer-first, precise and results-oriented. Professional, data-driven, no fluff.",
  targetAudience:
    "Founders, operations leaders, sales leaders, HR heads and CTOs at lean, high-growth companies who want to scale capacity without scaling headcount. Primary channel is LinkedIn (B2B agency audience).",
  voiceSnippet:
    "We write like an engineer who respects your time: one claim, one number, one next step. Every figure comes from the approved Pod stats list. No hype, no \"revolutionary\", no promise that agents completely replace people.",
  approvedCtas: [
    "Comment SCALEPODS to evaluate your workflow",
    "Book an Automation Audit",
    "Link in bio to book a demo",
  ],
  bannedWords: ["Revolutionary", "Magic", "Completely replaces human staff", "100% error-free"],
  doNotInvent:
    "Do not invent absolute dollar savings, total hiring counts, or unqualified speed/accuracy claims that are not in the official dashboard stats.",
  colors: [
    { name: "Dark navy-black", hex: "#04070D", use: "Standard dark background" },
    { name: "Deep green", hex: "#0B1A08", use: "Solid announcement and stat posts" },
    { name: "Sage Green", hex: "#B1D997", use: "Primary accent: HR and Ops highlights, primary buttons" },
    { name: "Electric Blue", hex: "#63A5E7", use: "Secondary accent: Sales and Marketing highlights" },
    { name: "Cream", hex: "#F8FAF7", use: "Light-mode data comparisons and lists" },
    { name: "Terracotta", hex: "#CC6B49", use: "Claude partner badges only" },
  ],
  fonts: [
    { name: "Inter (400/500/600/700)", use: "Body, labels and headlines" },
    { name: "Instrument Serif Italic", use: "Accent words in hero headlines" },
  ],
  handles: [
    { platform: "linkedin", handle: "ScalePods", followers: 4820 },
    { platform: "instagram", handle: "@scalepods.co", followers: 3175 },
    { platform: "x", handle: "@scalepods", followers: 1290 },
    { platform: "youtube", handle: "ScalePods", followers: 640 },
    { platform: "facebook", handle: "ScalePods", followers: 910 },
    { platform: "blog", handle: "scalepods.co/blog", followers: 2210 },
  ],
  formats: [
    { label: "Instagram feed portrait", ratio: "4:5", size: "1080 x 1350" },
    { label: "Story / reel cover", ratio: "9:16", size: "1080 x 1920" },
    { label: "LinkedIn / Facebook square", ratio: "1:1", size: "1080 x 1080" },
  ],
  competitors: [
    { name: "Generic RPA vendors", angle: "Rule-based bots, brittle on unstructured documents", threat: "Medium" },
    { name: "Freelance automation shops", angle: "Cheap one-off Zapier/n8n builds, no ongoing optimisation", threat: "High" },
    { name: "Enterprise AI consultancies", angle: "Long engagements, heavy retainers, slow to deploy", threat: "Low" },
  ],
  pillars: BRAND_PILLARS,
};

export const PLATFORM_LABEL: Record<ContentPlatform, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  x: "X",
  youtube: "YouTube",
  facebook: "Facebook",
  blog: "Blog",
};

export const PLATFORMS: ContentPlatform[] = ["linkedin", "instagram", "x", "youtube", "facebook", "blog"];

export const PLATFORM_COLOR_CLASS: Record<ContentPlatform, { dot: string; bg: string; text: string; border: string; hex: string }> = {
  linkedin: { dot: "bg-primary", bg: "bg-primary/10", text: "text-primary", border: "border-primary/30", hex: "var(--primary)" },
  instagram: { dot: "bg-accent", bg: "bg-accent/10", text: "text-accent", border: "border-accent/30", hex: "var(--accent)" },
  x: { dot: "bg-foreground", bg: "bg-muted", text: "text-foreground", border: "border-border", hex: "var(--foreground)" },
  youtube: { dot: "bg-destructive", bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30", hex: "var(--destructive)" },
  facebook: { dot: "bg-blue-500", bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30", hex: "#3b82f6" },
  blog: { dot: "bg-warning", bg: "bg-warning/15", text: "text-warning", border: "border-warning/30", hex: "var(--warning)" },
};

export const FORMAT_LABEL: Record<ContentFormat, string> = {
  text: "Text post",
  image: "Static image",
  carousel: "Carousel",
  video: "Video",
  ugc: "UGC video",
  billboard: "Billboard",
  blog: "Blog article",
};

export const STATUS_LABEL: Record<ContentStatus, string> = {
  draft: "Draft",
  review: "In review",
  sent_back: "Sent back",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published",
};

export const CONTENT_STAGES: ContentStatus[] = ["draft", "review", "approved", "scheduled", "published"];

// ---------------------------------------------------------------------------
// UGC & video library (real mp4 files in /public)
// ---------------------------------------------------------------------------

export type VideoKind = "ugc" | "billboard" | "product";
export type VideoApproval = "pending" | "approved" | "changes_requested" | "live";

export interface VideoPerformance {
  views: number;
  completionPct: number;
  avgWatchSec: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  ctr: number;
}

export interface VideoAsset {
  id: string;
  /** URL under /public (URL-encoded where needed). */
  src: string;
  fileName: string;
  title: string;
  kind: VideoKind;
  platform: ContentPlatform;
  aspect: "9:16" | "16:9" | "1:1";
  status: ContentStatus;
  approval: VideoApproval;
  hook: string;
  caption: string;
  creator: string;
  brief: string;
  script: string[];
  engine: string;
  costUsd: number;
  pillarId: string;
  draftId: string;
  createdAt: string;
  performance: VideoPerformance;
}

export const VIDEO_ASSETS: VideoAsset[] = [
  {
    id: "vid-ugc-1",
    src: "/UGC-1.mp4",
    fileName: "UGC-1.mp4",
    title: "UGC testimonial: the 45-minute invoice check",
    kind: "ugc",
    platform: "instagram",
    aspect: "9:16",
    status: "review",
    approval: "pending",
    hook: "I used to spend 45 minutes matching one invoice to a purchase order.",
    caption: "From a 45-minute manual comparison to under 60 seconds. This is what an Ops Pod does with 14+ fields on every transaction. Comment SCALEPODS to evaluate your workflow.",
    creator: "AI creator: Maya (operations lead persona)",
    brief: "Person-to-camera, phone-filmed register. Operations lead explains the invoice audit pain and the under-60-second result. Approved stats only: 14+ fields, <60 seconds, zero compliance slippages.",
    script: [
      "Hook (0-3s): \"I used to spend 45 minutes matching one invoice to a purchase order.\"",
      "Problem (3-9s): Copy-pasting between folders, catching typos, chasing GSTIN and HSN mismatches.",
      "Turn (9-15s): \"Now an agent checks 14+ fields in under a minute and logs every step.\"",
      "CTA (15-20s): Comment SCALEPODS to evaluate your workflow.",
    ],
    engine: "Kling Avatar (image + voiceover)",
    costUsd: 1.8,
    pillarId: "pillar-ops",
    draftId: "draft-v1",
    createdAt: agoIso(2, 5),
    performance: { views: 0, completionPct: 0, avgWatchSec: 0, likes: 0, comments: 0, shares: 0, clicks: 0, ctr: 0 },
  },
  {
    id: "vid-ugc-2",
    src: "/UGC_2.mp4",
    fileName: "UGC_2.mp4",
    title: "UGC testimonial: 8 hours a week of CRM updates",
    kind: "ugc",
    platform: "instagram",
    aspect: "9:16",
    status: "approved",
    approval: "approved",
    hook: "Your sales reps spend 8 hours a week updating the CRM. Here is how we fixed that.",
    caption: "8 hours saved per rep, every week. Sales Pods qualify and update CRM records in 3 seconds so reps sell instead of type. Link in bio to book a demo.",
    creator: "AI creator: Daniel (sales rep persona)",
    brief: "Reel-style UGC from a sales rep. Focus on the data-entry burden, then the 3-second CRM update and 40% more qualified meetings.",
    script: [
      "Hook (0-3s): \"8 hours a week. That is how long I spent updating the CRM.\"",
      "Proof (3-10s): Lead enters, agent updates fields in 3 seconds, meeting booked.",
      "Result (10-17s): 40% more qualified meetings, reps back on live deals.",
      "CTA (17-20s): Link in bio to book a demo.",
    ],
    engine: "Kling Avatar (image + voiceover)",
    costUsd: 1.8,
    pillarId: "pillar-sales",
    draftId: "draft-v2",
    createdAt: agoIso(5, 3),
    performance: { views: 0, completionPct: 0, avgWatchSec: 0, likes: 0, comments: 0, shares: 0, clicks: 0, ctr: 0 },
  },
  {
    id: "vid-billboard-1",
    src: "/billboard1.mp4",
    fileName: "billboard1.mp4",
    title: "Billboard motion: Scale capacity, not payroll",
    kind: "billboard",
    platform: "linkedin",
    aspect: "16:9",
    status: "scheduled",
    approval: "approved",
    hook: "Scale your capacity, not your payroll.",
    caption: "Autonomous Pods that work 24/7, cross-check their own output and plug into the tools you already use. Book an Automation Audit.",
    creator: "Motion graphics render (HTML + GSAP to MP4)",
    brief: "Kinetic-type billboard cut for LinkedIn and OOH mock-ups. Sage Green highlight on deep green, logo top-left, one headline, one CTA.",
    script: [
      "Frame 1: \"Scale your capacity,\" Inter Bold, white on #0B1A08.",
      "Frame 2: \"not your payroll\" in Instrument Serif Italic, Sage Green.",
      "Frame 3: Pod tagline strip: Screen. Shortlist. Hire. / Outreach. Engage. Book.",
      "End card: Book an Automation Audit + scalepods.co.",
    ],
    engine: "Motion graphics (no AI video model)",
    costUsd: 0,
    pillarId: "pillar-marketing",
    draftId: "draft-v3",
    createdAt: agoIso(7),
    performance: { views: 0, completionPct: 0, avgWatchSec: 0, likes: 0, comments: 0, shares: 0, clicks: 0, ctr: 0 },
  },
  {
    id: "vid-billboard-2",
    src: "/billboard2.mp4",
    fileName: "billboard2.mp4",
    title: "Billboard motion: Book an Automation Audit",
    kind: "billboard",
    platform: "facebook",
    aspect: "16:9",
    status: "draft",
    approval: "pending",
    hook: "Your team is spending 80% of its time on work an agent can do.",
    caption: "Audit. Build. Scale. We map your bottlenecks, connect the pipes and turn on the autopilot. Book an Automation Audit.",
    creator: "Motion graphics render (HTML + GSAP to MP4)",
    brief: "Second billboard variant built around the 3-step methodology (Audit, Build, Scale). Electric Blue highlight for the Sales / Marketing audience.",
    script: [
      "Frame 1: \"80% of the week is repetitive work.\"",
      "Frame 2: 01 Audit - 02 Build - 03 Scale step reveal.",
      "End card: Book an Automation Audit.",
    ],
    engine: "Motion graphics (no AI video model)",
    costUsd: 0,
    pillarId: "pillar-marketing",
    draftId: "draft-v4",
    createdAt: agoIso(1, 6),
    performance: { views: 0, completionPct: 0, avgWatchSec: 0, likes: 0, comments: 0, shares: 0, clicks: 0, ctr: 0 },
  },
  {
    id: "vid-oil",
    src: "/oil%20video.mp4",
    fileName: "oil video.mp4",
    title: "Product ad sample: cold-pressed oil",
    kind: "product",
    platform: "youtube",
    aspect: "9:16",
    status: "published",
    approval: "live",
    hook: "Pressed slow. Poured fast.",
    caption: "Sample D2C product ad produced by the Marketing Pod from a single brief: one asset, five platform cuts, ready in under 24 hours.",
    creator: "Marketing Pod demo reel (client sample)",
    brief: "Showcase of Marketing Pod output for a D2C wellness client: macro b-roll with pour shot, text overlays added by the render worker, brand sting at the end.",
    script: [
      "Shot 1: macro pour, warm practical light.",
      "Shot 2: oil swirl on spoon, slow motion.",
      "Shot 3: bottle hero on counter; end card with brand sting.",
    ],
    engine: "Veo 3.1 multi-shot + drawtext overlay",
    costUsd: 3.6,
    pillarId: "pillar-marketing",
    draftId: "draft-v5",
    createdAt: agoIso(14),
    performance: { views: 18420, completionPct: 61, avgWatchSec: 11.2, likes: 842, comments: 37, shares: 96, clicks: 412, ctr: 2.2 },
  },
  {
    id: "vid-turmeric",
    src: "/tumeric.mp4",
    fileName: "tumeric.mp4",
    title: "Product reel sample: turmeric",
    kind: "product",
    platform: "instagram",
    aspect: "9:16",
    status: "sent_back",
    approval: "changes_requested",
    hook: "One spoon. A whole routine.",
    caption: "Sample D2C product reel from the Marketing Pod: a single brief repurposed into reels, shorts and square cuts.",
    creator: "Marketing Pod demo reel (client sample)",
    brief: "Reel cut for a D2C spice brand. Reviewer asked for a stronger opening frame and to move the CTA earlier.",
    script: [
      "Shot 1: powder pour in sunlight.",
      "Shot 2: stir into a glass, golden swirl.",
      "Shot 3: product pack with pricing card (to be removed).",
    ],
    engine: "Veo 3.1 multi-shot + drawtext overlay",
    costUsd: 3.2,
    pillarId: "pillar-marketing",
    draftId: "draft-v6",
    createdAt: agoIso(9),
    performance: { views: 0, completionPct: 0, avgWatchSec: 0, likes: 0, comments: 0, shares: 0, clicks: 0, ctr: 0 },
  },
];

export function getVideo(id: string) {
  return VIDEO_ASSETS.find((v) => v.id === id);
}

export const VIDEO_KIND_LABEL: Record<VideoKind, string> = {
  ugc: "UGC",
  billboard: "Billboard",
  product: "Product ad",
};

export const VIDEO_APPROVAL_LABEL: Record<VideoApproval, string> = {
  pending: "Pending review",
  approved: "Approved",
  changes_requested: "Changes requested",
  live: "Live",
};

// ---------------------------------------------------------------------------
// Drafts
// ---------------------------------------------------------------------------

function m(
  impressions: number,
  likes: number,
  comments: number,
  shares: number,
  saves: number,
  clicks: number,
  extra: { views?: number; avgWatchPct?: number } = {}
): DraftMetrics {
  return {
    impressions,
    reach: Math.round(impressions * 0.78),
    likes,
    comments,
    shares,
    saves,
    clicks,
    ...extra,
  };
}

const CTA_EVAL = "Comment SCALEPODS to evaluate your workflow";
const CTA_AUDIT = "Book an Automation Audit";
const CTA_DEMO = "Link in bio to book a demo";

export const MOCK_CONTENT_DRAFTS: ContentDraft[] = [
  {
    id: "draft-1",
    platform: "linkedin",
    format: "text",
    title: "35,000 leads. Zero new hires.",
    hook: "A SaaS team's inbound volume tripled. They hired nobody and still qualified every lead.",
    body:
      "A fast-growing SaaS team's inbound signups spiked. The choice was familiar: hire three sales coordinators or let high-value leads rot in the queue.\n\nThey deployed a Sales Pod instead.\n\nWhat it did:\n- Qualified and processed 35,000 inbound leads automatically\n- Researched company data and scored intent signals\n- Updated CRM fields in 3 seconds\n- Booked calls with high-intent accounts\n\nOutcome: zero headcount added to ops, a 30% increase in sales growth and a 55% boost in prospect engagement.\n\nScale capacity, not payroll.",
    status: "published",
    aiGenerated: true,
    createdAt: agoIso(12),
    updatedAt: agoIso(9),
    reviewerIdx: 0,
    authorLabel: "Content Agent",
    pillarId: "pillar-proof",
    tags: ["case-study", "sales-pod"],
    targetDate: agoIso(9, -1),
    hashtags: ["#SalesAutomation", "#AIAgents", "#RevOps"],
    cta: CTA_AUDIT,
    imagePrompt: "Stat card: 35,000 leads, 0 new hires, Electric Blue highlight on #04070D",
    wordCount: 96,
    metrics: m(14820, 462, 38, 71, 54, 296),
    comments: [],
  },
  {
    id: "draft-2",
    platform: "instagram",
    format: "carousel",
    title: "The Silent Payroll Killer",
    hook: "The silent killer hiding in your company's payroll is not salaries. It is manual validation.",
    body:
      "Swipe through: the average ops team spends 45 minutes cross-checking one shipment invoice against purchase orders and tax databases. ScalePods automates the whole audit loop - 14+ fields verified in one pass, under 60 seconds, zero compliance slippages.",
    status: "scheduled",
    aiGenerated: true,
    createdAt: agoIso(5, 6),
    updatedAt: agoIso(1, 2),
    reviewerIdx: 1,
    authorLabel: "Content Agent",
    pillarId: "pillar-ops",
    tags: ["carousel", "ops-pod"],
    targetDate: aheadIso(1, 12),
    hashtags: ["#Operations", "#Automation", "#InvoiceAudit"],
    cta: CTA_EVAL,
    imagePrompt: "Dark navy carousel, chaotic folders turning into a single green check, Inter Bold headlines",
    wordCount: 58,
    slides: [
      { type: "cover", eyebrow: "OPS POD", headline: "The silent killer hiding in your payroll..." },
      { type: "step", headline: "It's not salaries or software licences.", body: "It's manual validation." },
      { type: "stat", headline: "45 minutes", body: "Average time to cross-check one shipment invoice against POs and tax databases." },
      { type: "step", headline: "Copy. Paste. Catch the typo.", body: "Searching folders for the one document that does not match." },
      { type: "stat", headline: "14+ fields, <60 seconds", body: "ScalePods verifies every field in one pass. Zero compliance slippages." },
      { type: "cta", headline: "Stop paying for busywork.", body: CTA_EVAL },
    ],
    comments: [],
  },
  {
    id: "draft-3",
    platform: "instagram",
    format: "carousel",
    title: "35,000 Leads. 0 New Hires.",
    hook: "How a fast-growing SaaS startup processed 35,000 leads with zero new hires.",
    body:
      "Five-slide case-study carousel for sales leaders: the dilemma, the Sales Pod workflow, the verified results (30% sales growth, 8 hours saved per rep, 55% engagement surge) and a CTA to book an Automation Audit.",
    status: "review",
    aiGenerated: true,
    createdAt: agoIso(2, 4),
    updatedAt: agoIso(0, 3),
    reviewerIdx: 0,
    authorLabel: "Content Agent",
    pillarId: "pillar-proof",
    tags: ["carousel", "case-study"],
    targetDate: aheadIso(3, 12),
    hashtags: ["#SalesPod", "#Pipeline", "#B2BSales"],
    cta: CTA_AUDIT,
    imagePrompt: "Electric Blue highlight numbers on #04070D, minimalist data-card style",
    wordCount: 74,
    slides: [
      { type: "cover", eyebrow: "SALES POD", headline: "35,000 leads. 0 new hires." },
      { type: "step", headline: "Hire 3 coordinators, or let leads rot?", body: "They chose option three: deploy a Sales Pod." },
      { type: "step", headline: "The Pod instantly:", body: "Scored fit from intent metrics, updated CRM in 3 seconds, booked meetings with high-intent accounts." },
      { type: "stat", headline: "+30% sales growth", body: "8 hours saved per rep, every week. 55% engagement surge." },
      { type: "cta", headline: "Automate your outbound pipeline.", body: CTA_AUDIT },
    ],
    comments: [],
  },
  {
    id: "draft-4",
    platform: "instagram",
    format: "carousel",
    title: "How to shortlist candidates in 5 days",
    hook: "The hiring cycle speedrun: from 14 days down to 5.",
    body:
      "HR Pod carousel: screening 3,500+ resumes, calendar bookings without email ping-pong, 80% less coordination and 10x recruiter capacity.",
    status: "approved",
    aiGenerated: true,
    createdAt: agoIso(4, 2),
    updatedAt: agoIso(1, 8),
    reviewerIdx: 1,
    authorLabel: "Content Agent",
    pillarId: "pillar-hr",
    tags: ["carousel", "hr-pod"],
    targetDate: aheadIso(4, 11),
    hashtags: ["#Recruiting", "#TalentAcquisition", "#HRTech"],
    cta: CTA_DEMO,
    imagePrompt: "Sage Green accents on deep navy, calendar and shortlist iconography",
    wordCount: 66,
    slides: [
      { type: "cover", eyebrow: "HR POD", headline: "From 14 days to 5." },
      { type: "step", headline: "Best candidates are gone in a week.", body: "If screening takes 14 days, you already lost them." },
      { type: "step", headline: "The HR Pod reads and scores 3,500+ resumes", body: "Calendar slots are booked without back-and-forth emails." },
      { type: "stat", headline: "10x recruiter capacity", body: "5 hours saved per recruiter every week. 80% less coordination." },
      { type: "cta", headline: "Secure top talent faster.", body: CTA_DEMO },
    ],
    comments: [
      { id: "c-4-1", authorName: "Reviewer", body: "Stats match the approved list. Good to go.", createdAt: agoIso(1, 8), type: "note" },
    ],
  },
  {
    id: "draft-5",
    platform: "instagram",
    format: "image",
    title: "14+ fields. 60 seconds.",
    hook: "A 45-minute physical comparison, replaced by one upload.",
    body: "Stat image for the Ops Pod: 14+ data fields cross-checked per transaction in under 60 seconds. Zero compliance slippages. Comment SCALEPODS to evaluate your workflow.",
    status: "published",
    aiGenerated: true,
    createdAt: agoIso(16),
    updatedAt: agoIso(13),
    reviewerIdx: 0,
    authorLabel: "Content Agent",
    pillarId: "pillar-ops",
    tags: ["stat-card", "ops-pod"],
    targetDate: agoIso(13, -2),
    hashtags: ["#OpsAutomation", "#Compliance", "#ClaudeAI"],
    cta: CTA_EVAL,
    imagePrompt: "Typographic data-card: '14+ fields' in Sage Green on #0B1A08, grid overlay at 2% opacity",
    wordCount: 31,
    metrics: m(9340, 611, 29, 44, 138, 117),
    comments: [],
  },
  {
    id: "draft-6",
    platform: "linkedin",
    format: "text",
    title: "What 45 minutes of invoice checking actually costs",
    hook: "Nobody budgets for manual validation. Everyone pays for it.",
    body:
      "Nobody has a line item called manual validation. Everyone pays for it.\n\nA single shipment invoice means matching weights, GSTIN, HSN codes, invoice numbers, batch details and chemistry data against purchase orders. By hand, that is a 45-minute job.\n\nAn Ops Pod does the same cross-check across 14+ fields in under 60 seconds and writes a timestamped audit trail for every decision.\n\nThe team does not shrink. It stops doing the part that breaks.",
    status: "review",
    aiGenerated: true,
    createdAt: agoIso(1, 7),
    updatedAt: agoIso(0, 6),
    reviewerIdx: 1,
    authorLabel: "Content Agent",
    pillarId: "pillar-ops",
    tags: ["thought-leadership", "ops-pod"],
    targetDate: aheadIso(2, 9),
    hashtags: ["#Operations", "#AIAgents", "#Compliance"],
    cta: CTA_AUDIT,
    wordCount: 92,
    comments: [],
  },
  {
    id: "draft-7",
    platform: "x",
    format: "text",
    title: "Scale capacity, not payroll",
    hook: "Scale your capacity, not your payroll. The rise of autonomous business units.",
    body:
      "Scale your capacity, not your payroll.\n\nPods are autonomous agent ecosystems that work 24/7, cross-check their own output and update the tools you already use.\n\nHR. Sales. Ops. Marketing.\n\nBook an Automation Audit: scalepods.co",
    status: "scheduled",
    aiGenerated: false,
    createdAt: agoIso(3, 3),
    updatedAt: agoIso(2),
    reviewerIdx: 0,
    authorLabel: "Manual composer",
    pillarId: "pillar-marketing",
    tags: ["brand", "x"],
    targetDate: aheadIso(0, 15),
    hashtags: ["#AIAgents"],
    cta: CTA_AUDIT,
    wordCount: 34,
    comments: [],
  },
  {
    id: "draft-8",
    platform: "x",
    format: "text",
    title: "3 seconds from lead to outreach",
    hook: "The moment a lead enters, outbound engagement fires in 3 seconds.",
    body: "The moment a lead enters your CRM, outbound engagement fires in 3 seconds. Not 3 hours. Not next Monday.\n\nSales Pod: Outreach. Engage. Book.\n\nLink in bio to book a demo.",
    status: "published",
    aiGenerated: false,
    createdAt: agoIso(10),
    updatedAt: agoIso(8),
    reviewerIdx: 1,
    authorLabel: "Manual composer",
    pillarId: "pillar-sales",
    tags: ["x", "sales-pod"],
    targetDate: agoIso(8, -3),
    hashtags: [],
    cta: CTA_DEMO,
    wordCount: 33,
    metrics: m(3120, 94, 11, 18, 6, 41),
    comments: [],
  },
  {
    id: "draft-9",
    platform: "blog",
    format: "blog",
    title: "How to qualify inbound leads without adding headcount",
    hook: "A practical blueprint for scoring, routing and booking inbound leads with an agent instead of a hire.",
    body:
      "## The problem with manual qualification\nWhen inbound volume spikes, reps waste time on dead-ends while high-value leads sit untouched.\n\n## What a Sales Pod actually does\nIt researches company data, evaluates intent signals, writes the result to CRM fields in 3 seconds and schedules a call for high-intent accounts.\n\n## Results to expect\nIn one deployment: 35,000 inbound leads qualified automatically, zero added headcount, +30% sales growth and +55% prospect engagement.\n\n## Getting started\nBook an Automation Audit and we will map your qualification bottlenecks first.",
    status: "review",
    aiGenerated: true,
    createdAt: agoIso(3, 5),
    updatedAt: agoIso(1, 1),
    reviewerIdx: 0,
    authorLabel: "Content Agent",
    pillarId: "pillar-sales",
    tags: ["blog", "seo", "sales-pod"],
    targetDate: aheadIso(5, 8),
    hashtags: [],
    cta: CTA_AUDIT,
    wordCount: 884,
    blogSlug: "qualify-inbound-leads-without-headcount",
    comments: [
      { id: "c-9-1", authorName: "Reviewer", body: "Add the CTA card variant (dark banner) and shorten the meta description to 155 characters.", createdAt: agoIso(1, 1), type: "change_request" },
    ],
  },
  {
    id: "draft-10",
    platform: "blog",
    format: "blog",
    title: "Invoice audit automation: a 14-field checklist",
    hook: "The exact fields an automated audit should verify on every shipment invoice.",
    body:
      "## Why 14 fields\nWeights, GSTIN, HSN codes, invoice numbers, chemistry data and batch details all have to agree.\n\n## The checklist\n1. Invoice number and date\n2. GSTIN and HSN code\n3. Net/gross weights\n4. Batch and chemistry data\n\n## Audit trail\nEvery decision is logged with an immutable timestamp so compliance review takes minutes, not days.",
    status: "draft",
    aiGenerated: true,
    createdAt: agoIso(0, 10),
    updatedAt: agoIso(0, 10),
    reviewerIdx: 1,
    authorLabel: "Content Agent",
    pillarId: "pillar-ops",
    tags: ["blog", "seo", "ops-pod"],
    targetDate: aheadIso(9, 8),
    hashtags: [],
    cta: CTA_EVAL,
    wordCount: 640,
    blogSlug: "invoice-audit-automation-14-field-checklist",
    comments: [],
  },
  {
    id: "draft-11",
    platform: "blog",
    format: "blog",
    title: "From 14 days to 5: automating tech resume screening",
    hook: "How an HR Pod screened 3,500+ resumes and cut time-to-hire by 70%.",
    body:
      "## The bottleneck\nThousands of applications, weeks of manual CV review, candidates signing elsewhere.\n\n## The HR Pod inside the ATS\nParses resumes, grades against job parameters, ranks by structural fit and coordinates calendar slots.\n\n## Outcome\n3,500+ resumes screened, hiring cycle 14 days to 5, 70% faster time-to-hire and a 35% reduction in cost-per-hire.",
    status: "published",
    aiGenerated: true,
    createdAt: agoIso(20),
    updatedAt: agoIso(15),
    reviewerIdx: 0,
    authorLabel: "Content Agent",
    pillarId: "pillar-hr",
    tags: ["blog", "case-study", "hr-pod"],
    targetDate: agoIso(15, -1),
    hashtags: [],
    cta: CTA_DEMO,
    wordCount: 1120,
    blogSlug: "automating-tech-resume-screening",
    metrics: m(6210, 0, 0, 52, 0, 388, { views: 4870 }),
    comments: [],
  },
  {
    id: "draft-12",
    platform: "linkedin",
    format: "text",
    title: "Respond in 3 seconds, not 3 hours",
    hook: "70% faster response to inbound leads is not a tooling story. It is a trust story.",
    body:
      "70% faster response to inbound leads is not a tooling story. It is a trust story.\n\nThe prospect who filled in your form is comparing you with two other tabs. The first reply wins the conversation.\n\nOur Sales Pod triggers outbound engagement within 3 seconds of a lead entering and keeps multi-channel sequences (LinkedIn + email) moving without a human copy-pasting.\n\n3x higher reply rates, 40% more qualified meetings.",
    status: "approved",
    aiGenerated: true,
    createdAt: agoIso(4),
    updatedAt: agoIso(2, 3),
    reviewerIdx: 1,
    authorLabel: "Content Agent",
    pillarId: "pillar-sales",
    tags: ["thought-leadership", "sales-pod"],
    targetDate: aheadIso(2, 14),
    hashtags: ["#SalesOps", "#LeadResponse"],
    cta: CTA_AUDIT,
    wordCount: 88,
    comments: [],
  },
  {
    id: "draft-13",
    platform: "linkedin",
    format: "image",
    title: "Marketing Pod: one asset, five platforms",
    hook: "Brief once. Publish everywhere in under 24 hours.",
    body:
      "Convert one core asset (a video, an article) into multi-format, platform-optimised campaigns. 10x content output, 80% less platform coordination, <24 hours from brief to multi-platform publish.",
    status: "sent_back",
    aiGenerated: true,
    createdAt: agoIso(6),
    updatedAt: agoIso(1, 4),
    reviewerIdx: 0,
    authorLabel: "Content Agent",
    pillarId: "pillar-marketing",
    tags: ["marketing-pod", "image"],
    targetDate: aheadIso(6, 10),
    hashtags: ["#ContentOps", "#MarketingAutomation"],
    cta: CTA_AUDIT,
    imagePrompt: "Hub-and-spoke diagram, one asset in the centre, five platform nodes, Electric Blue on #04070D",
    wordCount: 41,
    flag: "Headline claims a figure that is not in the approved stats list.",
    comments: [
      { id: "c-13-1", authorName: "Reviewer", body: "\"10x output in a week\" is not an approved claim. Use the approved 10x content production output stat without a timeframe.", createdAt: agoIso(1, 4), type: "change_request" },
    ],
  },
  {
    id: "draft-14",
    platform: "instagram",
    format: "image",
    title: "Powered by Claude",
    hook: "Autonomous agents with deep context, built on Claude.",
    body: "Our agent ecosystems run on Anthropic Claude: long context windows and strong reasoning to handle messy dates, routing decisions and cross-tool context. Enterprise security, GDPR-aligned, immutable audit logs.",
    status: "draft",
    aiGenerated: true,
    createdAt: agoIso(0, 5),
    updatedAt: agoIso(0, 5),
    reviewerIdx: 1,
    authorLabel: "Content Agent",
    pillarId: "pillar-marketing",
    tags: ["partner", "claude"],
    targetDate: aheadIso(7, 12),
    hashtags: ["#Claude", "#AIAgents"],
    cta: CTA_DEMO,
    imagePrompt: "Terracotta Claude partner badge on dark navy, subtle grid overlay",
    wordCount: 42,
    comments: [],
  },
  {
    id: "draft-15",
    platform: "facebook",
    format: "image",
    title: "Expo leads followed up in 30 seconds",
    hook: "The follow-up used to take 2 to 3 days. By then the lead was cold.",
    body: "Expo case study: leads parsed in real time and sent personalised email + SMS follow-ups in 30 seconds. 40% increase in lead retention, 65% surge in event ROI.",
    status: "scheduled",
    aiGenerated: true,
    createdAt: agoIso(4, 5),
    updatedAt: agoIso(2, 6),
    reviewerIdx: 0,
    authorLabel: "Content Agent",
    pillarId: "pillar-proof",
    tags: ["case-study", "facebook"],
    targetDate: aheadIso(2, 17),
    hashtags: ["#EventMarketing", "#LeadFollowUp"],
    cta: CTA_AUDIT,
    imagePrompt: "Before/after card: 2-3 days vs 30 seconds, cream background with sage accents",
    wordCount: 36,
    comments: [],
  },
  {
    id: "draft-16",
    platform: "facebook",
    format: "text",
    title: "What an Automation Audit covers",
    hook: "Three steps, one conversation: Audit, Build, Scale.",
    body: "Step 01 Discover and analyse the bottlenecks. Step 02 Design and implement the Pod in your stack. Step 03 Optimise and scale to more tasks. Book an Automation Audit to start.",
    status: "published",
    aiGenerated: false,
    createdAt: agoIso(18),
    updatedAt: agoIso(17),
    reviewerIdx: 1,
    authorLabel: "Manual composer",
    pillarId: "pillar-marketing",
    tags: ["methodology"],
    targetDate: agoIso(17, -2),
    hashtags: [],
    cta: CTA_AUDIT,
    wordCount: 38,
    metrics: m(2210, 61, 7, 12, 4, 33),
    comments: [],
  },
  {
    id: "draft-17",
    platform: "x",
    format: "text",
    title: "Words we do not use",
    hook: "No \"revolutionary\". No \"magic\". Just numbers.",
    body: "Our content rules: no revolutionary, no magic, no 100% error-free. If we cannot source the number from the Pod dashboard, it does not ship.",
    status: "sent_back",
    aiGenerated: true,
    createdAt: agoIso(3),
    updatedAt: agoIso(1),
    reviewerIdx: 1,
    authorLabel: "Content Agent",
    pillarId: "pillar-marketing",
    tags: ["brand-voice"],
    targetDate: aheadIso(4, 16),
    hashtags: [],
    cta: CTA_AUDIT,
    wordCount: 30,
    flag: "Draft quotes banned words in a promotional context.",
    comments: [
      { id: "c-17-1", authorName: "Reviewer", body: "Rephrase without listing the banned words; the brand checker flags them.", createdAt: agoIso(1), type: "change_request" },
    ],
  },
  {
    id: "draft-18",
    platform: "youtube",
    format: "text",
    title: "Founder take: why we call them Pods",
    hook: "A Pod is a team that never logs off. Here is the thinking.",
    body: "YouTube description and chapters for the founder-take video (manual HeyGen route): 00:00 Why Pods, 01:10 HR to Marketing, 02:30 How we deploy in 48 hours. Link in bio to book a demo.",
    status: "draft",
    aiGenerated: true,
    createdAt: agoIso(0, 8),
    updatedAt: agoIso(0, 8),
    reviewerIdx: 0,
    authorLabel: "Content Agent",
    pillarId: "pillar-marketing",
    tags: ["youtube", "founder"],
    targetDate: aheadIso(10, 13),
    hashtags: ["#AIAgents"],
    cta: CTA_DEMO,
    wordCount: 52,
    comments: [],
  },
  // --- Video / UGC / billboard drafts (one per mp4 in /public) ---
  {
    id: "draft-v1",
    platform: "instagram",
    format: "ugc",
    title: "UGC testimonial: the 45-minute invoice check",
    hook: "I used to spend 45 minutes matching one invoice to a purchase order.",
    body: "UGC testimonial reel (Ops Pod). Person-to-camera, phone register. Verified figures only: 14+ fields, under 60 seconds, zero compliance slippages.",
    status: "review",
    aiGenerated: true,
    createdAt: agoIso(2, 5),
    updatedAt: agoIso(0, 4),
    reviewerIdx: 1,
    authorLabel: "Video Studio",
    pillarId: "pillar-ops",
    tags: ["ugc", "reel", "ops-pod"],
    targetDate: aheadIso(3, 18),
    hashtags: ["#UGC", "#OpsAutomation", "#AIAgents"],
    cta: CTA_EVAL,
    wordCount: 34,
    videoId: "vid-ugc-1",
    comments: [],
  },
  {
    id: "draft-v2",
    platform: "instagram",
    format: "ugc",
    title: "UGC testimonial: 8 hours a week of CRM updates",
    hook: "8 hours a week. That is how long I spent updating the CRM.",
    body: "UGC reel (Sales Pod): sales rep persona explains the data-entry burden and the 3-second CRM update. 40% more qualified meetings.",
    status: "approved",
    aiGenerated: true,
    createdAt: agoIso(5, 3),
    updatedAt: agoIso(1, 6),
    reviewerIdx: 0,
    authorLabel: "Video Studio",
    pillarId: "pillar-sales",
    tags: ["ugc", "reel", "sales-pod"],
    targetDate: aheadIso(3, 11),
    hashtags: ["#UGC", "#SalesOps"],
    cta: CTA_DEMO,
    wordCount: 29,
    videoId: "vid-ugc-2",
    comments: [
      { id: "c-v2-1", authorName: "Reviewer", body: "Hook is strong and the claims match the approved list.", createdAt: agoIso(1, 6), type: "note" },
    ],
  },
  {
    id: "draft-v3",
    platform: "linkedin",
    format: "billboard",
    title: "Billboard motion: Scale capacity, not payroll",
    hook: "Scale your capacity, not your payroll.",
    body: "Kinetic-type billboard cut for LinkedIn and OOH mock-ups. Rendered with the motion-graphics path (no AI video model), so it is unlimited-length and perfectly on-brand.",
    status: "scheduled",
    aiGenerated: true,
    createdAt: agoIso(7),
    updatedAt: agoIso(2),
    reviewerIdx: 0,
    authorLabel: "Video Studio",
    pillarId: "pillar-marketing",
    tags: ["billboard", "motion-graphics"],
    targetDate: aheadIso(1, 9),
    hashtags: ["#ScalePods", "#AIAgents"],
    cta: CTA_AUDIT,
    wordCount: 22,
    videoId: "vid-billboard-1",
    comments: [],
  },
  {
    id: "draft-v4",
    platform: "facebook",
    format: "billboard",
    title: "Billboard motion: Book an Automation Audit",
    hook: "Your team is spending 80% of its time on work an agent can do.",
    body: "Second billboard cut built around Audit / Build / Scale. Awaiting hook polish before submission to review.",
    status: "draft",
    aiGenerated: true,
    createdAt: agoIso(1, 6),
    updatedAt: agoIso(1, 6),
    reviewerIdx: 1,
    authorLabel: "Video Studio",
    pillarId: "pillar-marketing",
    tags: ["billboard", "methodology"],
    targetDate: aheadIso(6, 15),
    hashtags: ["#ScalePods"],
    cta: CTA_AUDIT,
    wordCount: 24,
    videoId: "vid-billboard-2",
    comments: [],
  },
  {
    id: "draft-v5",
    platform: "youtube",
    format: "video",
    title: "Product ad sample: cold-pressed oil",
    hook: "Pressed slow. Poured fast.",
    body: "Marketing Pod showcase: a D2C product ad generated from a single brief and cut for Shorts, Reels and square feeds in under 24 hours.",
    status: "published",
    aiGenerated: true,
    createdAt: agoIso(14),
    updatedAt: agoIso(11),
    reviewerIdx: 0,
    authorLabel: "Video Studio",
    pillarId: "pillar-marketing",
    tags: ["product-ad", "shorts", "marketing-pod"],
    targetDate: agoIso(11, -4),
    hashtags: ["#Shorts", "#ProductAd"],
    cta: CTA_DEMO,
    wordCount: 27,
    videoId: "vid-oil",
    metrics: m(21050, 842, 37, 96, 71, 412, { views: 18420, avgWatchPct: 61 }),
    comments: [],
  },
  {
    id: "draft-v6",
    platform: "instagram",
    format: "video",
    title: "Product reel sample: turmeric",
    hook: "One spoon. A whole routine.",
    body: "Marketing Pod sample reel for a D2C spice brand. Sent back: strengthen the opening frame and remove the pricing card.",
    status: "sent_back",
    aiGenerated: true,
    createdAt: agoIso(9),
    updatedAt: agoIso(2, 2),
    reviewerIdx: 1,
    authorLabel: "Video Studio",
    pillarId: "pillar-marketing",
    tags: ["product-ad", "reel", "marketing-pod"],
    targetDate: aheadIso(5, 12),
    hashtags: ["#Reels", "#ProductAd"],
    cta: CTA_DEMO,
    wordCount: 25,
    videoId: "vid-turmeric",
    flag: "On-screen pricing card is not an approved claim format.",
    comments: [
      { id: "c-v6-1", authorName: "Reviewer", body: "Open on the golden swirl instead of the pack shot and remove the pricing card.", createdAt: agoIso(2, 2), type: "change_request" },
    ],
  },
];

export function getContentDraft(id: string) {
  return MOCK_CONTENT_DRAFTS.find((d) => d.id === id);
}

export function getDraftVideo(draft: ContentDraft) {
  return draft.videoId ? getVideo(draft.videoId) : undefined;
}

export function getPillar(id: string) {
  return BRAND_PILLARS.find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// Approval timeline + brand checks (derived, deterministic)
// ---------------------------------------------------------------------------

export interface ApprovalEvent {
  label: string;
  actor: string;
  at: string;
  tone: "neutral" | "success" | "warning" | "danger";
}

export function getApprovalTimeline(draft: ContentDraft, reviewerName: string): ApprovalEvent[] {
  const events: ApprovalEvent[] = [
    { label: "Generated", actor: draft.authorLabel, at: draft.createdAt, tone: "neutral" },
  ];
  const created = Date.parse(draft.createdAt);
  const updated = Date.parse(draft.updatedAt);
  const mid = (f: number) => new Date(created + (updated - created) * f).toISOString();
  if (draft.status === "draft") return events;
  events.push({ label: "Submitted for review (maker)", actor: draft.authorLabel, at: mid(0.35), tone: "neutral" });
  if (draft.status === "review") return events;
  if (draft.status === "sent_back") {
    events.push({ label: "Changes requested (checker)", actor: reviewerName, at: draft.updatedAt, tone: "warning" });
    return events;
  }
  events.push({ label: "Approved (checker)", actor: reviewerName, at: mid(0.7), tone: "success" });
  if (draft.status === "approved") return events;
  events.push({ label: "Scheduled", actor: "Publishing queue", at: mid(0.85), tone: "neutral" });
  if (draft.status === "scheduled") return events;
  events.push({ label: "Published", actor: "Publishing queue", at: draft.targetDate, tone: "success" });
  return events;
}

export interface BrandCheck {
  label: string;
  pass: boolean;
  note: string;
}

export function getBrandChecks(draft: ContentDraft): BrandCheck[] {
  return [
    { label: "Tone: developer-first, no fluff", pass: !draft.flag?.includes("banned"), note: "Voice matches the brand report" },
    { label: "Only approved Pod stats", pass: !draft.flag?.includes("approved"), note: draft.flag?.includes("approved") ? draft.flag : "All figures traced to the approved stats list" },
    { label: "Banned words absent", pass: !draft.flag?.includes("banned"), note: draft.flag?.includes("banned") ? draft.flag : "No banned phrases found" },
    { label: "Approved CTA used", pass: true, note: draft.cta },
    { label: "Brand overlay stamp (logo + handle)", pass: !draft.flag?.includes("pricing"), note: draft.flag?.includes("pricing") ? draft.flag : "Logo and handle applied" },
  ];
}

// ---------------------------------------------------------------------------
// Analytics / derived helpers
// ---------------------------------------------------------------------------

export interface StatusCount {
  status: ContentStatus;
  label: string;
  count: number;
}

export function getDraftsByStatus(drafts: ContentDraft[] = MOCK_CONTENT_DRAFTS): StatusCount[] {
  return (["draft", "review", "sent_back", "approved", "scheduled", "published"] as ContentStatus[]).map((status) => ({
    status,
    label: STATUS_LABEL[status],
    count: drafts.filter((d) => d.status === status).length,
  }));
}

export interface PlatformCount {
  platform: ContentPlatform;
  label: string;
  count: number;
}

export function getPlatformBreakdown(drafts: ContentDraft[] = MOCK_CONTENT_DRAFTS): PlatformCount[] {
  return PLATFORMS.map((platform) => ({
    platform,
    label: PLATFORM_LABEL[platform],
    count: drafts.filter((d) => d.platform === platform).length,
  }));
}

export interface VelocityWeekPoint {
  week: string;
  created: number;
  published: number;
}

export function getContentVelocityWeeks(weeks: number): VelocityWeekPoint[] {
  const points: VelocityWeekPoint[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const end = REF_MS - i * MS_PER_WEEK;
    const start = end - MS_PER_WEEK;
    const created = MOCK_CONTENT_DRAFTS.filter((d) => Date.parse(d.createdAt) >= start && Date.parse(d.createdAt) < end).length;
    const published = MOCK_CONTENT_DRAFTS.filter(
      (d) => d.status === "published" && Date.parse(d.targetDate) >= start && Date.parse(d.targetDate) < end
    ).length;
    const baseline = 4 + Math.round(seeded(i + 1) * 4);
    points.push({
      week: fmtDate(new Date(end).toISOString()),
      created: i === 0 ? Math.max(created, baseline) : created + baseline,
      published: i === 0 ? Math.max(published, Math.round(baseline * 0.5)) : published + Math.round(baseline * 0.6),
    });
  }
  return points;
}

export interface FunnelStage {
  stage: string;
  count: number;
}

export function getApprovalFunnelCounts(): FunnelStage[] {
  const n = (s: ContentStatus) => MOCK_CONTENT_DRAFTS.filter((d) => d.status === s).length;
  const published = n("published");
  const scheduled = n("scheduled");
  const approved = n("approved");
  const review = n("review") + n("sent_back");
  return [
    { stage: "Generated", count: MOCK_CONTENT_DRAFTS.length },
    { stage: "In review", count: review + approved + scheduled + published },
    { stage: "Approved", count: approved + scheduled + published },
    { stage: "Scheduled", count: scheduled + published },
    { stage: "Published", count: published },
  ];
}

export interface AverageTimeInReview {
  avgHours: number;
  avgDaysLabel: string;
  sampleSize: number;
}

export function getAverageTimeInReview(): AverageTimeInReview {
  const reviewed = MOCK_CONTENT_DRAFTS.filter((d) => d.status !== "draft");
  const total = reviewed.reduce(
    (sum, d) => sum + Math.max((Date.parse(d.updatedAt) - Date.parse(d.createdAt)) / MS_PER_HOUR, 0.5),
    0
  );
  const avgHours = total / reviewed.length;
  return {
    avgHours: Math.round(avgHours * 10) / 10,
    avgDaysLabel: avgHours < 24 ? `${avgHours.toFixed(1)}h` : `${(avgHours / 24).toFixed(1)}d`,
    sampleSize: reviewed.length,
  };
}

export interface WeeklyScheduledPoint {
  week: string;
  linkedin: number;
  instagram: number;
  x: number;
  youtube: number;
  facebook: number;
  blog: number;
  total: number;
}

export function getWeeklyScheduledCounts(weeks: number): WeeklyScheduledPoint[] {
  const upcoming = MOCK_CONTENT_DRAFTS.filter((d) => d.status === "scheduled" || d.status === "approved" || d.status === "review");
  const points: WeeklyScheduledPoint[] = [];
  for (let i = 0; i < weeks; i++) {
    const start = REF_MS + i * MS_PER_WEEK;
    const end = start + MS_PER_WEEK;
    const inWeek = upcoming.filter((d) => Date.parse(d.targetDate) >= start && Date.parse(d.targetDate) < end);
    const c = (p: ContentPlatform) => inWeek.filter((d) => d.platform === p).length;
    points.push({
      week: `Wk of ${fmtDate(new Date(start).toISOString())}`,
      linkedin: c("linkedin"),
      instagram: c("instagram"),
      x: c("x"),
      youtube: c("youtube"),
      facebook: c("facebook"),
      blog: c("blog"),
      total: inWeek.length,
    });
  }
  return points;
}

export interface PillarPerformance {
  pillar: string;
  outputCount: number;
  estimatedEngagement: number;
}

export function getPillarPerformance(pillars: BrandPillar[] = BRAND_PILLARS): PillarPerformance[] {
  return pillars.map((p) => {
    const mine = MOCK_CONTENT_DRAFTS.filter((d) => d.pillarId === p.id);
    const engagement = mine.reduce((s, d) => s + (d.metrics ? d.metrics.likes + d.metrics.comments + d.metrics.shares + d.metrics.saves : 0), 0);
    return { pillar: p.label, outputCount: mine.length, estimatedEngagement: engagement };
  });
}

export interface ReviewerWorkload {
  reviewerId: string;
  name: string;
  approved: number;
  rejected: number;
  pending: number;
}

export function getReviewerWorkload(orgId: string): ReviewerWorkload[] {
  const pool = reviewersFor(orgId);
  return pool.map((member, idx) => {
    const assigned = MOCK_CONTENT_DRAFTS.filter((d) => d.reviewerIdx % pool.length === idx);
    return {
      reviewerId: member.id,
      name: member.name,
      approved: assigned.filter((d) => ["approved", "scheduled", "published"].includes(d.status)).length,
      pending: assigned.filter((d) => d.status === "review").length,
      rejected: assigned.filter((d) => d.status === "sent_back").length,
    };
  });
}

export interface EngagementRow {
  draftId: string;
  title: string;
  platform: ContentPlatform;
  format: ContentFormat;
  status: ContentStatus;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
}

export function getEngagementRows(): EngagementRow[] {
  return MOCK_CONTENT_DRAFTS.filter((d) => d.metrics).map((d) => ({
    draftId: d.id,
    title: d.title,
    platform: d.platform,
    format: d.format,
    status: d.status,
    impressions: d.metrics!.impressions,
    likes: d.metrics!.likes,
    comments: d.metrics!.comments,
    shares: d.metrics!.shares,
    clicks: d.metrics!.clicks,
  }));
}

export interface ApprovalRatePoint {
  week: string;
  approvalRate: number;
}

export function getApprovalRateOverTime(weeks: number): ApprovalRatePoint[] {
  const base = 74;
  const out: ApprovalRatePoint[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    out.push({
      week: fmtDate(new Date(REF_MS - i * MS_PER_WEEK).toISOString()),
      approvalRate: Math.min(96, Math.max(58, base + Math.round((seeded(i + 3) - 0.5) * 14) + (weeks - 1 - i))),
    });
  }
  return out;
}

export interface DraftToScheduledPoint {
  week: string;
  avgDays: number;
}

export function getAvgDraftToScheduledTrend(weeks: number): DraftToScheduledPoint[] {
  const out: DraftToScheduledPoint[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    out.push({
      week: fmtDate(new Date(REF_MS - i * MS_PER_WEEK).toISOString()),
      avgDays: Math.round((2.6 - (weeks - 1 - i) * 0.08 + (seeded(i + 7) - 0.5) * 0.8) * 10) / 10,
    });
  }
  return out;
}

export interface OutputTrendPoint {
  week: string;
  linkedin: number;
  instagram: number;
  x: number;
  youtube: number;
  facebook: number;
  blog: number;
}

export function getOutputTrendByPlatform(weeks: number): OutputTrendPoint[] {
  const out: OutputTrendPoint[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const end = REF_MS - i * MS_PER_WEEK;
    const start = end - MS_PER_WEEK;
    const c = (p: ContentPlatform, base: number) =>
      MOCK_CONTENT_DRAFTS.filter((d) => d.platform === p && Date.parse(d.createdAt) >= start && Date.parse(d.createdAt) < end).length +
      Math.round(seeded(i * 7 + base) * 2) +
      (base > 3 ? 0 : 1);
    out.push({
      week: fmtDate(new Date(end).toISOString()),
      linkedin: c("linkedin", 1),
      instagram: c("instagram", 2),
      x: c("x", 3),
      youtube: Math.round(seeded(i + 31) * 1.4),
      facebook: Math.round(seeded(i + 41) * 2),
      blog: Math.round(seeded(i + 51) * 1.6),
    });
  }
  return out;
}

export interface TopicRow {
  label: string;
  share: number;
  engagement: number;
}

export function getTotals() {
  const live = MOCK_CONTENT_DRAFTS.filter((d) => d.metrics);
  return {
    impressions: live.reduce((s, d) => s + d.metrics!.impressions, 0),
    reach: live.reduce((s, d) => s + d.metrics!.reach, 0),
    engagements: live.reduce((s, d) => s + d.metrics!.likes + d.metrics!.comments + d.metrics!.shares + d.metrics!.saves, 0),
    clicks: live.reduce((s, d) => s + d.metrics!.clicks, 0),
    posts: live.length,
  };
}
