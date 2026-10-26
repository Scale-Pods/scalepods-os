import { MEMBERS } from "@/lib/mock-data/orgs";

export type ContentPlatform = "linkedin" | "instagram" | "blog";

export type ContentStatus = "draft" | "review" | "approved" | "scheduled";

export interface ContentDraft {
  id: string;
  orgId: string;
  platform: ContentPlatform;
  title: string;
  hook: string;
  body: string;
  status: ContentStatus;
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  reviewerId: string;
  authorLabel: string;
  tags: string[];
  scheduledFor?: string; // ISO date for scheduled items
  hashtags?: string[];
  imagePrompt?: string;
  wordCount?: number;
  comments: ContentComment[];
}

export interface ContentComment {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
  type: "change_request" | "note";
}

export interface BrandPillar {
  id: string;
  label: string;
}

export interface BrandProfile {
  websiteUrl: string;
  tone: "Professional" | "Friendly" | "Bold" | "Technical" | "Playful";
  targetAudience: string;
  pillars: BrandPillar[];
  voiceSnippet: string;
}

function reviewerFor(index: number) {
  const reviewers = MEMBERS.filter((m) => m.role === "owner" || m.role === "manager");
  return reviewers[index % reviewers.length]?.id ?? MEMBERS[0].id;
}

function daysAgoIso(days: number, hours = 0) {
  return new Date(Date.now() - days * 86400000 - hours * 3600000).toISOString();
}

