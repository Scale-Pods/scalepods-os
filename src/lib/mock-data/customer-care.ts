/**
 * Customer Care mock data, modelled on the Shills Growth OS Customer Care
 * command centre: AI support inbox (WhatsApp / Shopify / Instagram DM / website),
 * order lifecycle WhatsApp automation, live carrier tracking, review engine
 * (4-5 star routed public, 1-3 star intercepted into tickets), SLA monitor.
 *
 * Fully deterministic: all timestamps derive from CC_REF_DATE and pure index
 * functions - no Math.random() / Date.now().
 */

export const CC_REF_DATE = "2026-10-27T12:00:00Z";
const REF_MS = Date.parse(CC_REF_DATE);

function isoAgo(minutes: number): string {
  return new Date(REF_MS - minutes * 60_000).toISOString();
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n: number) => String(n).padStart(2, "0");

/** Deterministic (UTC) date-time label, safe for SSR + client. */
export function ccFmtDateTime(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]}, ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}
export function ccFmtDate(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
export function ccFmtTime(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}
export function ccAgo(iso: string): string {
  const m = Math.max(0, Math.round((REF_MS - Date.parse(iso)) / 60_000));
  if (m < 60) return `${m}m ago`;
  if (m < 60 * 24) return `${Math.round(m / 60)}h ago`;
  return `${Math.round(m / 1440)}d ago`;
}

/* ------------------------------------------------------------------ types */

export type CcChannel = "whatsapp" | "shopify" | "instagram" | "website";
export type CcStatus = "Open" | "Resolved";
export type CcSentiment = "positive" | "neutral" | "negative";
export type CcPriority = "low" | "medium" | "high" | "urgent";
export type CcSender = "customer" | "ai" | "agent";

export interface CcMessage {
  sender: CcSender;
  msg: string;
  at: string; // ISO
}

export interface CcCase {
  id: string;
  caseNo: string;
  customer: string;
  phone: string;
  email: string;
  channel: CcChannel;
  subject: string;
  msg: string; // first customer message
  status: CcStatus;
  escalation: string; // "None" or reason
  createdAt: string;
  updatedAt: string;
  priority: CcPriority;
  sentiment: CcSentiment;
  topic: string;
  handledBy: "AI" | "Human" | "AI + Human";
  assignee: string;
  firstResponseMin: number;
  resolutionHours: number | null;
  csat: number | null;
  orderId: string;
  product: string;
  orderValue: number;
  carrier: string;
  trackId: string;
  tags: string[];
  aiSummary: string;
  aiConfidence: number;
  thread: CcMessage[];
}

export interface CcReview {
  id: string;
  customer: string;
  rating: number;
  platform: "Google" | "Amazon" | "Nykaa" | "Myntra" | "Flipkart";
  product: string;
  text: string;
  date: string; // YYYY-MM-DD
  sentiment: CcSentiment;
  reply: string | null;
  intercepted: boolean;
  linkedCaseId: string | null;
  verifiedPurchase: boolean;
}

export interface CcOrderEvent {
  stage: string;
  time: string;
  done: boolean;
  trigger: string;
  waMsg: string;
}

export interface CcOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  city: string;
  carrier: string;
  trackId: string;
  currentStage: number; // index of last completed stage
  placedAt: string;
  payment: "UPI" | "Card" | "COD" | "Netbanking";
}

export interface CcShipment {
  id: string;
  carrier: string;
  trackId: string;
  orderId: string;
  customer: string;
  status: "In Transit" | "Out for Delivery" | "Delivered" | "Exception";
  location: string;
  updated: string;
  eta: string;
  history: { at: string; event: string; location: string }[];
}

export interface CcSlaRule {
  id: string;
  rule: string;
  target: string;
  actual: string;
  met: boolean;
  description: string;
  trend: number[]; // 7 daily values (percent of tickets within SLA)
}

export interface CcKbArticle {
  id: string;
  title: string;
  category: string;
  status: "published" | "draft" | "needs_review";
  author: string;
  updatedAt: string;
  views: number;
  aiCitations: number;
  helpfulPct: number;
  summary: string;
  body: string[];
  linkedTopics: string[];
}

/* ------------------------------------------------------------- scenarios */

interface Scenario {
  topic: string;
  subject: string;
  customerMsg: string;
  aiMsg: string;
  followUp?: string;
  agentMsg?: string;
  closing?: string;
  escalation: string;
  priority: CcPriority;
  sentiment: CcSentiment;
  product: number;
  resolved: boolean;
  tags: string[];
}

const PRODUCTS = [
  { name: "Nail Gel Set #12 (Classic Nudes)", price: 999 },
  { name: "Vitamin C Face Serum 30ml", price: 799 },
  { name: "Matte Peach Lipstick (Glow Edition)", price: 649 },
  { name: "Rosewater Face Mist 100ml", price: 499 },
  { name: "Hydrating Lavender Gel 100g", price: 549 },
];

