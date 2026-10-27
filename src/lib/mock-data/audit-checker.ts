/**
 * Deterministic mock data for the Audit Checker module.
 *
 * Reconstructed from the reference app: a document-reconciliation tool that
 * lines up purchase documents (Invoice, E-Way Bill, LR copy, GRN) and sales
 * documents (Sales Invoice vs internal Sheet, plus SO-vs-PO quick checks)
 * field by field. Every field is Match / Partial Match / Mismatch / Critical,
 * an overall score out of 100 is derived, and a reviewer Approves or Rejects.
 *
 * No Math.random / Date.now: everything derives from an index hash and a fixed
 * reference date so server and client render identically.
 */

export type AuditKind = "purchase" | "sales" | "quick";
export type FieldStatus = "Match" | "Partial Match" | "Mismatch" | "Critical";
export type AuditStatus = "Match" | "Partial Match" | "Mismatch" | "Critical";
export type Decision = "Pending" | "Approved" | "Rejected";
export type AccessRole = "Admin" | "developer" | "sales" | "purchase" | "both";

export const REFERENCE_NOW = Date.UTC(2026, 9, 27, 10, 0, 0); // 27 Oct 2026

export interface FieldResult {
  key: string;
  label: string;
  /** document name -> extracted value (null = not present on that document) */
  values: Record<string, string | null>;
  status: FieldStatus;
  note: string;
}

export interface AuditDocument {
  name: string;
  file: string;
  pages: number;
  sizeKb: number;
  uploadedAt: string;
  ocrConfidence: number;
}

export interface AuditEvent {
  at: string;
  actor: string;
  action: string;
}

export interface AuditRecord {
  id: string;
  kind: AuditKind;
  ref: string; // invoice number / order number
  party: string; // supplier or customer
  gstin: string;
  createdAt: string;
  amount: number;
  qty: number;
  qtyUnit: string;
  product: string;
  score: number;
  status: AuditStatus;
  fields: FieldResult[];
  documents: AuditDocument[];
  decision: Decision;
  decidedAt: string | null;
  reviewerId: string; // user who ran / owns it
  decidedById: string | null;
  comment: string;
  flagged: boolean;
  events: AuditEvent[];
}