function daysAheadIso(days: number, hour = 10) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const MOCK_CONTENT_DRAFTS: ContentDraft[] = [
  {
    id: "draft-1",
    orgId: "org-demo-realty",
    platform: "linkedin",
    title: "Hiring in 2026: What great candidates actually look for",
    hook: "The job market flipped. Here's what we're seeing from 300+ candidate conversations this quarter.",
    body:
      "The job market flipped this year. Candidates aren't just chasing salary anymore — they're reading between the lines on culture, growth paths and how fast a company actually moves.\n\nFrom 300+ candidate conversations this quarter, three things stood out:\n\n1. Response speed is a trust signal. Candidates who hear back within 24 hours rate the employer brand 2x higher.\n2. Transparency on comp band upfront cuts drop-off by 40%.\n3. \"What does success look like in 90 days\" is now the #1 interview question.\n\nIf you're hiring in 2026, lead with clarity, not perks.",
    status: "approved",
    aiGenerated: true,
    createdAt: daysAgoIso(6),
    updatedAt: daysAgoIso(1),
    reviewerId: reviewerFor(0),
    authorLabel: "Content Agent",
    tags: ["hiring", "talent"],
    scheduledFor: daysAheadIso(2),
    hashtags: ["#Hiring2026", "#TalentTrends", "#FutureOfWork"],
    imagePrompt: "Minimal illustration of a handshake over a rising bar chart, blue and green palette",
    wordCount: 118,
    comments: [],
  },
  {
    id: "draft-2",
    orgId: "org-demo-realty",
    platform: "instagram",
    title: "5 signs it's time to upgrade your villa",
    hook: "Swipe to see the 5 signs your family has outgrown your current home 🏡",
    body:
      "Swipe to see the 5 signs your family has outgrown your current home:\n\n1. The home office is also the guest room, gym and storage unit.\n2. You've started Googling \"how to add a room\" more than once.\n3. Weekend guests mean an air mattress in the living room.\n4. Your car barely fits in the garage next to the bikes, the stroller and the boxes you swear you'll unpack.\n5. You've outgrown the neighbourhood, not just the house.\n\nSound familiar? DM us \"VILLA\" and we'll send our current Palm Jumeirah and Arabian Ranches listings.",
    status: "review",
    aiGenerated: true,
    createdAt: daysAgoIso(2, 4),
    updatedAt: daysAgoIso(0, 3),
    reviewerId: reviewerFor(1),
    authorLabel: "Content Agent",
    tags: ["real-estate", "listings"],
    hashtags: ["#DubaiRealEstate", "#VillaLife", "#ArabianRanches"],
    imagePrompt: "Bright carousel-style photo of a modern villa living room with warm natural light",
    wordCount: 96,
    comments: [],
  },
  {
    id: "draft-3",
    orgId: "org-demo-realty",
    platform: "blog",
    title: "Dubai Off-Plan vs Ready Property: A 2026 Buyer's Guide",
    hook: "Thinking off-plan or ready? Here's the real cost-and-timeline comparison, with no sales spin.",
    body:
      "Dubai's property market keeps giving buyers two very different paths: off-plan developments with flexible payment plans, or ready properties you can move into (or rent out) immediately.\n\n## Off-plan: lower entry, longer wait\nOff-plan units typically require 10-20% down, with the balance spread across construction milestones. You get in at a lower price point, but face 2-4 years before handover and some construction-delay risk.\n\n## Ready property: immediate yield, higher upfront cost\nReady units let you start collecting rent or move in immediately, but require full financing or a larger lump sum upfront.\n\n## Our take for 2026\nFor investors prioritising yield in the next 12 months, ready property in established communities like JVC or Business Bay remains the safer bet. For longer-horizon capital appreciation, off-plan in emerging corridors (Dubai South, MBR City) still offers the better multiple — provided you vet the developer's delivery track record.\n\nTalk to our team before you commit to either path — we'll run the numbers specific to your goals.",
    status: "draft",
    aiGenerated: true,
    createdAt: daysAgoIso(1, 2),
    updatedAt: daysAgoIso(1, 2),
    reviewerId: reviewerFor(0),
    authorLabel: "Content Agent",
    tags: ["real-estate", "guide", "investment"],
    wordCount: 612,
    comments: [],
  },
  {
    id: "draft-4",
    orgId: "org-demo-realty",
    platform: "linkedin",
    title: "Why response time wins deals, not just listings",
    hook: "We tracked 180 leads for 90 days. The agents who replied in under 5 minutes closed 3x more.",
    body:
      "We tracked 180 inbound leads over 90 days across our brokerage network.\n\nThe pattern was stark: agents who replied within 5 minutes closed at 3x the rate of agents who took over an hour — even when the listings and pricing were identical.\n\nSpeed isn't a nice-to-have in real estate. It's the difference between being first in the buyer's inbox and being the fourth agent they never call back.\n\nIf your lead response process still relies on checking email manually, it's costing you deals you'll never see in a report.",
    status: "scheduled",
    aiGenerated: true,
    createdAt: daysAgoIso(8),
    updatedAt: daysAgoIso(3),
    reviewerId: reviewerFor(1),
    authorLabel: "Content Agent",
    tags: ["sales", "leads"],
    scheduledFor: daysAheadIso(1),
    hashtags: ["#RealEstateSales", "#LeadResponse", "#PropTech"],
    imagePrompt: "Clean stat card graphic showing '3x faster response = 3x more closes'",
    wordCount: 104,
    comments: [],
  },
  {
    id: "draft-5",
    orgId: "org-demo-realty",
    platform: "instagram",
    title: "Before you sign: 3 clauses to always double-check",
    hook: "Save this before your next lease signing 📌",
    body:
      "Save this before your next lease signing.\n\n1. **Maintenance responsibility** — who covers AC servicing and appliance repairs? Get it in writing.\n2. **Early termination clause** — what's the penalty if your circumstances change?\n3. **Renewal terms** — is there a cap on the annual increase?\n\nThese three clauses cause 80% of the landlord-tenant disputes we help resolve. Read before you sign, not after.",
    status: "draft",
    aiGenerated: true,
    createdAt: daysAgoIso(0, 6),
    updatedAt: daysAgoIso(0, 6),
    reviewerId: reviewerFor(0),
    authorLabel: "Content Agent",
    tags: ["tenancy", "education"],
    hashtags: ["#DubaiTenants", "#RentalTips", "#KnowYourLease"],
    imagePrompt: "Flat-lay graphic of a lease document with a highlighter and magnifying glass icon",
    wordCount: 78,
    comments: [],
  },
  {
    id: "draft-6",
    orgId: "org-demo-realty",
    platform: "blog",
    title: "A First-Time Buyer's Timeline: Offer to Keys in Dubai",
    hook: "From accepted offer to keys in hand — what actually happens, week by week.",
    body:
      "Buying your first property in Dubai involves more moving parts than most buyers expect. Here's the realistic week-by-week timeline our clients go through.\n\n**Week 1-2: Offer and MOU** — Once your offer is accepted, both parties sign a Memorandum of Understanding (Form F) and the buyer pays a 10% deposit.\n\n**Week 3-4: NOC and mortgage approval** — The seller applies for a No Objection Certificate from the developer; if financing, your bank finalises the mortgage offer.\n\n**Week 5-6: Transfer at the Trustee office** — Both parties attend the Dubai Land Department trustee office to complete the transfer and pay remaining balance plus the 4% DLD fee.\n\n**Week 6+: Keys and handover** — Utilities are transferred, and you receive your keys and title deed.\n\nBudget 6-8 weeks end to end, longer if there's an existing mortgage to clear on the seller's side.",
    status: "review",
    aiGenerated: true,
    createdAt: daysAgoIso(4),
    updatedAt: daysAgoIso(1, 5),
    reviewerId: reviewerFor(1),
    authorLabel: "Content Agent",
    tags: ["guide", "first-time-buyer"],
    wordCount: 548,
    comments: [
      {
        id: "cmt-1",
        authorName: "Lina Haddad",
        body: "Can we add a line about the DLD fee being payable by the buyer specifically? Worth being explicit.",
        createdAt: daysAgoIso(1, 4),
        type: "change_request",
      },
    ],
  },
  {
    id: "draft-7",
    orgId: "org-demo-realty",
    platform: "linkedin",
    title: "The hidden cost of a slow handover process",
    hook: "A 2-week delay in handover can cost a seller more than a price negotiation ever would.",
    body:
      "A two-week delay in a property handover can cost a seller more than any price negotiation ever would — holding costs, a buyer getting cold feet, or a chain of dependent transactions stalling.\n\nWe now run a 10-point pre-handover checklist with every seller 30 days out: NOC status, outstanding service charges, utility clearances, and snagging items.\n\nSellers who complete this checklist close an average of 9 days faster than those who don't.",
    status: "draft",
    aiGenerated: true,
    createdAt: daysAgoIso(0, 10),
    updatedAt: daysAgoIso(0, 10),
    reviewerId: reviewerFor(0),
    authorLabel: "Content Agent",
    tags: ["sales", "process"],
    hashtags: ["#RealEstateOps", "#Handover"],
    imagePrompt: "Checklist icon graphic with a stopwatch, brand blue and green accents",
    wordCount: 92,
    comments: [],
  },
  {
    id: "draft-8",
    orgId: "org-demo-realty",
    platform: "instagram",
    title: "Meet the team: our newest listing specialist",
    hook: "New face, same obsession with getting you the best deal 🤝",
    body:
      "New face on the team, same obsession with getting you the best deal.\n\nMeet Fatima — 6 years in Dubai Marina and JBR listings, speaks Arabic, English and French, and has closed over AED 180M in transactions.\n\nIf you're buying or selling in Marina, JBR or Bluewaters, she's your person. Link in bio to book a call.",
    status: "approved",
    aiGenerated: true,
    createdAt: daysAgoIso(5),
    updatedAt: daysAgoIso(2),
    reviewerId: reviewerFor(1),
    authorLabel: "Content Agent",
    tags: ["team", "brand"],
    scheduledFor: daysAheadIso(4),
    hashtags: ["#MeetTheTeam", "#DubaiMarina", "#RealEstateAgent"],
    imagePrompt: "Professional headshot-style portrait photo with a warm, welcoming office backdrop",
    wordCount: 68,
    comments: [],
  },
  {
    id: "draft-9",
    orgId: "org-demo-realty",
    platform: "blog",
    title: "Golden Visa Through Property Investment: What Changed in 2026",
    hook: "The AED 2M threshold rule got clearer this year — here's exactly what qualifies.",
    body:
      "The UAE's Golden Visa program continues to be one of the strongest draws for property investors, and 2026 brought welcome clarity on what qualifies.\n\n**The core rule remains:** a property investment of AED 2 million or more (net of any mortgage, in most cases) qualifies the owner for a 10-year renewable residency visa.\n\n**What's new this year:**\n- Off-plan properties now qualify if at least 50% of the purchase price has been paid, provided the developer is on the approved list.\n- Joint ownership between spouses now counts toward the threshold when combined.\n- Processing time has dropped to an average of 15 working days with a complete file.\n\nWe help clients structure purchases to meet the threshold cleanly and manage the visa application end-to-end. Reach out if you want the current approved-developer list.",
    status: "draft",
    aiGenerated: true,
    createdAt: daysAgoIso(1),
    updatedAt: daysAgoIso(1),
    reviewerId: reviewerFor(0),
    authorLabel: "Content Agent",
    tags: ["investment", "visa", "guide"],
    wordCount: 587,
    comments: [],
  },
  {
    id: "draft-10",
    orgId: "org-demo-realty",
    platform: "linkedin",
    title: "What we tell every landlord before their first listing photo shoot",
    hook: "The listings that rent in under 7 days all have one thing in common — and it isn't the price.",
    body:
      "The listings that rent in under 7 days almost always share one thing: they're staged and shot like a hotel brochure, not a snapshot.\n\nBefore every shoot, we ask landlords to:\n\n1. Clear counters and surfaces completely.\n2. Open every curtain — natural light outperforms any ring light.\n3. Remove personal photos and clutter from shelves.\n4. Add one or two plants if the space feels bare.\n\nIt takes 20 minutes of prep and routinely cuts vacancy time by a week or more.",
    status: "review",
    aiGenerated: true,
    createdAt: daysAgoIso(3),
    updatedAt: daysAgoIso(0, 8),
    reviewerId: reviewerFor(1),
    authorLabel: "Content Agent",
    tags: ["leasing", "tips"],
    hashtags: ["#LandlordTips", "#RentalMarket"],
    imagePrompt: "Before/after style split image of a staged vs unstaged living room",
    wordCount: 89,
    comments: [],
  },
  {
    id: "draft-11",
    orgId: "org-demo-realty",
    platform: "instagram",
    title: "Community spotlight: Arabian Ranches",
    hook: "Thinking villa life? Here's what Arabian Ranches is really like day to day 🟢",
    body:
      "Thinking villa life? Here's what Arabian Ranches is really like, day to day.\n\nGolf course views, three community pools, a dedicated cycling track, and a souk with everyday essentials so you're not always driving out. Schools inside a 10-minute radius cover British, American and IB curricula.\n\nAverage rent for a 4-bed villa currently sits around AED 220k/year. DM us \"RANCHES\" for current availability.",
    status: "draft",
    aiGenerated: true,
    createdAt: daysAgoIso(0, 14),
    updatedAt: daysAgoIso(0, 14),
    reviewerId: reviewerFor(0),
    authorLabel: "Content Agent",
    tags: ["community", "listings"],
    hashtags: ["#ArabianRanches", "#VillaLiving", "#DubaiCommunities"],
    imagePrompt: "Golden-hour drone-style photo of villas along a golf course",
    wordCount: 74,
    comments: [],
  },
  {
    id: "draft-12",
    orgId: "org-demo-realty",
    platform: "blog",
    title: "Service Charges Explained: What You're Actually Paying For",
    hook: "Most owners can't explain their own service charge invoice. Here's a plain-English breakdown.",
    body:
      "Most property owners we talk to can't fully explain their own service charge invoice. Here's a plain-English breakdown of where that money actually goes.\n\n**Common components:**\n- Building maintenance and common-area cleaning\n- Security and concierge staffing\n- Shared utilities (pool heating, landscaping irrigation, lobby lighting)\n- Reserve fund contribution for major future repairs (roofing, lifts, facade)\n- Master community fees, if applicable, on top of the building-level charge\n\n**What to check on your invoice:**\n- Is the reserve fund contribution reasonable (typically 5-15% of the total)?\n- Has the rate per sq ft changed significantly year over year, and is there a published reason?\n- Are you being charged for amenities you don't have access to (a common dispute in mixed-use buildings)?\n\nIf a number looks off, you're entitled to request the RERA-approved service charge index for your building.",
    status: "approved",
    aiGenerated: true,
    createdAt: daysAgoIso(7),
    updatedAt: daysAgoIso(2),
    reviewerId: reviewerFor(1),
    authorLabel: "Content Agent",
    tags: ["ownership", "guide"],
    scheduledFor: daysAheadIso(6),
    wordCount: 602,
    comments: [],
  },
  {
    id: "draft-13",
    orgId: "org-demo-realty",
    platform: "linkedin",
    title: "Our Q3 numbers: what actually drove closed deals",
    hook: "We pulled apart our Q3 pipeline. Referrals outperformed paid leads 4 to 1 in close rate.",
    body:
      "We pulled apart our Q3 pipeline to see what actually converts.\n\nReferral leads closed at a 31% rate. Paid digital leads closed at 7%. Walk-ins from our community events closed at 18%.\n\nThe takeaway isn't \"stop paid ads\" — it's that a referral program deserves at least the same budget line as acquisition. We're doubling our client-referral incentive for Q4.",
    status: "draft",
    aiGenerated: true,
    createdAt: daysAgoIso(0, 20),
    updatedAt: daysAgoIso(0, 20),
    reviewerId: reviewerFor(0),
    authorLabel: "Content Agent",
    tags: ["performance", "referrals"],
    hashtags: ["#SalesOps", "#RealEstateMarketing"],
    imagePrompt: "Simple bar chart graphic comparing close rates by lead source",
    wordCount: 81,
    comments: [],
  },
  {
    id: "draft-14",
    orgId: "org-demo-realty",
    platform: "instagram",
    title: "Weekend open house: Emaar South",
    hook: "Open house this Saturday — 3 units, one weekend only 🔑",
    body:
      "Open house this Saturday — 3 units, one weekend only.\n\n3-bed townhouses starting from AED 1.65M. Payment plan available, 10% down, handover Q1 2027.\n\nSaturday 11am-4pm, Emaar South Sales Centre. Walk-ins welcome, or DM to book a private slot.",
    status: "scheduled",
    aiGenerated: true,
    createdAt: daysAgoIso(2),
    updatedAt: daysAgoIso(0, 16),
    reviewerId: reviewerFor(1),
    authorLabel: "Content Agent",
    tags: ["event", "listings"],
    scheduledFor: daysAheadIso(3),
    hashtags: ["#OpenHouse", "#EmaarSouth", "#DubaiProperty"],
    imagePrompt: "Bright exterior photo of modern townhouses with a 'Saturday Open House' banner overlay",
    wordCount: 56,
    comments: [],
  },
  {
    id: "draft-15",
    orgId: "org-demo-realty",
    platform: "blog",
    title: "Renewing Your Tenancy? Negotiate These 4 Things First",
    hook: "Renewal notices are landing this month. Here's what tenants can actually negotiate.",
    body:
      "Renewal notices are landing this month across many Dubai communities. Here's what tenants can realistically negotiate before signing.\n\n**1. The increase itself** — check the RERA rental index for your area; an increase above the index cap is not enforceable.\n\n**2. Maintenance backlog** — bundle any outstanding repair requests into the renewal conversation; landlords are often more flexible here than on price.\n\n**3. Payment schedule** — moving from one cheque to quarterly payments is a common, low-friction ask.\n\n**4. Early-exit clause** — if your plans are uncertain, negotiate a reduced penalty for early termination now rather than after signing.\n\nBring the RERA index printout to the conversation — it shifts the negotiation from opinion to reference.",
    status: "review",
    aiGenerated: true,
    createdAt: daysAgoIso(3, 6),
    updatedAt: daysAgoIso(0, 9),
    reviewerId: reviewerFor(0),
    authorLabel: "Content Agent",
    tags: ["tenancy", "guide"],
    wordCount: 541,
    comments: [
      {
        id: "cmt-2",
        authorName: "Omar Al Farsi",
        body: "Good draft — can we soften the tone slightly in the intro, it reads a bit combative toward landlords.",
        createdAt: daysAgoIso(0, 8),
        type: "change_request",
      },
    ],
  },
];