const SCENARIOS: Scenario[] = [
  {
    topic: "Delivered not received",
    subject: "Marked delivered but not received",
    customerMsg: "My order {order} was marked delivered, but I did not receive it. The rider was unreachable.",
    aiMsg: "I apologise for the inconvenience, {first}. I am tracking {order}. Our records show it was completed by the delivery partner. I am escalating to operations to arrange a refund or a fresh dispatch.",
    followUp: "I need this today, it was a gift.",
    agentMsg: "Hi {first}, this is the CS team. We have raised a missing-parcel claim with the carrier and are dispatching a replacement with priority shipping today.",
    escalation: "Refund Requested",
    priority: "urgent",
    sentiment: "negative",
    product: 0,
    resolved: false,
    tags: ["delivery", "refund", "lost-parcel"],
  },
  {
    topic: "Wrong shade received",
    subject: "Shade differs from product photos",
    customerMsg: "Received the lip tint but the shade 'Midnight Cherry' is completely different from the pictures. I need an exchange.",
    aiMsg: "Hello {first}! I can help you exchange your Matte Peach Lipstick. I have logged your request. Would you like a pickup scheduled, or a credit coupon code instead?",
    followUp: "Pickup please, tomorrow evening works.",
    closing: "Pickup booked for tomorrow 5-8 PM. The exchange unit ships as soon as the courier scans the return.",
    escalation: "Exchange Request",
    priority: "high",
    sentiment: "negative",
    product: 2,
    resolved: false,
    tags: ["exchange", "wrong-item"],
  },
  {
    topic: "Order cancellation",
    subject: "Cancel order before dispatch",
    customerMsg: "Can I cancel my order {order}? It is still processing.",
    aiMsg: "Your order {order} has been cancelled successfully. The refund will reflect in your original payment method in 2-3 business days.",
    closing: "Thanks for the quick help!",
    escalation: "None",
    priority: "low",
    sentiment: "neutral",
    product: 1,
    resolved: true,
    tags: ["cancellation", "refund"],
  },
  {
    topic: "Where is my order",
    subject: "Order status enquiry",
    customerMsg: "Hi, where is my order {order}? It was supposed to arrive yesterday.",
    aiMsg: "Hi {first}, your parcel is currently in transit with {carrier} (tracking {track}) and is expected today by 6 PM. You can follow it live at shills.in/track/{track}.",
    closing: "Got it, thank you.",
    escalation: "None",
    priority: "low",
    sentiment: "neutral",
    product: 4,
    resolved: true,
    tags: ["tracking", "wismo"],
  },
  {
    topic: "Damaged in transit",
    subject: "Bottle arrived leaking",
    customerMsg: "The Rosewater mist bottle arrived leaking and the whole bag is damp. Very disappointed.",
    aiMsg: "I am so sorry, {first}. That should not have happened. Could you share a photo of the parcel and bottle? I will trigger a replacement right away.",
    followUp: "Sent the photo just now.",
    agentMsg: "Photo verified. Replacement {order}-R1 has been created and will dispatch within 24 hours at no cost.",
    escalation: "Replacement Triggered",
    priority: "high",
    sentiment: "negative",
    product: 3,
    resolved: false,
    tags: ["damage", "replacement"],
  },
  {
    topic: "Refund status",
    subject: "Refund not received yet",
    customerMsg: "I returned my serum 5 days ago and the refund has not come through. Please check.",
    aiMsg: "Thanks for your patience, {first}. Your return was received on day 3 and the refund of Rs.{amount} was initiated 18 hours ago. Banks usually take 2-4 business days to post it.",
    closing: "Okay, I will wait. Thanks.",
    escalation: "None",
    priority: "medium",
    sentiment: "neutral",
    product: 1,
    resolved: true,
    tags: ["refund", "returns"],
  },
  {
    topic: "Product usage question",
    subject: "How do I apply the gel set?",
    customerMsg: "How long should I cure the Nail Gel Set #12 under a UV lamp? The instructions are unclear.",
    aiMsg: "Cure the base coat for 30 seconds, colour coats for 60 seconds each and the top coat for 60 seconds under a 36W LED/UV lamp. I have also sent the how-to video link to your WhatsApp.",
    closing: "Perfect, that worked beautifully!",
    escalation: "None",
    priority: "low",
    sentiment: "positive",
    product: 0,
    resolved: true,
    tags: ["usage", "kb-answered"],
  },
  {
    topic: "Address change",
    subject: "Change delivery address",
    customerMsg: "I entered the wrong flat number. Can I update the delivery address for {order}?",
    aiMsg: "Your order {order} is packed but not yet handed to the carrier, so I can update it. Please confirm the corrected address and I will apply it immediately.",
    followUp: "Flat 402, Tower B, Sector 15, Noida.",
    closing: "Address updated for {order}. You will get a fresh dispatch confirmation shortly.",
    escalation: "None",
    priority: "medium",
    sentiment: "neutral",
    product: 2,
    resolved: true,
    tags: ["address", "pre-dispatch"],
  },
  {
    topic: "Payment failed / double charge",
    subject: "Charged twice for one order",
    customerMsg: "I was charged twice on UPI for order {order}. Please reverse one payment.",
    aiMsg: "I can see two debit attempts, {first}. One is a pending authorisation that auto-reverses in 24-48 hours. I have flagged it to finance so they can verify and speed it up.",
    followUp: "It has been 3 days already.",
    agentMsg: "Finance confirmed the duplicate debit. A manual reversal of Rs.{amount} has been initiated and will show within 24 hours.",
    escalation: "Finance Review",
    priority: "urgent",
    sentiment: "negative",
    product: 0,
    resolved: false,
    tags: ["payment", "double-charge"],
  },
  {
    topic: "Bulk / salon enquiry",
    subject: "Wholesale pricing for salon",
    customerMsg: "We run a nail studio and want 40 Nail Gel Set #12 kits. Do you offer wholesale pricing?",
    aiMsg: "Thank you for your interest, {first}. For 25+ units we offer tiered B2B pricing. I have shared our wholesale catalogue and a salon account manager will call you within the hour.",
    closing: "Great, expecting the call.",
    escalation: "Routed to Sales",
    priority: "medium",
    sentiment: "positive",
    product: 0,
    resolved: true,
    tags: ["b2b", "sales-handoff"],
  },
  {
    topic: "Ingredient / allergy",
    subject: "Allergy question about Vitamin C serum",
    customerMsg: "I have sensitive skin. Is the Vitamin C serum free of fragrance and alcohol? I do not want a reaction.",
    aiMsg: "The Vitamin C Face Serum contains 15% L-Ascorbic Acid, is fragrance-free and alcohol-free. We still recommend a patch test behind the ear 24 hours before first use.",
    closing: "Thank you, that is helpful.",
    escalation: "None",
    priority: "low",
    sentiment: "positive",
    product: 1,
    resolved: true,
    tags: ["ingredients", "kb-answered"],
  },
  {
    topic: "Coupon not applied",
    subject: "Discount code rejected at checkout",
    customerMsg: "The code GLOW15 is not working at checkout even though your Instagram post says it is live.",
    aiMsg: "Sorry about that, {first}. GLOW15 requires a minimum cart of Rs.799. Add any item to reach it, or I can generate a one-time code valid for your current cart.",
    followUp: "Please send the one-time code.",
    closing: "Your one-time code GLOW15-X7 is valid for 24 hours.",
    escalation: "None",
    priority: "low",
    sentiment: "neutral",
    product: 3,
    resolved: true,
    tags: ["coupon", "checkout"],
  },
  {
    topic: "Low CSAT intercept",
    subject: "Auto-intercept: 2 star survey rating",
    customerMsg: "Rating: 2 stars - the lipstick formula feels dry and the packaging was crushed.",
    aiMsg: "Hi {first}, we are really sorry to hear about your experience. A support manager has been assigned to your case and we will make this right within 2 hours.",
    followUp: "I just want my money back.",
    agentMsg: "Hi {first}, I am a CS manager. I have approved a full refund and added a Rs.150 credit for the trouble. The public review was never posted, thank you for telling us first.",
    escalation: "Low CSAT Intercept",
    priority: "high",
    sentiment: "negative",
    product: 2,
    resolved: false,
    tags: ["csat-intercept", "refund"],
  },
  {
    topic: "Shipping delay",
    subject: "Parcel stuck at sorting hub",
    customerMsg: "My package has been stuck at the Delhi sorting hub for 3 days now. What is going on?",
    aiMsg: "I can see the exception at the Delhi hub, {first}. The carrier has rescheduled delivery for tomorrow. As an apology I have added a Rs.50 coupon to your account.",
    closing: "Fine, I will wait till tomorrow.",
    escalation: "Carrier Exception",
    priority: "medium",
    sentiment: "negative",
    product: 4,
    resolved: true,
    tags: ["delay", "carrier-exception", "coupon"],
  },
];