export interface AuditUser {
  id: string;
  name: string;
  email: string;
  access: AccessRole;
  lastLogin: string | null;
  createdAt: string;
  active: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const h = (i: number, j: number) => {
  let x = Math.imul(i + 1, 2654435761) ^ Math.imul(j + 7, 40503);
  x = Math.imul(x ^ (x >>> 15), 2246822519);
  x = Math.imul(x ^ (x >>> 13), 3266489917);
  return (x ^ (x >>> 16)) >>> 0;
};
const pick = <T,>(arr: readonly T[], i: number, j: number): T => arr[h(i, j) % arr.length];
const iso = (ms: number) => new Date(ms).toISOString();
const HOUR = 3600e3;
const pad = (n: number, w = 2) => String(n).padStart(w, "0");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

const USER_SEED: [string, AccessRole, boolean][] = [
  ["Meera Iyer", "Admin", true],
  ["Rohan Deshmukh", "developer", true],
  ["Kavita Nair", "both", true],
  ["Imran Sheikh", "both", true],
  ["Priya Menon", "purchase", true],
  ["Arjun Patil", "purchase", true],
  ["Sunita Rao", "purchase", true],
  ["Vikram Chauhan", "sales", true],
  ["Neha Kulkarni", "sales", true],
  ["Farhan Qureshi", "sales", true],
  ["Deepa Joshi", "purchase", false],
  ["Rahul Bhatt", "sales", false],
];

export const AUDIT_USERS: AuditUser[] = USER_SEED.map(([name, access, active], i) => ({
  id: `usr-${pad(i + 1)}`,
  name,
  email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
  access,
  active,
  createdAt: iso(Date.UTC(2025, 5, 3, 9) + i * 19 * 24 * HOUR),
  lastLogin: active ? iso(REFERENCE_NOW - (h(i, 3) % 96) * HOUR - i * 2 * HOUR) : i === 10 ? iso(REFERENCE_NOW - 71 * 24 * HOUR) : null,
}));

export const ROLE_ROUTES: Record<AccessRole, string[]> = {
  Admin: ["Dashboard", "Purchase Audit", "Sales Audit", "Analytics", "History", "Users"],
  developer: ["Dashboard", "Purchase Audit", "Sales Audit", "Analytics", "History", "Users"],
  both: ["Dashboard", "Purchase Audit", "Sales Audit", "Analytics", "History"],
  sales: ["Dashboard", "Sales Audit", "History"],
  purchase: ["Dashboard", "Purchase Audit", "History"],
};

const userById = (id: string) => AUDIT_USERS.find((u) => u.id === id);
export const userName = (id: string | null) => (id ? userById(id)?.name ?? id : "—");

const usersFor = (kind: AuditKind) =>
  AUDIT_USERS.filter(
    (u) => u.active && (kind === "purchase" ? ["Admin", "both", "purchase"] : ["Admin", "both", "sales"]).includes(u.access),
  );
const approvers = AUDIT_USERS.filter((u) => u.active && ["Admin", "developer", "both"].includes(u.access));

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------

const SUPPLIERS = [
  "Jindal Coils & Sheets Pvt Ltd", "Hindustan Strips Ltd", "Bharat Alloy Rolling Mills", "Sundaram Steel Traders",
  "Kalyani Flat Products Pvt Ltd", "Maruti Metal Works", "Tata Ferro Distributors", "Shree Ganesh Ispat Ltd",
  "Apex Galvanising Co", "Vardhman Forge & Steel", "Om Sai Iron Corporation", "Navbharat Wires Pvt Ltd",
];
const CUSTOMERS = [
  "Raj Fabricators Pvt Ltd", "Sahyadri Engineering Works", "Patel Roofing Solutions", "Konkan Structurals Ltd",
  "Metro Pipes & Tubes", "Dhruv Infra Projects", "Kamat Steel Furniture", "Bluestar Prefab Pvt Ltd",
  "Anand Industrial Supplies", "Western Containers Co", "Prime Auto Components", "Gokul Sheet Metal",
];
const BROKERS = ["Rajesh Agarwal", "Sanjay Shah", "Mukesh Jain", "Direct", "Hitesh Doshi", "Nilesh Parekh"];
const PRODUCTS = [
  { name: "HR Coil 2.5mm", hsn: "72083990" },
  { name: "CR Sheet 1.2mm", hsn: "72091690" },
  { name: "MS Angle 50x50x5", hsn: "72166100" },
  { name: "GP Coil 0.5mm", hsn: "72104900" },
  { name: "MS Flat 40x6", hsn: "72149990" },
  { name: "Chequered Plate 5mm", hsn: "72254090" },
  { name: "TMT Bar Fe500D 12mm", hsn: "72142090" },
];
const PAYMENT_TERMS = ["30 Days", "45 Days", "60 Days", "90 Days", "120 Days", "150 Days"];
const BILL_TO = ["Mumbai - Masjid Bunder", "Mumbai - Carnac Bunder", "Mumbai - Head Office"];
const SHIP_TO = ["Taloja MIDC Warehouse", "Roshan Fabricators, Taloja", "MIDC Taloja Yard 2"];

const PASS_COMMENTS = [
  "All documents agree. Cleared for GRN posting.",
  "Clean reconciliation, no action needed.",
  "Verified against supplier master. Approved.",
];
const PARTIAL_COMMENTS = [
  "Formatting differences only (date / name abbreviations). Accepted.",
  "Minor OCR noise on LR copy. Looks fine on manual check.",
  "Weight within weighbridge tolerance. Approved with note.",
];
const FAIL_COMMENTS = [
  "Raised with supplier, waiting for corrected invoice.",
  "Vehicle number differs between E-Way Bill and LR. Escalated to logistics.",
  "Rate mismatch against the sales sheet; sales head to confirm.",
  "GSTIN differs from supplier master. Payment on hold.",
  "Quantity beyond the 250 KG tolerance. Rejected and returned to sales desk.",
];

// ---------------------------------------------------------------------------
// Field specs
// ---------------------------------------------------------------------------

interface Gen {
  base: string;
  partial: string;
  bad: string;
}
interface FieldSpec {
  key: string;
  label: string;
  docs: string[];
  critical?: boolean;
  /** true when this single-document field can only be checked against a reference list */
  reference?: boolean;
  gen: (c: Ctx) => Gen;
}
interface Ctx {
  i: number;
  party: string;
  gstin: string;
  product: { name: string; hsn: string };
  qty: number;
  amount: number;
  ref: string;
  vehicle: string;
  dateIso: string;
}

const dateFmt = (d: Date, style: number) => {
  const dd = pad(d.getUTCDate());
  const mm = pad(d.getUTCMonth() + 1);
  const yyyy = d.getUTCFullYear();
  if (style === 0) return `${dd}-${MONTHS[d.getUTCMonth()]}-${String(yyyy).slice(2)}`;
  if (style === 1) return `${dd}/${mm}/${yyyy}`;
  return `${dd}-${MONTHS[d.getUTCMonth()]}-${yyyy}`;
};
const abbreviate = (s: string) => s.replace("Pvt Ltd", "Private Limited").replace(/ Ltd$/, " Limited");
const fmtNum = (n: number, d = 3) => n.toFixed(d);

const PURCHASE_DOCS = ["Invoice", "E-Way Bill", "LR Copy", "GRN"];

const PURCHASE_SPEC: FieldSpec[] = [
  { key: "invoice_no", label: "Invoice Number", docs: PURCHASE_DOCS, gen: (c) => ({ base: c.ref, partial: c.ref.replace("/", "-"), bad: c.ref.slice(0, -2) + pad((Number(c.ref.slice(-2)) + 7) % 100) }) },
  { key: "date", label: "Date", docs: PURCHASE_DOCS, gen: (c) => { const d = new Date(c.dateIso); return { base: dateFmt(d, 0), partial: dateFmt(d, 1), bad: dateFmt(new Date(d.getTime() - 3 * 24 * HOUR), 0) }; } },
  { key: "supplier", label: "Supplier Name", docs: PURCHASE_DOCS, gen: (c) => ({ base: c.party, partial: abbreviate(c.party), bad: c.party.split(" ")[0] + " Enterprises" }) },
  { key: "gstin", label: "GSTIN", docs: ["Invoice", "E-Way Bill"], critical: true, gen: (c) => ({ base: c.gstin, partial: c.gstin, bad: c.gstin.slice(0, 12) + "2Z" + c.gstin.slice(14) }) },
  { key: "amount", label: "Amount (INR)", docs: ["Invoice", "E-Way Bill", "GRN"], gen: (c) => ({ base: c.amount.toLocaleString("en-IN"), partial: c.amount.toLocaleString("en-IN") + ".00", bad: (c.amount + 1840).toLocaleString("en-IN") }) },
  { key: "weight", label: "Weight (MT)", docs: ["Invoice", "E-Way Bill", "LR Copy"], gen: (c) => ({ base: fmtNum(c.qty), partial: fmtNum(c.qty + 0.082), bad: fmtNum(c.qty + 1.45) }) },
  { key: "vehicle", label: "Vehicle Number", docs: ["E-Way Bill", "LR Copy"], gen: (c) => ({ base: c.vehicle, partial: c.vehicle.replace(/ /g, ""), bad: c.vehicle.slice(0, -4) + pad((h(c.i, 55) % 90) + 10, 4) }) },
  { key: "hsn", label: "HSN Code", docs: ["Invoice", "E-Way Bill"], gen: (c) => ({ base: c.product.hsn, partial: c.product.hsn.slice(0, 6) + "00", bad: "7210" + c.product.hsn.slice(4, 6) + "10" }) },
  { key: "product", label: "Product / Description", docs: ["Invoice", "E-Way Bill", "GRN"], gen: (c) => ({ base: c.product.name, partial: c.product.name.replace("MS ", "Mild Steel ").replace("HR ", "Hot Rolled "), bad: "Assorted steel products" }) },
  { key: "batch", label: "Batch / Coil Number", docs: ["Invoice", "GRN"], gen: (c) => ({ base: `CL-${24000 + c.i * 17}`, partial: `CL${24000 + c.i * 17}`, bad: `CL-${24000 + c.i * 17 + 3}` }) },
  { key: "bill_to", label: "Bill To Address", docs: ["Invoice"], reference: true, gen: (c) => ({ base: pick(BILL_TO, c.i, 21), partial: pick(BILL_TO, c.i, 21), bad: "Andheri East, Mumbai (not a known billing site)" }) },
  { key: "ship_to", label: "Ship To Address", docs: ["Invoice", "E-Way Bill"], reference: true, gen: (c) => ({ base: pick(SHIP_TO, c.i, 22), partial: pick(SHIP_TO, c.i, 22), bad: "Bhiwandi Godown 7 (not a known delivery site)" }) },
  { key: "ewb_no", label: "E-Way Bill Number", docs: ["E-Way Bill"], gen: (c) => ({ base: `3410${pad(c.i, 3)}${(h(c.i, 31) % 900000) + 100000}`, partial: "", bad: "" }) },
  { key: "lr_no", label: "LR Number", docs: ["LR Copy"], gen: (c) => ({ base: `LR/${26}/${(h(c.i, 32) % 90000) + 10000}`, partial: "", bad: "" }) },
];

const SALES_SPEC = (docs: string[]): FieldSpec[] => [
  { key: "order_no", label: "Order Number", docs, gen: (c) => ({ base: c.ref, partial: c.ref.replace("-", " "), bad: c.ref.slice(0, -2) + pad((Number(c.ref.slice(-2)) + 9) % 100) }) },
  { key: "party_order_no", label: "Party Order Number", docs, gen: (c) => ({ base: `PO-${(h(c.i, 41) % 9000) + 1000}`, partial: `PO${(h(c.i, 41) % 9000) + 1000}`, bad: `PO-${(h(c.i, 41) % 9000) + 1019}` }) },
  { key: "broker", label: "Broker Name", docs, gen: (c) => { const b = pick(BROKERS, c.i, 42); return { base: b, partial: b.slice(0, -1), bad: pick(BROKERS, c.i + 1, 43) === b ? "Direct" : pick(BROKERS, c.i + 1, 43) }; } },
  { key: "bill_to_name", label: "Bill To Name", docs, gen: (c) => ({ base: c.party, partial: abbreviate(c.party), bad: c.party.split(" ")[0] + " Traders" }) },
  { key: "rate", label: "Rate (INR / MT)", docs, gen: (c) => { const r = 52000 + (h(c.i, 44) % 14000); return { base: r.toLocaleString("en-IN"), partial: r.toLocaleString("en-IN") + ".00", bad: (r + 500).toLocaleString("en-IN") }; } },
  { key: "qty", label: "Quantity (MT)", docs, gen: (c) => ({ base: fmtNum(c.qty), partial: fmtNum(c.qty + 0.14), bad: fmtNum(c.qty + 0.9) }) },
  { key: "payment_terms", label: "Payment Terms", docs, gen: (c) => { const t = pick(PAYMENT_TERMS, c.i, 45); return { base: t, partial: t.replace(" Days", " days"), bad: pick(PAYMENT_TERMS, c.i + 2, 46) === t ? "30 Days" : pick(PAYMENT_TERMS, c.i + 2, 46) }; } },
  { key: "thickness", label: "Thickness (mm)", docs, gen: (c) => { const t = [0.5, 1.2, 1.6, 2.0, 2.5, 3.15, 5.0][h(c.i, 47) % 7]; return { base: t.toFixed(2), partial: String(t), bad: (t + 0.3).toFixed(2) }; } },
  { key: "width", label: "Width (mm)", docs, gen: (c) => { const w = [1000, 1219, 1250, 1500][h(c.i, 48) % 4]; return { base: String(w), partial: w + ".0", bad: String(w + 25) }; } },
  { key: "length", label: "Length (mm)", docs, gen: (c) => { const l = [2500, 3000, 6000, 12000][h(c.i, 49) % 4]; return { base: String(l), partial: l + ".0", bad: String(l - 100) }; } },
];

const NOTES: Record<FieldStatus, (label: string, docs: string[]) => string> = {
  Match: (l, d) => `${l} agrees across ${d.join(", ")}.`,
  "Partial Match": (l) => `${l} differs only in formatting / minor variation; likely OCR or abbreviation.`,
  Mismatch: (l) => `${l} differs between documents. Check which one carries the correct value.`,
  Critical: (l) => `${l} mismatch is a tax compliance issue. Needs immediate attention.`,
};

// ---------------------------------------------------------------------------
// Audit generation
// ---------------------------------------------------------------------------

function buildFields(spec: FieldSpec[], c: Ctx, tier: number): FieldResult[] {
  return spec.map((f, fi) => {
    const p = h(c.i * 31 + fi, 5) % 100;
    const g = f.gen(c);
    const multi = f.docs.length > 1;
    let status: FieldStatus = "Match";
    // tier 0 clean, 1 minor, 2 bad
    if (multi) {
      const failFrom = tier === 2 ? 76 : tier === 1 ? 94 : 101;
      const partialTo = tier === 0 ? 5 : 16;
      if (p >= failFrom) status = f.critical ? "Critical" : "Mismatch";
      else if (p < partialTo && g.partial !== g.base) status = "Partial Match";
    } else if (f.reference && tier === 2 && p >= 70) {
      status = "Mismatch";
    }
    const values: Record<string, string | null> = {};
    f.docs.forEach((d, di) => {
      let v = g.base;
      if (status === "Partial Match" && di === f.docs.length - 1) v = g.partial;
      if ((status === "Mismatch" || status === "Critical") && (multi ? di === f.docs.length - 1 : true)) v = g.bad;
      values[d] = v;
    });
    // an occasionally unreadable optional document value
    if (multi && status === "Match" && p === 50 && f.docs.length > 2) values[f.docs[1]] = null;
    return { key: f.key, label: f.label, values, status, note: NOTES[status](f.label, f.docs) };
  });
}

const scoreOf = (fields: FieldResult[]) => {
  const pts = fields.reduce((s, f) => s + (f.status === "Match" ? 1 : f.status === "Partial Match" ? 0.6 : 0), 0);
  let sc = Math.round((pts / fields.length) * 100);
  if (fields.some((f) => f.status === "Critical")) sc = Math.min(sc, 58);
  return sc;
};
const statusOf = (fields: FieldResult[]): AuditStatus =>
  fields.some((f) => f.status === "Critical")
    ? "Critical"
    : fields.some((f) => f.status === "Mismatch")
      ? "Mismatch"
      : fields.some((f) => f.status === "Partial Match")
        ? "Partial Match"
        : "Match";

const GSTIN = (i: number) => `27${pad((h(i, 61) % 90) + 10, 0)}${"ABCDE"[h(i, 62) % 5]}${"FGHKL"[h(i, 63) % 5]}${"PQRST"[h(i, 64) % 5]}${"CFHJP"[h(i, 65) % 5]}${"ABCDE"[h(i, 66) % 5]}${pad(h(i, 67) % 10000, 4)}${"ABCDE"[h(i, 68) % 5]}1Z${h(i, 69) % 10}`;

function makeAudit(kind: AuditKind, n: number, offset: number, total: number): AuditRecord {
  const i = n + offset;
  const tier = (() => {
    const t = h(i, 9) % 10;
    return t < 5 ? 0 : t < 8 ? 1 : 2;
  })();
  const prod = pick(PRODUCTS, i, 11);
  const party = kind === "purchase" ? pick(SUPPLIERS, i, 12) : pick(CUSTOMERS, i, 12);
  const qty = Math.round((8 + (h(i, 13) % 340) / 10) * 1000) / 1000;
  const rate = 52000 + (h(i, 14) % 14000);
  const amount = Math.round(qty * rate * 1.18);
  const createdMs = REFERENCE_NOW - Math.floor((n / total) * 62 * 24) * HOUR - (h(i, 15) % 18) * HOUR - 2 * HOUR;
  const prefix = kind === "purchase" ? "PUR" : kind === "sales" ? "SO" : "QC";
  const ref = kind === "purchase" ? `${prefix}/26-27/${pad(1200 + i * 3, 4)}` : `${prefix}-26${pad(4100 + i * 7, 4)}`;
  const vehicle = `MH ${pad(40 + (h(i, 16) % 8))} ${"ABCDEFGH"[h(i, 17) % 8]}${"KLMNPRS"[h(i, 18) % 7]} ${pad(1000 + (h(i, 19) % 8999), 4)}`;
  const gstin = GSTIN(i);
  const ctx: Ctx = { i, party, gstin, product: prod, qty, amount, ref, vehicle, dateIso: iso(createdMs - 24 * HOUR) };

  const docNames = kind === "purchase" ? PURCHASE_DOCS : kind === "sales" ? ["Sales Invoice", "Sheet"] : ["Sales Order", "Purchase Order"];
  const spec = kind === "purchase" ? PURCHASE_SPEC : SALES_SPEC(docNames);
  const fields = buildFields(spec, ctx, tier);
  const status = statusOf(fields);
  const score = scoreOf(fields);

  const owners = usersFor(kind);
  const owner = owners[h(i, 20) % owners.length];
  const rd = h(i, 21) % 100;
  const decision: Decision =
    status === "Match" ? (rd < 75 ? "Approved" : "Pending") : status === "Partial Match" ? (rd < 60 ? "Approved" : rd < 80 ? "Pending" : "Rejected") : rd < 30 ? "Pending" : rd < 55 ? "Approved" : "Rejected";
  const decider = approvers[h(i, 22) % approvers.length];
  const decidedMs = createdMs + (1 + (h(i, 23) % 30)) * HOUR;
  const decidedAt = decision === "Pending" ? null : iso(Math.min(decidedMs, REFERENCE_NOW - HOUR));
  const comment =
    decision === "Pending"
      ? ""
      : decision === "Approved"
        ? status === "Match"
          ? pick(PASS_COMMENTS, i, 24)
          : pick(PARTIAL_COMMENTS, i, 24)
        : pick(FAIL_COMMENTS, i, 24);

  const documents: AuditDocument[] = docNames.map((name, di) => ({
    name,
    file: `${name.toLowerCase().replace(/[^a-z]+/g, "-")}-${ref.replace(/[^A-Za-z0-9]+/g, "")}.pdf`,
    pages: 1 + (h(i, 70 + di) % 3),
    sizeKb: 180 + (h(i, 80 + di) % 1400),
    uploadedAt: iso(createdMs - (3 - di) * 60e3),
    ocrConfidence: 86 + (h(i, 90 + di) % 14),
  }));

  const events: AuditEvent[] = [
    { at: iso(createdMs - 4 * 60e3), actor: owner.name, action: `Uploaded ${docNames.length} documents` },
    { at: iso(createdMs), actor: "Audit engine", action: `Reconciled ${fields.length} fields, score ${score}%` },
  ];
  const flagged = status === "Critical" || (status === "Mismatch" && decision === "Pending");
  if (flagged) events.push({ at: iso(createdMs + 60e3), actor: "Audit engine", action: status === "Critical" ? "Flagged: GSTIN compliance mismatch" : "Flagged for manual review" });
  if (decidedAt) events.push({ at: decidedAt, actor: decider.name, action: `${decision}${comment ? `: ${comment}` : ""}` });

  return {
    id: `${kind === "purchase" ? "PA" : kind === "sales" ? "SA" : "QK"}-${pad(n + 1, 3)}`,
    kind, ref, party, gstin, createdAt: iso(createdMs), amount, qty,
    qtyUnit: "MT", product: prod.name, score, status, fields, documents, decision, decidedAt,
    reviewerId: owner.id, decidedById: decidedAt ? decider.id : null, comment, flagged, events,
  };
}

const gen = (kind: AuditKind, count: number, offset: number) =>
  Array.from({ length: count }, (_, n) => makeAudit(kind, n, offset, count));

export const PURCHASE_AUDITS: AuditRecord[] = gen("purchase", 48, 0);
export const SALES_AUDITS: AuditRecord[] = gen("sales", 36, 100);
export const QUICK_AUDITS: AuditRecord[] = gen("quick", 22, 200);
export const ALL_AUDITS: AuditRecord[] = [...PURCHASE_AUDITS, ...SALES_AUDITS, ...QUICK_AUDITS].sort(
  (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
);

export const KIND_LABEL: Record<AuditKind, string> = { purchase: "Purchase", sales: "Sales", quick: "Quick Check" };
export const auditById = (id: string | null) => (id ? ALL_AUDITS.find((a) => a.id === id) : undefined);

// ---------------------------------------------------------------------------
// Aggregates
// ---------------------------------------------------------------------------

export interface AuditStats {
  total: number;
  matched: number;
  partial: number;
  mismatched: number;
  critical: number;
  passRate: number;
  avgScore: number;
  value: number;
  pending: number;
  approved: number;
  rejected: number;
  flagged: number;
  atRisk: number;
}

export function auditStats(list: AuditRecord[]): AuditStats {
  const c = (s: AuditStatus) => list.filter((a) => a.status === s).length;
  const d = (x: Decision) => list.filter((a) => a.decision === x).length;
  const total = list.length;
  const matched = c("Match");
  return {
    total, matched, partial: c("Partial Match"), mismatched: c("Mismatch"), critical: c("Critical"),
    passRate: total ? Math.round((matched / total) * 100) : 0,
    avgScore: total ? Math.round(list.reduce((s, a) => s + a.score, 0) / total) : 0,
    value: list.reduce((s, a) => s + a.amount, 0),
    pending: d("Pending"), approved: d("Approved"), rejected: d("Rejected"),
    flagged: list.filter((a) => a.flagged).length,
    atRisk: list.filter((a) => a.status === "Mismatch" || a.status === "Critical").reduce((s, a) => s + a.amount, 0),
  };
}

export interface FieldErrorRow {
  label: string;
  kind: AuditKind | "sales+quick";
  checked: number;
  partial: number;
  mismatch: number;
  critical: number;
  errorRate: number;
}

export function fieldErrorRates(list: AuditRecord[]): FieldErrorRow[] {
  const map = new Map<string, FieldErrorRow>();
  for (const a of list) {
    for (const f of a.fields) {
      const k = `${a.kind === "purchase" ? "P" : "S"}:${f.label}`;
      const row = map.get(k) ?? { label: f.label, kind: a.kind === "purchase" ? "purchase" : "sales+quick", checked: 0, partial: 0, mismatch: 0, critical: 0, errorRate: 0 };
      row.checked++;
      if (f.status === "Partial Match") row.partial++;
      if (f.status === "Mismatch") row.mismatch++;
      if (f.status === "Critical") row.critical++;
      map.set(k, row);
    }
  }
  return [...map.values()]
    .map((r) => ({ ...r, errorRate: r.checked ? Math.round(((r.mismatch + r.critical) / r.checked) * 1000) / 10 : 0 }))
    .sort((a, b) => b.errorRate - a.errorRate);
}

export interface DayPoint {
  label: string;
  total: number;
  clean: number;
  issues: number;
}

/** Last `days` days ending at the reference date, bucketed by day. */
export function dailyTrend(list: AuditRecord[], days = 14): DayPoint[] {
  const end = Date.UTC(2026, 9, 27);
  return Array.from({ length: days }, (_, k) => {
    const start = end - (days - 1 - k) * 24 * HOUR;
    const inDay = list.filter((a) => {
      const t = new Date(a.createdAt).getTime();
      return t >= start && t < start + 24 * HOUR;
    });
    const d = new Date(start);
    return {
      label: `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`,
      total: inDay.length,
      clean: inDay.filter((a) => a.status === "Match" || a.status === "Partial Match").length,
      issues: inDay.filter((a) => a.status === "Mismatch" || a.status === "Critical").length,
    };
  });
}

export function weeklyScores(list: AuditRecord[], weeks = 8): { label: string; avg: number; count: number }[] {
  const end = Date.UTC(2026, 9, 28);
  return Array.from({ length: weeks }, (_, k) => {
    const start = end - (weeks - k) * 7 * 24 * HOUR;
    const inWeek = list.filter((a) => {
      const t = new Date(a.createdAt).getTime();
      return t >= start && t < start + 7 * 24 * HOUR;
    });
    const d = new Date(start);
    return {
      label: `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`,
      avg: inWeek.length ? Math.round(inWeek.reduce((s, a) => s + a.score, 0) / inWeek.length) : 0,
      count: inWeek.length,
    };
  });
}

export const SCORE_BUCKETS = [
  { label: "90-100", min: 90, max: 100 },
  { label: "75-89", min: 75, max: 89 },
  { label: "60-74", min: 60, max: 74 },
  { label: "<60", min: 0, max: 59 },
] as const;

export function partyRisk(list: AuditRecord[]) {
  const map = new Map<string, { party: string; audits: number; issues: number; value: number; avgScore: number }>();
  for (const a of list) {
    const r = map.get(a.party) ?? { party: a.party, audits: 0, issues: 0, value: 0, avgScore: 0 };
    r.audits++;
    r.value += a.amount;
    r.avgScore += a.score;
    if (a.status === "Mismatch" || a.status === "Critical") r.issues++;
    map.set(a.party, r);
  }
  return [...map.values()]
    .map((r) => ({ ...r, avgScore: Math.round(r.avgScore / r.audits) }))
    .sort((a, b) => b.issues - a.issues || a.avgScore - b.avgScore);
}

export function reviewerStats() {
  return AUDIT_USERS.map((u) => {
    const owned = ALL_AUDITS.filter((a) => a.reviewerId === u.id);
    const decided = ALL_AUDITS.filter((a) => a.decidedById === u.id);
    return {
      user: u,
      owned: owned.length,
      decided: decided.length,
      approved: decided.filter((a) => a.decision === "Approved").length,
      rejected: decided.filter((a) => a.decision === "Rejected").length,
      avgScore: owned.length ? Math.round(owned.reduce((s, a) => s + a.score, 0) / owned.length) : 0,
    };
  });
}
