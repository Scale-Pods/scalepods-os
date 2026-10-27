// ---------------------------------------------------------------------------
// Receivables Recovery — mock data
//
// Two core tables mirror the production schema:
//   party_ledger        -> PartyLedgerRow
//   recovery_outreach   -> RecoveryOutreachRow
// Everything is derived deterministically from the seed tables below so the
// funnel stays internally consistent (replied <= threads <= outreach sent).
// ---------------------------------------------------------------------------

export interface PartyLedgerRow {
  id: number;
  party_name: string;
  opening_balance: number;
  particulars: string;
  voucher_no: string;
  bill_no: string;
  debit: number;
  credit: number;
  running_balance: number;
  Final_Amount: number;
  narration: string;
  created_at: string;
  email: string;
  phone: string;
  closed: boolean;
  gstin: string;
  url: string;
  Payment_Date: string | null;
}

export interface ConversationEntry {
  role: "assistant" | "user";
  stage?: string;
  channel?: "email" | "whatsapp" | "call";
  message: string;
  timestamp?: string;
}

export type OutreachStatus =
  | "Queued"
  | "Active"
  | "Awaiting Reply"
  | "Replied"
  | "Closed"
  | "Disputed"
  | "Founder Review";

export interface RecoveryOutreachRow {
  id: number;
  // identity
  party_name: string;
  email: string;
  phone: string;
  bill_no: string;
  voucher_no: string;
  gstin: string;
  transaction_date: string;
  cycle_started_date: string;
  // amount / status
  total_outstanding: number;
  overdue_amount: number;
  current_stage: string;
  next_action: string;
  next_action_date: string | null;
  status: OutreachStatus;
  closed: boolean;
  dispute: boolean;
  founder_review: boolean;
  // email steps
  email_1_date: string | null;
  email_1_content: string | null;
  email_1_sent_at: string | null;
  email_2_date: string | null;
  email_2_content: string | null;
  email_2_sent_at: string | null;
  email_3_date: string | null;
  email_3_content: string | null;
  email_3_sent_at: string | null;
  // whatsapp steps
  wa_1_date: string | null;
  wa_1_content: string | null;
  wa_1_sent_at: string | null;
  wa_2_date: string | null;
  wa_2_content: string | null;
  wa_2_sent_at: string | null;
  wa_3_date: string | null;
  wa_3_content: string | null;
  wa_3_sent_at: string | null;
  // call steps
  call_1_date: string | null;
  call_1_content: string | null;
  call_1_sent_at: string | null;
  call_2_date: string | null;
  call_2_content: string | null;
  call_2_sent_at: string | null;
  call1_url: string | null;
  call2_url: string | null;
  // conversations
  email_replied: boolean;
  email_conversation: ConversationEntry[];
  wa_replied: boolean;
  wa_conversation: ConversationEntry[];
  call_replied: boolean;
  call_conversation: ConversationEntry[];
  // AI analysis
  sentiment: "Positive" | "Neutral" | "Negative" | null;
  sentiment_score: number | null;
  intent: string | null;
  summary: string | null;
}

// ---------------------------------------------------------------------------
// Seed — parties
// ---------------------------------------------------------------------------

const NOW = new Date("2026-10-27T10:30:00+05:30");
const DAY = 86400000;

interface PartySeed {
  name: string;
  gstin: string;
  email: string;
  phone: string;
  opening: number;
}

const PARTIES: PartySeed[] = [
  { name: "Sharma Textiles Pvt Ltd", gstin: "27AABCS4412F1Z5", email: "accounts@sharmatextiles.example", phone: "+91 98200 41127", opening: 142000 },
  { name: "Gupta Steel Traders", gstin: "07AAHFG9087K1ZB", email: "billing@guptasteel.example", phone: "+91 98110 62940", opening: 0 },
  { name: "Mehra Pharma Distributors", gstin: "03AAECM5521D1Z9", email: "finance@mehrapharma.example", phone: "+91 98720 30518", opening: 87500 },
  { name: "Kapoor Electronics", gstin: "06AACCK1873L1ZP", email: "kapoor.elec@mail.example", phone: "+91 99150 77246", opening: 0 },
  { name: "Nair Agro Exports", gstin: "32AAJFN6630G1ZQ", email: "accounts@nairagro.example", phone: "+91 94470 18853", opening: 215000 },
  { name: "Iyer Auto Components", gstin: "33AABCI2209H1Z3", email: "ap@iyerauto.example", phone: "+91 98400 52371", opening: 0 },
  { name: "Bose Packaging Co", gstin: "19AAFCB7745M1ZR", email: "bose.pack@mail.example", phone: "+91 98300 29064", opening: 61200 },
  { name: "Reddy Constructions", gstin: "36AAGFR3318J1ZD", email: "accounts@reddycons.example", phone: "+91 99490 85512", opening: 0 },
  { name: "Malhotra Foods LLP", gstin: "09AAKFM4096P1Z8", email: "malhotrafoods@mail.example", phone: "+91 98100 73385", opening: 128400 },
  { name: "Jain Chemicals", gstin: "24AABCJ8852E1ZK", email: "payables@jainchem.example", phone: "+91 98250 64017", opening: 0 },
  { name: "Khan Leather Works", gstin: "09AAHPK2731R1ZW", email: "khanleather@mail.example", phone: "+91 97176 40829", opening: 53800 },
  { name: "Patel Plastics Industries", gstin: "24AADCP9164B1Z2", email: "accounts@patelplastics.example", phone: "+91 98790 31196", opening: 0 },
];