const CUSTOMERS = [
  "Meera Sen", "Rohan Sharma", "Nitin Gupta", "Priya Shah", "Amit Kulkarni", "Neha Sharma", "Shreya Roy",
  "Karan Malhotra", "Aisha Khan", "Vikram Rao", "Sanya Kapoor", "Deepak Joshi", "Ritu Verma", "Arjun Nair",
  "Pooja Iyer", "Manish Tiwari", "Tanvi Desai", "Faisal Ahmed", "Isha Bansal", "Gaurav Mehta",
  "Lakshmi Pillai", "Harsh Vardhan", "Simran Kaur", "Yash Agarwal", "Divya Menon", "Rahul Bhatt",
  "Ananya Das", "Kabir Singh",
];

const CHANNELS: CcChannel[] = ["shopify", "whatsapp", "website", "whatsapp", "instagram", "whatsapp", "shopify", "website"];
const CARRIERS = ["Delhivery", "Shiprocket", "Shadowfax", "Xpressbees", "Blue Dart"];
const CARRIER_CODE: Record<string, string> = {
  Delhivery: "DEL", Shiprocket: "SR", Shadowfax: "SFX", Xpressbees: "XB", "Blue Dart": "BD",
};
const AGENTS = ["Anika Rao", "Dev Malhotra", "Sana Qureshi", "Rhea D'Souza"];

function fill(t: string, v: Record<string, string>): string {
  return t.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");
}

function buildCases(): CcCase[] {
  const out: CcCase[] = [];
  const total = 30;
  for (let i = 0; i < total; i++) {
    const sc = SCENARIOS[i % SCENARIOS.length];
    const customer = CUSTOMERS[i % CUSTOMERS.length];
    const first = customer.split(" ")[0];
    const channel = CHANNELS[(i * 3 + 1) % CHANNELS.length];
    const carrier = CARRIERS[(i * 2) % CARRIERS.length];
    const orderNo = 9840 - i * 3;
    const order = `#SH-${orderNo}`;
    const track = `${CARRIER_CODE[carrier]}-${orderNo}-${String.fromCharCode(65 + (i % 26))}`;
    const prod = PRODUCTS[sc.product];
    const minutesAgo = 10 + i * 95 + (i % 4) * 17; // newest first
    const created = isoAgo(minutesAgo);
    const status: CcStatus = sc.resolved && !(i >= 14 && i % 4 === 0) ? "Resolved" : "Open";
    const vars = { order, first, carrier, track, amount: String(prod.price) };
    const firstResp = Math.round((1.2 + ((i * 7) % 29) / 10) * 10) / 10; // 1.2 - 4.0
    const handledBy: CcCase["handledBy"] = sc.agentMsg ? "AI + Human" : sc.escalation !== "None" && status === "Open" ? "AI + Human" : "AI";
    const escalation = sc.escalation;

    const thread: CcMessage[] = [];
    let t = minutesAgo;
    thread.push({ sender: "customer", msg: fill(sc.customerMsg, vars), at: isoAgo(t) });
    t -= Math.max(1, Math.round(firstResp));
    thread.push({ sender: "ai", msg: fill(sc.aiMsg, vars), at: isoAgo(t) });
    if (sc.followUp) {
      t -= 6 + (i % 5);
      thread.push({ sender: "customer", msg: fill(sc.followUp, vars), at: isoAgo(t) });
    }
    if (sc.agentMsg) {
      t -= 9 + (i % 7);
      thread.push({ sender: "agent", msg: fill(sc.agentMsg, vars), at: isoAgo(t) });
    }
    if (sc.closing && status === "Resolved") {
      t -= 5 + (i % 4);
      thread.push({ sender: sc.agentMsg ? "agent" : sc.followUp ? "ai" : "customer", msg: fill(sc.closing, vars), at: isoAgo(t) });
    }
    // clamp negative-time safety
    const updatedAt = thread[thread.length - 1].at;

    out.push({
      id: `case-${i + 1}`,
      caseNo: `CC-${4100 + i + 1}`,
      customer,
      phone: `+91 98${pad(10 + ((i * 13) % 80))}${pad(20 + ((i * 7) % 70))}${pad(10 + ((i * 11) % 80))}`,
      email: `${customer.toLowerCase().replace(/[^a-z]+/g, ".")}@gmail.com`,
      channel,
      subject: sc.subject,
      msg: fill(sc.customerMsg, vars),
      status,
      escalation,
      createdAt: created,
      updatedAt,
      priority: sc.priority,
      sentiment: sc.sentiment,
      topic: sc.topic,
      handledBy,
      assignee: handledBy === "AI" ? "AI Agent" : AGENTS[i % AGENTS.length],
      firstResponseMin: firstResp,
      resolutionHours: status === "Resolved" ? Math.round((0.3 + ((i * 5) % 17) / 4) * 10) / 10 : null,
      csat: status === "Resolved" ? 3 + ((i * 3) % 3) : null,
      orderId: order,
      product: prod.name,
      orderValue: prod.price,
      carrier,
      trackId: track,
      tags: sc.tags,
      aiSummary: `${sc.topic}: customer on ${channel} regarding ${prod.name}. ${
        status === "Resolved" ? "Resolved" : "Awaiting action"
      }${escalation !== "None" ? `; flagged "${escalation}".` : "."}`,
      aiConfidence: Math.round((0.72 + ((i * 11) % 27) / 100) * 100) / 100,
      thread,
    });
  }
  return out;
}

