import { contactsByOrg, MOCK_COMPANIES } from "@/lib/mock-data/contacts";
import type { Activity } from "@/lib/types/core";

const STAFFING_ORG_ID = "org-staffing-co";

/* ------------------------------------------------------------------ */
/* Jobs                                                                 */
/* ------------------------------------------------------------------ */

export type JobStatus = "open" | "closed" | "draft";

export interface JobSkill {
  name: string;
}

export interface Job {
  id: string;
  orgId: string;
  title: string;
  department: string;
  location: string;
  status: JobStatus;
  createdAt: string;
  clientId?: string; // staffing mode: job belongs to a client requisition
  requisitionId?: string;
  description: string;
  aiExtracted: {
    skills: string[];
    experienceMin: number;
    experienceMax: number;
    location: string;
    salaryBandMin: number;
    salaryBandMax: number;
    currency: "INR" | "USD";
  };
}

export const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    orgId: STAFFING_ORG_ID,
    title: "Senior Backend Engineer",
    department: "Engineering",
    location: "Bengaluru (Hybrid)",
    status: "open",
    createdAt: daysAgoIso(32),
    clientId: "client-1",
    requisitionId: "req-1",
    description:
      "We are looking for a Senior Backend Engineer to own our payments platform. You will design and build high-throughput services in Node.js/TypeScript, work closely with product on API contracts, and mentor two mid-level engineers. Strong experience with Postgres, distributed systems and observability is a must. Fintech experience is a big plus.",
    aiExtracted: {
      skills: ["Node.js", "TypeScript", "PostgreSQL", "Microservices", "AWS", "System Design"],
      experienceMin: 5,
      experienceMax: 9,
      location: "Bengaluru",
      salaryBandMin: 2800000,
      salaryBandMax: 4200000,
      currency: "INR",
    },
  },
  {
    id: "job-2",
    orgId: STAFFING_ORG_ID,
    title: "Product Designer",
    department: "Design",
    location: "Remote (India)",
    status: "open",
    createdAt: daysAgoIso(28),
    clientId: "client-2",
    requisitionId: "req-2",
    description:
      "Orbit Fintech is hiring a Product Designer to lead end-to-end design for their lending app. You'll run discovery, wireframe, prototype in Figma and collaborate with engineering on implementation. 3+ years designing B2C fintech or consumer apps preferred.",
    aiExtracted: {
      skills: ["Figma", "UX Research", "Design Systems", "Prototyping", "Interaction Design"],
      experienceMin: 3,
      experienceMax: 6,
      location: "Remote",
      salaryBandMin: 1800000,
      salaryBandMax: 2800000,
      currency: "INR",
    },
  },
  {
    id: "job-3",
    orgId: STAFFING_ORG_ID,
    title: "Data Analyst",
    department: "Analytics",
    location: "Mumbai",
    status: "open",
    createdAt: daysAgoIso(21),
    clientId: "client-3",
    requisitionId: "req-3",
    description:
      "Vertex Retail Group needs a Data Analyst to build dashboards for store performance and inventory. SQL, Python and strong communication with store ops leadership required. Retail analytics background preferred.",
    aiExtracted: {
      skills: ["SQL", "Python", "Power BI", "Data Modeling", "Retail Analytics"],
      experienceMin: 2,
      experienceMax: 5,
      location: "Mumbai",
      salaryBandMin: 1200000,
      salaryBandMax: 1900000,
      currency: "INR",
    },
  },
  {
    id: "job-4",
    orgId: STAFFING_ORG_ID,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Pune (Hybrid)",
    status: "open",
    createdAt: daysAgoIso(18),
    clientId: "client-1",
    requisitionId: "req-4",
    description:
      "Nimbus Logistics is scaling its fleet-tracking platform and needs a DevOps engineer to own CI/CD, Kubernetes clusters and cost optimisation on AWS. Terraform and on-call experience required.",
    aiExtracted: {
      skills: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Docker", "Observability"],
      experienceMin: 4,
      experienceMax: 8,
      location: "Pune",
      salaryBandMin: 2200000,
      salaryBandMax: 3400000,
      currency: "INR",
    },
  },
  {
    id: "job-5",
    orgId: STAFFING_ORG_ID,
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Hyderabad",
    status: "open",
    createdAt: daysAgoIso(14),
    clientId: "client-5",
    requisitionId: "req-5",
    description:
      "Pinnacle Health is hiring a CSM to manage enterprise hospital accounts, drive renewals and coordinate with clinical ops teams. Healthcare SaaS experience strongly preferred.",
    aiExtracted: {
      skills: ["Account Management", "Renewals", "Healthcare SaaS", "Stakeholder Management"],
      experienceMin: 3,
      experienceMax: 7,
      location: "Hyderabad",
      salaryBandMin: 1400000,
      salaryBandMax: 2100000,
      currency: "INR",
    },
  },
  {
    id: "job-6",
    orgId: STAFFING_ORG_ID,
    title: "QA Automation Engineer",
    department: "Engineering",
    location: "Delhi NCR (Hybrid)",
    status: "open",
    createdAt: daysAgoIso(11),
    clientId: "client-4",
    requisitionId: "req-6",
    description:
      "Solara Energy needs a QA Automation Engineer to build a Playwright-based regression suite for their energy-trading dashboard. Experience with CI pipelines and API testing required.",
    aiExtracted: {
      skills: ["Playwright", "Test Automation", "API Testing", "CI/CD", "JavaScript"],
      experienceMin: 2,
      experienceMax: 5,
      location: "Delhi NCR",
      salaryBandMin: 1100000,
      salaryBandMax: 1700000,
      currency: "INR",
    },
  },
  {
    id: "job-7",
    orgId: STAFFING_ORG_ID,
    title: "Finance Controller",
    department: "Finance",
    location: "Mumbai",
    status: "draft",
    createdAt: daysAgoIso(6),
    clientId: "client-2",
    requisitionId: "req-7",
    description:
      "Orbit Fintech is scaling its finance team and needs a Controller to own statutory reporting, audits and treasury. CA with 8+ years in fintech or NBFC preferred. JD still being finalised with the client.",
    aiExtracted: {
      skills: ["Financial Reporting", "Statutory Compliance", "Treasury", "Audit"],
      experienceMin: 8,
      experienceMax: 14,
      location: "Mumbai",
      salaryBandMin: 3000000,
      salaryBandMax: 4500000,
      currency: "INR",
    },
  },
  {
    id: "job-8",
    orgId: STAFFING_ORG_ID,
    title: "Warehouse Operations Lead",
    department: "Operations",
    location: "Bengaluru",
    status: "open",
    createdAt: daysAgoIso(45),
    clientId: "client-1",
    requisitionId: "req-8",
    description:
      "Nimbus Logistics is opening a new fulfilment centre and needs an Operations Lead to manage a 60-person warehouse team, inventory accuracy and shift planning.",
    aiExtracted: {
      skills: ["Warehouse Management", "Inventory Control", "Team Leadership", "Lean Ops"],
      experienceMin: 4,
      experienceMax: 10,
      location: "Bengaluru",
      salaryBandMin: 1000000,
      salaryBandMax: 1500000,
      currency: "INR",
    },
  },
  {
    id: "job-9",
    orgId: STAFFING_ORG_ID,
    title: "Clinical Data Coordinator",
    department: "Clinical Ops",
    location: "Hyderabad",
    status: "closed",
    createdAt: daysAgoIso(70),
    clientId: "client-5",
    requisitionId: "req-9",
    description:
      "Pinnacle Health hired a Clinical Data Coordinator to manage patient record digitisation workflows across three hospital branches. Role filled after a 5-week search.",
    aiExtracted: {
      skills: ["Clinical Data Management", "HIPAA/Compliance", "EMR Systems"],
      experienceMin: 2,
      experienceMax: 5,
      location: "Hyderabad",
      salaryBandMin: 800000,
      salaryBandMax: 1200000,
      currency: "INR",
    },
  },
  {
    id: "job-10",
    orgId: STAFFING_ORG_ID,
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote (India)",
    status: "open",
    createdAt: daysAgoIso(9),
    clientId: "client-3",
    requisitionId: "req-10",
    description:
      "Vertex Retail Group is hiring a Growth Marketing Manager to own paid acquisition and lifecycle campaigns across its e-commerce storefronts. Performance marketing background in retail/D2C required.",
    aiExtracted: {
      skills: ["Performance Marketing", "Lifecycle Marketing", "SQL", "A/B Testing"],
      experienceMin: 3,
      experienceMax: 6,
      location: "Remote",
      salaryBandMin: 1500000,
      salaryBandMax: 2300000,
      currency: "INR",
    },
  },
];

