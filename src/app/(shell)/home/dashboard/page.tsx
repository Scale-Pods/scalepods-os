"use client";

import { useMemo } from "react";
import { Activity, LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { BusinessPulseChart } from "@/components/home/business-pulse-chart";
import { AiActionsDonut } from "@/components/home/ai-actions-donut";
import { MessagesByChannelChart } from "@/components/home/messages-by-channel-chart";
import { ActivityFeed } from "@/components/home/activity-feed";
import { PlanUsagePanel } from "@/components/home/plan-usage-panel";
import { PodSection, inrCompact, num, TONE } from "@/components/home/pods/pod-ui";
import { OutreachBlock } from "@/components/home/pods/sales-blocks";
import { RecruitBlock } from "@/components/home/pods/hr-blocks";
import { ContentOsBlock } from "@/components/home/pods/marketing-blocks";
import { AuditBlock, CustomerCareBlock, InventoryBlock, ReceivablesBlock } from "@/components/home/pods/operations-blocks";
import { useOrg } from "@/lib/org-context";
import { APP_REGISTRY } from "@/lib/registry/apps";
import { PODS } from "@/lib/registry/pods";
import type { AppManifest } from "@/lib/types/manifest";
import { MOCK_AUDIT_LOG } from "@/lib/mock-data/approvals";
import { buildAiActionsByPod, buildMessagesByChannel, buildPlanUsage, buildPulseTrend } from "@/lib/mock-data/analytics";
import { COLD_OUTREACH_SUMMARY } from "@/lib/mock-data/outreach-system";
import { dashboardStats } from "@/lib/mock-data/hr";
import { MOCK_CONTENT_DRAFTS } from "@/lib/mock-data/marketing";
import { CC_STATS } from "@/lib/mock-data/customer-care";
import { recoveryStats } from "@/lib/mock-data/receivables";
import { ALL_AUDITS, auditStats } from "@/lib/mock-data/audit-checker";
import { INV_TOTALS } from "@/lib/mock-data/inventory";
import { Users, Briefcase, FileClock, Headset, IndianRupee, ShieldCheck, PackageSearch } from "lucide-react";

type BlockRenderer = (props: { app: AppManifest }) => React.ReactElement;

/** Which block renders each app on the dashboard. Add a line here to surface a new app. */
const APP_BLOCKS: Record<string, BlockRenderer> = {
  "sales-outreach-system": OutreachBlock,
  "hr-recruit": RecruitBlock,
  "marketing-content-os": ContentOsBlock,
  "ops-customer-care": CustomerCareBlock,
  "ops-receivables": ReceivablesBlock,
  "ops-audit-checker": AuditBlock,
  "custom-studio-inventory-intel": InventoryBlock,
};

function jumpTo(podId: string) {
  document.getElementById(`pod-${podId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function MasterDashboardPage() {
  const { org } = useOrg();

  const installed = useMemo(
    () => new Set(org.installedApps),
    [org.installedApps]
  );
  const has = (id: string) => installed.has(id);

  const pulseTrend = useMemo(() => buildPulseTrend(org.id, org.plan), [org.id, org.plan]);
  const aiActionsByPod = useMemo(
    () => buildAiActionsByPod(org.id, org.installedApps, org.plan),
    [org.id, org.installedApps, org.plan]
  );
  const messagesByChannel = useMemo(() => buildMessagesByChannel(org.id, org.plan), [org.id, org.plan]);
  const planUsage = useMemo(() => buildPlanUsage(org.id, org.plan), [org.id, org.plan]);
  const activityEntries = useMemo(() => MOCK_AUDIT_LOG.filter((e) => e.orgId === org.id), [org.id]);

  // Pods that have at least one installed app (the Home pod is this dashboard itself).
  const pods = [...PODS]
    .sort((a, b) => a.order - b.order)
    .filter((p) => p.id !== "home")
    .map((pod) => ({ pod, apps: APP_REGISTRY.filter((a) => a.pod === pod.id && installed.has(a.id) && APP_BLOCKS[a.id]) }))
    .filter((p) => p.apps.length > 0);

  const hr = dashboardStats();
  const rec = recoveryStats();
  const aud = auditStats(ALL_AUDITS);
  const awaitingContent = MOCK_CONTENT_DRAFTS.filter((d) => d.status === "review").length;

  return (
    <div className="space-y-10">
      <div>
        <PageHeader
          title="Master Dashboard"
          description={`Everything running in ${org.name}, grouped by pod. Select a number to jump to that pod.`}
        />

        {pods.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {has("sales-outreach-system") && (
              <KpiCard label="Sales · Leads" value={num(COLD_OUTREACH_SUMMARY.totalLeads)} context={`${COLD_OUTREACH_SUMMARY.totalReplies} replies`} icon={<Users className="size-4" />} iconClassName={TONE.blue} onClick={() => jumpTo("sales")} />
            )}
            {has("hr-recruit") && (
              <KpiCard label="HR · In pipeline" value={String(hr.active)} context={`${hr.hired} hired`} icon={<Briefcase className="size-4" />} iconClassName={TONE.purple} onClick={() => jumpTo("hr")} />
            )}
            {has("marketing-content-os") && (
              <KpiCard label="Marketing · In review" value={String(awaitingContent)} context="drafts awaiting approval" icon={<FileClock className="size-4" />} iconClassName={TONE.orange} onClick={() => jumpTo("marketing")} />
            )}
            {has("ops-customer-care") && (
              <KpiCard label="Ops · Open cases" value={String(CC_STATS.openCases)} context={`CSAT ${CC_STATS.csat.toFixed(2)}`} icon={<Headset className="size-4" />} iconClassName={TONE.green} onClick={() => jumpTo("operations")} />
            )}
            {has("ops-receivables") && (
              <KpiCard label="Ops · Outstanding" value={inrCompact(rec.outstandingAmt)} context={`${rec.openBills} open bills`} icon={<IndianRupee className="size-4" />} iconClassName={TONE.orange} onClick={() => jumpTo("operations")} />
            )}
            {has("ops-audit-checker") && (
              <KpiCard label="Ops · Audit pass rate" value={`${aud.passRate}%`} context={`${aud.flagged} flagged`} icon={<ShieldCheck className="size-4" />} iconClassName={TONE.green} onClick={() => jumpTo("operations")} />
            )}
            {has("custom-studio-inventory-intel") && (
              <KpiCard label="Ops · Low / critical SKUs" value={String(INV_TOTALS.counts["Low Stock"] + INV_TOTALS.counts.Critical + INV_TOTALS.counts["Out of Stock"])} context={`${INV_TOTALS.openAlerts} open alerts`} icon={<PackageSearch className="size-4" />} iconClassName={TONE.red} onClick={() => jumpTo("operations")} />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-16 text-center">
            <LayoutDashboard className="mb-3 size-8 text-muted-foreground" />
            <p className="text-sm font-semibold">No apps installed yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Visit Settings → Apps to install your first app.</p>
          </div>
        )}
      </div>

      {pods.map(({ pod, apps }) => (
        <PodSection key={pod.id} pod={pod} apps={apps}>
          {apps.map((app) => {
            const Block = APP_BLOCKS[app.id];
            return <Block key={app.id} app={app} />;
          })}
        </PodSection>
      ))}

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Activity className="size-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold tracking-tight">Workspace-wide</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <BusinessPulseChart data={pulseTrend} />
          <AiActionsDonut data={aiActionsByPod} />
          <MessagesByChannelChart data={messagesByChannel} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityFeed entries={activityEntries} />
          </div>
          <div className="lg:col-span-1">
            <PlanUsagePanel usage={planUsage} planLabel={org.plan} />
          </div>
        </div>
      </section>
    </div>
  );
}
