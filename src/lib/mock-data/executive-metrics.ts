export interface WeeklyPoint {
  week: string;
  pipelineValue: number;
  newLeads: number;
}

export const PIPELINE_TREND: WeeklyPoint[] = [
  { week: "Wk 1", pipelineValue: 318000, newLeads: 84 },
  { week: "Wk 2", pipelineValue: 335000, newLeads: 91 },
  { week: "Wk 3", pipelineValue: 329000, newLeads: 78 },
  { week: "Wk 4", pipelineValue: 356000, newLeads: 102 },
  { week: "Wk 5", pipelineValue: 372000, newLeads: 97 },
  { week: "Wk 6", pipelineValue: 401000, newLeads: 113 },
  { week: "Wk 7", pipelineValue: 438000, newLeads: 126 },
  { week: "Wk 8", pipelineValue: 486000, newLeads: 142 },
];

export interface AiCostByApp {
  app: string;
  costUsd: number;
}

export const AI_COST_BY_APP: AiCostByApp[] = [
  { app: "Recruit", costUsd: 184.32 },
  { app: "Lead Response", costUsd: 211.08 },
  { app: "Outreach", costUsd: 96.47 },
  { app: "Content OS", costUsd: 42.15 },
  { app: "Customer Care", costUsd: 73.9 },
  { app: "Receivables Recovery", costUsd: 28.64 },
];

export interface AiSpendRow {
  app: string;
  agentType: string;
  calls: number;
  costUsd: number;
}

export const AI_SPEND_ROWS: AiSpendRow[] = [
  { app: "Recruit", agentType: "CV Screening Agent", calls: 1842, costUsd: 121.6 },
  { app: "Recruit", agentType: "Outreach Agent", calls: 406, costUsd: 62.72 },
  { app: "Lead Response", agentType: "Lead Response Agent", calls: 2290, costUsd: 211.08 },
  { app: "Outreach", agentType: "Sequence Personalisation", calls: 318, costUsd: 96.47 },
  { app: "Content OS", agentType: "Content Draft Agent", calls: 94, costUsd: 42.15 },
  { app: "Customer Care", agentType: "Auto-Reply Agent", calls: 612, costUsd: 73.9 },
  { app: "Receivables Recovery", agentType: "Payment Reminder Agent", calls: 158, costUsd: 28.64 },
];

export interface TopAgentRow {
  agentName: string;
  app: string;
  pod: string;
  calls: number;
  costUsd: number;
  avgCostPerCall: number;
}

/**
 * Ranked by total monthly cost, derived from the same per-app spend already
 * shown in AI_SPEND_ROWS plus a few extra agents so the "Top agents by
 * cost" list on the Executive Board has real depth.
 */
export const TOP_AGENTS_BY_COST: TopAgentRow[] = [
  { agentName: "Lead Response Agent", app: "Lead Response", pod: "Sales", calls: 2290, costUsd: 211.08, avgCostPerCall: 0.0922 },
  { agentName: "CV Screening Agent", app: "Recruit", pod: "HR", calls: 1842, costUsd: 121.6, avgCostPerCall: 0.066 },
  { agentName: "Sequence Personalisation", app: "Outreach", pod: "Sales", calls: 318, costUsd: 96.47, avgCostPerCall: 0.3033 },
  { agentName: "Auto-Reply Agent", app: "Customer Care", pod: "Operations", calls: 612, costUsd: 73.9, avgCostPerCall: 0.1207 },
  { agentName: "Outreach Agent", app: "Recruit", pod: "HR", calls: 406, costUsd: 62.72, avgCostPerCall: 0.1544 },
  { agentName: "Content Draft Agent", app: "Content OS", pod: "Marketing", calls: 94, costUsd: 42.15, avgCostPerCall: 0.4484 },
  { agentName: "Payment Reminder Agent", app: "Receivables Recovery", pod: "Operations", calls: 158, costUsd: 28.64, avgCostPerCall: 0.1813 },
  { agentName: "Deal Stage Classifier", app: "CRM", pod: "Sales", calls: 1120, costUsd: 24.31, avgCostPerCall: 0.0217 },
  { agentName: "Sentiment Monitor", app: "Customer Care", pod: "Operations", calls: 940, costUsd: 18.95, avgCostPerCall: 0.0202 },
  { agentName: "Interview Scheduler", app: "Recruit", pod: "HR", calls: 212, costUsd: 11.4, avgCostPerCall: 0.0538 },
].sort((a, b) => b.costUsd - a.costUsd);

export const EXEC_SUMMARY = {
  pipelineValueUsd: 486000,
  pipelineChangePct: 9.2,
  hiresInProgress: 18,
  hiresChange: 4,
  medianResponseTimeSec: 42,
  responseTimeChangeSec: -8,
  receivablesOverdueUsd: 58400,
  receivablesChangePct: -6.1,
  aiCostThisMonthUsd: 636.56,
  aiCostChangePct: 14.8,
};
