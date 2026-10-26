# Build prompt: ScalePods OS — MVP

> Paste everything below the line into Claude Code (run it from an empty repo folder) or into an Antigravity agent. It is written to be followed step by step, milestone by milestone.

---

## 1. What you are building

You are building the MVP of **ScalePods OS**, a multi-tenant B2B SaaS platform. ScalePods (scalepods.co) is an AI automation company that has spent 15 months building custom AI systems for SMBs across India, the UAE and the USA. We are now packaging those systems into one product.

**The core idea:** one login, one workspace, many AI-powered apps. It works like Zoho One: an **app switcher** moves between apps that share the same contacts, users, billing and data. The difference is that every app is built around **AI agents that do the work** (answer leads, screen CVs, draft content, chase invoices), not forms that people fill in.

Apps are grouped into **Pods**:

| Pod | Apps in the MVP | MVP status |
|---|---|---|
| **Home** | Master Dashboard (all apps combined), Executive Board (founder view) | Build fully |
| **HR Pod** | Recruit (jobs, candidates, AI screening and ranking, AI outreach, interview booking, offer letters); Staffing mode for recruitment agencies (client accounts, requisitions, submissions) | Build fully |
| **Sales Pod** | Leads & CRM (contacts, companies, deals pipeline); Outreach (multi-step email + WhatsApp sequences); Lead Response agent (instant AI reply to inbound leads); Rep Activity (calls, emails and meetings per rep) | Build fully |
| **Marketing Pod** | Content OS (AI content drafts, maker-checker approval, content calendar) | Build basic version |
| **Operations Pod** | Customer Care (unified inbox for WhatsApp, email and web chat, with AI-suggested replies); Receivables Recovery (invoices, overdue tracking, AI reminder sequences) | Build basic version |
| **Custom Studio** | Placeholder app that shows how a client-specific module plugs in (e.g. "Inventory Intel") | Scaffold only |

The attached reference screenshot shows an internal dashboard we built for one client. Use it only for the *feel*: a dark-first UI, a sidebar with an app switcher, KPI cards and drill-down tiles. Do **not** copy it exactly.

## 2. Non-negotiable architecture rules

1. **Multi-tenant from day one.** Every business table carries `org_id`. Enforce isolation with Postgres Row-Level Security (RLS). No query may ever return another org's data.
2. **Apps are modules, registered through a manifest.** Adding an app must never require editing the shell. Each app lives in `/apps/<app-id>/` and exports a manifest:
   ```ts
   export const manifest: AppManifest = {
     id: "hr-recruit",
     name: "Recruit",
     pod: "hr",                    // home | sales | hr | marketing | operations | custom
     description: "Jobs, candidates, AI screening",
     icon: "Users",                // lucide-react icon name
     basePath: "/hr/recruit",
     nav: [{ label: "Jobs", path: "/jobs" }, { label: "Candidates", path: "/candidates" }],
     requiredPlan: "basic",        // free | basic | growth | enterprise
     permissions: ["hr.read", "hr.write"],
     dashboardWidgets: ["hr.open-roles", "hr.candidates-in-pipeline"], // KPI tiles shown on the Master Dashboard
     featureFlags: [],
   };
   ```
   The shell reads every manifest from a central registry. That registry builds the app switcher, sidebar, ⌘K command palette, route guards, plan gating and Master Dashboard tiles.
3. **One shared data core.** Contacts, companies, users, conversations, activities, files, tags and notes are **shared across apps**. A candidate in HR and a lead in Sales are both `contacts`, each with a role or type. Apps add their own tables that reference the core.
4. **AI is provider-agnostic.** All LLM calls go through one internal service (`/lib/ai`) that supports Anthropic Claude, OpenAI and Google Gemini, and routes per task (cheap model for classification, stronger model for drafting). Every call logs model, tokens, cost, org and app into `usage_events`.
5. **Agents run in the background, with a human in the loop.** Long-running or scheduled AI work (screening 200 CVs, sending a sequence) runs as background jobs, never inside a request. Anything that goes out to a customer (an email, a WhatsApp message, an offer letter) runs in one of two modes: auto-send, or "draft for approval" (maker-checker). Each org chooses the mode per agent.
6. **Integrations sit behind adapters.** Define interfaces such as `MessagingChannel`, `TelephonyProvider`, `CRMSync`, `CalendarProvider` and `ATSSource`. Ship working adapters for the providers listed in section 3, and mocks for everything else. Credentials are stored encrypted per org.
7. **Everything is auditable.** Log every agent action and every user change to `audit_logs`: who or what did it, when, before and after.