export const BRAND_PROFILE: BrandProfile = {
  websiteUrl: "https://demorealty.ae",
  tone: "Professional",
  targetAudience:
    "Property buyers, sellers, landlords and tenants in Dubai and the wider UAE — primarily expats and investors aged 28-55 who value clear, no-spin guidance over sales pressure.",
  pillars: [
    { id: "pillar-1", label: "Market education" },
    { id: "pillar-2", label: "Listing spotlights" },
    { id: "pillar-3", label: "Buyer/tenant rights" },
    { id: "pillar-4", label: "Team & culture" },
    { id: "pillar-5", label: "Investment guides" },
  ],
  voiceSnippet:
    "We write like the most straight-talking agent in the room — clear, specific, numbers-first, and allergic to hype. No \"stunning opportunity\" or \"don't miss out.\" If a number or a timeline backs up the claim, we show it.",
};

export function getContentDraft(id: string) {
  return MOCK_CONTENT_DRAFTS.find((d) => d.id === id);
}

export const PLATFORM_LABEL: Record<ContentPlatform, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  blog: "Blog",
};

export const PLATFORM_COLOR_CLASS: Record<ContentPlatform, { dot: string; bg: string; text: string; border: string }> = {
  linkedin: {
    dot: "bg-primary",
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/30",
  },
  instagram: {
    dot: "bg-accent",
    bg: "bg-accent/10",
    text: "text-accent",
    border: "border-accent/30",
  },
  blog: {
    dot: "bg-warning",
    bg: "bg-warning/15",
    text: "text-warning",
    border: "border-warning/30",
  },
};