export const CC_CASES: CcCase[] = buildCases();

/* ----------------------------------------------------------------- reviews */

const REVIEW_SEED: Omit<CcReview, "id" | "linkedCaseId" | "intercepted" | "sentiment" | "verifiedPurchase">[] = [
  { customer: "Priya Shah", rating: 5, platform: "Google", product: PRODUCTS[0].name, date: "2026-10-26", text: "Absolutely love the Nail Gel Set! The classic nudes are highly pigmented and hold up for weeks without chipping. Worth every rupee.", reply: "Thank you Priya! We are thrilled to hear our gel polish holds up beautifully!" },
  { customer: "Amit K.", rating: 2, platform: "Amazon", product: PRODUCTS[3].name, date: "2026-10-25", text: "Product itself is fine but the Rosewater bottle arrived leaking. The Amazon bag was completely damp.", reply: "Hi Amit, we apologize for the leaking mist bottle. We are sending a replacement right away!" },
  { customer: "Neha Sharma", rating: 4, platform: "Nykaa", product: PRODUCTS[4].name, date: "2026-10-25", text: "Very nice hydration from the Lavender Gel. Non-sticky formula. Will buy again.", reply: null },
  { customer: "Shreya Roy", rating: 1, platform: "Nykaa", product: PRODUCTS[2].name, date: "2026-10-24", text: "Ordered peach lipstick but received wrong shade Midnight Cherry. Disappointed.", reply: "We are sorry for the mixup Shreya. Our AI Support is issuing an exchange code for you." },
  { customer: "Karan Malhotra", rating: 5, platform: "Amazon", product: PRODUCTS[1].name, date: "2026-10-24", text: "Brightening effect visible within two weeks. Packaging is premium and the dropper is precise.", reply: "Thanks Karan! Glad the serum is working for you." },
  { customer: "Aisha Khan", rating: 5, platform: "Myntra", product: PRODUCTS[2].name, date: "2026-10-23", text: "The Glow Edition lipstick is gorgeous. Stays on through lunch and does not dry out my lips.", reply: null },
  { customer: "Vikram Rao", rating: 3, platform: "Flipkart", product: PRODUCTS[3].name, date: "2026-10-23", text: "Mist is fine but the spray nozzle clogs after a week. Average for the price.", reply: "Hi Vikram, thanks for flagging this. A support manager will reach out about a nozzle replacement." },
  { customer: "Sanya Kapoor", rating: 4, platform: "Google", product: PRODUCTS[0].name, date: "2026-10-22", text: "Great kit for home manicures. Wish it came with more cure-time guidance, but results are salon quality.", reply: "Thank you Sanya! We have added a cure-time guide to the kit insert." },
  { customer: "Deepak Joshi", rating: 5, platform: "Nykaa", product: PRODUCTS[1].name, date: "2026-10-22", text: "Best vitamin C serum I have tried under Rs.1000. No stickiness, no irritation.", reply: "Thank you Deepak!" },
  { customer: "Ritu Verma", rating: 2, platform: "Amazon", product: PRODUCTS[4].name, date: "2026-10-21", text: "Gel arrived with the seal broken. Contacted support, they were quick, but the experience was not great.", reply: "Ritu, we apologise. Your replacement shipped yesterday." },
  { customer: "Arjun Nair", rating: 4, platform: "Flipkart", product: PRODUCTS[4].name, date: "2026-10-20", text: "Nice cooling gel, good after a long day outdoors. Delivery was a day late.", reply: null },
  { customer: "Pooja Iyer", rating: 5, platform: "Google", product: PRODUCTS[3].name, date: "2026-10-20", text: "My go-to mist for the office. Smells subtle and keeps makeup fresh.", reply: "Thank you Pooja!" },
  { customer: "Manish Tiwari", rating: 1, platform: "Amazon", product: PRODUCTS[0].name, date: "2026-10-19", text: "Gel set missing the top coat bottle. Very disappointed with quality control.", reply: "Manish, this is not the standard we aim for. A complete replacement set is on the way." },
  { customer: "Tanvi Desai", rating: 5, platform: "Myntra", product: PRODUCTS[0].name, date: "2026-10-18", text: "Four colours in one kit and all of them stunning. Gifted one to my sister too.", reply: null },
  { customer: "Faisal Ahmed", rating: 4, platform: "Nykaa", product: PRODUCTS[2].name, date: "2026-10-17", text: "Lovely peach shade, true to the photos. Slightly pricey but worth it.", reply: "Thank you Faisal!" },
  { customer: "Isha Bansal", rating: 3, platform: "Google", product: PRODUCTS[1].name, date: "2026-10-16", text: "Serum works but the smell of vitamin C is stronger than I expected.", reply: "Hi Isha, a mild citrus note is normal with stable L-Ascorbic Acid. Happy to help with usage tips." },
  { customer: "Gaurav Mehta", rating: 5, platform: "Amazon", product: PRODUCTS[4].name, date: "2026-10-15", text: "Subscribed after the first tub. Skin feels noticeably more hydrated.", reply: "Thanks Gaurav, welcome to the subscription!" },
  { customer: "Lakshmi Pillai", rating: 2, platform: "Flipkart", product: PRODUCTS[2].name, date: "2026-10-14", text: "Lipstick melted in transit during summer dispatch. Colour is ok otherwise.", reply: "Lakshmi, we are sorry. We now ship lipsticks with insulated wraps in warm months." },
  { customer: "Harsh Vardhan", rating: 5, platform: "Google", product: PRODUCTS[3].name, date: "2026-10-13", text: "Instant freshness. Bought three for the family.", reply: null },
  { customer: "Simran Kaur", rating: 4, platform: "Myntra", product: PRODUCTS[1].name, date: "2026-10-12", text: "Good serum, fast shipping, nice packaging. Would like a bigger size option.", reply: "Thanks Simran, a 50ml size is on our roadmap!" },
];