## 3. Tech stack (use exactly this unless blocked; if blocked, explain why before switching)

- **Frontend:** Next.js 15 (App Router) + TypeScript (strict), Tailwind CSS, shadcn/ui, lucide-react icons, TanStack Table, Recharts for charts, `cmdk` for the ⌘K palette. Dark and light themes, dark by default.
- **Backend:** Next.js server actions and route handlers; Supabase (Postgres, Auth, RLS, Storage, Realtime); Drizzle ORM with SQL migrations committed to the repo.
- **Background jobs and agents:** Trigger.dev (or Inngest) for queued and scheduled jobs. Expose webhooks so existing n8n workflows can trigger, and be triggered by, ScalePods OS events.
- **AI:** Vercel AI SDK with Anthropic, OpenAI and Google providers behind `/lib/ai`. Use structured outputs (zod schemas) for every extraction and scoring task.
- **Channels (working adapters in the MVP):**
  - Email: SMTP/Resend for sending, plus Gmail OAuth for reading replies.
  - WhatsApp: Meta WhatsApp Cloud API (templates and session messages; inbound webhook).
  - Calendar: Google Calendar for booking interviews and meetings.
- **Channels (interface plus mock adapter only):** AI voice calls (Vapi/Retell/Twilio), LinkedIn, HubSpot/Zoho/Salesforce CRM sync, ATS imports.
- **Billing:** Stripe for USD plans and Razorpay for INR plans, behind one `BillingProvider` interface. Plans are Free, Basic (US$149), Growth (US$349) and Enterprise (US$1,099+), per account per month.
- **Auth:** Supabase Auth with email magic link and Google OAuth. Roles per org: Owner, Admin, Manager, Member, Viewer. SSO is an Enterprise-only flag and is stubbed.
- **Hosting:** Vercel (app) + Supabase (data). Keep data-residency region configurable, with India/UAE/US options.
- **Quality:** ESLint + Prettier, Vitest for unit tests, Playwright for end-to-end smoke tests, GitHub Actions CI (lint, typecheck, test, build).

## 4. The shell (build this first)

- **Sidebar with app switcher.**
  - The top of the sidebar shows the current app (icon, name, subtitle). Clicking it opens a switcher listing every app the org has installed, grouped by Pod.
  - Apps the plan doesn't include show a lock badge and an "Upgrade" call to action.
  - Under the switcher sits the current app's own nav.
  - At the bottom: theme toggle, user card, sign out, and "Powered by ScalePods".
- **Top bar:** breadcrumbs, a global ⌘K search (apps, contacts, deals, candidates, invoices and actions such as "New job"), a date-range picker that every dashboard respects, a notifications bell (agent approvals waiting, replies received) and an org switcher for users in more than one workspace.
- **Master Dashboard:**
  - A KPI card row built from the `dashboardWidgets` of every installed app.
  - An "AI agents today" strip: messages sent, replies received, CVs screened, items awaiting approval.
  - A tile per app that drills into it.
  - Every number is a real query, not hard-coded.
- **Executive Board:** a founder view showing pipeline value, hires in progress, response time to new leads, receivables overdue and AI usage cost this month.
- **App Marketplace (Settings → Apps):** install or uninstall apps per org, gated by plan.
- **Settings:** organisation profile, members and roles, plan and billing, integrations (connect WhatsApp, Gmail and Google Calendar; others show "coming soon"), AI settings (default model per task, auto-send vs approval per agent, monthly AI budget cap), audit log viewer and API keys.
- **Onboarding wizard (freemium):** sign up → create workspace → choose industry template (Staffing agency, Real estate brokerage, Property/home services, General SMB) → pick the first free app → connect one channel → see seeded sample data.
- **Plan gating and usage meters:**
  - Free tier limits: 1 app, 1 seat, 100 AI actions/month, 50 outbound messages/month.
  - Enforce limits on the server.
  - Show a usage bar in Settings, plus in-app upgrade prompts with a value message (e.g. "Your Lead Response agent answered 142 leads this month").

