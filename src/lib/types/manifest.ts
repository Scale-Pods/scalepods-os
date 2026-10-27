import type { LucideIcon } from "lucide-react";

export type PodId =
  | "home"
  | "sales"
  | "hr"
  | "marketing"
  | "operations"
  | "custom";

export type PlanId = "free" | "basic" | "growth" | "enterprise";

export interface AppNavItem {
  label: string;
  path: string; // relative to basePath
  icon?: keyof typeof import("lucide-react");
  children?: { label: string; path: string }[]; // relative to basePath; shown only while the parent item is active
}

export interface AppManifest {
  id: string;
  name: string;
  pod: PodId;
  description: string;
  icon: string; // lucide-react icon name
  basePath: string;
  nav: AppNavItem[];
  requiredPlan: PlanId;
  permissions: string[];
  dashboardWidgets: string[];
  featureFlags: string[];
  status?: "full" | "basic" | "scaffold";
  badge?: string; // e.g. "Demo adapter"
}

export interface PodDefinition {
  id: PodId;
  label: string;
  icon: string;
  order: number;
}

export type LucideIconType = LucideIcon;