export const CC_REVIEWS: CcReview[] = REVIEW_SEED.map((r, i) => {
  const intercepted = r.rating <= 3;
  const linked = intercepted
    ? CC_CASES.find((c) => c.customer.split(" ")[0] === r.customer.split(" ")[0])?.id ?? `case-${(i % CC_CASES.length) + 1}`
    : null;
  return {
    ...r,
    id: `rev-${i + 1}`,
    sentiment: r.rating >= 4 ? "positive" : r.rating === 3 ? "neutral" : "negative",
    intercepted,
    linkedCaseId: linked,
    verifiedPurchase: i % 5 !== 3,
  };
});

/* ------------------------------------------------------- order lifecycle */

export function buildOrderTimeline(order: CcOrder): CcOrderEvent[] {
  const { id, carrier, trackId, product, amount, currentStage } = order;
  const stages: Omit<CcOrderEvent, "done">[] = [
    {
      stage: "Order Placed", time: "10:02 AM", trigger: "Immediate - via Shopify webhook",
      waMsg: `*Order Confirmed!* Hi! Your Shills order *${id}* has been placed successfully.\n\nItems: ${product} x 1\nAmount: Rs.${amount}\nDelivery to: ${order.city}\n\nWe'll notify you when it ships. Track anytime: shills.in/track/${trackId}`,
    },
    {
      stage: "Payment Verified", time: "10:03 AM", trigger: "Immediate - via Razorpay webhook",
      waMsg: `*Payment Received!* Your payment of Rs.${amount} for order *${id}* is confirmed via ${order.payment}.\n\nReceipt: shills.in/receipt/${trackId}\n\nYour order is now being packed!`,
    },
    {
      stage: "Packed & Ready", time: "11:30 AM", trigger: "Warehouse scan - WMS event",
      waMsg: `*Order Packed!* Your Shills order *${id}* has been packed and is ready for pickup.\n\nEstimated dispatch: within 2 hours.\n\nNeed to change address? Reply *CHANGE* within the next 30 minutes.`,
    },
    {
      stage: "Out for Delivery", time: "02:15 PM", trigger: "Carrier API pull - every 2 hrs",
      waMsg: `*Out for Delivery!* Your Shills package is on its way!\n\nTracking ID: *${trackId}*\nCarrier: ${carrier}\nLive track: shills.in/track/${trackId}\n\nExpected arrival: today by 6:00 PM\n\nOur rider will call you before delivery. Please be available!`,
    },
    {
      stage: "Delivery Attempted", time: "05:48 PM", trigger: "Carrier exception webhook",
      waMsg: `*Delivery Attempted!* We tried delivering order *${id}* but couldn't reach you.\n\nCarrier: ${carrier} | ID: ${trackId}\n\nWe'll retry tomorrow between 10 AM-6 PM.\n\nTo reschedule or update address, reply *RESCHEDULE*.`,
    },
    {
      stage: "Delivered", time: "06:20 PM", trigger: "Carrier delivery confirmation",
      waMsg: `*Delivered Successfully!* Your Shills order *${id}* has been delivered.\n\nProof of delivery available at: shills.in/track/${trackId}\n\nEnjoy your product! We'll check in on Day 3 for your feedback.`,
    },
    {
      stage: "Day 3 Review Ask", time: "72 hrs later", trigger: "Scheduled - 72 hrs post delivery",
      waMsg: `*How's your Shills product?* Hi! It's been 3 days since you received your order.\n\nWe'd love to hear your feedback:\nshills.in/review/${trackId}\n\nRate us in 10 seconds! Your review helps other customers.\n\n_Reply ISSUE if you need support._`,
    },
  ];
  return stages.map((s, i) => ({
    ...s,
    done: i <= currentStage,
    time: i <= currentStage ? s.time : "-",
  }));
}

const CITIES = ["Sector 15, Noida", "Bandra West, Mumbai", "Indiranagar, Bangalore", "Salt Lake, Kolkata", "Greater Kailash, Delhi", "Banjara Hills, Hyderabad", "Koregaon Park, Pune", "Adyar, Chennai"];
const PAYMENTS: CcOrder["payment"][] = ["UPI", "Card", "COD", "Netbanking"];

export const CC_ORDERS: CcOrder[] = Array.from({ length: 12 }, (_, i) => {
  const carrier = CARRIERS[i % CARRIERS.length];
  const orderNo = 9840 - i * 2;
  const prod = PRODUCTS[i % PRODUCTS.length];
  return {
    id: `SH-${orderNo}`,
    customer: CUSTOMERS[(i * 2) % CUSTOMERS.length],
    product: prod.name,
    amount: prod.price * (1 + (i % 3 === 2 ? 1 : 0)),
    city: CITIES[i % CITIES.length],
    carrier,
    trackId: `${CARRIER_CODE[carrier]}-${orderNo}-X`,
    currentStage: [3, 4, 6, 5, 1, 2, 3, 6, 5, 0, 4, 3][i],
    placedAt: isoAgo(60 * (4 + i * 7)),
    payment: PAYMENTS[i % PAYMENTS.length],
  };
});

