import {
  MOCK_JOBS,
  candidatesInPipelineCount,
  averageFitScore,
  interviewsThisWeekCount,
} from "@/lib/mock-data/hr";

/**
 * Plain, internally-consistent KPI values for the Recruit app's
 * dashboardWidgets ("hr.open-roles", "hr.candidates-in-pipeline",
 * "hr.avg-fit-score", "hr.time-to-shortlist", "hr.interviews-this-week").
 * The Master Dashboard reads this object directly — numbers are derived
 * from the same mock data the Recruit screens render, so they always match.
 */

export interface HrMetric {
  value: string;
  context: string;
  trend: "up" | "down" | "flat";
  trendValue: string;
}

const openRoles = MOCK_JOBS.filter((j) => j.status === "open").length;
const pipelineCount = candidatesInPipelineCount();
const avgFit = averageFitScore();
const interviewsThisWeek = interviewsThisWeekCount();

export const HR_DASHBOARD_METRICS: Record<string, HrMetric> = {
  "hr.open-roles": {
    value: String(openRoles),
    context: `${MOCK_JOBS.filter((j) => j.status === "draft").length} drafts awaiting AI extraction`,
    trend: "up",
    trendValue: "+2 this month",
  },
  "hr.candidates-in-pipeline": {
    value: String(pipelineCount),
    context: `Across ${openRoles} open roles`,
    trend: "up",
    trendValue: "+14 this week",
  },
  "hr.avg-fit-score": {
    value: `${avgFit}`,
    context: "AI fit score, 0-100 scale",
    trend: "up",
    trendValue: "+3 pts",
  },
  "hr.time-to-shortlist": {
    value: "2.4 days",
    context: "Median: applied → shortlisted",
    trend: "down",
    trendValue: "-0.6 days",
  },
  "hr.interviews-this-week": {
    value: String(interviewsThisWeek),
    context: "Scheduled across all open roles",
    trend: "flat",
    trendValue: "same as last week",
  },
};
