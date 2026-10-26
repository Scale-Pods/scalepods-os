import type { ReactNode } from "react";

/**
 * Each pod registers its KPI tiles here, keyed by the widget id used in its
 * manifest's dashboardWidgets array. The Master Dashboard renders every
 * widget whose id appears in an installed app's manifest — it never
 * hard-codes a pod's numbers.
 */
export type DashboardWidgetRenderer = () => ReactNode;

export const DASHBOARD_WIDGETS: Record<string, DashboardWidgetRenderer> = {};

export function registerDashboardWidget(id: string, renderer: DashboardWidgetRenderer) {
  DASHBOARD_WIDGETS[id] = renderer;
}