## 5. MVP app specs

### HR Pod: Recruit (including Staffing mode)
- **Jobs:** create a job by pasting a JD or uploading a file; AI extracts title, skills, experience, location and salary band into structured fields.
- **Candidates:**
  - Bulk-upload CVs (PDF/DOCX) or add them by email forward.
  - AI parses each CV into a structured profile, de-duplicates against existing contacts, and scores fit against the job (0–100, with a short reason per criterion).
  - Kanban pipeline: Sourced → Screened → Shortlisted → Interview → Offer → Hired/Rejected.
- **AI outreach:** shortlisted candidates get a personalised email/WhatsApp invite with a booking link (Google Calendar slots). Replies land in the shared inbox and move the candidate's stage.
- **AI interview prep:** generate role-specific and candidate-specific interview questions, and a scorecard template.
- **Offer letters:** generate from a template plus approved compensation; export to PDF; track sent, viewed and accepted.
- **Staffing mode** (a toggle in settings; on by default for the Staffing template):
  - Adds **Client accounts** and **Requisitions**, with a job belonging to a client requisition.
  - Adds **Submissions**: send a shortlisted candidate's anonymised profile to the client contact.
  - Client-side follow-ups use the Sales Pod's Outreach sequences.
- **HR KPIs for dashboards:** open roles, candidates in pipeline, average fit score, time-to-shortlist, interviews this week.

### Sales Pod
- **Leads & CRM:** contacts, companies, deals with a customisable pipeline, activities timeline, tags, notes, CSV import, and duplicate detection.
- **Lead Response agent:**
  - Inbound leads arrive by web-form webhook, WhatsApp or email.
  - The agent replies within 60 seconds in the lead's channel and language, asks 2–3 qualification questions, scores the lead, books a meeting when qualified, and hands off to a human on request or on low confidence.
  - Every response is logged with its response time.
- **Outreach sequences:**
  - Multi-step email + WhatsApp sequences with delays, conditions ("if no reply") and AI personalisation per contact.
  - Each sequence has an auto-send or approval mode.
  - Unsubscribe and opt-out handling is required.
- **Rep Activity:** per-rep counts of emails, WhatsApp messages, calls (logged manually in the MVP) and meetings; response-time leaderboard.
- **Sales KPIs:** new leads, median first-response time, qualified leads, meetings booked, pipeline value.

### Marketing Pod: Content OS (basic)
- **Brand profile:** website URL, tone, audience and pillars.
- **AI drafts:** generate post drafts for LinkedIn, Instagram and blog.
- **Approval:** maker-checker workflow (Draft → Review → Approved → Scheduled).
- **Calendar:** month view of scheduled content.
- **Publishing:** stub the auto-posting behind a `SocialPublisher` interface. Show "Content awaiting review" on the Master Dashboard.

### Operations Pod (basic)
- **Customer Care:**
  - Unified inbox (WhatsApp + email + an embeddable web-chat widget), with conversation assignment, status, and AI-suggested replies.
  - An AI auto-reply agent using a knowledge base (upload FAQs/docs → embeddings in pgvector).
  - Sentiment flag that surfaces "negative review/complaint intercepted".
- **Receivables Recovery:**
  - Import invoices by CSV or form; flag overdue invoices.
  - AI reminder sequences escalate in tone, run on email + WhatsApp, and are approval-gated.
  - Dashboard shows outstanding amount, overdue count and amount collected.

### Custom Studio (scaffold)
- An example custom app ("Inventory Intel": SKUs, stock levels, low-stock alerts) built purely through the manifest system. It proves a client-specific module can be added without touching the shell.

## 6. Data model (minimum; extend as needed, RLS on every table)

- **Core:**
  - `organizations`, `members` (user_id, org_id, role), `subscriptions`, `app_installs`
  - `contacts` (type: lead / candidate / customer / client_contact), `companies`, `activities`, `notes`, `tags`, `files`
  - `conversations`, `messages` (channel, direction, status, ai_generated, approved_by)