export const CC_AUTOMATION_RULES = [
  { stage: "Order Placed", rule: "Immediate - via Shopify webhook", sentToday: 142, deliveryRate: 99.4 },
  { stage: "Payment Verified", rule: "Immediate - via Razorpay webhook", sentToday: 138, deliveryRate: 99.1 },
  { stage: "Packed & Ready", rule: "Warehouse scan - WMS event", sentToday: 131, deliveryRate: 98.8 },
  { stage: "Out for Delivery", rule: "Carrier API pull - every 2 hrs", sentToday: 96, deliveryRate: 98.5 },
  { stage: "Delivery Attempted", rule: "Carrier exception webhook", sentToday: 11, deliveryRate: 97.9 },
  { stage: "Delivered", rule: "Carrier delivery confirmation", sentToday: 88, deliveryRate: 98.9 },
  { stage: "Day 3 Review Ask", rule: "Scheduled - 72 hrs post delivery", sentToday: 74, deliveryRate: 97.2 },
];

/* ------------------------------------------------------- carrier tracking */

function shipmentHistory(carrier: string, status: CcShipment["status"], loc: string, i: number): CcShipment["history"] {
  const base: CcShipment["history"] = [
    { at: isoAgo(60 * 30 + i * 11), event: "Shipment picked up", location: "Shills Warehouse, Gurugram" },
    { at: isoAgo(60 * 22 + i * 11), event: `Arrived at ${carrier} origin hub`, location: "Gurugram Hub" },
    { at: isoAgo(60 * 12 + i * 11), event: "Departed origin hub", location: "Gurugram Hub" },
  ];
  if (status === "Exception") base.push({ at: isoAgo(60 * 3 + i), event: "Delay: sorting backlog, rescheduled", location: loc });
  else {
    base.push({ at: isoAgo(60 * 5 + i), event: "Arrived at destination hub", location: loc });
    if (status === "Out for Delivery" || status === "Delivered") base.push({ at: isoAgo(60 * 2 + i), event: "Out for delivery", location: loc });
    if (status === "Delivered") base.push({ at: isoAgo(30 + i), event: "Delivered - signed by customer", location: "Customer address" });
  }
  return base;
}

const SHIP_SEED: Pick<CcShipment, "status" | "location" | "updated" | "eta">[] = [
  { status: "In Transit", location: "Noida Hub", updated: "2 min ago", eta: "Today 5:30 PM" },
  { status: "Out for Delivery", location: "Sector 15, Noida", updated: "12 min ago", eta: "Today 4:00 PM" },
  { status: "Delivered", location: "Customer Address", updated: "1h ago", eta: "Completed" },
  { status: "Exception", location: "Delhi Sorting Hub", updated: "45 min ago", eta: "Delayed - Rescheduled Tomorrow" },
  { status: "In Transit", location: "Mumbai Hub", updated: "25 min ago", eta: "Tomorrow 2:00 PM" },
  { status: "Out for Delivery", location: "Indiranagar, Bangalore", updated: "8 min ago", eta: "Today 6:30 PM" },
  { status: "Delivered", location: "Customer Address", updated: "3h ago", eta: "Completed" },
  { status: "In Transit", location: "Hyderabad Hub", updated: "1h ago", eta: "Tomorrow 11:00 AM" },
  { status: "Exception", location: "Kolkata Sorting Hub", updated: "2h ago", eta: "Delayed - Address verification" },
  { status: "Out for Delivery", location: "Koregaon Park, Pune", updated: "20 min ago", eta: "Today 5:00 PM" },
];

export const CC_SHIPMENTS: CcShipment[] = SHIP_SEED.map((s, i) => {
  const carrier = CARRIERS[i % CARRIERS.length];
  const order = CC_ORDERS[i % CC_ORDERS.length];
  return {
    id: `ship-${i + 1}`,
    carrier,
    trackId: i === 0 ? "DEL-9840-X" : i === 1 ? "SR-7712-B" : i === 2 ? "SFX-3301-C" : i === 3 ? "XB-5509-D" : `${CARRIER_CODE[carrier]}-${7000 + i * 131}-${String.fromCharCode(65 + i)}`,
    orderId: order.id,
    customer: order.customer,
    ...s,
    history: shipmentHistory(carrier, s.status, s.location, i),
  };
});

export const CC_CARRIER_PERFORMANCE = [
  { carrier: "Delhivery", onTime: 94.2, avgDays: 2.4, rto: 3.1, shipments: 412 },
  { carrier: "Shiprocket", onTime: 91.8, avgDays: 2.7, rto: 3.8, shipments: 338 },
  { carrier: "Shadowfax", onTime: 88.5, avgDays: 2.9, rto: 4.6, shipments: 201 },
  { carrier: "Xpressbees", onTime: 83.1, avgDays: 3.4, rto: 6.2, shipments: 176 },
  { carrier: "Blue Dart", onTime: 96.4, avgDays: 2.1, rto: 2.2, shipments: 129 },
];

export const CC_EXCEPTION_RULES = [
  { trigger: "Delivery Attempted (2x failed)", action: "Auto-call customer + raise ticket" },
  { trigger: "Package Delayed > 2 days", action: "WhatsApp apology + Rs.50 coupon" },
  { trigger: "RTO Initiated", action: "AI contacts customer to retry delivery" },
  { trigger: "Damaged in Transit", action: "Immediate replacement order triggered" },
  { trigger: "Lost Shipment", action: "Full refund + replacement within 24hrs" },
];

/* -------------------------------------------------------------------- SLA */

export const CC_SLA_RULES: CcSlaRule[] = [
  { id: "sla-1", rule: "First Response SLA", target: "< 5 min", actual: "2.8 min", met: true, description: "Time from first customer message to first AI or human reply, across all channels.", trend: [97, 98, 96, 99, 98, 99, 98] },
  { id: "sla-2", rule: "Refund Processing", target: "< 48 hrs", actual: "31 hrs avg", met: true, description: "Time from refund approval to money-back initiation with the payment gateway.", trend: [92, 94, 93, 95, 96, 94, 95] },
  { id: "sla-3", rule: "Exchange Dispatch", target: "< 24 hrs", actual: "19 hrs avg", met: true, description: "Time from return pickup scan to replacement unit dispatch.", trend: [90, 91, 93, 92, 94, 93, 95] },
  { id: "sla-4", rule: "Escalation Resolution", target: "< 2 hrs", actual: "1h 44m", met: true, description: "Time for a human manager to resolve an AI-escalated case.", trend: [88, 90, 89, 91, 92, 90, 93] },
  { id: "sla-5", rule: "CSAT Survey Send (Day 3)", target: "Day 3 post delivery", actual: "100% automated", met: true, description: "Share of delivered orders that received the day-3 WhatsApp review ask on schedule.", trend: [100, 100, 100, 100, 100, 100, 100] },
  { id: "sla-6", rule: "Negative Review Intercept", target: "1-3 star to ticket < 1 min", actual: "0.4 min avg", met: true, description: "Time from a 1-3 star survey rating to a private support ticket being created.", trend: [99, 100, 99, 100, 100, 99, 100] },
];