/**
 * One line per bill: [party index, bill no, invoice age (days), amount (INR),
 * plan]. `plan` is one of:
 *   "paid" — settled before outreach ever started
 *   "n"    — not yet due, no outreach
 *   "<step>|<reply>|<flags>" — outreach plan. `step` = cadence steps already
 *     sent (0-8), `reply` = e|w|c (which channel the party replied on),
 *     `flags` = c (closed/recovered) d (dispute) f (founder review)
 */
const BILL_SEED: [number, string, number, number, string][] = [
  [0, "SH/24-25/0412", 190, 184500, "paid"],
  [0, "SH/25-26/0087", 74, 262300, "8||f"],
  [0, "SH/25-26/0131", 48, 118750, "4|"],
  [1, "GS/25-26/0203", 96, 341800, "3|e|c"],
  [1, "GS/25-26/0244", 61, 207400, "6|"],
  [1, "GS/25-26/0290", 12, 156200, "n"],
  [2, "MP/25-26/0318", 118, 94600, "paid"],
  [2, "MP/25-26/0355", 67, 128900, "5|w|d"],
  [2, "MP/25-26/0371", 41, 76300, "2|"],
  [3, "KE/25-26/0066", 83, 58450, "7|w|c"],
  [3, "KE/25-26/0102", 29, 91200, "1|"],
  [4, "NA/25-26/0149", 102, 412600, "8||f"],
  [4, "NA/25-26/0177", 58, 268000, "4|w|c"],
  [4, "NA/25-26/0215", 9, 187500, "n"],
  [5, "IA/25-26/0521", 72, 233400, "5|c|c"],
  [5, "IA/25-26/0548", 38, 109800, "0|"],
  [6, "BP/25-26/0094", 144, 46200, "paid"],
  [6, "BP/25-26/0128", 54, 83750, "6|e"],
  [6, "BP/25-26/0160", 33, 51900, "2|e"],
  [7, "RC/25-26/0412", 109, 524000, "7|"],
  [7, "RC/25-26/0438", 64, 318600, "3|w"],
  [7, "RC/25-26/0467", 15, 142300, "n"],
  [8, "MF/25-26/0271", 88, 72450, "4|"],
  [8, "MF/25-26/0309", 52, 64800, "3|"],
  [8, "MF/25-26/0342", 26, 38100, "1|"],
  [9, "JC/25-26/0185", 131, 156400, "paid"],
  [9, "JC/25-26/0226", 69, 219750, "5|"],
  [9, "JC/25-26/0263", 44, 133900, "3|"],
  [10, "KL/25-26/0057", 156, 28600, "paid"],
  [10, "KL/25-26/0088", 77, 61300, "0|"],
  [10, "KL/25-26/0119", 36, 47750, "1|"],
  [11, "PP/25-26/0334", 93, 176200, "2|"],
  [11, "PP/25-26/0381", 57, 98400, "6|e"],
  [11, "PP/25-26/0403", 21, 124650, "paid"],
];

// Cadence: day offset (from cycle start) of each step, in send order.
const STEPS = [
  { key: "email_1", label: "Email 1", ch: "email", day: 0 },
  { key: "wa_1", label: "WhatsApp 1", ch: "whatsapp", day: 2 },
  { key: "email_2", label: "Email 2", ch: "email", day: 5 },
  { key: "wa_2", label: "WhatsApp 2", ch: "whatsapp", day: 7 },
  { key: "call_1", label: "Call 1", ch: "call", day: 9 },
  { key: "email_3", label: "Email 3", ch: "email", day: 12 },
  { key: "wa_3", label: "WhatsApp 3", ch: "whatsapp", day: 14 },
  { key: "call_2", label: "Call 2", ch: "call", day: 16 },
] as const;

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const iso = (d: Date) => d.toISOString();

