export type SkuStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  stockLevel: number;
  reorderThreshold: number;
  status: SkuStatus;
  warehouseLocation: string;
}

function statusFor(stock: number, threshold: number): SkuStatus {
  if (stock <= 0) return "out-of-stock";
  if (stock <= threshold) return "low-stock";
  return "in-stock";
}

const RAW: { sku: string; name: string; stock: number; threshold: number; location: string }[] = [
  { sku: "SKU-1001", name: "Stainless Steel Water Bottle 750ml", stock: 240, threshold: 50, location: "Mumbai - Rack A3" },
  { sku: "SKU-1002", name: "Wireless Mechanical Keyboard", stock: 18, threshold: 20, location: "Mumbai - Rack B1" },
  { sku: "SKU-1003", name: "Organic Cotton Tote Bag", stock: 0, threshold: 30, location: "Pune - Rack C2" },
  { sku: "SKU-1004", name: "USB-C Fast Charger 65W", stock: 312, threshold: 60, location: "Mumbai - Rack A1" },
  { sku: "SKU-1005", name: "Ceramic Coffee Mug Set (4pc)", stock: 42, threshold: 40, location: "Pune - Rack C4" },
  { sku: "SKU-1006", name: "Bluetooth Noise-Cancelling Earbuds", stock: 9, threshold: 25, location: "Mumbai - Rack B3" },
  { sku: "SKU-1007", name: "Yoga Mat — Premium Non-Slip", stock: 128, threshold: 30, location: "Bengaluru - Rack D1" },
  { sku: "SKU-1008", name: "Laptop Sleeve 14-inch", stock: 0, threshold: 20, location: "Mumbai - Rack B2" },
  { sku: "SKU-1009", name: "Stainless Steel Lunch Box", stock: 76, threshold: 35, location: "Pune - Rack C1" },
  { sku: "SKU-1010", name: "Portable Power Bank 20000mAh", stock: 15, threshold: 25, location: "Mumbai - Rack A4" },
  { sku: "SKU-1011", name: "Adjustable Desk Lamp LED", stock: 94, threshold: 20, location: "Bengaluru - Rack D3" },
  { sku: "SKU-1012", name: "Memory Foam Pillow", stock: 51, threshold: 15, location: "Pune - Rack C3" },
  { sku: "SKU-1013", name: "Smart Fitness Tracker Band", stock: 6, threshold: 20, location: "Mumbai - Rack B4" },
  { sku: "SKU-1014", name: "Insulated Travel Tumbler 500ml", stock: 183, threshold: 40, location: "Bengaluru - Rack D2" },
  { sku: "SKU-1015", name: "Foldable Phone Stand (Aluminium)", stock: 27, threshold: 30, location: "Mumbai - Rack A2" },
];

export const MOCK_INVENTORY: InventoryItem[] = RAW.map((r, i) => ({
  id: `inv-item-${i + 1}`,
  sku: r.sku,
  productName: r.name,
  stockLevel: r.stock,
  reorderThreshold: r.threshold,
  status: statusFor(r.stock, r.threshold),
  warehouseLocation: r.location,
}));

/* ------------------------------------------------------------------ */
/* Inventory analytics                                                 */
/* ------------------------------------------------------------------ */

export interface StockDistributionPoint {
  status: SkuStatus;
  label: string;
  count: number;
}

export const MOCK_STOCK_DISTRIBUTION: StockDistributionPoint[] = (
  ["in-stock", "low-stock", "out-of-stock"] as SkuStatus[]
).map((status) => ({
  status,
  label: status === "in-stock" ? "In stock" : status === "low-stock" ? "Low stock" : "Out of stock",
  count: MOCK_INVENTORY.filter((i) => i.status === status).length,
}));

export interface DepletingSku {
  sku: string;
  productName: string;
  stockLevel: number;
  dailyVelocity: number;
  daysOfCoverLeft: number;
}

/** Mock daily sell-through velocity per SKU, used to estimate days of stock cover remaining. */
const VELOCITY_SEED: Record<string, number> = {
  "SKU-1001": 6,
  "SKU-1002": 3,
  "SKU-1003": 2,
  "SKU-1004": 14,
  "SKU-1005": 4,
  "SKU-1006": 2,
  "SKU-1007": 5,
  "SKU-1008": 1,
  "SKU-1009": 5,
  "SKU-1010": 3,
  "SKU-1011": 6,
  "SKU-1012": 4,
  "SKU-1013": 2,
  "SKU-1014": 9,
  "SKU-1015": 3,
};

export const MOCK_FASTEST_DEPLETING_SKUS: DepletingSku[] = MOCK_INVENTORY.filter((i) => i.status !== "out-of-stock")
  .map((item) => {
    const dailyVelocity = VELOCITY_SEED[item.sku] ?? 2;
    return {
      sku: item.sku,
      productName: item.productName,
      stockLevel: item.stockLevel,
      dailyVelocity,
      daysOfCoverLeft: Math.round(item.stockLevel / Math.max(1, dailyVelocity)),
    };
  })
  .sort((a, b) => a.daysOfCoverLeft - b.daysOfCoverLeft)
  .slice(0, 6);