export const CC_AUTOMATION_COVERAGE = [
  { label: "Order notifications", pct: 100 },
  { label: "Delivery status pulls", pct: 100 },
  { label: "Review solicitation (Day 3)", pct: 100 },
  { label: "1-3 star intercept to ticket", pct: 100 },
  { label: "First AI response", pct: 100 },
  { label: "Refund initiation (standard)", pct: 82 },
  { label: "Exchange dispatch", pct: 79 },
  { label: "Complex escalations", pct: 0 },
];

export const CC_QUICK_ACTIONS = [
  "Send bulk WA - all pending orders",
  "Pull all carrier updates now",
  "Escalate all unresolved > 4hrs",
  "Export case log to CSV",
];

/* --------------------------------------------------------- knowledge base */

export const CC_KB_ARTICLES: CcKbArticle[] = [
  {
    id: "kb-1", title: "Return and exchange policy", category: "Returns & Refunds", status: "published", author: "Anika Rao",
    updatedAt: isoAgo(60 * 24 * 6), views: 1840, aiCitations: 412, helpfulPct: 91,
    summary: "7-day return window, unopened-seal rule, exchange vs refund paths.",
    body: ["Customers can request a return or exchange within 7 days of delivery.", "Opened cosmetics are eligible only for damage, leakage or wrong-item claims with a photo.", "Exchanges ship within 24 hours of the return pickup scan. Refunds go to the original payment method in 2-4 business days.", "COD orders are refunded to a UPI ID shared by the customer."],
    linkedTopics: ["Wrong shade received", "Refund status", "Damaged in transit"],
  },
  {
    id: "kb-2", title: "Missing or lost parcel claims", category: "Shipping & Delivery", status: "published", author: "Dev Malhotra",
    updatedAt: isoAgo(60 * 24 * 12), views: 960, aiCitations: 288, helpfulPct: 84,
    summary: "How to handle 'delivered but not received' and lost shipments.",
    body: ["Verify the carrier's proof of delivery and rider call logs.", "If delivery cannot be proven within 24 hours, raise a claim and dispatch a replacement or refund.", "High-value orders (Rs.1500+) get priority claim handling."],
    linkedTopics: ["Delivered not received", "Shipping delay"],
  },
  {
    id: "kb-3", title: "Order status and tracking", category: "Shipping & Delivery", status: "published", author: "Anika Rao",
    updatedAt: isoAgo(60 * 24 * 3), views: 3120, aiCitations: 905, helpfulPct: 94,
    summary: "Where customers can follow orders and what each stage means.",
    body: ["Every order has a live tracking page at shills.in/track/<tracking-id>.", "WhatsApp updates are sent automatically at 7 lifecycle stages.", "Carrier data refreshes every 2 hours; exceptions are pushed instantly via webhook."],
    linkedTopics: ["Where is my order"],
  },
  {
    id: "kb-4", title: "Damaged or leaking products", category: "Returns & Refunds", status: "published", author: "Sana Qureshi",
    updatedAt: isoAgo(60 * 24 * 9), views: 780, aiCitations: 201, helpfulPct: 88,
    summary: "Evidence needed and the replacement flow for transit damage.",
    body: ["Ask for a photo of the outer parcel and the damaged item.", "Approve replacement without return for items under Rs.800.", "Log carrier damage for the monthly carrier scorecard."],
    linkedTopics: ["Damaged in transit"],
  },
  {
    id: "kb-5", title: "Nail Gel Set #12 - application guide", category: "Product Guides", status: "published", author: "Rhea D'Souza",
    updatedAt: isoAgo(60 * 24 * 20), views: 2210, aiCitations: 530, helpfulPct: 93,
    summary: "Prep, cure times and removal for the gel kit.",
    body: ["Prep nails: push cuticles, buff lightly and wipe with isopropyl alcohol.", "Cure base coat 30s, colour coats 60s each, top coat 60s under a 36W lamp.", "Remove by soaking cotton pads in acetone for 10 minutes."],
    linkedTopics: ["Product usage question"],
  },
  {
    id: "kb-6", title: "Vitamin C serum - ingredients and sensitive skin", category: "Product Guides", status: "published", author: "Rhea D'Souza",
    updatedAt: isoAgo(60 * 24 * 15), views: 1490, aiCitations: 340, helpfulPct: 90,
    summary: "Full ingredient list, patch test advice and usage frequency.",
    body: ["15% L-Ascorbic Acid, hyaluronic acid, ferulic acid. Fragrance-free and alcohol-free.", "Patch test 24 hours before first use. Start with every other night.", "Store away from sunlight; discard if the serum turns dark orange."],
    linkedTopics: ["Ingredient / allergy"],
  },
  {
    id: "kb-7", title: "Coupons and discount rules", category: "Orders & Payments", status: "needs_review", author: "Dev Malhotra",
    updatedAt: isoAgo(60 * 24 * 41), views: 1120, aiCitations: 260, helpfulPct: 72,
    summary: "Minimum cart rules, stacking and one-time code generation.",
    body: ["GLOW15 requires a minimum cart value of Rs.799.", "Codes cannot be stacked with automatic sale pricing.", "Support can issue single-use codes valid for 24 hours."],
    linkedTopics: ["Coupon not applied"],
  },
  {
    id: "kb-8", title: "Cancellation and address change", category: "Orders & Payments", status: "published", author: "Anika Rao",
    updatedAt: isoAgo(60 * 24 * 5), views: 1630, aiCitations: 470, helpfulPct: 92,
    summary: "What can be changed before dispatch and how.",
    body: ["Orders can be cancelled or edited until they are handed to the carrier.", "After dispatch, request an RTO or refuse delivery.", "Address changes by WhatsApp reply CHANGE within 30 minutes of the packed message."],
    linkedTopics: ["Order cancellation", "Address change"],
  },
  {
    id: "kb-9", title: "Duplicate payment and failed payment handling", category: "Orders & Payments", status: "published", author: "Sana Qureshi",
    updatedAt: isoAgo(60 * 24 * 18), views: 540, aiCitations: 130, helpfulPct: 81,
    summary: "How to verify double debits and trigger a reversal.",
    body: ["Check the Razorpay dashboard for duplicate captured payments.", "Pending authorisations auto-reverse in 24-48 hours.", "Captured duplicates require a manual refund via finance."],
    linkedTopics: ["Payment failed / double charge"],
  },
  {
    id: "kb-10", title: "Wholesale and salon programme", category: "Sales Handoff", status: "published", author: "Dev Malhotra",
    updatedAt: isoAgo(60 * 24 * 27), views: 410, aiCitations: 96, helpfulPct: 86,
    summary: "Tier pricing and how to route B2B leads to sales.",
    body: ["25+ units unlock tier 1 pricing; 100+ units unlock tier 2 plus free shipping.", "Share the wholesale catalogue and create a sales task in the CRM.", "Salon account manager must call within 1 hour."],
    linkedTopics: ["Bulk / salon enquiry"],
  },
  {
    id: "kb-11", title: "Review interception playbook", category: "Reviews & CSAT", status: "published", author: "Anika Rao",
    updatedAt: isoAgo(60 * 24 * 4), views: 690, aiCitations: 175, helpfulPct: 89,
    summary: "How 1-3 star ratings become private tickets and when to ask for a public review.",
    body: ["Day 3 post-delivery WhatsApp survey asks for a 1-5 rating.", "4-5 stars: link to Google, Amazon or Nykaa review pages.", "1-3 stars: create a high-priority ticket within 1 minute and notify the CS manager."],
    linkedTopics: ["Low CSAT intercept"],
  },
  {
    id: "kb-12", title: "Carrier exception handling", category: "Shipping & Delivery", status: "draft", author: "Dev Malhotra",
    updatedAt: isoAgo(60 * 24 * 2), views: 0, aiCitations: 0, helpfulPct: 0,
    summary: "Draft: playbook for sorting-hub delays, RTO and failed attempts.",
    body: ["Delays over 2 days trigger a WhatsApp apology and Rs.50 coupon.", "Two failed attempts trigger an automated call and a ticket.", "TODO: add carrier escalation contacts per region."],
    linkedTopics: ["Shipping delay"],
  },
  {
    id: "kb-13", title: "Lipstick shade guide", category: "Product Guides", status: "needs_review", author: "Rhea D'Souza",
    updatedAt: isoAgo(60 * 24 * 52), views: 880, aiCitations: 150, helpfulPct: 69,
    summary: "Real-light swatches to reduce shade-mismatch complaints.",
    body: ["Swatches are photographed under neutral daylight on three skin tones.", "Midnight Cherry reads deeper on screen than in person - note this on PDPs.", "Offer a free shade exchange within 7 days."],
    linkedTopics: ["Wrong shade received"],
  },
  {
    id: "kb-14", title: "Refund timelines by payment method", category: "Returns & Refunds", status: "published", author: "Sana Qureshi",
    updatedAt: isoAgo(60 * 24 * 8), views: 1275, aiCitations: 360, helpfulPct: 90,
    summary: "UPI, card, netbanking and COD refund timelines.",
    body: ["UPI: 1-3 business days. Cards: 5-7 business days. Netbanking: 3-5 business days.", "COD: manual UPI payout within 48 hours of return receipt.", "Share the refund ARN with the customer when available."],
    linkedTopics: ["Refund status"],
  },
];

