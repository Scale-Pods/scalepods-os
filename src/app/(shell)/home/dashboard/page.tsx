"use client";

import { useMemo } from "react";
import { Activity, LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { AppTile } from "@/components/home/app-tile";
import { AiAgentsStrip } from "@/components/home/ai-agents-strip";
import { BusinessPulseChart } from "@/components/home/business-pulse-chart";
import { AiActionsDonut } from "@/components/home/ai-actions-donut";
import { MessagesByChannelChart } from "@/components/home/messages-by-channel-chart";
import { ActivityFeed } from "@/components/home/activity-feed";
import { PlanUsagePanel } from "@/components/home/plan-usage-panel";
import { useOrg } from "@/lib/org-context";
import { APP_REGISTRY } from "@/lib/registry/apps";
import { DASHBOARD_WIDGETS } from "@/lib/registry/dashboard-widgets";
import { DASHBOARD_METRICS } from "@/lib/mock-data/dashboard-metrics";
import { MOCK_APPROVALS, MOCK_AUDIT_LOG } from "@/lib/mock-data/approvals";
import {
  buildAiActionsByPod,
  buildMessagesByChannel,
  buildPlanUsage,
  buildPulseTrend,
  planScale,
} from "@/lib/mock-data/analytics";
import { AppIcon } from "@/lib/icon";

export default function MasterDashboardPage() {
  const { org } = useOrg();

  const installedApps = APP_REGISTRY.filter((app) => org.installedApps.includes(app.id));
  const tileApps = installedApps.filter((app) => app.pod !== "home");

  const widgetIds = installedApps.flatMap((app) => app.dashboardWidgets);
  const uniqueWidgetIds = Array.from(new Set(widgetIds));

  const pulseTrend = useMemo(() => buildPulseTrend(org.id, org.plan), [org.id, org.plan]);
  const aiActionsByPod = useMemo(
    () => buildAiActionsByPod(org.id, org.installedApps, org.plan),
    [org.id, org.installedApps, org.plan]
  );
  const messagesByChannel = useMemo(
    () => buildMessagesByChannel(org.id, org.plan),
    [org.id, org.plan]
  );
  const planUsage = useMemo(() => buildPlanUsage(org.id, org.plan), [org.id, org.plan]);
  const activityEntries = useMemo(
    () => MOCK_AUDIT_LOG.filter((e) => e.orgId === org.id),
    [org.id]
  );
  const orgApprovals = useMemo(
    () => MOCK_APPROVALS.filter((a) => a.orgId === org.id),
    [org.id]
  );
  const scale = planScale(org.plan);

  return (
    <div>
      <PageHeader
        title="Master Dashboard"
        description={`Everything running in ${org.name}, pulled from every installed app.`}
      />

      {uniqueWidgetIds.length > 0 ? (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {uniqueWidgetIds.map((id) => {
            const metric = DASHBOARD_METRICS[id];
            const Registered = DASHBOARD_WIDGETS[id];
            if (Registered) return <Registered key={id} />;
            if (metric) {
              return (
                <KpiCard
                  key={id}
                  label={metric.label}
                  value={metric.value}
                  context={metric.context}
                  trend={metric.trend}
                  trendValue={metric.trendValue}
                  trendGood={metric.trendGood}
                  icon={<AppIcon name={metric.icon} className="size-4" />}
                />
              );
            }
            return (
              <KpiCard
                key={id}
                label={id}
                value="—"
                context="Widget not yet registered"
              />
            );
          })}
        </div>
      ) : null}

      <div className="mb-6">
        <AiAgentsStrip
          messagesSent={Math.round(318 * scale)}
          repliesReceived={Math.round(176 * scale)}
          cvsScreened={Math.round(64 * scale)}
          awaitingApproval={orgApprovals.length}
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">Your apps</p>
          <p className="text-xs text-muted-foreground">
            {tileApps.length} installed on the {org.plan} plan
          </p>
        </div>
        {tileApps.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tileApps.map((app) => {
              const firstWidgetId = app.dashboardWidgets[0];
              const metric = firstWidgetId ? DASHBOARD_METRICS[firstWidgetId] : undefined;
              return (
                <AppTile
                  key={app.id}
                  app={app}
                  metricLabel={metric?.label ?? "Status"}
                  metricValue={metric?.value ?? "Active"}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-16 text-center">
            <LayoutDashboard className="mb-3 size-8 text-muted-foreground" />
            <p className="text-sm font-semibold">No apps installed yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Visit Settings → Apps to install your first app.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <Activity className="size-4 text-muted-foreground" />
          <p className="text-sm font-semibold">Business pulse</p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <BusinessPulseChart data={pulseTrend} />
          </div>
          <div className="lg:col-span-1">
            <AiActionsDonut data={aiActionsByPod} />
          </div>
          <div className="lg:col-span-1">
            <MessagesByChannelChart data={messagesByChannel} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityFeed entries={activityEntries} />
        </div>
        <div className="lg:col-span-1">
          <PlanUsagePanel usage={planUsage} planLabel={org.plan} />
        </div>
      </div>
    </div>
  );
}
