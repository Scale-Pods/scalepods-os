/**
 * Shared analytics + time-series mock data for the Home pod (Master
 * Dashboard + Executive Board). Everything here is org-aware: pass the
 * org's plan/seed in and you get numbers that scale with it, so switching
 * org via useOrg() produces different (but consistent) charts instead of
 * one org's numbers baked in everywhere.
 *
 * All generators are pure functions of their inputs — no Date.now()/Math.random()
 * without a seed — so server/client render the same thing and nothing drifts
 * between renders.
 */

import type { PodId } from "@/lib/types/manifest";

/** Small deterministic PRNG (mulberry32) so charts are stable per org/seed. */
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

function seedFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return h;
}

const PLAN_SCALE: Record<string, number> = {
  free: 0.45,
  basic: 0.7,
  growth: 1,
  enterprise: 1.6,
};

export function planScale(plan: string): number {
  return PLAN_SCALE[plan] ?? 1;
}

// ---------------------------------------------------------------------------
// Business pulse — 12 week combined trend: leads, deals, candidates
// ---------------------------------------------------------------------------

export interface PulseWeekPoint {
  week: string;
  leads: number;
  deals: number;
  candidates: number;
}

export function buildPulseTrend(orgId: string, plan: string): PulseWeekPoint[] {
  const rand = mulberry32(seedFromString(`${orgId}-pulse`));
  const scale = planScale(plan);
  const points: PulseWeekPoint[] = [];
  let leadsBase = 70 * scale;
  let dealsBase = 18 * scale;
  let candidatesBase = 40 * scale;
  for (let i = 0; i < 12; i++) {
    leadsBase += (rand() - 0.3) * 10 * scale;
    dealsBase += (rand() - 0.35) * 3 * scale;
    candidatesBase += (rand() - 0.3) * 6 * scale;
    points.push({
      week: `Wk ${i + 1}`,
      leads: Math.max(8, Math.round(leadsBase)),
      deals: Math.max(2, Math.round(dealsBase)),
      candidates: Math.max(5, Math.round(candidatesBase)),
    });
  }
  return points;
}

// ---------------------------------------------------------------------------
// AI actions by pod — donut
// ---------------------------------------------------------------------------

export interface PodSlice {
  pod: PodId;
  label: string;
  value: number;
}

const POD_LABELS: Record<PodId, string> = {
  home: "Home",
  hr: "HR",
  sales: "Sales",
  marketing: "Marketing",
  operations: "Operations",
  custom: "Custom",
};

export function buildAiActionsByPod(orgId: string, installedApps: string[], plan: string): PodSlice[] {
  const rand = mulberry32(seedFromString(`${orgId}-ai-by-pod`));
  const scale = planScale(plan);
  const podsPresent = new Set<PodId>(["home"]);
  for (const appId of installedApps) {
    if (appId.startsWith("hr-")) podsPresent.add("hr");
    if (appId.startsWith("sales-")) podsPresent.add("sales");
    if (appId.startsWith("marketing-")) podsPresent.add("marketing");
    if (appId.startsWith("ops-")) podsPresent.add("operations");
    if (appId.startsWith("custom-")) podsPresent.add("custom");
  }
  const order: PodId[] = ["sales", "hr", "marketing", "operations", "custom", "home"];
  return order
    .filter((p) => podsPresent.has(p))
    .map((pod) => ({
      pod,
      label: POD_LABELS[pod],
      value: Math.max(6, Math.round((pod === "home" ? 20 : 40 + rand() * 180) * scale)),
    }));
}

// ---------------------------------------------------------------------------
// Messages sent by channel, per week — stacked bar
// ---------------------------------------------------------------------------

export interface ChannelWeekPoint {
  week: string;
  email: number;
  whatsapp: number;
  web_chat: number;
  sms: number;
}

export function buildMessagesByChannel(orgId: string, plan: string): ChannelWeekPoint[] {
  const rand = mulberry32(seedFromString(`${orgId}-channels`));
  const scale = planScale(plan);
  const points: ChannelWeekPoint[] = [];
  for (let i = 0; i < 12; i++) {
    points.push({
      week: `Wk ${i + 1}`,
      email: Math.round((30 + rand() * 40) * scale),
      whatsapp: Math.round((50 + rand() * 70) * scale),
      web_chat: Math.round((15 + rand() * 25) * scale),
      sms: Math.round((5 + rand() * 15) * scale),
    });
  }
  return points;
}

// ---------------------------------------------------------------------------
// Plan usage — AI actions + outbound messages vs cap
// ---------------------------------------------------------------------------

export interface PlanUsage {
  aiActionsUsed: number;
  aiActionsCap: number;
  messagesUsed: number;
  messagesCap: number;
  seatsUsed: number;
  seatsCap: number;
}

const PLAN_CAPS: Record<string, { ai: number; messages: number; seats: number }> = {
  free: { ai: 500, messages: 300, seats: 2 },
  basic: { ai: 2500, messages: 1500, seats: 5 },
  growth: { ai: 8000, messages: 6000, seats: 15 },
  enterprise: { ai: 30000, messages: 20000, seats: 50 },
};