- **Agents and usage:** `agents` (type, config, mode), `agent_runs`, `approvals`, `usage_events`, `audit_logs`, `integrations` (encrypted credentials), `webhooks`
- **HR:** `jobs`, `applications` (contact × job, stage, fit_score, fit_reasons JSON), `interviews`, `offers`, `client_accounts`, `requisitions`, `submissions`
- **Sales:** `pipelines`, `deals`, `sequences`, `sequence_steps`, `sequence_enrollments`, `lead_scores`
- **Marketing:** `brand_profiles`, `content_items`, `content_schedule`
- **Operations:** `kb_documents`, `kb_chunks` (pgvector), `tickets`, `invoices`, `payment_reminders`
- **Custom:** `inventory_items`

Money is stored as integer minor units plus a currency code (INR/USD/AED). Dates are UTC, displayed in the org's timezone.

## 7. Seed data and demo

Create two demo workspaces with realistic fake data, generated by a seed script:
1. **"Demo Staffing Co"** (India): staffing template, with HR and Sales installed, 5 clients, 12 requisitions, 150 candidates and 2 active sequences.
2. **"Demo Realty"** (Dubai): real-estate template, with Sales, Customer Care and Content OS installed, 300 leads, a deal pipeline and 40 conversations.

Both must look alive on first login. Every dashboard tile shows real numbers from the seeded rows.

## 8. Milestones (stop after each, summarise, and wait for my "go")

1. **Foundation:** repo, CI, Supabase schema, RLS, auth, orgs and roles, app registry, shell (sidebar app switcher, top bar, ⌘K, theme), empty Master Dashboard.
2. **HR Pod:** Recruit + Staffing mode, CV parsing + scoring, pipeline, outreach + booking, offer letters.
3. **Sales Pod:** CRM, Lead Response agent, sequences, Rep Activity.
4. **Shared inbox + channels:** WhatsApp Cloud API, Gmail and Google Calendar adapters; approvals queue; notifications.
5. **Marketing + Operations basics:** Content OS, Customer Care with knowledge base, Receivables Recovery.
6. **Freemium and billing:** plans, gating, usage metering, Stripe/Razorpay, onboarding wizard, App Marketplace.
7. **Custom Studio scaffold, seed data, polish:** empty states, loading skeletons, error states, mobile-responsive layouts, accessibility pass, Playwright smoke tests for the main flows.

## 9. Definition of done for the MVP

- **Signup to value:** a new user can sign up, pick the Staffing template, upload 20 CVs, see them scored and ranked against a job within 2 minutes, and send AI-drafted invites after approving them.
- **Lead response:** an inbound WhatsApp lead gets an AI reply in under 60 seconds, appears in the CRM, and shows on the Master Dashboard.
- **Isolation:** switching apps keeps the same contact data, and switching orgs never leaks data (an RLS test proves it).
- **Plan gating:** the Free tier hits its limits and shows the upgrade prompt; an upgraded plan unlocks locked apps.
- **Audit:** every AI action is visible in the audit log with its cost.
- **Build:** `pnpm install && pnpm db:migrate && pnpm db:seed && pnpm dev` runs the whole thing locally, and CI is green.

## 10. How I want you to work

- **Plan first:** start by writing `docs/PLAN.md` (architecture diagram in Mermaid, folder structure, schema, and milestone checklist) and `docs/DECISIONS.md` (any deviation from this prompt, with its reason). Then build milestone 1.
- **Be honest about gaps:** never silently stub. If something is mocked, label it in the UI ("Demo adapter") and list it in `docs/GAPS.md`.
- **Configuration:** keep secrets out of the repo, and provide `.env.example` with every variable documented.
- **Prompts:** put every AI prompt in `/lib/ai/prompts/*.ts` as versioned templates with typed inputs and zod output schemas. Hard-coded prompt strings inside components are not allowed.
- **Code quality:** small, typed, testable functions; server-side validation with zod on every action; no `any`.
- **Progress reports:** at the end of each milestone, give me what was built, how to test it, screenshots or Playwright traces, and what's next.

## 11. Look and feel

- Dark theme by default, with a light toggle. Clean SaaS aesthetic in the style of Linear, Vercel or Notion: generous spacing, subtle borders, one accent colour.
- Brand colours: primary blue `#0066FF`, accent green `#00C48C`, neutrals for everything else.
- Font: Inter.
- KPI cards: label, big number, one-line context ("2 invoices overdue"), trend arrow.
- Every list: search, filters, saved views, bulk actions and an empty state that tells the user what to do next.
- The app switcher must feel instant: prefetch routes, and open with ⌘J.