/* ------------------------------------------------------------ analytics */

export const CC_VOLUME_14D = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(REF_MS - (13 - i) * 86_400_000);
  const total = 38 + ((i * 7) % 13) + (i % 7 === 5 ? 9 : 0);
  const ai = Math.round(total * (0.74 + ((i * 3) % 7) / 100));
  return {
    label: `${pad(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]}`,
    total,
    ai,
    human: total - ai,
    csat: Math.round((4.6 + ((i * 5) % 9) / 40) * 100) / 100,
  };
});

export const CC_TOPIC_BREAKDOWN = (() => {
  const m = new Map<string, number>();
  CC_CASES.forEach((c) => m.set(c.topic, (m.get(c.topic) ?? 0) + 1));
  return [...m.entries()].map(([topic, count]) => ({ topic, count })).sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
})();

/* ---------------------------------------------------------- aggregates */

const openCases = CC_CASES.filter((c) => c.status === "Open");
const negCases = CC_CASES.filter((c) => c.sentiment === "negative");

export const CC_STATS = {
  csat: 4.82,
  openCases: openCases.length,
  resolvedCases: CC_CASES.length - openCases.length,
  totalCases: CC_CASES.length,
  negativeCases: negCases.length,
  escalated: CC_CASES.filter((c) => c.escalation !== "None").length,
  avgFirstResponse: 2.8,
  autoResolvedPct: 78,
  totalReviews: CC_REVIEWS.length,
  negativeIntercepted: CC_REVIEWS.filter((r) => r.rating <= 3).length,
  avgRating: Math.round((CC_REVIEWS.reduce((s, r) => s + r.rating, 0) / CC_REVIEWS.length) * 100) / 100,
};

export const CC_CHANNELS: { id: CcChannel; label: string }[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "shopify", label: "Shopify" },
  { id: "instagram", label: "Instagram DM" },
  { id: "website", label: "Website" },
];

export function ccChannelLabel(c: CcChannel): string {
  return CC_CHANNELS.find((x) => x.id === c)?.label ?? c;
}
