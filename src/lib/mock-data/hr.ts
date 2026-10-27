/**
 * ScalePods HR / Recruit mock data.
 *
 * Mirrors the data model of the ScalePods-HR-Tool reference app (hiring
 * "campaigns" -> candidates flowing through resume screening and up to three
 * interview rounds -> hired / rejected / reserve; interviews with calendar
 * links, event ids and reschedules; admin users).
 *
 * Everything here is a pure, deterministic function of an index and the fixed
 * reference date HR_TODAY (no Math.random / Date.now) so server and client
 * render identically. Data is NOT scoped to an organisation: every org sees the
 * same full module.
 */

/* ------------------------------------------------------------------ */
/* Date helpers (string based, timezone free)                           */
/* ------------------------------------------------------------------ */

export const HR_TODAY = "2026-10-27"; // Tuesday

function toUtc(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function fromUtc(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function addDays(iso: string, n: number) {
  const d = toUtc(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return fromUtc(d);
}

/** 0 = Sunday ... 6 = Saturday */
export function dayOfWeek(iso: string) {
  return toUtc(iso).getUTCDay();
}

export function startOfWeek(iso: string) {
  const dow = dayOfWeek(iso);
  return addDays(iso, -((dow + 6) % 7)); // Monday
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function fmtDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function fmtDateShort(iso: string) {
  if (!iso) return "—";
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

export function fmtDateLong(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${DAYS_LONG[dayOfWeek(iso)]}, ${d} ${MONTHS_LONG[m - 1]} ${y}`;
}

export function monthLabel(year: number, month0: number) {
  return `${MONTHS_LONG[month0]} ${year}`;
}

export function isoFor(year: number, month0: number, day: number) {
  return fromUtc(new Date(Date.UTC(year, month0, day)));
}

/** "10:30 AM" -> minutes since midnight */
export function timeToMinutes(t: string) {
  const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10);
  const mn = parseInt(m[2], 10);
  const ap = (m[3] || "").toUpperCase();
  if (ap === "PM" && h < 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + mn;
}

export function minutesToTime(total: number) {
  const h24 = Math.floor(total / 60);
  const mn = total % 60;
  const ap = h24 >= 12 ? "PM" : "AM";
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${String(mn).padStart(2, "0")} ${ap}`;
}

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

export type CampaignStatus = "open" | "closed" | "draft";
/** Backwards compatible alias: a hiring campaign is what the dashboard calls a job/role. */
export type JobStatus = CampaignStatus;

export interface ScoreWeights {
  skills: number;
  experience: number;
  education: number;
  jd: number;
}

export interface Campaign {
  id: string;
  title: string; // campaign name, e.g. "AI Automation Engineer"
  department: string;
  description: string;
  jdText: string;
  startDate: string;
  endDate: string;
  location: string;
  salaryMinLpa: number;
  salaryMaxLpa: number;
  expectedJoining: string;
  rounds: string[]; // round names (1-3)
  weights: ScoreWeights;
  isActive: boolean;
  quickHire: boolean;
  status: CampaignStatus;
  createdAt: string;
  owner: string;
  skills: string[];
}
export type Job = Campaign;

export type Decision = "" | "Selected" | "Rejected" | "Reserve" | "Hired";
export type FitLevel = "High" | "Medium" | "Low";

export interface Reschedule {
  id: string;
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
  reason: string;
  requestedBy: string;
  at: string; // ISO date
}

export interface RoundData {
  round: 1 | 2 | 3;
  name: string;
  assigned: string;
  decision: Decision;
  meetingDate: string;
  meetingTime: string;
  meetingLink: string;
  calendarLink: string;
  eventId: string;
  meetingMail: string;
  waFollowup: string;
  mailFollowup: string;
  questionnaire: string;
  comments: string;
  reschedules: Reschedule[];
}

export interface Candidate {
  id: string; // "Candidate ID"
  campaignId: string;
  campaignName: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  recruiter: string;
  score: number;
  scoreBreakdown: { skills: number; experience: number; education: number; jdAlignment: number };
  fit: FitLevel;
  tags: string[];
  source: string;
  appliedAt: string;
  experienceYears: number;
  currentCompany: string;
  education: string;
  skills: string[];
  expectedCtcLpa: number;
  noticePeriod: string;
  resumeLink: string;
  summary: string;
  fitAnalysis: string;
  strengths: string;
  gaps: string;
  riskFlags: string;
  careerProgression: string;
  stabilityAnalysis: string;
  industryRelevance: string;
  resumeDecision: Decision;
  resumeDecisionDate: string;
  rounds: RoundData[];
}

export type StageKey =
  | "screening"
  | "round1"
  | "round2"
  | "round3"
  | "hired"
  | "reserve"
  | "rejected";

export const STAGE_LABELS: Record<StageKey, string> = {
  screening: "Resume Screening",
  round1: "Round 1",
  round2: "Round 2",
  round3: "Round 3",
  hired: "Hired",
  reserve: "Reserve",
  rejected: "Rejected",
};

export const STAGE_ORDER: StageKey[] = [
  "screening",
  "round1",
  "round2",
  "round3",
  "hired",
  "reserve",
  "rejected",
];

export type InterviewStatus = "scheduled" | "awaiting-decision" | "completed" | "rescheduled";

export interface Interview {
  id: string;
  candidateId: string;
  campaignId: string;
  campaignName: string;
  name: string;
  email: string;
  role: string;
  round: 1 | 2 | 3;
  roundName: string;
  date: string;
  time: string;
  durationMin: number;
  interviewer: string;
  interviewerEmail: string;
  link: string;
  calendarLink: string;
  eventId: string;
  decision: Decision;
  status: InterviewStatus;
  reschedules: Reschedule[];
}

export interface Interviewer {
  name: string;
  email: string;
  title: string;
  calendarLink: string;
}

export interface HrUser {
  id: string;
  email: string;
  fullName: string;
  role: "Admin" | "Recruiter" | "Interviewer";
  status: "active" | "invited";
  createdAt: string;
  passwordsChangedAt: string;
  lastLogin: string;
  campaigns: number;
}

/* ------------------------------------------------------------------ */
/* Static reference lists                                               */
/* ------------------------------------------------------------------ */

/** The signed-in user for the "Mine" filter in the Interview Center. */
export const CURRENT_INTERVIEWER = "Abeer Gandhi";

export const INTERVIEWERS: Interviewer[] = [
  { name: "Abeer Gandhi", email: "abeer@scalepods.co", title: "Co-founder, Product", calendarLink: "https://cal.scalepods.co/abeer" },
  { name: "Raunak Mehta", email: "raunak@scalepods.co", title: "Head of Engineering", calendarLink: "https://cal.scalepods.co/raunak" },
  { name: "Priya Nair", email: "priya@scalepods.co", title: "Talent Partner", calendarLink: "https://cal.scalepods.co/priya" },
  { name: "Deep Bartaria", email: "deep@scalepods.co", title: "Senior Engineer", calendarLink: "https://cal.scalepods.co/deep" },
  { name: "Tushar Funde", email: "tushar@scalepods.co", title: "Growth Lead", calendarLink: "https://cal.scalepods.co/tushar" },
  { name: "Kavya Iyer", email: "kavya@scalepods.co", title: "Design Lead", calendarLink: "https://cal.scalepods.co/kavya" },
];

export const RECRUITERS = ["Priya Nair", "Abeer Gandhi", "Meera Kapoor"];

export const CANDIDATE_SOURCES = ["LinkedIn", "Referral", "Naukri", "Career Page", "Internshala", "Wellfound"];

export const ROUND_TYPE_LABEL = ["HR", "Technical", "Manager"];

/** Suggestions the typewriter search cycles through (from the reference app). */
export const ROLE_SUGGESTIONS = [
  "Quant Analyst", "Business Analyst", "Business Development", "AI Automation Engineer",
  "Software Engineer", "Project Manager", "HR Executive", "Data Analyst", "Marketing Executive",
  "Sales Manager", "Accountant", "Graphic Designer", "UI/UX Designer", "Operations Executive",
  "Team Lead", "Customer Support Executive", "Office Administrator", "Product Manager",
];

/* ------------------------------------------------------------------ */
/* Campaigns                                                            */
/* ------------------------------------------------------------------ */

const w = (skills: number, experience: number, education: number, jd: number): ScoreWeights => ({
  skills, experience, education, jd,
});

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "cmp-1",
    title: "AI Automation Engineer",
    department: "Engineering",
    description: "Build n8n and LLM-agent workflows that automate client operations end to end.",
    jdText:
      "We are looking for an AI Automation Engineer to design, ship and monitor production automations for ScalePods clients.\n\nResponsibilities\n- Build agentic workflows with n8n, Python and LLM APIs\n- Integrate CRMs, WhatsApp, email and voice providers\n- Own reliability: retries, observability and cost tracking\n\nRequirements\n- 2+ years in backend or automation engineering\n- Strong with REST APIs, webhooks and JSON\n- Hands-on with OpenAI / Anthropic APIs",
    startDate: "2026-09-14",
    endDate: "2026-11-20",
    location: "Mumbai (Hybrid)",
    salaryMinLpa: 12,
    salaryMaxLpa: 20,
    expectedJoining: "2026-12-14",
    rounds: ["Technical Screening", "System Design", "Founder Round"],
    weights: w(35, 30, 10, 25),
    isActive: true,
    quickHire: false,
    status: "open",
    createdAt: "2026-09-12",
    owner: "Priya Nair",
    skills: ["Python", "n8n", "LLM APIs", "REST", "Webhooks", "SQL"],
  },
  {
    id: "cmp-2",
    title: "Business Development Executive",
    department: "Sales",
    description: "Own outbound pipeline for the US and UAE staffing and real-estate verticals.",
    jdText:
      "Business Development Executive to run outbound prospecting, discovery calls and demos.\n\nResponsibilities\n- Build lead lists and run multichannel outreach\n- Qualify inbound and outbound leads\n- Book and run demos with founders and operations heads\n\nRequirements\n- 1-3 years in B2B SaaS or services sales\n- Excellent written and spoken English\n- Comfort with CRM tooling",
    startDate: "2026-09-21",
    endDate: "2026-11-15",
    location: "Remote (India)",
    salaryMinLpa: 6,
    salaryMaxLpa: 10,
    expectedJoining: "2026-12-01",
    rounds: ["HR Round", "Manager Interview"],
    weights: w(25, 35, 10, 30),
    isActive: true,
    quickHire: true,
    status: "open",
    createdAt: "2026-09-19",
    owner: "Meera Kapoor",
    skills: ["Outbound", "CRM", "Cold Email", "Demos", "Negotiation"],
  },
  {
    id: "cmp-3",
    title: "Quant Analyst",
    department: "Research",
    description: "Model pricing and demand signals for the revenue-intelligence product line.",
    jdText:
      "Quant Analyst to build forecasting and pricing models.\n\nResponsibilities\n- Time-series forecasting and anomaly detection\n- Statistical testing of pricing experiments\n- Communicate findings to product and leadership\n\nRequirements\n- Strong statistics and Python (pandas, scikit-learn)\n- B.Tech / M.Sc in a quantitative field",
    startDate: "2026-08-31",
    endDate: "2026-11-30",
    location: "Bengaluru (Onsite)",
    salaryMinLpa: 14,
    salaryMaxLpa: 24,
    expectedJoining: "2027-01-05",
    rounds: ["Aptitude Screening", "Technical Interview", "Panel Round"],
    weights: w(30, 20, 25, 25),
    isActive: true,
    quickHire: false,
    status: "open",
    createdAt: "2026-08-28",
    owner: "Priya Nair",
    skills: ["Statistics", "Python", "Time Series", "SQL", "Experimentation"],
  },
  {
    id: "cmp-4",
    title: "Product Marketing Manager",
    department: "Marketing",
    description: "Lead positioning, launches and sales enablement for the Pods suite.",
    jdText:
      "Product Marketing Manager to own go-to-market for new modules.\n\nResponsibilities\n- Positioning and messaging\n- Launch plans, case studies and sales enablement\n- Competitive and customer research\n\nRequirements\n- 3-5 years in B2B SaaS product marketing",
    startDate: "2026-10-05",
    endDate: "2026-12-05",
    location: "Pune (Hybrid)",
    salaryMinLpa: 15,
    salaryMaxLpa: 22,
    expectedJoining: "2027-01-12",
    rounds: ["Recruiter Screen", "Case Study Review"],
    weights: w(20, 35, 10, 35),
    isActive: true,
    quickHire: false,
    status: "open",
    createdAt: "2026-10-02",
    owner: "Meera Kapoor",
    skills: ["Positioning", "Copywriting", "GTM", "Analytics", "Sales Enablement"],
  },
  {
    id: "cmp-5",
    title: "UI/UX Designer",
    department: "Design",
    description: "Design product surfaces across the HR, Sales and Operations pods.",
    jdText:
      "UI/UX Designer to craft dashboards and workflow experiences.\n\nResponsibilities\n- End-to-end product design in Figma\n- Maintain the shared design system\n- Run quick usability tests\n\nRequirements\n- 2+ years designing SaaS products, strong portfolio",
    startDate: "2026-10-12",
    endDate: "2026-12-12",
    location: "Remote (India)",
    salaryMinLpa: 9,
    salaryMaxLpa: 16,
    expectedJoining: "2027-01-04",
    rounds: ["Portfolio Review", "Design Challenge"],
    weights: w(40, 25, 10, 25),
    isActive: true,
    quickHire: false,
    status: "open",
    createdAt: "2026-10-09",
    owner: "Priya Nair",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research", "Accessibility"],
  },
  {
    id: "cmp-6",
    title: "Customer Success Lead",
    department: "Operations",
    description: "Run onboarding and renewals for mid-market accounts.",
    jdText:
      "Customer Success Lead to own account health and onboarding.\n\nResponsibilities\n- Onboard new clients within 14 days\n- Track health scores, run QBRs\n- Reduce churn and drive expansion",
    startDate: "2026-07-06",
    endDate: "2026-09-30",
    location: "Mumbai (Onsite)",
    salaryMinLpa: 8,
    salaryMaxLpa: 13,
    expectedJoining: "2026-10-26",
    rounds: ["HR Round"],
    weights: w(20, 40, 10, 30),
    isActive: false,
    quickHire: true,
    status: "closed",
    createdAt: "2026-07-03",
    owner: "Meera Kapoor",
    skills: ["Onboarding", "Account Management", "QBRs", "Communication"],
  },
  {
    id: "cmp-7",
    title: "Data Analyst Intern",
    department: "Research",
    description: "Six-month paid internship supporting dashboards and reporting.",
    jdText:
      "Data Analyst Intern to support the analytics team.\n\nResponsibilities\n- Build SQL queries and Looker dashboards\n- Clean and validate datasets\n\nRequirements\n- Final-year student or recent graduate, strong SQL basics",
    startDate: "2026-10-01",
    endDate: "2026-11-25",
    location: "Remote (India)",
    salaryMinLpa: 3,
    salaryMaxLpa: 4,
    expectedJoining: "2026-12-07",
    rounds: ["Assignment Review", "Technical Interview", "Manager Interview"],
    weights: w(30, 10, 30, 30),
    isActive: true,
    quickHire: true,
    status: "open",
    createdAt: "2026-09-29",
    owner: "Priya Nair",
    skills: ["SQL", "Excel", "Dashboards", "Statistics"],
  },
  {
    id: "cmp-8",
    title: "HR Executive",
    department: "People",
    description: "Support recruitment operations and onboarding logistics.",
    jdText: "HR Executive to coordinate interviews, offers and onboarding paperwork. (Draft - JD under review)",
    startDate: "2026-11-09",
    endDate: "2026-12-20",
    location: "Mumbai (Hybrid)",
    salaryMinLpa: 4,
    salaryMaxLpa: 7,
    expectedJoining: "2027-01-18",
    rounds: ["HR Round", "Manager Interview"],
    weights: w(25, 25, 20, 30),
    isActive: false,
    quickHire: false,
    status: "draft",
    createdAt: "2026-10-24",
    owner: "Abeer Gandhi",
    skills: ["Coordination", "Communication", "HRIS", "Compliance"],
  },
];

/** Alias kept for the Master Dashboard / hr-metrics. */
export const MOCK_JOBS: Job[] = MOCK_CAMPAIGNS;

export function getCampaign(id: string) {
  return MOCK_CAMPAIGNS.find((c) => c.id === id);
}
export const getJob = getCampaign;

/* ------------------------------------------------------------------ */
/* Candidates                                                           */
/* ------------------------------------------------------------------ */

const NAMES: string[] = [
  "Aarav Sharma", "Ishita Verma", "Rohan Deshmukh", "Ananya Iyer", "Vikram Singh", "Neha Kulkarni",
  "Karan Malhotra", "Sneha Reddy", "Arjun Nair", "Pooja Bansal", "Siddharth Rao", "Kriti Jain",
  "Mohammad Fazal Attar", "Diya Mehta", "Yash Rao", "Tanvi Patil", "Harsh Vardhan", "Riya Choudhury",
  "Mithul CE", "Aditi Joshi", "Nikhil Gupta", "Shreya Banerjee", "Viraj Gosawami", "Meghna Pillai",
  "Rahul Khanna", "Simran Kaur", "Aman Saxena", "Pallavi Naik", "Dhruv Agarwal", "Sakshi Thakur",
  "Kunal Bhatia", "Isha Menon", "Varun Chopra", "Nandini Sethi", "Tejas Kamat", "Bhavna Shah",
];

const CITIES = ["Mumbai", "Pune", "Bengaluru", "Hyderabad", "Delhi NCR", "Chennai", "Ahmedabad", "Kolkata"];
const COMPANIES = [
  "Infosys", "Freshworks", "Zoho", "Razorpay", "Swiggy", "Paytm", "Tata Consultancy", "Wipro",
  "Zerodha", "Cred", "PhonePe", "Groww", "Meesho", "Capgemini", "Deloitte", "Startup (stealth)",
];
const EDUCATION = [
  "B.Tech, Computer Science - VJTI Mumbai", "B.E., Information Technology - Pune University",
  "MBA, Marketing - SPJIMR", "M.Sc., Statistics - IIT Bombay", "B.Des - NID Ahmedabad",
  "B.Com (Hons) - Symbiosis", "B.Tech, Electronics - NIT Surathkal", "BBA - Christ University",
  "M.Tech, Data Science - IIIT Hyderabad", "B.Sc., Mathematics - St. Xavier's",
];
const NOTICE = ["Immediate", "15 days", "30 days", "45 days", "60 days", "Serving notice"];
const TAG_POOL = ["Senior", "Remote", "Referral", "Fast-track", "Needs follow-up", "Strong portfolio", "Relocating", "Internship", "Python", "Top 10%"];

/**
 * Journey patterns. Tokens separated by "|": first token is resume screening,
 * then one per round. S = selected, R = rejected, V = reserve, H = hired,
 * "" = meeting scheduled / awaiting decision, "-" = nothing yet.
 */
const PATTERNS = [
  "-", "R", "S|", "S|R", "S|S|", "S|S|S|", "S|S|R", "S|S|S|H",
  "S|S|", "S|S|S|V", "S|", "S|S|S|R", "S|S|S|H", "R", "S|S|",
  "S|R", "-", "S|S|S|", "S|S|S|H", "S|S|R",
];

function tokenToDecision(t: string): Decision {
  switch (t) {
    case "S": return "Selected";
    case "R": return "Rejected";
    case "V": return "Reserve";
    case "H": return "Hired";
    default: return "";
  }
}

interface Journey {
  resume: Decision;
  /** per round: decision + whether a meeting exists */
  rounds: { decision: Decision; hasMeeting: boolean }[];
}

function buildJourney(pattern: string, nRounds: number): Journey {
  const toks = pattern.split("|");
  const resumeTok = toks[0];
  if (resumeTok === "-") return { resume: "", rounds: [] };
  const resume = tokenToDecision(resumeTok);
  const roundToks = toks.slice(1);
  const hasFinalTok = (t: string) => t === "H" || t === "V";
  const out: { decision: Decision; hasMeeting: boolean }[] = [];
  if (resume === "Rejected") return { resume, rounds: [] };
  // round tokens in the pattern: (S|S|S|H) -> ["S","S","H"]; (S|) -> [""]
  const rt = roundToks.length ? roundToks : [""];
  const last = rt[rt.length - 1];
  if (hasFinalTok(last)) {
    // map the final decision onto the campaign's last round
    for (let r = 0; r < nRounds; r++) {
      if (r < nRounds - 1) out.push({ decision: "Selected", hasMeeting: true });
      else out.push({ decision: tokenToDecision(last), hasMeeting: true });
    }
    return { resume, rounds: out };
  }
  for (let r = 0; r < Math.min(nRounds, rt.length); r++) {
    const d = tokenToDecision(rt[r]);
    out.push({ decision: d, hasMeeting: true });
  }
  // a candidate who cleared every round without an explicit final token becomes Hired
  if (out.length === nRounds && out[nRounds - 1].decision === "Selected") {
    out[nRounds - 1] = { decision: "Hired", hasMeeting: true };
  }
  return { resume, rounds: out };
}

const MEETING_TIMES = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "4:30 PM", "12:00 PM", "5:00 PM", "9:30 AM"];

const REASONS = [
  "Candidate had a clash with current employer's review meeting",
  "Interviewer travelling - moved by one day",
  "Candidate requested a later slot due to a medical appointment",
  "Panel member unavailable, slot reassigned",
  "Power cut at candidate's location - rescheduled",
];

function skipSunday(iso: string) {
  return dayOfWeek(iso) === 0 ? addDays(iso, 1) : iso;
}

function qa(round: number, name: string, role: string, i: number) {
  const topics = [
    ["Walk me through the most complex project you shipped.", "Led a migration of three manual reporting flows to automated pipelines; cut turnaround from 2 days to 40 minutes."],
    ["How do you handle ambiguity in requirements?", "Writes a one-page assumptions doc, validates with the stakeholder, ships a thin slice first."],
    ["Describe a time you disagreed with a teammate.", "Disagreed on build-vs-buy; ran a 2-day spike with data and aligned on the faster option."],
    ["Why ScalePods and why this role?", `Excited by applied AI for ${role.toLowerCase()} work and the speed of the team.`],
    ["What would your first 30 days look like?", "Shadow live clients, audit existing flows, fix the top three reliability gaps."],
  ];
  const a = topics[(i + round) % topics.length];
  const b = topics[(i + round + 2) % topics.length];
  return `Q1. ${a[0]}\nA: ${a[1]}\n\nQ2. ${b[0]}\nA: ${b[1]}\n\nInterviewer note for ${name}: ${
    (i + round) % 3 === 0 ? "Strong communicator, structured thinking." : (i + round) % 3 === 1 ? "Good depth, needs sharper trade-off reasoning." : "Confident and curious, a few gaps in fundamentals."
  }`;
}

function buildCandidates(): Candidate[] {
  const list: Candidate[] = [];
  const openIds = MOCK_CAMPAIGNS.filter((c) => c.status !== "draft");
  // candidate counts per campaign (sums to 36)
  const counts = [8, 6, 6, 4, 4, 3, 5];
  let idx = 0;
  openIds.forEach((camp, ci) => {
    const n = counts[ci] ?? 0;
    for (let k = 0; k < n; k++) {
      const i = idx;
      const name = NAMES[i % NAMES.length];
      const nRounds = camp.rounds.length;
      const journey = buildJourney(PATTERNS[(i * 7 + ci) % PATTERNS.length], nRounds);
      const rejected =
        journey.resume === "Rejected" || journey.rounds.some((r) => r.decision === "Rejected");

      // index-based, deterministic score
      const baseScore = 52 + ((i * 37 + ci * 11) % 45);
      const score = Math.max(34, Math.min(97, rejected ? baseScore - 14 : baseScore));
      const fit: FitLevel = score >= 80 ? "High" : score >= 65 ? "Medium" : "Low";
      const skills = camp.skills.filter((_, s) => (s + i) % 3 !== 0).concat(["Communication"]);

      const first = name.split(" ")[0].toLowerCase().replace(/[^a-z]/g, "");
      const last = (name.split(" ")[1] ?? "x").toLowerCase().replace(/[^a-z]/g, "");
      const recruiter = RECRUITERS[i % RECRUITERS.length];
      const appliedAt = addDays(camp.startDate, (i * 3) % 24);
      const candId = `C-${String(1000 + i * 7)}`;
      const experienceYears = Math.round((1 + ((i * 13) % 70) / 10) * 10) / 10;

      const resumeDate = addDays(appliedAt, 2);
      const rounds: RoundData[] = camp.rounds.map((rname, r) => {
        const rj = journey.rounds[r];
        const interviewer = INTERVIEWERS[(i + r * 2 + ci) % INTERVIEWERS.length];
        const base: RoundData = {
          round: (r + 1) as 1 | 2 | 3,
          name: rname,
          assigned: "",
          decision: "",
          meetingDate: "",
          meetingTime: "",
          meetingLink: "",
          calendarLink: "",
          eventId: "",
          meetingMail: "",
          waFollowup: "",
          mailFollowup: "",
          questionnaire: "",
          comments: "",
          reschedules: [],
        };
        if (!rj) return base;
        const decided = rj.decision !== "";
        let date: string;
        if (decided) {
          date = skipSunday(addDays(HR_TODAY, -(2 + ((i * 3 + r * 5) % 18)) + r * 0));
        } else {
          // pending meetings spread over -2 .. +11 days around the reference date
          date = skipSunday(addDays(HR_TODAY, ((i * 5 + ci * 3 + r) % 14) - 2));
        }
        const time = MEETING_TIMES[(i + r + ci) % MEETING_TIMES.length];
        const eventId = `evt_${(0x3a1f00 + i * 977 + r * 131).toString(16)}`;
        const rescheduled = (i + r) % 5 === 2;
        const reschedules: Reschedule[] = rescheduled
          ? [
              {
                id: `rs-${candId}-${r + 1}`,
                fromDate: addDays(date, -1 - ((i + r) % 3)),
                fromTime: MEETING_TIMES[(i + r + 3) % MEETING_TIMES.length],
                toDate: date,
                toTime: time,
                reason: REASONS[(i + r) % REASONS.length],
                requestedBy: (i + r) % 2 === 0 ? name : interviewer.name,
                at: addDays(date, -2 - ((i + r) % 3)),
              },
            ]
          : [];
        return {
          ...base,
          assigned: interviewer.name,
          decision: rj.decision,
          meetingDate: date,
          meetingTime: time,
          meetingLink: `https://meet.google.com/${first.slice(0, 3)}-${last.slice(0, 4)}-${String(100 + ((i * 7 + r) % 900))}`,
          calendarLink: `https://calendar.google.com/calendar/event?eid=${eventId}`,
          eventId,
          meetingMail: interviewer.email,
          waFollowup: decided ? `Sent ${fmtDateShort(addDays(date, -1))}` : date <= HR_TODAY ? `Sent ${fmtDateShort(addDays(date, -1))}` : "",
          mailFollowup: decided ? `Sent ${fmtDateShort(addDays(date, -2))}` : "",
          questionnaire: decided ? qa(r + 1, name, camp.title, i) : "",
          comments:
            rj.decision === "Rejected"
              ? "Not a fit on depth for this stage."
              : rj.decision === "Selected" || rj.decision === "Hired"
                ? "Cleared the bar. Recommend moving forward."
                : rj.decision === "Reserve"
                  ? "Strong but timing mismatch - keep warm."
                  : "",
          reschedules,
        };
      });

      const tags = [TAG_POOL[i % TAG_POOL.length], TAG_POOL[(i * 3 + 2) % TAG_POOL.length]].filter(
        (t, k, a) => a.indexOf(t) === k,
      );
      const company = COMPANIES[(i * 5 + ci) % COMPANIES.length];

      list.push({
        id: candId,
        campaignId: camp.id,
        campaignName: camp.title,
        name,
        email: `${first}.${last}@gmail.com`,
        phone: `+91 9${String(8000000000 + ((i * 7919) % 1999999999)).slice(1, 10)}`,
        city: CITIES[(i * 3 + ci) % CITIES.length],
        role: camp.title,
        recruiter,
        score,
        scoreBreakdown: {
          skills: Math.max(30, Math.min(99, score + ((i * 3) % 11) - 5)),
          experience: Math.max(30, Math.min(99, score + ((i * 5) % 13) - 6)),
          education: Math.max(30, Math.min(99, score + ((i * 7) % 15) - 8)),
          jdAlignment: Math.max(30, Math.min(99, score + ((i * 11) % 9) - 4)),
        },
        fit,
        tags,
        source: CANDIDATE_SOURCES[(i + ci) % CANDIDATE_SOURCES.length],
        appliedAt,
        experienceYears,
        currentCompany: company,
        education: EDUCATION[(i + ci) % EDUCATION.length],
        skills,
        expectedCtcLpa: Math.round(camp.salaryMinLpa + ((camp.salaryMaxLpa - camp.salaryMinLpa) * (((i * 17) % 10) / 10))),
        noticePeriod: NOTICE[i % NOTICE.length],
        resumeLink: `https://drive.google.com/file/d/1${name.replace(/[^A-Za-z]/g, "").slice(0, 6)}${1000 + i}/view`,
        summary: `${name} is a ${experienceYears}-year ${camp.department.toLowerCase()} professional currently at ${company}, based in ${CITIES[(i * 3 + ci) % CITIES.length]}. Profile shows ${
          score >= 80 ? "strong alignment" : score >= 65 ? "reasonable alignment" : "partial alignment"
        } with the ${camp.title} brief, with hands-on work in ${skills.slice(0, 3).join(", ")}.`,
        fitAnalysis: `Scored ${score}/100 against the ${camp.title} rubric (skills ${camp.weights.skills}%, experience ${camp.weights.experience}%, education ${camp.weights.education}%, JD alignment ${camp.weights.jd}%). ${
          fit === "High" ? "Matches most must-have requirements." : fit === "Medium" ? "Meets core requirements; some nice-to-haves missing." : "Several must-haves are missing or unverified."
        }`,
        strengths: `${skills.slice(0, 3).join(", ")} | ${experienceYears >= 3 ? "Relevant tenure with measurable outcomes" : "Fast learner with strong fundamentals"} | Clear written communication`,
        gaps:
          fit === "High"
            ? `Limited exposure to ${camp.skills[camp.skills.length - 1]} at scale`
            : `No demonstrated ${camp.skills[(i + 1) % camp.skills.length]} depth | Short tenure at last role`,
        riskFlags: (i * 3) % 7 === 0 ? "Risk flag: two roles under 8 months in the last 3 years" : "",
        careerProgression:
          experienceYears >= 4
            ? `Steady progression from associate to ${camp.department.toLowerCase()} lead in ${Math.round(experienceYears)} years.`
            : `Early-career with one promotion in ${experienceYears} years; trajectory is upward.`,
        stabilityAnalysis:
          (i * 3) % 7 === 0
            ? "Mixed - one short stint, otherwise 2+ year average tenure."
            : "Stable - average tenure above 2 years, no unexplained gaps.",
        industryRelevance:
          fit === "Low"
            ? "Adjacent industry; ramp-up expected."
            : `Direct experience in SaaS / services businesses similar to ScalePods clients.`,
        resumeDecision: journey.resume,
        resumeDecisionDate: journey.resume ? resumeDate : "",
        rounds,
      });
      idx++;
    }
  });
  return list;
}

export const MOCK_CANDIDATES: Candidate[] = buildCandidates();
/** Backwards compatible alias. */
export const CANDIDATE_HR_FIELDS = MOCK_CANDIDATES;

export function getCandidate(id: string) {
  return MOCK_CANDIDATES.find((c) => c.id === id);
}

export function candidatesForCampaign(campaignId: string, list: Candidate[] = MOCK_CANDIDATES) {
  return list.filter((c) => c.campaignId === campaignId);
}
export const candidatesForJob = candidatesForCampaign;

/* ------------------------------------------------------------------ */
/* Stage + decision logic                                               */
/* ------------------------------------------------------------------ */

export function isRejected(c: Candidate) {
  return c.resumeDecision === "Rejected" || c.rounds.some((r) => r.decision === "Rejected");
}

export function getCandidateStage(c: Candidate): StageKey {
  if (isRejected(c)) return "rejected";
  if (c.resumeDecision === "") return "screening";
  for (let r = 0; r < c.rounds.length; r++) {
    const d = c.rounds[r].decision;
    if (d === "") return (`round${r + 1}`) as StageKey;
    if (d === "Hired") return "hired";
    if (d === "Reserve") return "reserve";
  }
  return "hired";
}

/** The next decision step for a candidate, or null when finished. */
export function nextDecisionStep(c: Candidate): { key: "resume" | 1 | 2 | 3; label: string; isLast: boolean } | null {
  if (isRejected(c)) return null;
  if (c.resumeDecision === "") return { key: "resume", label: "Resume Screening", isLast: false };
  for (let r = 0; r < c.rounds.length; r++) {
    if (c.rounds[r].decision === "") {
      return { key: (r + 1) as 1 | 2 | 3, label: `Round ${r + 1}`, isLast: r === c.rounds.length - 1 };
    }
  }
  return null;
}

export type DecisionValue = "yes" | "no" | "reserve" | "hire";

export function applyDecision(
  c: Candidate,
  key: "resume" | 1 | 2 | 3,
  value: DecisionValue,
): Candidate {
  const decision: Decision =
    value === "hire" ? "Hired" : value === "reserve" ? "Reserve" : value === "yes" ? "Selected" : "Rejected";
  if (key === "resume") {
    return { ...c, resumeDecision: decision, resumeDecisionDate: HR_TODAY };
  }
  return {
    ...c,
    rounds: c.rounds.map((r) => (r.round === key ? { ...r, decision } : r)),
  };
}

export function fitLevelFromScore(score: number): FitLevel {
  return score >= 80 ? "High" : score >= 65 ? "Medium" : "Low";
}

/* ------------------------------------------------------------------ */
/* Interviews (derived from candidate rounds)                           */
/* ------------------------------------------------------------------ */

export function interviewsFromCandidates(candidates: Candidate[]): Interview[] {
  const out: Interview[] = [];
  for (const c of candidates) {
    for (const r of c.rounds) {
      if (!r.meetingDate) continue;
      const decided = r.decision !== "";
      const status: InterviewStatus = r.reschedules.length
        ? decided
          ? "completed"
          : r.meetingDate < HR_TODAY
            ? "awaiting-decision"
            : "rescheduled"
        : decided
          ? "completed"
          : r.meetingDate < HR_TODAY
            ? "awaiting-decision"
            : "scheduled";
      const interviewer = INTERVIEWERS.find((x) => x.name === r.assigned);
      out.push({
        id: `iv-${c.id}-${r.round}`,
        candidateId: c.id,
        campaignId: c.campaignId,
        campaignName: c.campaignName,
        name: c.name,
        email: c.email,
        role: c.role,
        round: r.round,
        roundName: r.name,
        date: r.meetingDate,
        time: r.meetingTime,
        durationMin: r.round === 1 ? 30 : r.round === 2 ? 45 : 60,
        interviewer: r.assigned,
        interviewerEmail: interviewer?.email ?? r.meetingMail,
        link: r.meetingLink,
        calendarLink: r.calendarLink,
        eventId: r.eventId,
        decision: r.decision,
        status,
        reschedules: r.reschedules,
      });
    }
  }
  return out.sort(
    (a, b) => a.date.localeCompare(b.date) || timeToMinutes(a.time) - timeToMinutes(b.time),
  );
}

export const MOCK_INTERVIEWS: Interview[] = interviewsFromCandidates(MOCK_CANDIDATES);

export function getInterview(id: string) {
  return MOCK_INTERVIEWS.find((i) => i.id === id);
}

export function interviewsThisWeekCount() {
  const start = startOfWeek(HR_TODAY);
  const end = addDays(start, 6);
  return MOCK_INTERVIEWS.filter((i) => i.date >= start && i.date <= end).length;
}

/* ------------------------------------------------------------------ */
/* Aggregates                                                           */
/* ------------------------------------------------------------------ */

function pick(campaignId?: string) {
  return campaignId && campaignId !== "all"
    ? MOCK_CANDIDATES.filter((c) => c.campaignId === campaignId)
    : MOCK_CANDIDATES;
}

export function candidatesInPipelineCount() {
  return MOCK_CANDIDATES.filter((c) => {
    const s = getCandidateStage(c);
    return s !== "rejected" && s !== "hired";
  }).length;
}

export function averageFitScore(list: Candidate[] = MOCK_CANDIDATES) {
  if (!list.length) return 0;
  return Math.round(list.reduce((s, c) => s + c.score, 0) / list.length);
}

export interface DashboardStats {
  total: number;
  active: number;
  avgScore: number;
  hired: number;
  decisionQuality: number;
  timeToHireDays: number;
  pipelineGrowthPct: number;
  pipeline: { key: string; label: string; count: number; pct: number }[];
  conversion: { label: string; pct: number }[];
  overallConversionPct: number;
  cities: { city: string; count: number }[];
  fitMix: { level: FitLevel; count: number }[];
  sources: { source: string; count: number }[];
}

export function dashboardStats(campaignId?: string): DashboardStats {
  const list = pick(campaignId);
  const total = list.length;
  const stages = list.map(getCandidateStage);
  const hired = stages.filter((s) => s === "hired").length;
  const active = stages.filter((s) => s !== "rejected" && s !== "hired").length;

  // "reached" counts: candidate passed resume screening, round 1 ... hired
  const reached = {
    screening: total,
    round1: list.filter((c) => c.resumeDecision === "Selected").length,
    round2: list.filter((c) => c.rounds[0] && ["Selected", "Hired", "Reserve"].includes(c.rounds[0].decision)).length,
    round3: list.filter((c) => c.rounds[1] && ["Selected", "Hired", "Reserve"].includes(c.rounds[1].decision)).length,
    hired,
  };
  const max = Math.max(1, reached.screening);
  const pipeline = [
    { key: "screening", label: "Screening", count: reached.screening },
    { key: "round1", label: "Round 1", count: reached.round1 },
    { key: "round2", label: "Round 2", count: reached.round2 },
    { key: "round3", label: "Round 3", count: reached.round3 },
    { key: "hired", label: "Hired", count: reached.hired },
  ].map((p) => ({ ...p, pct: Math.round((p.count / max) * 100) }));

  const rate = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));
  const conversion = [
    { label: "Screening → Round 1", pct: rate(reached.round1, reached.screening) },
    { label: "Round 1 → Round 2", pct: rate(reached.round2, reached.round1) },
    { label: "Round 2 → Round 3", pct: rate(reached.round3, reached.round2) },
    { label: "Round 3 → Hired", pct: rate(reached.hired, reached.round3 || reached.round2) },
  ];

  const cityMap = new Map<string, number>();
  list.forEach((c) => cityMap.set(c.city, (cityMap.get(c.city) ?? 0) + 1));
  const srcMap = new Map<string, number>();
  list.forEach((c) => srcMap.set(c.source, (srcMap.get(c.source) ?? 0) + 1));

  // decision quality: share of "Selected/Hired" candidates whose score >= 65
  const advanced = list.filter((c) => c.resumeDecision === "Selected");
  const goodCalls = advanced.filter((c) => c.score >= 65).length;
  const rejectedList = list.filter((c) => c.resumeDecision === "Rejected");
  const goodRejects = rejectedList.filter((c) => c.score < 75).length;
  const decisionQuality = Math.round(
    ((goodCalls + goodRejects) / Math.max(1, advanced.length + rejectedList.length)) * 100,
  );

  return {
    total,
    active,
    avgScore: averageFitScore(list),
    hired,
    decisionQuality,
    timeToHireDays: 19 + (total % 5),
    pipelineGrowthPct: 18 + (total % 9),
    pipeline,
    conversion,
    overallConversionPct: rate(hired, total),
    cities: Array.from(cityMap, ([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count),
    fitMix: (["High", "Medium", "Low"] as FitLevel[]).map((level) => ({
      level,
      count: list.filter((c) => c.fit === level).length,
    })),
    sources: Array.from(srcMap, ([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count),
  };
}

export function campaignStats(campaignId: string, list?: Candidate[]) {
  const cands = list ?? candidatesForCampaign(campaignId);
  const stages = cands.map(getCandidateStage);
  const total = cands.length;
  const passed = cands.filter((c) => c.resumeDecision === "Selected").length;
  const decidedResume = cands.filter((c) => c.resumeDecision !== "").length;
  const byStage = STAGE_ORDER.map((s) => ({ key: s, label: STAGE_LABELS[s], count: stages.filter((x) => x === s).length }));
  return {
    total,
    avgScore: averageFitScore(cands),
    passRate: decidedResume ? Math.round((passed / decidedResume) * 100) : 0,
    pending: cands.filter((c) => c.resumeDecision === "").length,
    byStage,
  };
}

export function monthlyHiringTrend() {
  return [
    { label: "May", applications: 42, hires: 2 },
    { label: "Jun", applications: 55, hires: 3 },
    { label: "Jul", applications: 61, hires: 4 },
    { label: "Aug", applications: 74, hires: 3 },
    { label: "Sep", applications: 88, hires: 5 },
    { label: "Oct", applications: 97, hires: 6 },
  ];
}

/* ------------------------------------------------------------------ */
/* Users (admin) - mirrors public.users in the reference schema         */
/* ------------------------------------------------------------------ */

export const MOCK_HR_USERS: HrUser[] = [
  { id: "u-1", email: "abeer@scalepods.co", fullName: "Abeer Gandhi", role: "Admin", status: "active", createdAt: "2026-03-02", passwordsChangedAt: "2026-09-10", lastLogin: "2026-10-27", campaigns: 3 },
  { id: "u-2", email: "raunak@scalepods.co", fullName: "Raunak Mehta", role: "Admin", status: "active", createdAt: "2026-03-02", passwordsChangedAt: "2026-08-21", lastLogin: "2026-10-26", campaigns: 1 },
  { id: "u-3", email: "priya@scalepods.co", fullName: "Priya Nair", role: "Recruiter", status: "active", createdAt: "2026-04-15", passwordsChangedAt: "2026-04-15", lastLogin: "2026-10-27", campaigns: 4 },
  { id: "u-4", email: "meera@scalepods.co", fullName: "Meera Kapoor", role: "Recruiter", status: "active", createdAt: "2026-05-06", passwordsChangedAt: "2026-07-30", lastLogin: "2026-10-25", campaigns: 3 },
  { id: "u-5", email: "deep@scalepods.co", fullName: "Deep Bartaria", role: "Interviewer", status: "active", createdAt: "2026-06-11", passwordsChangedAt: "2026-06-11", lastLogin: "2026-10-24", campaigns: 0 },
  { id: "u-6", email: "tushar@scalepods.co", fullName: "Tushar Funde", role: "Interviewer", status: "active", createdAt: "2026-06-11", passwordsChangedAt: "2026-06-11", lastLogin: "2026-10-22", campaigns: 0 },
  { id: "u-7", email: "kavya@scalepods.co", fullName: "Kavya Iyer", role: "Interviewer", status: "active", createdAt: "2026-08-03", passwordsChangedAt: "2026-08-03", lastLogin: "2026-10-23", campaigns: 0 },
  { id: "u-8", email: "intern.hr@scalepods.co", fullName: "Mithul CE", role: "Recruiter", status: "invited", createdAt: "2026-10-20", passwordsChangedAt: "2026-10-20", lastLogin: "", campaigns: 0 },
];

/* ------------------------------------------------------------------ */
/* Offer letter defaults                                                */
/* ------------------------------------------------------------------ */

export const OFFER_LETTER_DEFAULTS = {
  name: "Mithul",
  role: "AI Automations Intern",
  company: "ScalePods",
  stipend: "5,000",
  date: HR_TODAY,
  type: "internship" as "internship" | "fulltime",
};