export const CONTENT_STAGES: ContentStatus[] = ["draft", "review", "approved", "scheduled"];

// ---------------------------------------------------------------------------
// Analytics / derived data helpers
//
// Everything below is computed once at module load from MOCK_CONTENT_DRAFTS
// (or from small deterministic generators seeded by index), so values never
// change between renders or between server and client.
// ---------------------------------------------------------------------------

const NOW_MS = Date.now();
const MS_PER_DAY = 86400000;
const MS_PER_WEEK = MS_PER_DAY * 7;

/** Deterministic pseudo-random in [0, 1), seeded by an integer. No Math.random(). */
function seeded(seed: number) {
  const x = Math.sin(seed * 999.17) * 10000;
  return x - Math.floor(x);
}

export interface StatusCount {
  status: ContentStatus;
  label: string;
  count: number;
}

export function getDraftsByStatus(): StatusCount[] {
  const labels: Record<ContentStatus, string> = {
    draft: "Draft",
    review: "In review",
    approved: "Approved",
    scheduled: "Scheduled",
  };
  return CONTENT_STAGES.map((status) => ({
    status,
    label: labels[status],
    count: MOCK_CONTENT_DRAFTS.filter((d) => d.status === status).length,
  }));
}

export interface PlatformCount {
  platform: ContentPlatform;
  label: string;
  count: number;
}