// ---------------------------------------------------------------------------
// Party ledger
// ---------------------------------------------------------------------------

function buildLedger(): PartyLedgerRow[] {
  const running: Record<number, number> = {};
  let id = 0;
  return BILL_SEED.map(([p, bill, age, amount, plan]) => {
    id += 1;
    const party = PARTIES[p];
    const closed = plan === "paid" || plan.split("|")[2]?.includes("c") === true;
    const created = new Date(NOW.getTime() - age * DAY);
    const paymentDate = closed
      ? iso(new Date(NOW.getTime() - (plan === "paid" ? Math.max(3, age - 38) : 2 + (id % 5)) * DAY))
      : null;
    const credit = closed ? amount : 0;
    running[p] = (running[p] ?? party.opening) + amount - credit;
    return {
      id,
      party_name: party.name,
      opening_balance: party.opening,
      particulars: "Sales Invoice",
      voucher_no: `VCH-${2600 + id}`,
      bill_no: bill,
      debit: amount,
      credit,
      running_balance: running[p],
      Final_Amount: amount - credit,
      narration: `Goods supplied against PO ${4100 + id * 7}`,
      created_at: iso(created),
      email: party.email,
      phone: party.phone,
      closed,
      gstin: party.gstin,
      url: `https://billing.scalepods.example/invoices/${bill.replace(/\//g, "-")}.pdf`,
      Payment_Date: paymentDate,
    };
  });
}

export const MOCK_PARTY_LEDGER: PartyLedgerRow[] = buildLedger();

// ---------------------------------------------------------------------------
// Outreach + conversations
// ---------------------------------------------------------------------------

function stepMessage(ch: string, n: number, party: string, bill: string, amount: number, days: number) {
  if (ch === "email") {
    const body = [
      `Dear ${party} team, this is a gentle reminder that invoice ${bill} for ${inr(amount)} is now ${days} days past due. Could you please confirm the expected payment date? Invoice copy attached.`,
      `Following up on invoice ${bill} (${inr(amount)}), now ${days} days overdue. Kindly share the payment schedule or let us know if anything is blocking release of funds.`,
      `Final reminder: invoice ${bill} for ${inr(amount)} is ${days} days overdue. Please settle within 5 business days to avoid a hold on further dispatches.`,
    ];
    return body[n - 1];
  }
  if (ch === "whatsapp") {
    const body = [
      `Hi, a quick reminder from accounts — invoice ${bill} (${inr(amount)}) is pending. Could you share when we can expect the payment? 🙏`,
      `Hello again — invoice ${bill} is now ${days} days overdue. Happy to resend the invoice copy or help with anything needed to process it.`,
      `Final nudge on ${bill} (${inr(amount)}). Please confirm payment by this week so we can keep your account in good standing.`,
    ];
    return body[n - 1];
  }
  const body = [
    `Hello, I'm calling from the accounts team about invoice ${bill} for ${inr(amount)}, ${days} days overdue. Is there a date by which payment can be released? If there's a query on the invoice, I can note it and have it resolved today.`,
    `This is a follow-up call regarding invoice ${bill}, ${inr(amount)} outstanding. We've sent emails and messages — I'd like to agree a firm payment date on this call, and escalate internally if there's a dispute.`,
  ];
  return body[n - 1];
}

const REPLIES = {
  e: [
    "Thanks for the reminder. Payment will be processed in the next batch — expect it by Friday.",
    "Please resend the invoice copy and the PO reference. Our accounts team can't find it.",
    "Finance is on leave this week, we will release the payment on the 3rd.",
  ],
  w: [
    "Sir payment will be done tomorrow, sorry for the delay.",
    "Quality of last lot was not as agreed. We are holding this until it is resolved.",
    "Transferred just now, UTR will be shared in a few minutes.",
    "Can we split this into two payments? Half now, half after Diwali.",
  ],
  c: [
    "Yes, I'm aware of it. We'll clear it by Thursday — please send the bank details again on WhatsApp.",
  ],
} as const;

const INTENTS: Record<string, { intent: string; sentiment: "Positive" | "Neutral" | "Negative"; score: number; summary: string }> = {
  closed: { intent: "Payment confirmed", sentiment: "Positive", score: 0.82, summary: "Party confirmed payment and shared the transaction details. Bill marked as recovered." },
  dispute: { intent: "Quality dispute", sentiment: "Negative", score: -0.58, summary: "Party is withholding payment citing quality issues with the last lot. Needs a human to resolve before further reminders." },
  reply: { intent: "Promised to pay", sentiment: "Neutral", score: 0.21, summary: "Party acknowledged the dues and promised payment within a few days; follow up if no payment arrives." },
  silent: { intent: "No response", sentiment: "Neutral", score: 0, summary: "No reply on any channel so far; cadence continues." },
  founder: { intent: "No response", sentiment: "Negative", score: -0.34, summary: "Full cadence exhausted with no reply. Flagged for founder review before any further action." },
};

