/**
 * Inventory Intel mock data. Fully deterministic: every value is derived from
 * indexes and a fixed reference date (no Math.random / Date.now), so server and
 * client render identically. SKU fields mirror the Shills Growth OS inventory
 * workspace (warehouse + 7 marketplace/quick-commerce channels, avg monthly
 * sales, cost / MRP, lead time, ABC class, days-of-cover, bundle kits).
 */

export const INV_REF_DATE = "2026-10-27";

const DAY = 86_400_000;
const refMs = Date.UTC(2026, 9, 27);
export const isoDay = (offsetDays: number) => new Date(refMs + offsetDays * DAY).toISOString().slice(0, 10);

/** Deterministic hash in [0,1). */
function h(i: number, k: number): number {
  let x = Math.imul(i + 1, 374761393) ^ Math.imul(k + 7, 668265263);
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

// ---------- Types ----------

export const CHANNEL_KEYS = ["warehouse", "amazon", "blinkit", "myntra", "flipkart", "instamart", "nykaa", "shopify"] as const;
export type ChannelKey = (typeof CHANNEL_KEYS)[number];
export const CHANNEL_LABELS: Record<ChannelKey, string> = {
  warehouse: "Warehouse",
  amazon: "Amazon FBA",
  blinkit: "Blinkit",
  myntra: "Myntra",
  flipkart: "Flipkart",
  instamart: "Instamart",
  nykaa: "Nykaa",
  shopify: "Shopify",
};

export const WAREHOUSE_KEYS = ["delhi", "mumbai", "bengaluru"] as const;
export type WarehouseKey = (typeof WAREHOUSE_KEYS)[number];

export interface Warehouse {
  id: WarehouseKey;
  name: string;
  city: string;
  manager: string;
  capacityUnits: number;
  zones: string[];
  status: "Active" | "Near capacity" | "Maintenance window";
}

export const WAREHOUSES: Warehouse[] = [
  { id: "delhi", name: "Delhi Hub", city: "Delhi NCR", manager: "Rakesh Malhotra", capacityUnits: 14000, zones: ["A - Fast movers", "B - Bulk", "C - Cold/Serums"], status: "Active" },
  { id: "mumbai", name: "Mumbai FC", city: "Bhiwandi, Mumbai", manager: "Sunita Kamat", capacityUnits: 9000, zones: ["A - Pick face", "B - Reserve"], status: "Near capacity" },
  { id: "bengaluru", name: "Bengaluru FC", city: "Hoskote, Bengaluru", manager: "Arvind Nair", capacityUnits: 7000, zones: ["A - Pick face", "B - Reserve"], status: "Active" },
];

export type StockStatus = "Out of Stock" | "Critical" | "Low Stock" | "Healthy" | "Overstock";
export type AbcClass = "A" | "B" | "C";

export interface Sku {
  id: string;
  sku: string;
  name: string;
  category: string;
  supplierId: string;
  cost: number;
  price: number;
  avgMonthlySales: number;
  leadTime: number;
  reorderPoint: number;
  safetyStock: number;
  moq: number;
  channels: Record<ChannelKey, number>;
  warehouses: Record<WarehouseKey, number>;
  bins: Record<WarehouseKey, string>;
  growthPct: number; // forecast month-on-month growth
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  contact: string;
  email: string;
  leadTimeDays: number;
  onTimePct: number;
  qualityPct: number;
  paymentTerms: string;
  openPos: number;
  categories: string[];
  rating: number;
}

export type PoStatus = "Draft" | "Ordered" | "In Transit" | "Received" | "Delayed" | "Cancelled";

export interface PoLine {
  skuId: string;
  qty: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  status: PoStatus;
  orderDate: string;
  eta: string;
  receivedDate: string | null;
  destination: WarehouseKey;
  lines: PoLine[];
  totalQty: number;
  totalValue: number;
  freight: number;
  incoterm: string;
  notes: string;
  timeline: { date: string; event: string }[];
}

export type MovementType = "Receipt" | "Sale" | "Transfer" | "Adjustment" | "Return" | "Damage";

export interface Movement {
  id: string;
  date: string;
  time: string;
  skuId: string;
  type: MovementType;
  qty: number; // signed effect on total network stock (transfer = 0 net)
  from: string;
  to: string;
  reference: string;
  user: string;
  note: string;
}

export type AlertKind = "Low Stock" | "Out of Stock" | "Dead Stock" | "Overstock" | "Fast Mover" | "PO Delayed" | "Reorder Now";
export type AlertSeverity = "critical" | "warning" | "info";

export interface InvAlert {
  id: string;
  kind: AlertKind;
  severity: AlertSeverity;
  skuId: string | null;
  poId: string | null;
  title: string;
  detail: string;
  date: string;
  status: "Open" | "Acknowledged" | "Resolved";
  notified: string;
  action: string;
}

export interface Bundle {
  id: string;
  name: string;
  skuIds: string[];
  mrp: number;
  bundlePrice: number;
  kitsAvailable: number;
  status: "Active" | "Draft";
  reason: string;
  channels: string[];
  soldLast30: number;
}

// ---------- Suppliers ----------

export const SUPPLIERS: Supplier[] = [
  { id: "sup-1", name: "Guangzhou Glow Cosmetics Co.", country: "China", contact: "Li Wei", email: "liwei@gzglow.example", leadTimeDays: 45, onTimePct: 88, qualityPct: 96, paymentTerms: "30% advance, 70% on BL", openPos: 0, categories: ["Lip & Color", "Face", "Eye & Brow"], rating: 4.3 },
  { id: "sup-2", name: "Shenzhen NailPro Ltd.", country: "China", contact: "Chen Hao", email: "chen@nailpro.example", leadTimeDays: 30, onTimePct: 92, qualityPct: 94, paymentTerms: "50% advance, 50% on shipment", openPos: 0, categories: ["Nail Care"], rating: 4.5 },
  { id: "sup-3", name: "Mumbai Naturals Pvt Ltd", country: "India", contact: "Pooja Deshmukh", email: "pooja@mumbainaturals.example", leadTimeDays: 12, onTimePct: 95, qualityPct: 98, paymentTerms: "Net 30", openPos: 0, categories: ["Skincare", "Body Care"], rating: 4.8 },
  { id: "sup-4", name: "Baddi Skincare Labs", country: "India", contact: "Harpreet Gill", email: "harpreet@baddilabs.example", leadTimeDays: 18, onTimePct: 81, qualityPct: 93, paymentTerms: "Net 45", openPos: 0, categories: ["Skincare", "Hair Care"], rating: 3.9 },
  { id: "sup-5", name: "PackRight Industries", country: "India", contact: "Naveen Rao", email: "naveen@packright.example", leadTimeDays: 10, onTimePct: 97, qualityPct: 99, paymentTerms: "Net 15", openPos: 0, categories: ["Accessories"], rating: 4.7 },
  { id: "sup-6", name: "Seoul Beauty Source", country: "South Korea", contact: "Min-jun Park", email: "minjun@seoulbeauty.example", leadTimeDays: 35, onTimePct: 90, qualityPct: 97, paymentTerms: "LC at sight", openPos: 0, categories: ["Skincare", "Face"], rating: 4.4 },
];

// ---------- SKUs ----------

type Tpl = [sku: string, name: string, category: string, cost: number, price: number, sales: number, lead: number, sup: number, days: number];

/** Reference workspace SKUs with their original channel stock. */
const REF_FIXED: { tpl: Tpl; ch: number[] }[] = [
  { tpl: ["SH-NGEL-12", "Nail Gel Set #12 (Classic Nudes)", "Nail Care", 350, 999, 180, 30, 1, 0], ch: [250, 80, 25, 15, 30, 10, 40, 50] },
  { tpl: ["SH-VITC-30", "Vitamin C Face Serum 30ml", "Skincare", 162, 799, 620, 45, 5, 0], ch: [850, 340, 45, 110, 80, 30, 120, 150] },
  { tpl: ["SH-PEACH-LP", "Matte Peach Lipstick (Glow Edition)", "Lip & Color", 98, 649, 240, 45, 0, 0], ch: [12, 45, 12, 0, 25, 8, 10, 30] },
  { tpl: ["SH-ROSE-100", "Rosewater Face Mist 100ml", "Skincare", 72, 499, 310, 30, 2, 0], ch: [8, 14, 2, 12, 5, 1, 4, 18] },
  { tpl: ["SH-LAV-100", "Hydrating Lavender Gel 100g", "Body Care", 110, 549, 280, 30, 2, 0], ch: [420, 115, 45, 85, 50, 25, 60, 90] },
  { tpl: ["SH-BROW-01", "Matte Brown Eyebrow Pencil", "Eye & Brow", 65, 349, 190, 30, 0, 0], ch: [320, 90, 30, 45, 40, 15, 55, 70] },
  { tpl: ["SH-FOUN-30", "Dewy Finish Foundation SPF30", "Face", 210, 1099, 420, 45, 0, 0], ch: [60, 110, 18, 95, 35, 8, 70, 40] },
  { tpl: ["SH-BLUSH-RG", "Rose Gold Blush Compact", "Face", 130, 749, 280, 45, 0, 0], ch: [5, 12, 2, 0, 8, 0, 3, 7] },
  { tpl: ["SH-MASK-CC", "Charcoal Deep Cleanse Mask 75ml", "Skincare", 88, 499, 95, 30, 3, 0], ch: [680, 200, 55, 120, 90, 40, 150, 110] },
  { tpl: ["SH-SCRUB-CB", "Coffee Body Scrub 200g", "Body Care", 95, 599, 145, 30, 2, 0], ch: [480, 130, 40, 80, 55, 20, 90, 85] },
];

// [sku, name, category, cost, price, monthlySales, leadTime, supplierIdx, targetDaysCover]
const EXTRA: Tpl[] = [
  ["SH-NGEL-07", "Nail Gel Set #07 (Berry Pop)", "Nail Care", 340, 949, 130, 30, 1, 55],
  ["SH-NGEL-21", "Nail Gel Set #21 (Chrome Mirror)", "Nail Care", 390, 1099, 95, 30, 1, 140],
  ["SH-NPOL-BS", "Gel Polish Base & Top Coat Duo", "Nail Care", 150, 549, 210, 30, 1, 38],
  ["SH-NFILE-PR", "Pro Nail File & Buffer Set", "Nail Care", 40, 249, 160, 30, 1, 70],
  ["SH-NART-KT", "Nail Art Rhinestone Kit", "Nail Care", 85, 399, 14, 30, 1, 210],
  ["SH-VITC-15", "Vitamin C Face Serum 15ml (Travel)", "Skincare", 95, 449, 260, 45, 5, 27],
  ["SH-HYAL-30", "Hyaluronic Acid Serum 30ml", "Skincare", 175, 849, 340, 45, 5, 44],
  ["SH-NIAC-30", "Niacinamide 10% Serum 30ml", "Skincare", 120, 599, 410, 18, 3, 8],
  ["SH-SPF-50", "Sunscreen Gel SPF50 PA++++ 50g", "Skincare", 130, 649, 520, 18, 3, 21],
  ["SH-RETI-20", "Retinol Night Cream 50g", "Skincare", 210, 999, 150, 45, 5, 62],
  ["SH-CLNS-FM", "Gentle Foaming Cleanser 150ml", "Skincare", 70, 399, 380, 12, 3, 34],
  ["SH-TONR-AHA", "AHA-BHA Exfoliating Toner 120ml", "Skincare", 105, 549, 175, 18, 3, 95],
  ["SH-EYE-CR", "Under-Eye Brightening Cream 15g", "Skincare", 140, 699, 88, 45, 5, 120],
  ["SH-SHEET-5", "Sheet Mask Variety Pack (5)", "Skincare", 60, 349, 230, 35, 5, 40],
  ["SH-PEACH-GL", "Peach Gloss Lip Oil", "Lip & Color", 55, 399, 275, 45, 0, 36],
  ["SH-NUDE-LP", "Matte Nude Lipstick #04", "Lip & Color", 92, 599, 205, 45, 0, 29],
  ["SH-RED-LP", "Classic Red Liquid Lipstick", "Lip & Color", 105, 649, 160, 45, 0, 18],
  ["SH-LINER-LP", "Lip Liner Pencil Trio", "Lip & Color", 48, 349, 90, 45, 0, 105],
  ["SH-TINT-LB", "Cheek & Lip Tint Stick", "Lip & Color", 78, 449, 12, 45, 0, 190],
  ["SH-BALM-LP", "Tinted Lip Balm SPF15", "Lip & Color", 38, 249, 330, 12, 3, 31],
  ["SH-ROSE-BD", "Rose Body Butter 200g", "Body Care", 120, 649, 120, 12, 2, 85],
  ["SH-SHEA-LT", "Shea Body Lotion 250ml", "Body Care", 90, 449, 260, 12, 2, 48],
  ["SH-LAV-WSH", "Lavender Body Wash 300ml", "Body Care", 75, 399, 190, 12, 2, 66],
  ["SH-HAND-CR", "Hand Cream Trio (30g x3)", "Body Care", 85, 449, 18, 12, 2, 170],
  ["SH-FOOT-MS", "Foot Repair Mask Socks", "Body Care", 45, 299, 140, 30, 1, 52],
  ["SH-BROW-GL", "Eyebrow Gel Clear", "Eye & Brow", 50, 299, 110, 30, 0, 60],
  ["SH-LASH-MC", "Volumising Mascara Black", "Eye & Brow", 85, 499, 295, 45, 0, 23],
  ["SH-LINER-EY", "Waterproof Eyeliner Pen", "Eye & Brow", 60, 349, 340, 45, 0, 26],
  ["SH-SHAD-12", "12-Shade Eyeshadow Palette", "Eye & Brow", 190, 999, 120, 45, 0, 88],
  ["SH-CONC-30", "Full Coverage Concealer", "Face", 95, 599, 230, 45, 0, 9],
  ["SH-PRMR-30", "Pore Blur Primer 30ml", "Face", 115, 699, 145, 45, 5, 74],
  ["SH-SETSP-100", "Setting Spray 100ml", "Face", 98, 599, 185, 45, 0, 42],
  ["SH-HLTR-GD", "Golden Highlighter Stick", "Face", 80, 549, 66, 45, 0, 150],
  ["SH-SHMP-AR", "Argan Repair Shampoo 250ml", "Hair Care", 88, 449, 280, 18, 3, 33],
  ["SH-COND-AR", "Argan Repair Conditioner 250ml", "Hair Care", 90, 449, 245, 18, 3, 12],
  ["SH-HAIR-OIL", "Onion Hair Growth Oil 100ml", "Hair Care", 98, 549, 405, 18, 3, 39],
  ["SH-BAG-CS", "Cosmetic Organiser Pouch", "Accessories", 70, 399, 75, 10, 4, 98],
  ["SH-BRSH-SET", "10-Piece Makeup Brush Set", "Accessories", 160, 899, 130, 10, 4, 57],
  ["SH-SPONGE-3", "Blending Sponge Pack (3)", "Accessories", 28, 199, 360, 10, 4, 6],
];

const TOTAL_WEIGHTS: number[] = [0.45, 0.15, 0.04, 0.07, 0.07, 0.03, 0.09, 0.1];

function buildSku(tpl: Tpl, idx: number, fixedCh?: number[]): Sku {
  const [sku, name, category, cost, price, sales, lead, sup] = tpl;
  const days = tpl[8];
  let ch: number[];
  if (fixedCh) ch = fixedCh;
  else {
    const total = days === 0 ? 0 : Math.round((sales * days) / 30);
    ch = TOTAL_WEIGHTS.map((w, k) => Math.max(0, Math.round(total * w * (0.7 + h(idx, k) * 0.6))));
    // Out-of-stock for a few SKUs: keep deterministic
  }
  const channels = {} as Record<ChannelKey, number>;
  CHANNEL_KEYS.forEach((k, i) => (channels[k] = ch[i]));
  // split warehouse stock across 3 warehouses
  const wh = ch[0];
  const d = Math.round(wh * (0.4 + h(idx, 11) * 0.15));
  const m = Math.round(wh * (0.25 + h(idx, 12) * 0.1));
  const b = Math.max(0, wh - d - m);
  const warehouses: Record<WarehouseKey, number> = { delhi: d, mumbai: m, bengaluru: b };
  const bins = {
    delhi: `${"ABC"[idx % 3]}-${String(1 + (idx % 9)).padStart(2, "0")}-${String(1 + ((idx * 3) % 12)).padStart(2, "0")}`,
    mumbai: `${"AB"[idx % 2]}-${String(1 + ((idx * 2) % 9)).padStart(2, "0")}-${String(1 + ((idx * 5) % 10)).padStart(2, "0")}`,
    bengaluru: `${"AB"[(idx + 1) % 2]}-${String(1 + ((idx * 4) % 8)).padStart(2, "0")}-${String(1 + ((idx * 7) % 10)).padStart(2, "0")}`,
  };
  const safetyStock = Math.round((sales / 30) * 7);
  const reorderPoint = Math.round((sales / 30) * lead) + safetyStock;
  return {
    id: `sku-${String(idx + 1).padStart(3, "0")}`,
    sku,
    name,
    category,
    supplierId: SUPPLIERS[sup].id,
    cost,
    price,
    avgMonthlySales: sales,
    leadTime: lead,
    reorderPoint,
    safetyStock,
    moq: sales >= 300 ? 500 : sales >= 100 ? 250 : 100,
    channels,
    warehouses,
    bins,
    growthPct: Math.round((h(idx, 21) * 28 - 6) * 10) / 10,
  };
}

export const SKUS: Sku[] = [
  ...REF_FIXED.map((r, i) => buildSku(r.tpl, i, r.ch)),
  ...EXTRA.map((t, i) => buildSku(t, REF_FIXED.length + i)),
];

export const SKU_BY_ID: Record<string, Sku> = Object.fromEntries(SKUS.map((s) => [s.id, s]));
export const SUPPLIER_BY_ID: Record<string, Supplier> = Object.fromEntries(SUPPLIERS.map((s) => [s.id, s]));
export const CATEGORIES = Array.from(new Set(SKUS.map((s) => s.category)));

// ---------- Derived SKU helpers ----------

export const totalStock = (s: Sku) => CHANNEL_KEYS.reduce((a, k) => a + s.channels[k], 0);
export const daysCover = (s: Sku) => (s.avgMonthlySales > 0 ? Math.round((totalStock(s) / s.avgMonthlySales) * 30) : 999);
export const stockValue = (s: Sku) => totalStock(s) * s.cost;
export const monthlyRevenue = (s: Sku) => s.avgMonthlySales * s.price;
export const grossMargin = (s: Sku) => Math.round(((s.price - s.cost) / s.price) * 100);
export const abcClass = (s: Sku): AbcClass => {
  const r = monthlyRevenue(s);
  return r >= 150000 ? "A" : r >= 50000 ? "B" : "C";
};
export const isDead = (s: Sku) => totalStock(s) > 0 && s.avgMonthlySales < 20;

export function stockStatus(s: Sku): StockStatus {
  const t = totalStock(s);
  const d = daysCover(s);
  if (t === 0) return "Out of Stock";
  if (d <= 10) return "Critical";
  if (d <= 25) return "Low Stock";
  if (d > 90) return "Overstock";
  return "Healthy";
}

export const suggestedOrderQty = (s: Sku) => Math.max(s.moq, Math.ceil((s.avgMonthlySales * 3) / 50) * 50);
export const daysUntilOrder = (s: Sku) => daysCover(s) - s.leadTime;

/** 6 months history + 3 months forecast of units sold (deterministic). */
export function skuTrend(s: Sku): { label: string; units: number; forecast: boolean }[] {
  const idx = Number(s.id.slice(4));
  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
  return months.map((label, i) => {
    const past = i < 6;
    const factor = past ? 1 + (h(idx, 30 + i) - 0.5) * 0.3 - (5 - i) * (s.growthPct / 100) * 0.5 : 1 + ((i - 5) * s.growthPct) / 100;
    return { label, units: Math.max(0, Math.round(s.avgMonthlySales * factor)), forecast: !past };
  });
}

// ---------- Purchase orders ----------

const PO_STATUS_CYCLE: PoStatus[] = ["Received", "Received", "In Transit", "Ordered", "Delayed", "Received", "Draft", "In Transit", "Received", "Ordered", "Received", "Cancelled", "In Transit", "Received", "Delayed", "Ordered", "Received", "In Transit", "Draft", "Received"];

export const PURCHASE_ORDERS: PurchaseOrder[] = PO_STATUS_CYCLE.map((status, i) => {
  const sup = SUPPLIERS[(i * 5 + 1) % SUPPLIERS.length];
  const candidates = SKUS.filter((s) => s.supplierId === sup.id);
  const lineCount = Math.min(candidates.length, 2 + (i % 3));
  const lines: PoLine[] = Array.from({ length: lineCount }, (_, j) => {
    const sk = candidates[(i * 3 + j * 2) % candidates.length];
    return { skuId: sk.id, qty: Math.max(sk.moq, Math.ceil((sk.avgMonthlySales * (2 + (j % 3))) / 50) * 50), unitCost: sk.cost };
  });
  // dedupe skuId
  const uniq = lines.filter((l, p) => lines.findIndex((x) => x.skuId === l.skuId) === p);
  const totalQty = uniq.reduce((a, l) => a + l.qty, 0);
  const totalValue = uniq.reduce((a, l) => a + l.qty * l.unitCost, 0);
  const ageDays = status === "Draft" ? 1 : 4 + i * 4;
  const orderDate = isoDay(-ageDays);
  const eta = isoDay(-ageDays + sup.leadTimeDays + (status === "Delayed" ? 9 : 0));
  const received = status === "Received" ? isoDay(-ageDays + sup.leadTimeDays - 1 + (i % 3)) : null;
  const dest = WAREHOUSE_KEYS[i % 3];
  const timeline: { date: string; event: string }[] = [{ date: orderDate, event: status === "Draft" ? "Draft created from reorder suggestion" : `PO issued to ${sup.name}` }];
  if (status !== "Draft" && status !== "Cancelled") timeline.push({ date: isoDay(-ageDays + 2), event: "Supplier confirmed order and production slot" });
  if (status === "In Transit" || status === "Received" || status === "Delayed") timeline.push({ date: isoDay(-ageDays + Math.round(sup.leadTimeDays * 0.6)), event: "Goods dispatched / shipment booked" });
  if (status === "Delayed") timeline.push({ date: isoDay(-2), event: "Carrier reported port congestion, ETA pushed by 9 days" });
  if (status === "Received") timeline.push({ date: received ?? orderDate, event: `Received at ${WAREHOUSES[i % 3].name}, GRN posted` });
  if (status === "Cancelled") timeline.push({ date: isoDay(-ageDays + 3), event: "Cancelled - superseded by consolidated order" });
  return {
    id: `PO-2026-${String(1042 + i)}`,
    supplierId: sup.id,
    status,
    orderDate,
    eta,
    receivedDate: received,
    destination: dest,
    lines: uniq,
    totalQty,
    totalValue,
    freight: Math.round(totalValue * (sup.country === "India" ? 0.02 : 0.07)),
    incoterm: sup.country === "India" ? "Ex-works" : i % 2 ? "FOB" : "CIF",
    notes: status === "Delayed" ? "Escalated to supplier account manager." : status === "Draft" ? "Awaiting founder approval." : "Standard replenishment order.",
    timeline,
  };
});

SUPPLIERS.forEach((s) => {
  s.openPos = PURCHASE_ORDERS.filter((p) => p.supplierId === s.id && ["Ordered", "In Transit", "Delayed", "Draft"].includes(p.status)).length;
});

/** Units already on order per SKU (open POs). */
export function onOrderQty(skuId: string): number {
  return PURCHASE_ORDERS.filter((p) => ["Ordered", "In Transit", "Delayed"].includes(p.status)).reduce(
    (a, p) => a + p.lines.filter((l) => l.skuId === skuId).reduce((x, l) => x + l.qty, 0),
    0,
  );
}

// ---------- Movements ----------

const MOVE_TYPES: MovementType[] = ["Sale", "Sale", "Receipt", "Transfer", "Sale", "Return", "Transfer", "Adjustment", "Sale", "Damage"];
const USERS = ["Rakesh M.", "Sunita K.", "Arvind N.", "Auto-sync", "Auto-sync", "Priya S."];
const SALE_CHANNELS: ChannelKey[] = ["amazon", "shopify", "nykaa", "flipkart", "myntra", "blinkit", "instamart"];

export const MOVEMENTS: Movement[] = Array.from({ length: 96 }, (_, i) => {
  const type = MOVE_TYPES[i % MOVE_TYPES.length];
  const sku = SKUS[Math.floor(h(i, 40) * SKUS.length)];
  const wh = WAREHOUSES[i % 3];
  const ch = SALE_CHANNELS[Math.floor(h(i, 41) * SALE_CHANNELS.length)];
  const base = Math.max(1, Math.round(sku.avgMonthlySales / 30));
  let qty = base * (1 + Math.floor(h(i, 42) * 4));
  let from = wh.name;
  let to = CHANNEL_LABELS[ch];
  let ref = `ORD-${98000 + i * 7}`;
  let signed = -qty;
  let note = `Order fulfilled on ${CHANNEL_LABELS[ch]}`;
  if (type === "Receipt") {
    const po = PURCHASE_ORDERS.filter((p) => p.status === "Received")[i % PURCHASE_ORDERS.filter((p) => p.status === "Received").length];
    qty = Math.max(sku.moq, qty * 20);
    from = SUPPLIER_BY_ID[po.supplierId].name;
    to = wh.name;
    ref = po.id;
    signed = qty;
    note = "Goods receipt against purchase order";
  } else if (type === "Transfer") {
    qty = base * (3 + Math.floor(h(i, 43) * 6));
    from = wh.name;
    to = CHANNEL_LABELS[ch];
    ref = `TRF-${2200 + i}`;
    signed = 0;
    note = "Replenishment to channel inventory";
  } else if (type === "Return") {
    qty = 1 + Math.floor(h(i, 44) * 4);
    from = CHANNEL_LABELS[ch];
    to = wh.name;
    ref = `RTN-${5100 + i}`;
    signed = qty;
    note = "Customer return, restocked after QC";
  } else if (type === "Adjustment") {
    qty = 1 + Math.floor(h(i, 45) * 6);
    signed = h(i, 46) > 0.5 ? qty : -qty;
    from = wh.name;
    to = wh.name;
    ref = `ADJ-${700 + i}`;
    note = "Cycle count variance";
  } else if (type === "Damage") {
    qty = 1 + Math.floor(h(i, 47) * 5);
    signed = -qty;
    from = wh.name;
    to = "Write-off";
    ref = `DMG-${300 + i}`;
    note = "Damaged in handling / expired seal";
  }
  const hour = 8 + Math.floor(h(i, 48) * 11);
  const minute = Math.floor(h(i, 49) * 60);
  return {
    id: `MV-${String(10400 + i)}`,
    date: isoDay(-Math.floor(i / 3.4)),
    time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    skuId: sku.id,
    type,
    qty: signed,
    from,
    to,
    reference: ref,
    user: type === "Sale" ? "Auto-sync" : USERS[i % USERS.length],
    note,
  };
});

// ---------- Alerts ----------

export const ALERTS: InvAlert[] = (() => {
  const out: InvAlert[] = [];
  let n = 0;
  const push = (a: Omit<InvAlert, "id">) => out.push({ id: `ALT-${String(500 + ++n)}`, ...a });
  SKUS.forEach((s) => {
    const st = stockStatus(s);
    const d = daysCover(s);
    if (st === "Out of Stock")
      push({ kind: "Out of Stock", severity: "critical", skuId: s.id, poId: null, title: `${s.name} is out of stock`, detail: `No units across any channel. Monthly demand ${s.avgMonthlySales}.`, date: isoDay(-(n % 4)), status: "Open", notified: "WhatsApp to Founder", action: "Raise emergency PO" });
    else if (st === "Critical")
      push({ kind: "Low Stock", severity: "critical", skuId: s.id, poId: null, title: `Critical stock: ${s.name}`, detail: `${totalStock(s)} units, ${d} days cover vs ${s.leadTime} day lead time.`, date: isoDay(-(n % 5)), status: n % 3 === 0 ? "Acknowledged" : "Open", notified: "WhatsApp to Founder", action: `Order ${suggestedOrderQty(s)} units now` });
    else if (st === "Low Stock")
      push({ kind: "Reorder Now", severity: "warning", skuId: s.id, poId: null, title: `Reorder window open: ${s.name}`, detail: `${d} days cover, lead time ${s.leadTime} days.`, date: isoDay(-(n % 6)), status: n % 4 === 0 ? "Acknowledged" : "Open", notified: "Email to Ops", action: `Order ${suggestedOrderQty(s)} units` });
    else if (st === "Overstock")
      push({ kind: "Overstock", severity: "info", skuId: s.id, poId: null, title: `Overstock: ${s.name}`, detail: `${d} days of cover, ${(stockValue(s) / 1000).toFixed(0)}K capital locked.`, date: isoDay(-(n % 9)), status: "Open", notified: "Email to Ops", action: "Bundle or reallocate to fast channels" });
    if (isDead(s))
      push({ kind: "Dead Stock", severity: "warning", skuId: s.id, poId: null, title: `Dead stock: ${s.name}`, detail: `Only ${s.avgMonthlySales} units/month against ${totalStock(s)} on hand.`, date: isoDay(-(n % 11)), status: "Open", notified: "WhatsApp to Founder", action: "Liquidate via bundle kit" });
    if (s.avgMonthlySales >= 400 && s.growthPct > 8)
      push({ kind: "Fast Mover", severity: "info", skuId: s.id, poId: null, title: `Fast mover: ${s.name}`, detail: `Demand trending +${s.growthPct}% month over month. Raise reorder point.`, date: isoDay(-(n % 7)), status: "Acknowledged", notified: "Dashboard", action: "Increase reorder point" });
  });
  PURCHASE_ORDERS.filter((p) => p.status === "Delayed").forEach((p) =>
    push({ kind: "PO Delayed", severity: "warning", skuId: null, poId: p.id, title: `${p.id} delayed`, detail: `${SUPPLIER_BY_ID[p.supplierId].name} shipment pushed to ${p.eta}.`, date: isoDay(-2), status: "Open", notified: "Email to Ops", action: "Contact supplier / expedite" }),
  );
  // Mark a handful resolved for realism
  return out.map((a, i) => (i % 9 === 8 ? { ...a, status: "Resolved" as const } : a));
})();

// ---------- Bundles ----------

const skuByCode = (code: string) => SKUS.find((s) => s.sku === code)!.id;

export const BUNDLES: Bundle[] = [
  { id: "bnd-1", name: "Salon Pro Nail Kit", skuIds: [skuByCode("SH-NGEL-12"), skuByCode("SH-PEACH-LP")], mrp: 1648, bundlePrice: 999, kitsAvailable: 45, status: "Active", reason: "Pairs fast-mover nail gel with slow lipstick to clear dead stock.", channels: ["Shopify", "Nykaa"], soldLast30: 38 },
  { id: "bnd-2", name: "Glow & Go Skincare Set", skuIds: [skuByCode("SH-VITC-30"), skuByCode("SH-ROSE-100")], mrp: 1298, bundlePrice: 849, kitsAvailable: 62, status: "Active", reason: "High-demand serum bundled with low-stock mist accelerates mist turnover.", channels: ["Shopify", "Amazon FBA"], soldLast30: 74 },
  { id: "bnd-3", name: "Daily Ritual Duo", skuIds: [skuByCode("SH-LAV-100"), skuByCode("SH-SCRUB-CB")], mrp: 1148, bundlePrice: 749, kitsAvailable: 80, status: "Active", reason: "Overstock clearance bundle for slow-moving body care SKUs.", channels: ["Shopify", "Nykaa", "Flipkart"], soldLast30: 52 },
  { id: "bnd-4", name: "Nail Art Clearance Box", skuIds: [skuByCode("SH-NART-KT"), skuByCode("SH-NGEL-21"), skuByCode("SH-NFILE-PR")], mrp: 1747, bundlePrice: 1099, kitsAvailable: 30, status: "Draft", reason: "Moves dead rhinestone kit and overstocked chrome gel with a high-attach file set.", channels: ["Shopify"], soldLast30: 0 },
  { id: "bnd-5", name: "Hands & Feet Care Pack", skuIds: [skuByCode("SH-HAND-CR"), skuByCode("SH-FOOT-MS")], mrp: 748, bundlePrice: 499, kitsAvailable: 55, status: "Active", reason: "Liquidates dead hand cream stock alongside steady foot masks.", channels: ["Shopify", "Amazon FBA"], soldLast30: 21 },
];

// ---------- Aggregates ----------

export const INV_TOTALS = (() => {
  const units = SKUS.reduce((a, s) => a + totalStock(s), 0);
  const value = SKUS.reduce((a, s) => a + stockValue(s), 0);
  const counts: Record<StockStatus, number> = { "Out of Stock": 0, Critical: 0, "Low Stock": 0, Healthy: 0, Overstock: 0 };
  SKUS.forEach((s) => counts[stockStatus(s)]++);
  const dead = SKUS.filter(isDead).length;
  const fast = SKUS.filter((s) => s.avgMonthlySales > 200).length;
  const openAlerts = ALERTS.filter((a) => a.status === "Open").length;
  const openPos = PURCHASE_ORDERS.filter((p) => ["Ordered", "In Transit", "Delayed"].includes(p.status)).length;
  const onOrderValue = PURCHASE_ORDERS.filter((p) => ["Ordered", "In Transit", "Delayed"].includes(p.status)).reduce((a, p) => a + p.totalValue, 0);
  return { units, value, counts, dead, fast, openAlerts, openPos, onOrderValue };
})();

export const channelTotals = (): Record<ChannelKey, number> => {
  const t = {} as Record<ChannelKey, number>;
  CHANNEL_KEYS.forEach((k) => (t[k] = SKUS.reduce((a, s) => a + s.channels[k], 0)));
  return t;
};

export const warehouseTotals = (): Record<WarehouseKey, number> => {
  const t = {} as Record<WarehouseKey, number>;
  WAREHOUSE_KEYS.forEach((k) => (t[k] = SKUS.reduce((a, s) => a + s.warehouses[k], 0)));
  return t;
};
