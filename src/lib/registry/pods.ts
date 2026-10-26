import type { PodDefinition } from "@/lib/types/manifest";

export const PODS: PodDefinition[] = [
  { id: "home", label: "Home", icon: "LayoutDashboard", order: 0 },
  { id: "sales", label: "Sales Pod", icon: "Target", order: 1 },
  { id: "hr", label: "HR Pod", icon: "Users", order: 2 },
  { id: "marketing", label: "Marketing Pod", icon: "Megaphone", order: 3 },
  { id: "operations", label: "Operations Pod", icon: "Headset", order: 4 },
  { id: "custom", label: "Custom Studio", icon: "Blocks", order: 5 },
];

export function getPod(id: string) {
  return PODS.find((p) => p.id === id);
}
