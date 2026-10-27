import type { AppManifest } from "@/lib/types/manifest";

/**
 * Central app registry. Each pod's manifest is defined in its own module
 * under src/lib/registry/manifests/<app-id>.ts and imported here. Adding an
 * app means adding one manifest + one entry in this array — the shell
 * (sidebar, switcher, ⌘K, route guards, plan gating, dashboard tiles) reads
 * only from this list.
 */
import { manifest as masterDashboard } from "./manifests/home-dashboard";
import { manifest as executiveBoard } from "./manifests/home-executive-board";
import { manifest as hrRecruit } from "./manifests/hr-recruit";
import { manifest as salesOutreachSystem } from "./manifests/sales-outreach-system";
import { manifest as marketingContentOs } from "./manifests/marketing-content-os";
import { manifest as opsCustomerCare } from "./manifests/ops-customer-care";
import { manifest as opsReceivables } from "./manifests/ops-receivables";
import { manifest as customStudio } from "./manifests/custom-studio";

export const APP_REGISTRY: AppManifest[] = [
  masterDashboard,
  executiveBoard,
  hrRecruit,
  salesOutreachSystem,
  marketingContentOs,
  opsCustomerCare,
  opsReceivables,
  customStudio,
];

export function getAppById(id: string) {
  return APP_REGISTRY.find((a) => a.id === id);
}

export function getAppsByPod(pod: string) {
  return APP_REGISTRY.filter((a) => a.pod === pod);
}

export function findAppByPath(path: string) {
  return APP_REGISTRY.find((a) => path.startsWith(a.basePath));
}

const PLAN_ORDER = ["free", "basic", "growth", "enterprise"] as const;

export function isAppUnlocked(app: AppManifest, orgPlan: string) {
  const orgIdx = PLAN_ORDER.indexOf(orgPlan as (typeof PLAN_ORDER)[number]);
  const reqIdx = PLAN_ORDER.indexOf(app.requiredPlan);
  return orgIdx >= reqIdx;
}