export function buildPlanUsage(orgId: string, plan: string): PlanUsage {
  const rand = mulberry32(seedFromString(`${orgId}-usage`));
  const caps = PLAN_CAPS[plan] ?? PLAN_CAPS.growth;
  return {
    aiActionsUsed: Math.round(caps.ai * (0.45 + rand() * 0.4)),
    aiActionsCap: caps.ai,
    messagesUsed: Math.round(caps.messages * (0.3 + rand() * 0.45)),
    messagesCap: caps.messages,
    seatsUsed: Math.max(1, Math.round(caps.seats * (0.4 + rand() * 0.5))),
    seatsCap: caps.seats,
  };
}

// ---------------------------------------------------------------------------
// Funnel — leads -> qualified -> meetings -> won
// ---------------------------------------------------------------------------

export interface FunnelStage {
  stage: string;
  value: number;
}

export function buildFunnel(orgId: string, plan: string): FunnelStage[] {
  const rand = mulberry32(seedFromString(`${orgId}-funnel`));
  const scale = planScale(plan);
  const leads = Math.round((420 + rand() * 120) * scale);
  const qualified = Math.round(leads * (0.55 + rand() * 0.1));
  const meetings = Math.round(qualified * (0.4 + rand() * 0.1));
  const won = Math.round(meetings * (0.3 + rand() * 0.15));
  return [
    { stage: "Leads", value: leads },
    { stage: "Qualified", value: qualified },
    { stage: "Meetings booked", value: meetings },
    { stage: "Won", value: won },
  ];
}

// ---------------------------------------------------------------------------
// Pipeline value: this period vs last period, weekly
// ---------------------------------------------------------------------------

export interface PipelineComparisonPoint {
  week: string;
  thisPeriod: number;
  lastPeriod: number;
}

export function buildPipelineComparison(orgId: string, plan: string): PipelineComparisonPoint[] {
  const rand = mulberry32(seedFromString(`${orgId}-pipeline-compare`));
  const scale = planScale(plan);
  const points: PipelineComparisonPoint[] = [];
  let thisBase = 300000 * scale;
  let lastBase = 260000 * scale;
  for (let i = 0; i < 12; i++) {
    thisBase += (rand() - 0.2) * 18000 * scale;
    lastBase += (rand() - 0.3) * 14000 * scale;
    points.push({
      week: `Wk ${i + 1}`,
      thisPeriod: Math.max(50000, Math.round(thisBase)),
      lastPeriod: Math.max(40000, Math.round(lastBase)),
    });
  }
  return points;
}

// ---------------------------------------------------------------------------
// AI budget utilization — radial gauge
// ---------------------------------------------------------------------------

export interface AiBudget {
  usedUsd: number;
  capUsd: number;
  pct: number;
}

export function buildAiBudget(orgId: string, plan: string): AiBudget {
  const rand = mulberry32(seedFromString(`${orgId}-ai-budget`));
  const caps: Record<string, number> = { free: 50, basic: 250, growth: 900, enterprise: 3000 };
  const capUsd = caps[plan] ?? 900;
  const usedUsd = Math.round(capUsd * (0.35 + rand() * 0.45));
  return { usedUsd, capUsd, pct: Math.round((usedUsd / capUsd) * 100) };
}

// ---------------------------------------------------------------------------
// Pod performance comparison table
// ---------------------------------------------------------------------------

export interface PodPerformanceRow {
  pod: PodId;
  label: string;
  aiActionsThisMonth: number;
  costUsd: number;
  approvalsPending: number;
  trend: "up" | "down" | "flat";
  trendValue: string;
}

export function buildPodPerformance(
  orgId: string,
  installedApps: string[],
  plan: string
): PodPerformanceRow[] {
  const rand = mulberry32(seedFromString(`${orgId}-pod-perf`));
  const scale = planScale(plan);
  const podsPresent = new Set<PodId>(["home"]);
  for (const appId of installedApps) {
    if (appId.startsWith("hr-")) podsPresent.add("hr");
    if (appId.startsWith("sales-")) podsPresent.add("sales");
    if (appId.startsWith("marketing-")) podsPresent.add("marketing");
    if (appId.startsWith("ops-")) podsPresent.add("operations");
    if (appId.startsWith("custom-")) podsPresent.add("custom");
  }
  const order: PodId[] = ["home", "sales", "hr", "marketing", "operations", "custom"];
  return order
    .filter((p) => podsPresent.has(p))
    .map((pod) => {
      const actions = Math.max(12, Math.round((pod === "home" ? 60 : 180 + rand() * 900) * scale));
      const cost = Number((actions * (0.02 + rand() * 0.06)).toFixed(2));
      const approvals = Math.round(rand() * (pod === "home" ? 2 : 9));
      const trendRoll = rand();
      const trend: "up" | "down" | "flat" = trendRoll > 0.6 ? "up" : trendRoll > 0.25 ? "flat" : "down";
      const trendValue = `${trend === "up" ? "+" : trend === "down" ? "-" : ""}${Math.round(rand() * 18)}%`;
      return {
        pod,
        label: POD_LABELS[pod],
        aiActionsThisMonth: actions,
        costUsd: cost,
        approvalsPending: approvals,
        trend,
        trendValue,
      };
    });
}