function buildOutreach(): RecoveryOutreachRow[] {
  const ledger = MOCK_PARTY_LEDGER;
  const rows: RecoveryOutreachRow[] = [];
  const replyIdx = { e: 0, w: 0, c: 0 };

  BILL_SEED.forEach(([p, , age, amount, plan], i) => {
    if (plan === "paid" || plan === "n") return;
    const [stepStr, reply, flags = ""] = plan.split("|");
    const step = Number(stepStr);
    const party = PARTIES[p];
    const led = ledger[i];
    const closed = flags.includes("c");
    const dispute = flags.includes("d");
    const founder = flags.includes("f");

    const lastDay = step > 0 ? STEPS[step - 1].day : 0;
    const cycleStart = new Date(NOW.getTime() - (step > 0 ? lastDay + 1 : 0) * DAY);
    const stepDate = (k: number) => new Date(cycleStart.getTime() + STEPS[k].day * DAY);
    const overdueDays = Math.max(1, age - 30);

    const row = {
      id: rows.length + 1,
      party_name: party.name,
      email: party.email,
      phone: party.phone,
      bill_no: led.bill_no,
      voucher_no: led.voucher_no,
      gstin: party.gstin,
      transaction_date: led.created_at,
      cycle_started_date: step > 0 ? iso(cycleStart) : iso(NOW),
      total_outstanding: led.Final_Amount === 0 ? 0 : amount,
      overdue_amount: closed ? 0 : amount,
      closed,
      dispute,
      founder_review: founder,
      email_replied: reply === "e",
      wa_replied: reply === "w",
      call_replied: reply === "c",
      email_conversation: [] as ConversationEntry[],
      wa_conversation: [] as ConversationEntry[],
      call_conversation: [] as ConversationEntry[],
    } as Partial<RecoveryOutreachRow> & Record<string, unknown>;

    // per-step fields
    STEPS.forEach((s, k) => {
      const n = Number(s.key.split("_")[1]);
      const sent = k < step;
      const content = sent ? stepMessage(s.ch, n, party.name, led.bill_no, amount, overdueDays) : null;
      row[`${s.key}_date`] = sent ? iso(stepDate(k)) : null;
      row[`${s.key}_content`] = content;
      row[`${s.key}_sent_at`] = sent ? iso(new Date(stepDate(k).getTime() + 3600000 * 3)) : null;
      if (sent && content) {
        const entry: ConversationEntry = {
          role: "assistant",
          stage: s.label,
          channel: s.ch as ConversationEntry["channel"],
          message: content,
          timestamp: row[`${s.key}_sent_at`] as string,
        };
        if (s.ch === "email") (row.email_conversation as ConversationEntry[]).push(entry);
        else if (s.ch === "whatsapp") (row.wa_conversation as ConversationEntry[]).push(entry);
        else (row.call_conversation as ConversationEntry[]).push(entry);
      }
    });
    row.call1_url = step >= 5 ? `https://recordings.scalepods.example/${led.bill_no.replace(/\//g, "-")}-call1.mp3` : null;
    row.call2_url = step >= 8 ? `https://recordings.scalepods.example/${led.bill_no.replace(/\//g, "-")}-call2.mp3` : null;

    // inbound replies
    if (reply) {
      const key = reply as "e" | "w" | "c";
      const pool = REPLIES[key];
      let text = pool[replyIdx[key]++ % pool.length];
      if (dispute) text = REPLIES.w[1];
      if (closed && key === "w") text = REPLIES.w[2];
      const channel = key === "e" ? "email" : key === "w" ? "whatsapp" : "call";
      const convo = (key === "e" ? row.email_conversation : key === "w" ? row.wa_conversation : row.call_conversation) as ConversationEntry[];
      const lastIdx = convo.length;
      const last = convo[lastIdx - 1];
      convo.push({
        role: "user",
        stage: last?.stage,
        channel,
        message: text,
        timestamp: iso(new Date(new Date(last?.timestamp ?? NOW.toISOString()).getTime() + 3600000 * 5)),
      });
      if (closed) {
        convo.push({
          role: "assistant",
          stage: "Confirmation",
          channel,
          message: "Thank you — we've noted this and will mark the bill as closed once the payment reflects.",
          timestamp: iso(new Date(NOW.getTime() - 3600000 * 2)),
        });
      }
    }

    // AI analysis
    const a = closed ? INTENTS.closed : dispute ? INTENTS.dispute : reply ? INTENTS.reply : founder ? INTENTS.founder : INTENTS.silent;
    row.sentiment = step === 0 ? null : a.sentiment;
    row.sentiment_score = step === 0 ? null : a.score;
    row.intent = step === 0 ? null : a.intent;
    row.summary = step === 0 ? null : a.summary;

    // status / next action
    row.current_stage = closed ? "Recovered" : step === 0 ? "Not started" : STEPS[step - 1].label;
    row.next_action = closed ? "None" : founder ? "Founder review" : dispute ? "Human follow-up" : step >= 8 ? "Founder review" : STEPS[step].label;
    row.next_action_date = closed || founder || dispute || step >= 8 ? null : iso(new Date(NOW.getTime() + (step === 0 ? 1 : Math.max(1, STEPS[step].day - lastDay)) * DAY));
    row.status = closed ? "Closed" : founder ? "Founder Review" : dispute ? "Disputed" : reply ? "Replied" : step === 0 ? "Queued" : step <= 2 ? "Active" : "Awaiting Reply";

    rows.push(row as unknown as RecoveryOutreachRow);
  });
  return rows;
}