function daysAgoIso(days: number) {
  return new Date(Date.now() - days * 86400000).toISOString();
}

export function getJob(id: string) {
  return MOCK_JOBS.find((j) => j.id === id);
}

/* ------------------------------------------------------------------ */
/* Candidate HR fields (extends shared contacts)                       */
/* ------------------------------------------------------------------ */

export type CandidateStage =
  | "sourced"
  | "screened"
  | "shortlisted"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

export const STAGE_LABELS: Record<CandidateStage, string> = {
  sourced: "Sourced",
  screened: "Screened",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected",
};

export const STAGE_ORDER: CandidateStage[] = [
  "sourced",
  "screened",
  "shortlisted",
  "interview",
  "offer",
  "hired",
  "rejected",
];

export interface FitReason {
  criterion: string;
  note: string;
  met: boolean;
}

export interface CandidateHrFields {
  contactId: string;
  fitScore: number;
  fitReasons: FitReason[];
  stage: CandidateStage;
  resumeUrl: string;
  appliedJobId: string;
  appliedAt: string;
}

const SOURCE_CRITERIA = [
  "Core skills match",
  "Years of experience",
  "Domain/industry fit",
  "Location & work mode",
  "Communication (resume quality)",
  "Compensation expectation fit",
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const rand = seededRandom(1337);

function buildFitReasons(score: number): FitReason[] {
  const count = 4;
  const picked = [...SOURCE_CRITERIA].sort(() => rand() - 0.5).slice(0, count);
  return picked.map((criterion) => {
    const met = rand() < score / 100;
    const notesMet: Record<string, string> = {
      "Core skills match": "Resume lists 5 of 6 required skills with recent hands-on usage.",
      "Years of experience": "Experience band aligns closely with the role's requirement.",
      "Domain/industry fit": "Has worked in a directly comparable industry for 2+ years.",
      "Location & work mode": "Based in the job's location, open to the stated work mode.",
      "Communication (resume quality)": "Resume is well-structured with quantified impact statements.",
      "Compensation expectation fit": "Stated expectation sits within the approved salary band.",
    };
    const notesNotMet: Record<string, string> = {
      "Core skills match": "Missing 2 of 6 required skills; may need upskilling on the job.",
      "Years of experience": "Slightly below the experience band requested for this role.",
      "Domain/industry fit": "Limited direct industry exposure, mostly adjacent sectors.",
      "Location & work mode": "Currently based outside the preferred location; relocation unconfirmed.",
      "Communication (resume quality)": "Resume is sparse on measurable outcomes.",
      "Compensation expectation fit": "Expectation is above the top of the approved band.",
    };
    return {
      criterion,
      note: met ? notesMet[criterion] : notesNotMet[criterion],
      met,
    };
  });
}

const candidateContacts = contactsByOrg(STAFFING_ORG_ID).filter((c) => c.type === "candidate");

export const CANDIDATE_SOURCES = ["LinkedIn", "Referral", "Job Board", "Agency Database", "Walk-in", "Career Page"];

export const CANDIDATE_HR_FIELDS: CandidateHrFields[] = candidateContacts.map((contact, i) => {
  const job = MOCK_JOBS[i % MOCK_JOBS.length];
  // Deterministic-ish distribution across stages, weighted toward earlier stages.
  const stageRoll = i % 10;
  let stage: CandidateStage;
  if (stageRoll < 3) stage = "sourced";
  else if (stageRoll < 5) stage = "screened";
  else if (stageRoll < 7) stage = "shortlisted";
  else if (stageRoll < 8) stage = "interview";
  else if (stageRoll === 8) stage = "offer";
  else stage = i % 20 === 9 ? "hired" : "rejected";

  // Pure function of the index (not the shared rand() stream) so server and client agree.
  const baseScore = 55 + (Math.imul(i + 1, 2654435761) >>> 0) % 40; // 55-94
  const fitScore = stage === "rejected" ? Math.max(35, baseScore - 25) : stage === "hired" ? Math.min(98, baseScore + 10) : baseScore;

  return {
    contactId: contact.id,
    fitScore,
    fitReasons: buildFitReasons(fitScore),
    stage,
    resumeUrl: `/mock-files/resumes/${contact.id}.pdf`,
    appliedJobId: job.id,
    appliedAt: new Date(new Date(contact.createdAt).getTime() + 2 * 86400000).toISOString(),
  };
});

export function getCandidateHr(contactId: string) {
  return CANDIDATE_HR_FIELDS.find((c) => c.contactId === contactId);
}

export function candidatesForJob(jobId: string) {
  return CANDIDATE_HR_FIELDS.filter((c) => c.appliedJobId === jobId);
}

export function candidatesInPipelineCount() {
  return CANDIDATE_HR_FIELDS.filter((c) => c.stage !== "hired" && c.stage !== "rejected").length;
}

export function averageFitScore() {
  const scores = CANDIDATE_HR_FIELDS.map((c) => c.fitScore);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/* ------------------------------------------------------------------ */
/* Candidate activity timeline (mock)                                  */
/* ------------------------------------------------------------------ */

export function candidateActivity(contactId: string): Activity[] {
  const hr = getCandidateHr(contactId);
  if (!hr) return [];
  const job = getJob(hr.appliedJobId);
  const base = new Date(hr.appliedAt).getTime();
  const entries: Activity[] = [
    {
      id: `act-${contactId}-1`,
      orgId: STAFFING_ORG_ID,
      contactId,
      type: "ai_action",
      title: "AI parsed resume and created candidate profile",
      description: "Extracted skills, experience and contact details from uploaded CV.",
      createdAt: new Date(base).toISOString(),
      aiGenerated: true,
    },
    {
      id: `act-${contactId}-2`,
      orgId: STAFFING_ORG_ID,
      contactId,
      type: "ai_action",
      title: `AI scored fit against ${job?.title ?? "role"}: ${hr.fitScore}/100`,
      description: "Scoring based on skills match, experience band and domain fit.",
      createdAt: new Date(base + 30 * 60000).toISOString(),
      aiGenerated: true,
    },
    {
      id: `act-${contactId}-3`,
      orgId: STAFFING_ORG_ID,
      contactId,
      type: "stage_change",
      title: `Moved to ${STAGE_LABELS["screened"]}`,
      createdAt: new Date(base + 2 * 86400000).toISOString(),
    },
  ];
  if (STAGE_ORDER.indexOf(hr.stage) >= STAGE_ORDER.indexOf("shortlisted")) {
    entries.push({
      id: `act-${contactId}-4`,
      orgId: STAFFING_ORG_ID,
      contactId,
      type: "email",
      title: "AI-drafted outreach email sent",
      description: "Personalised invite with Google Calendar booking link sent for approval.",
      createdAt: new Date(base + 4 * 86400000).toISOString(),
      aiGenerated: true,
    });
    entries.push({
      id: `act-${contactId}-5`,
      orgId: STAFFING_ORG_ID,
      contactId,
      type: "stage_change",
      title: `Moved to ${STAGE_LABELS["shortlisted"]}`,
      createdAt: new Date(base + 5 * 86400000).toISOString(),
    });
  }
  if (STAGE_ORDER.indexOf(hr.stage) >= STAGE_ORDER.indexOf("interview")) {
    entries.push({
      id: `act-${contactId}-6`,
      orgId: STAFFING_ORG_ID,
      contactId,
      type: "meeting",
      title: "Interview scheduled",
      description: `Candidate confirmed a 45-minute interview slot for the ${job?.title ?? "role"} role.`,
      createdAt: new Date(base + 7 * 86400000).toISOString(),
    });
  }
  return entries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/* ------------------------------------------------------------------ */
/* Interviews                                                           */
/* ------------------------------------------------------------------ */

export interface Interview {
  id: string;
  orgId: string;
  candidateContactId: string;
  jobId: string;
  scheduledAt: string;
  durationMins: number;
  interviewer: string;
  mode: "video" | "phone" | "onsite";
  status: "scheduled" | "completed" | "cancelled";
}

const interviewCandidates = CANDIDATE_HR_FIELDS.filter(
  (c) => c.stage === "interview" || c.stage === "offer" || c.stage === "hired"
).slice(0, 8);

const INTERVIEWERS = ["Rohan Mehta", "Priya Nair", "Aisha Khan", "Karan Oza"];

export const MOCK_INTERVIEWS: Interview[] = interviewCandidates.map((c, i) => ({
  id: `interview-${i + 1}`,
  orgId: STAFFING_ORG_ID,
  candidateContactId: c.contactId,
  jobId: c.appliedJobId,
  scheduledAt: new Date(Date.now() + (i - 2) * 86400000 + i * 3600000).toISOString(),
  durationMins: 45,
  interviewer: INTERVIEWERS[i % INTERVIEWERS.length],
  mode: i % 3 === 0 ? "onsite" : i % 3 === 1 ? "video" : "phone",
  status: i < 2 ? "completed" : "scheduled",
}));

export function getInterview(id: string) {
  return MOCK_INTERVIEWS.find((i) => i.id === id);
}

export function interviewsThisWeekCount() {
  const now = Date.now();
  const weekMs = 7 * 86400000;
  return MOCK_INTERVIEWS.filter((i) => {
    const t = new Date(i.scheduledAt).getTime();
    return t >= now - weekMs && t <= now + weekMs && i.status === "scheduled";
  }).length;
}

/* ------------------------------------------------------------------ */
/* Offers                                                               */
/* ------------------------------------------------------------------ */

export type OfferStatus = "sent" | "viewed" | "accepted" | "declined";

export interface Offer {
  id: string;
  orgId: string;
  candidateContactId: string;
  jobId: string;
  compMinor: number;
  currency: "INR" | "USD";
  startDate: string;
  status: OfferStatus;
  sentAt: string;
}

const offerCandidates = CANDIDATE_HR_FIELDS.filter((c) => c.stage === "offer" || c.stage === "hired").slice(0, 5);

export const MOCK_OFFERS: Offer[] = offerCandidates.map((c, i) => {
  const job = getJob(c.appliedJobId);
  const band = job?.aiExtracted;
  const comp = band ? Math.round((band.salaryBandMin + band.salaryBandMax) / 2) : 1800000;
  const statuses: OfferStatus[] = ["sent", "viewed", "accepted", "accepted", "declined"];
  return {
    id: `offer-${i + 1}`,
    orgId: STAFFING_ORG_ID,
    candidateContactId: c.contactId,
    jobId: c.appliedJobId,
    compMinor: comp * 100,
    currency: band?.currency ?? "INR",
    startDate: new Date(Date.now() + (14 + i * 3) * 86400000).toISOString(),
    status: c.stage === "hired" ? "accepted" : statuses[i % statuses.length],
    sentAt: new Date(Date.now() - (10 - i) * 86400000).toISOString(),
  };
});

export function getOffer(id: string) {
  return MOCK_OFFERS.find((o) => o.id === id);
}

/* ------------------------------------------------------------------ */
/* Staffing mode: Clients, Requisitions, Submissions                   */
/* ------------------------------------------------------------------ */

export interface Client {
  id: string;
  orgId: string;
  companyId: string;
  contactPerson: string;
  contactEmail: string;
  openRequisitions: number;
}

const staffingCompanies = MOCK_COMPANIES.filter((c) => c.orgId === STAFFING_ORG_ID);

export const MOCK_CLIENTS: Client[] = staffingCompanies.map((company, i) => ({
  id: `client-${i + 1}`,
  orgId: STAFFING_ORG_ID,
  companyId: company.id,
  contactPerson: ["Neha Kapoor", "Arjun Malhotra", "Divya Pillai", "Sameer Joshi", "Ritu Bhasin"][i % 5],
  contactEmail: `hr@${company.domain}`,
  openRequisitions: 0, // computed below
}));

export function getClient(id: string) {
  return MOCK_CLIENTS.find((c) => c.id === id);
}

export interface Requisition {
  id: string;
  orgId: string;
  clientId: string;
  jobId: string;
  title: string;
  status: "open" | "on-hold" | "filled" | "closed";
  candidatesSubmitted: number;
  createdAt: string;
}

const REQ_STATUSES: Requisition["status"][] = ["open", "open", "on-hold", "filled", "closed"];

export const MOCK_REQUISITIONS: Requisition[] = Array.from({ length: 12 }, (_, i) => {
  const job = MOCK_JOBS[i % MOCK_JOBS.length];
  const client = MOCK_CLIENTS.find((c) => c.id === job.clientId) ?? MOCK_CLIENTS[i % MOCK_CLIENTS.length];
  return {
    id: `req-${i + 1}`,
    orgId: STAFFING_ORG_ID,
    clientId: client.id,
    jobId: job.id,
    title: `${job.title} — ${client.id === job.clientId ? "primary req" : "additional headcount"}`,
    status: REQ_STATUSES[i % REQ_STATUSES.length],
    candidatesSubmitted: 3 + (i % 6),
    createdAt: daysAgoIso(10 + i * 4),
  };
});

// Backfill openRequisitions counts on clients now that requisitions exist.
MOCK_CLIENTS.forEach((client) => {
  client.openRequisitions = MOCK_REQUISITIONS.filter(
    (r) => r.clientId === client.id && (r.status === "open" || r.status === "on-hold")
  ).length;
});

export function getRequisition(id: string) {
  return MOCK_REQUISITIONS.find((r) => r.id === id);
}

export function requisitionsForClient(clientId: string) {
  return MOCK_REQUISITIONS.filter((r) => r.clientId === clientId);
}

export type SubmissionFeedback = "pending" | "shortlisted" | "rejected" | "interview";

export interface Submission {
  id: string;
  orgId: string;
  candidateContactId: string;
  clientId: string;
  requisitionId: string;
  submittedAt: string;
  clientFeedback: SubmissionFeedback;
}

const FEEDBACK_CYCLE: SubmissionFeedback[] = ["pending", "shortlisted", "interview", "rejected"];

const submissionCandidates = CANDIDATE_HR_FIELDS.filter(
  (c) => c.stage !== "sourced" && c.stage !== "rejected"
).slice(0, 14);

export const MOCK_SUBMISSIONS: Submission[] = submissionCandidates.map((c, i) => {
  const req = MOCK_REQUISITIONS.find((r) => r.jobId === c.appliedJobId) ?? MOCK_REQUISITIONS[i % MOCK_REQUISITIONS.length];
  return {
    id: `sub-${i + 1}`,
    orgId: STAFFING_ORG_ID,
    candidateContactId: c.contactId,
    clientId: req.clientId,
    requisitionId: req.id,
    submittedAt: new Date(Date.now() - (20 - i) * 86400000).toISOString(),
    clientFeedback: FEEDBACK_CYCLE[i % FEEDBACK_CYCLE.length],
  };
});

export function anonymisedLabel(contactId: string) {
  // Deterministic "Candidate #id" + initials-only display for client-facing submissions.
  const num = contactId.replace(/\D/g, "");
  return `Candidate #${num}`;
}

/* ------------------------------------------------------------------ */
/* Analytics helpers — derived aggregates, no hardcoded numbers        */
/* ------------------------------------------------------------------ */

export const FUNNEL_STAGES: CandidateStage[] = [
  "sourced",
  "screened",
  "shortlisted",
  "interview",
  "offer",
  "hired",
];

export interface FunnelStagePoint {
  stage: CandidateStage;
  label: string;
  count: number;
}

/** Funnel counts for a given list of candidate HR rows (defaults to all candidates). */
export function buildFunnel(rows: CandidateHrFields[] = CANDIDATE_HR_FIELDS): FunnelStagePoint[] {
  // A candidate currently at stage X has necessarily passed through every
  // earlier stage in the funnel, so each funnel step counts candidates whose
  // stage index is >= that step's index (rejected candidates still count for
  // the stages they reached before falling out, inferred from fit score band).
  return FUNNEL_STAGES.map((stage) => {
    const stageIdx = STAGE_ORDER.indexOf(stage);
    const count = rows.filter((r) => {
      if (r.stage === "rejected") {
        // Approximate how far a rejected candidate got using their fit score:
        // higher-scoring rejects are assumed to have progressed further.
        const reachedIdx = Math.min(
          FUNNEL_STAGES.length - 2,
          Math.floor((r.fitScore / 100) * (FUNNEL_STAGES.length - 1))
        );
        return reachedIdx >= stageIdx;
      }
      return STAGE_ORDER.indexOf(r.stage) >= stageIdx;
    }).length;
    return { stage, label: STAGE_LABELS[stage], count };
  });
}

/** Funnel for one specific job's candidates. */
export function buildFunnelForJob(jobId: string): FunnelStagePoint[] {
  return buildFunnel(candidatesForJob(jobId));
}

export interface FitScoreBucket {
  bucket: string;
  min: number;
  max: number;
  count: number;
}

const FIT_BUCKETS: [number, number, string][] = [
  [0, 20, "0-20"],
  [21, 40, "21-40"],
  [41, 60, "41-60"],
  [61, 80, "61-80"],
  [81, 100, "81-100"],
];

/** Bucketed fit-score histogram for a set of candidate rows. */
export function buildFitScoreHistogram(
  rows: CandidateHrFields[] = CANDIDATE_HR_FIELDS
): FitScoreBucket[] {
  return FIT_BUCKETS.map(([min, max, bucket]) => ({
    bucket,
    min,
    max,
    count: rows.filter((r) => r.fitScore >= min && r.fitScore <= max).length,
  }));
}

export function fitScoreHistogramForJob(jobId: string): FitScoreBucket[] {
  return buildFitScoreHistogram(candidatesForJob(jobId));
}

export interface SourceBreakdownPoint {
  source: string;
  count: number;
}

/** Candidate source breakdown (Website / WhatsApp / LinkedIn / Referral / Email / Walk-in). */
export function candidateSourceBreakdown(): SourceBreakdownPoint[] {
  const counts = new Map<string, number>();
  CANDIDATE_HR_FIELDS.forEach((hr) => {
    const contact = candidateContacts.find((c) => c.id === hr.contactId);
    const source = contact?.source ?? "Other";
    counts.set(source, (counts.get(source) ?? 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}

/** Average fit score for candidates who applied to a given job. */
export function averageFitScoreForJob(jobId: string): number {
  const rows = candidatesForJob(jobId);
  if (rows.length === 0) return 0;
  return Math.round(rows.reduce((sum, r) => sum + r.fitScore, 0) / rows.length);
}

/** Stage-to-stage conversion rates across the whole candidate pool. */
export interface StageConversion {
  fromStage: CandidateStage;
  toStage: CandidateStage;
  rate: number; // 0-100
}

export function stageConversionRates(): StageConversion[] {
  const funnel = buildFunnel();
  const out: StageConversion[] = [];
  for (let i = 0; i < funnel.length - 1; i++) {
    const from = funnel[i];
    const to = funnel[i + 1];
    const rate = from.count === 0 ? 0 : Math.round((to.count / from.count) * 100);
    out.push({ fromStage: from.stage, toStage: to.stage, rate });
  }
  return out;
}

/** Average time-to-fill (createdAt -> now, or a plausible fixed close window for closed jobs), in days. */
export function avgTimeToFillDays(): number {
  const closed = MOCK_JOBS.filter((j) => j.status === "closed");
  if (closed.length === 0) return 35; // fallback consistent with seeded "closed after 5-week search" job
  const totalDays = closed.reduce((sum, j) => {
    const ageDays = Math.round((Date.now() - new Date(j.createdAt).getTime()) / 86400000);
    return sum + Math.min(ageDays, 60);
  }, 0);
  return Math.round(totalDays / closed.length);
}

export function offersPendingCount(): number {
  return MOCK_OFFERS.filter((o) => o.status === "sent" || o.status === "viewed").length;
}

/* -------------------------- Interviews analytics -------------------------- */

export interface WeeklyVolumePoint {
  week: string;
  count: number;
}

/** Interview volume per week for the last N weeks (synthesised from a stable seed so the
 * chart has a believable shape; current week pulls from MOCK_INTERVIEWS where possible). */
export function weeklyInterviewVolume(weeks = 8, now = Date.now()): WeeklyVolumePoint[] {
  const points: WeeklyVolumePoint[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const weekStart = now - w * 7 * 86400000;
    const weekEnd = weekStart + 7 * 86400000;
    const actual = MOCK_INTERVIEWS.filter((iv) => {
      const t = new Date(iv.scheduledAt).getTime();
      return t >= weekStart && t < weekEnd;
    }).length;
    // Blend actual scheduled interviews (mostly only populated near "now") with a
    // deterministic synthetic baseline so earlier weeks still show a realistic trend.
    const synthetic = 4 + ((w * 7 + 3) % 6);
    points.push({
      week: w === 0 ? "This week" : `${w}w ago`,
      count: w === 0 ? Math.max(actual, synthetic) : synthetic,
    });
  }
  return points.reverse(); // chronological order (oldest -> newest)
}

export interface InterviewerWorkload {
  interviewer: string;
  count: number;
}

/** Interviewer workload for the current week (scheduled, non-cancelled interviews). */
export function interviewerWorkloadThisWeek(now = Date.now()): InterviewerWorkload[] {
  const weekMs = 7 * 86400000;
  const counts = new Map<string, number>();
  MOCK_INTERVIEWS.filter((iv) => {
    const t = new Date(iv.scheduledAt).getTime();
    return iv.status !== "cancelled" && t >= now - weekMs && t <= now + weekMs;
  }).forEach((iv) => {
    counts.set(iv.interviewer, (counts.get(iv.interviewer) ?? 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([interviewer, count]) => ({ interviewer, count }))
    .sort((a, b) => b.count - a.count);
}

/* ----------------------------- Offers analytics ---------------------------- */

export interface OfferFunnelPoint {
  label: string;
  count: number;
}

export function offerFunnel(): OfferFunnelPoint[] {
  const sent = MOCK_OFFERS.length;
  const viewed = MOCK_OFFERS.filter((o) => o.status !== "sent").length;
  const accepted = MOCK_OFFERS.filter((o) => o.status === "accepted").length;
  const declined = MOCK_OFFERS.filter((o) => o.status === "declined").length;
  return [
    { label: "Sent", count: sent },
    { label: "Viewed", count: viewed },
    { label: "Accepted", count: accepted },
    { label: "Declined", count: declined },
  ];
}

/** Average days between an offer being sent and it being accepted (deterministic mock). */
export function avgTimeToAcceptDays(): number {
  const accepted = MOCK_OFFERS.filter((o) => o.status === "accepted");
  if (accepted.length === 0) return 0;
  // Deterministic pseudo-duration per offer based on its id, 3-9 days.
  const total = accepted.reduce((sum, o) => {
    const n = Number(o.id.replace(/\D/g, "")) || 1;
    return sum + (3 + (n % 7));
  }, 0);
  return Math.round((total / accepted.length) * 10) / 10;
}

/* -------------------------- Staffing analytics ----------------------------- */

export interface RequisitionsByStatusPoint {
  status: Requisition["status"];
  count: number;
}

export function requisitionsByStatus(): RequisitionsByStatusPoint[] {
  const statuses: Requisition["status"][] = ["open", "on-hold", "filled", "closed"];
  return statuses.map((status) => ({
    status,
    count: MOCK_REQUISITIONS.filter((r) => r.status === status).length,
  }));
}

export interface SubmissionsByClientPoint {
  clientId: string;
  clientName: string;
  count: number;
}

export function submissionsByClient(): SubmissionsByClientPoint[] {
  const counts = new Map<string, number>();
  MOCK_SUBMISSIONS.forEach((s) => {
    counts.set(s.clientId, (counts.get(s.clientId) ?? 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([clientId, count]) => {
      const client = getClient(clientId);
      const company = client ? staffingCompanies.find((c) => c.id === client.companyId) : undefined;
      return { clientId, clientName: company?.name ?? clientId, count };
    })
    .sort((a, b) => b.count - a.count);
}

export interface ClientHealthRow {
  clientId: string;
  clientName: string;
  openReqs: number;
  submissionsThisMonth: number;
  avgTimeToFillDays: number;
}

/** Per-client health summary: open reqs, submissions this month, avg time-to-fill. */
export function clientHealthSummary(now = Date.now()): ClientHealthRow[] {
  const monthMs = 30 * 86400000;
  return MOCK_CLIENTS.map((client) => {
    const company = staffingCompanies.find((c) => c.id === client.companyId);
    const reqs = requisitionsForClient(client.id);
    const openReqs = reqs.filter((r) => r.status === "open" || r.status === "on-hold").length;
    const submissionsThisMonth = MOCK_SUBMISSIONS.filter(
      (s) => s.clientId === client.id && now - new Date(s.submittedAt).getTime() <= monthMs
    ).length;
    const filledReqs = reqs.filter((r) => r.status === "filled" || r.status === "closed");
    const avgFill =
      filledReqs.length === 0
        ? 0
        : Math.round(
            filledReqs.reduce((sum, r) => {
              const ageDays = Math.round((now - new Date(r.createdAt).getTime()) / 86400000);
              return sum + Math.min(ageDays, 60);
            }, 0) / filledReqs.length
          );
    return {
      clientId: client.id,
      clientName: company?.name ?? client.id,
      openReqs,
      submissionsThisMonth,
      avgTimeToFillDays: avgFill,
    };
  });
}

/* ------------------------- Whole-app analytics page ------------------------ */

export interface TimeToHireWeekPoint {
  week: string;
  days: number;
}

/** Synthesised time-to-hire trend over the last N weeks (deterministic, seeded). */
export function timeToHireTrend(weeks = 12, now = Date.now()): TimeToHireWeekPoint[] {
  const base = avgTimeToFillDays();
  const points: TimeToHireWeekPoint[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    // Deterministic wave around the base so the trend looks organic but is
    // 100% reproducible (no Math.random/Date.now() inside the loop body).
    const wobble = Math.round(4 * Math.sin((w / weeks) * Math.PI * 2)) - (weeks - 1 - w >= weeks - 3 ? 2 : 0);
    points.push({ week: w === 0 ? "This week" : `${w}w ago`, days: Math.max(12, base + wobble) });
  }
  void now;
  return points.reverse();
}

export interface SourceEffectivenessPoint {
  source: string;
  avgFitScore: number;
  hires: number;
  candidates: number;
}

/** Which lead source produces the best fit scores / most hires. */
export function sourceEffectiveness(): SourceEffectivenessPoint[] {
  const bySource = new Map<string, { scoreSum: number; count: number; hires: number }>();
  CANDIDATE_HR_FIELDS.forEach((hr) => {
    const contact = candidateContacts.find((c) => c.id === hr.contactId);
    const source = contact?.source ?? "Other";
    const entry = bySource.get(source) ?? { scoreSum: 0, count: 0, hires: 0 };
    entry.scoreSum += hr.fitScore;
    entry.count += 1;
    if (hr.stage === "hired") entry.hires += 1;
    bySource.set(source, entry);
  });
  return Array.from(bySource.entries())
    .map(([source, { scoreSum, count, hires }]) => ({
      source,
      avgFitScore: count === 0 ? 0 : Math.round(scoreSum / count),
      hires,
      candidates: count,
    }))
    .sort((a, b) => b.avgFitScore - a.avgFitScore);
}

export interface RecruiterPerformancePoint {
  recruiter: string;
  interviewsHeld: number;
  hiresInfluenced: number;
}

/** Interviewer/recruiter performance: interview load vs. downstream hires on those jobs. */
export function recruiterPerformance(): RecruiterPerformancePoint[] {
  const byInterviewer = new Map<string, { interviewsHeld: number; jobIds: Set<string> }>();
  MOCK_INTERVIEWS.forEach((iv) => {
    const entry = byInterviewer.get(iv.interviewer) ?? { interviewsHeld: 0, jobIds: new Set<string>() };
    entry.interviewsHeld += 1;
    entry.jobIds.add(iv.jobId);
    byInterviewer.set(iv.interviewer, entry);
  });
  return Array.from(byInterviewer.entries())
    .map(([recruiter, { interviewsHeld, jobIds }]) => ({
      recruiter,
      interviewsHeld,
      hiresInfluenced: CANDIDATE_HR_FIELDS.filter(
        (hr) => hr.stage === "hired" && jobIds.has(hr.appliedJobId)
      ).length,
    }))
    .sort((a, b) => b.interviewsHeld - a.interviewsHeld);
}

/** Estimated cost-per-hire: a simple blended estimate from job-board/agency spend assumptions. */
export function costPerHireEstimate(): { totalCostInr: number; hires: number; costPerHireInr: number } {
  const hires = CANDIDATE_HR_FIELDS.filter((c) => c.stage === "hired").length;
  const COST_PER_OPEN_ROLE = 15000; // sourcing/ads spend per open role, INR
  const COST_PER_INTERVIEW = 800; // interviewer time cost, INR
  const totalCostInr =
    MOCK_JOBS.length * COST_PER_OPEN_ROLE + MOCK_INTERVIEWS.length * COST_PER_INTERVIEW;
  return {
    totalCostInr,
    hires: Math.max(hires, 1),
    costPerHireInr: Math.round(totalCostInr / Math.max(hires, 1)),
  };
}

/** Hiring funnel summary across ALL jobs combined (same shape as buildFunnel but exported
 * with explicit naming for the analytics dashboard). */
export function allJobsFunnelSummary(): FunnelStagePoint[] {
  return buildFunnel();
}