export function getPlatformBreakdown(drafts: ContentDraft[] = MOCK_CONTENT_DRAFTS): PlatformCount[] {
  const platforms: ContentPlatform[] = ["linkedin", "instagram", "blog"];
  return platforms.map((platform) => ({
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

/**
 * Deterministic weekly content velocity for the last `weeks` weeks (oldest first).
 * Each draft is bucketed into a week by its createdAt / scheduledFor date; weeks
 * with no real drafts fall back to a small deterministic baseline so the chart
 * always reads as "a steady content engine" rather than mostly empty.
 */
export function getContentVelocityWeeks(weeks: number): VelocityWeekPoint[] {
  const points: VelocityWeekPoint[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = NOW_MS - i * MS_PER_WEEK;
    const weekEnd = weekStart + MS_PER_WEEK;
    const createdInWeek = MOCK_CONTENT_DRAFTS.filter((d) => {
      const t = new Date(d.createdAt).getTime();
      return t >= weekStart - MS_PER_WEEK && t < weekEnd - MS_PER_WEEK;
    }).length;
    const publishedInWeek = MOCK_CONTENT_DRAFTS.filter((d) => {
      if (!d.scheduledFor) return false;
      const t = new Date(d.scheduledFor).getTime();
      return t >= weekStart - MS_PER_WEEK && t < weekEnd - MS_PER_WEEK;
    }).length;
    const baseline = 2 + Math.round(seeded(i + 1) * 3);
    const weekDate = new Date(weekStart);
    points.push({
      week: weekDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      created: Math.max(createdInWeek, baseline),
      published: Math.max(publishedInWeek, Math.round(baseline * 0.6)),
    });
  }
  return points;
}

export interface FunnelStage {
  stage: string;
  count: number;
}

export function getApprovalFunnelCounts(): FunnelStage[] {
  const draft = MOCK_CONTENT_DRAFTS.filter((d) => d.status === "draft").length;
  const review = MOCK_CONTENT_DRAFTS.filter((d) => d.status === "review").length;
  const approved = MOCK_CONTENT_DRAFTS.filter((d) => d.status === "approved").length;
  const scheduled = MOCK_CONTENT_DRAFTS.filter((d) => d.status === "scheduled").length;
  return [
    { stage: "Draft", count: draft + review + approved + scheduled },
    { stage: "Review", count: review + approved + scheduled },
    { stage: "Approved", count: approved + scheduled },
    { stage: "Scheduled", count: scheduled },
  ];
}

export interface AverageTimeInReview {
  avgHours: number;
  avgDaysLabel: string;
  sampleSize: number;
}

/**
 * Average time-in-review derived from createdAt -> updatedAt for drafts that
 * have moved past the review stage (review, approved or scheduled).
 */
export function getAverageTimeInReview(): AverageTimeInReview {
  const reviewed = MOCK_CONTENT_DRAFTS.filter(
    (d) => d.status === "review" || d.status === "approved" || d.status === "scheduled"
  );
  if (reviewed.length === 0) {
    return { avgHours: 0, avgDaysLabel: "No data yet", sampleSize: 0 };
  }
  const totalHours = reviewed.reduce((sum, d) => {
    const hours = (new Date(d.updatedAt).getTime() - new Date(d.createdAt).getTime()) / 3600000;
    return sum + Math.max(hours, 0.5);
  }, 0);
  const avgHours = totalHours / reviewed.length;
  const avgDaysLabel =
    avgHours < 24 ? `${avgHours.toFixed(1)}h` : `${(avgHours / 24).toFixed(1)}d`;
  return { avgHours: Math.round(avgHours * 10) / 10, avgDaysLabel, sampleSize: reviewed.length };
}

export interface WeeklyScheduledPoint {
  week: string;
  linkedin: number;
  instagram: number;
  blog: number;
  total: number;
}

/** Posts scheduled per week for the next `weeks` weeks (starting this week). */
export function getWeeklyScheduledCounts(weeks: number): WeeklyScheduledPoint[] {
  const scheduled = MOCK_CONTENT_DRAFTS.filter((d) => d.scheduledFor);
  const points: WeeklyScheduledPoint[] = [];
  for (let i = 0; i < weeks; i++) {
    const weekStart = NOW_MS + i * MS_PER_WEEK;
    const weekEnd = weekStart + MS_PER_WEEK;
    const inWeek = scheduled.filter((d) => {
      const t = new Date(d.scheduledFor as string).getTime();
      return t >= weekStart && t < weekEnd;
    });
    const linkedin = inWeek.filter((d) => d.platform === "linkedin").length;
    const instagram = inWeek.filter((d) => d.platform === "instagram").length;
    const blog = inWeek.filter((d) => d.platform === "blog").length;
    const weekDate = new Date(weekStart);
    points.push({
      week: `Wk of ${weekDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`,
      linkedin,
      instagram,
      blog,
      total: linkedin + instagram + blog,
    });
  }
  return points;
}

export interface PillarPerformance {
  pillar: string;
  outputCount: number;
  estimatedEngagement: number;
}

/**
 * Mock output volume + engagement index per brand pillar. Deterministically
 * derived from the pillar's position so numbers are stable across renders.
 */
export function getPillarPerformance(pillars: BrandPillar[] = BRAND_PROFILE.pillars): PillarPerformance[] {
  return pillars.map((pillar, i) => {
    const outputCount = 3 + Math.round(seeded(i + 1) * 9);
    const estimatedEngagement = 120 + Math.round(seeded(i + 11) * 480);
    return { pillar: pillar.label, outputCount, estimatedEngagement };
  });
}

export interface ReviewerWorkload {
  reviewerId: string;
  name: string;
  approved: number;
  rejected: number;
  pending: number;
}

/**
 * Reviewer workload: how many drafts assigned to each reviewer are approved
 * (approved/scheduled), rejected (simulated split of review items), or still
 * pending. MEMBERS is passed in by the caller (from mock-data/orgs) to keep
 * this module decoupled from org data.
 */
export function getReviewerWorkload(
  members: { id: string; name: string }[]
): ReviewerWorkload[] {
  return members
    .map((member) => {
      const assigned = MOCK_CONTENT_DRAFTS.filter((d) => d.reviewerId === member.id);
      if (assigned.length === 0) return null;
      const approved = assigned.filter((d) => d.status === "approved" || d.status === "scheduled").length;
      const pending = assigned.filter((d) => d.status === "review").length;
      // A deterministic small number of "rejected" drafts to make the chart
      // reflect maker-checker reality without a dedicated rejected field.
      const rejected = assigned.filter((d) => d.status === "draft" && d.comments.length > 0).length;
      return { reviewerId: member.id, name: member.name, approved, rejected, pending };
    })
    .filter((v): v is ReviewerWorkload => v !== null);
}

export interface EstimatedEngagementRow {
  draftId: string;
  title: string;
  platform: ContentPlatform;
  status: ContentStatus;
  likes: number;
  comments: number;
  shares: number;
}

/**
 * Mock "estimated engagement" per published/scheduled piece. These numbers
 * are simulated — the social publishing integration is stubbed per spec, so
 * there is no live engagement API to read from yet. Seeded by draft id so
 * values are stable across renders.
 */
export function getEstimatedEngagement(): EstimatedEngagementRow[] {
  return MOCK_CONTENT_DRAFTS.filter((d) => d.status === "approved" || d.status === "scheduled").map(
    (d, i) => {
      const base = d.platform === "instagram" ? 600 : d.platform === "linkedin" ? 300 : 80;
      const likes = Math.round(base * (0.6 + seeded(i + 1) * 1.1));
      const comments = Math.round(likes * (0.03 + seeded(i + 21) * 0.05));
      const shares = Math.round(likes * (0.02 + seeded(i + 41) * 0.04));
      return {
        draftId: d.id,
        title: d.title,
        platform: d.platform,
        status: d.status,
        likes,
        comments,
        shares,
      };
    }
  );
}

export interface ApprovalRatePoint {
  week: string;
  approvalRate: number;
}

/** Approval rate (% approved+scheduled of all drafts touched) trending over the last `weeks` weeks. */
export function getApprovalRateOverTime(weeks: number): ApprovalRatePoint[] {
  const points: ApprovalRatePoint[] = [];
  const baseRate = Math.round(
    (MOCK_CONTENT_DRAFTS.filter((d) => d.status === "approved" || d.status === "scheduled").length /
      MOCK_CONTENT_DRAFTS.length) *
      100
  );
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = NOW_MS - i * MS_PER_WEEK;
    const wobble = Math.round((seeded(i + 3) - 0.5) * 16);
    const rate = Math.min(98, Math.max(55, baseRate + wobble - Math.round(i * 0.4)));
    const weekDate = new Date(weekStart);
    points.push({
      week: weekDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      approvalRate: rate,
    });
  }
  return points;
}

export interface DraftToScheduledPoint {
  week: string;
  avgDays: number;
}

/** Average draft -> scheduled turnaround time (days) trending over the last `weeks` weeks. */
export function getAvgDraftToScheduledTrend(weeks: number): DraftToScheduledPoint[] {
  const avgTimeInReview = getAverageTimeInReview();
  const baseDays = Math.max(1, Math.round((avgTimeInReview.avgHours / 24) * 10) / 10 + 1.5);
  const points: DraftToScheduledPoint[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = NOW_MS - i * MS_PER_WEEK;
    const wobble = (seeded(i + 7) - 0.5) * 1.2;
    const avgDays = Math.max(0.5, Math.round((baseDays + wobble) * 10) / 10);
    const weekDate = new Date(weekStart);
    points.push({
      week: weekDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      avgDays,
    });
  }
  return points;
}

export interface OutputTrendPoint {
  week: string;
  linkedin: number;
  instagram: number;
  blog: number;
}

/** Content output over the last `weeks` weeks, split by platform, for a stacked area chart. */
export function getOutputTrendByPlatform(weeks: number): OutputTrendPoint[] {
  const points: OutputTrendPoint[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = NOW_MS - i * MS_PER_WEEK;
    const weekEnd = weekStart + MS_PER_WEEK;
    const inWeek = MOCK_CONTENT_DRAFTS.filter((d) => {
      const t = new Date(d.createdAt).getTime();
      return t >= weekStart - MS_PER_WEEK && t < weekEnd - MS_PER_WEEK;
    });
    const linkedinBase = 1 + Math.round(seeded(i + 2) * 2);
    const instagramBase = 1 + Math.round(seeded(i + 13) * 2);
    const blogBase = Math.round(seeded(i + 23) * 2);
    points.push({
      week: new Date(weekStart).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      linkedin: Math.max(inWeek.filter((d) => d.platform === "linkedin").length, linkedinBase),
      instagram: Math.max(inWeek.filter((d) => d.platform === "instagram").length, instagramBase),
      blog: Math.max(inWeek.filter((d) => d.platform === "blog").length, blogBase),
    });
  }
  return points;
}