export const MOCK_OUTREACH: RecoveryOutreachRow[] = buildOutreach();

// ---------------------------------------------------------------------------
// Derived stats
// ---------------------------------------------------------------------------

const sentAny = (r: RecoveryOutreachRow) => r.email_1_sent_at !== null || r.wa_1_sent_at !== null;
const anyReply = (r: RecoveryOutreachRow) => r.email_replied || r.wa_replied || r.call_replied;
// A "thread" is a party whose conversation is worth reading: they replied, or
// the cadence has already reached the first call.
const hasThread = (r: RecoveryOutreachRow) => anyReply(r) || r.call_1_sent_at !== null;

export function recoveryStats() {
  const rows = MOCK_OUTREACH;
  const ledger = MOCK_PARTY_LEDGER;
  const outstanding = ledger.filter((l) => !l.closed);
  const outstandingAmt = outstanding.reduce((s, l) => s + l.Final_Amount, 0);
  const recoveredAmt = ledger.filter((l) => l.closed && l.Payment_Date).reduce((s, l) => s + l.credit, 0);
  const sent = rows.filter(sentAny);
  const threads = rows.filter(hasThread);
  const replied = rows.filter(anyReply);
  const closedViaOutreach = rows.filter((r) => r.closed);
  return {
    totalBills: ledger.length,
    parties: new Set(ledger.map((l) => l.party_name)).size,
    openBills: outstanding.length,
    outstandingAmt,
    recoveredAmt,
    outreachRows: rows.length,
    sent: sent.length,
    threads: threads.length,
    replied: replied.length,
    closed: closedViaOutreach.length,
    disputes: rows.filter((r) => r.dispute).length,
    founderReview: rows.filter((r) => r.founder_review).length,
    recoveryRate: sent.length ? Math.round((closedViaOutreach.length / sent.length) * 1000) / 10 : 0,
    replyRate: sent.length ? Math.round((replied.length / sent.length) * 1000) / 10 : 0,
  };
}

export function channelStats(channel: "email" | "whatsapp" | "call") {
  const rows = MOCK_OUTREACH;
  const first = (r: RecoveryOutreachRow) =>
    channel === "email" ? r.email_1_sent_at : channel === "whatsapp" ? r.wa_1_sent_at : r.call_1_sent_at;
  const replied = (r: RecoveryOutreachRow) =>
    channel === "email" ? r.email_replied : channel === "whatsapp" ? r.wa_replied : r.call_replied;
  const reached = rows.filter((r) => first(r) !== null);
  const threads = reached.filter((r) => {
    const c = channel === "email" ? r.email_conversation : channel === "whatsapp" ? r.wa_conversation : r.call_conversation;
    return c.length > 1 || replied(r);
  });
  const repliedRows = reached.filter(replied);
  return {
    reached,
    threads,
    repliedRows,
    closed: repliedRows.filter((r) => r.closed),
    messagesSent: reached.reduce((s, r) => {
      const keys =
        channel === "email" ? [r.email_1_sent_at, r.email_2_sent_at, r.email_3_sent_at]
        : channel === "whatsapp" ? [r.wa_1_sent_at, r.wa_2_sent_at, r.wa_3_sent_at]
        : [r.call_1_sent_at, r.call_2_sent_at];
      return s + keys.filter(Boolean).length;
    }, 0),
  };
}
