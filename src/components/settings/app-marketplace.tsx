"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowUpRight, Check, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/shared/page-header";
import { DemoAdapterBadge } from "@/components/shared/badges";
import { AppIcon } from "@/lib/icon";
import { PODS } from "@/lib/registry/pods";
import { getAppsByPod, isAppUnlocked } from "@/lib/registry/apps";
import { useOrg } from "@/lib/org-context";
import type { AppManifest } from "@/lib/types/manifest";

const POD_TAGLINE: Record<string, string> = {
  home: "Workspace-wide views across every app",
  sales: "Outbound reach, replies and pipeline",
  hr: "Hiring campaigns, candidates and interviews",
  marketing: "Content production, approvals and publishing",
  operations: "Operations Pod · support, collections, audits and stock",
  custom: "Client-specific modules",
};

function AppCard({
  app,
  installed,
  onToggle,
}: {
  app: AppManifest;
  installed: boolean;
  onToggle: (app: AppManifest, next: boolean) => void;
}) {
  const { org } = useOrg();
  const unlocked = isAppUnlocked(app, org.plan);
  const features = app.nav.map((n) => n.label);

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-3 px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <AppIcon name={app.icon} className="size-5" />
            </div>
            <p className="truncate text-sm font-semibold">{app.name}</p>
          </div>
          {app.badge && <DemoAdapterBadge />}
        </div>

        <p className="line-clamp-2 min-h-[2.5rem] text-xs text-muted-foreground">{app.description}</p>

        {features.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {features.slice(0, 5).map((f) => (
              <span key={f} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {f}
              </span>
            ))}
            {features.length > 5 && (
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">+{features.length - 5} more</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
          {unlocked ? (
            <div className="flex items-center gap-2">
              <Switch checked={installed} onCheckedChange={(v) => onToggle(app, v)} />
              <span className="text-xs text-muted-foreground">{installed ? "Installed" : "Not installed"}</span>
            </div>
          ) : (
            <Badge variant="outline" className="gap-1 text-[11px] text-muted-foreground">
              <Lock className="size-3" />
              Requires {app.requiredPlan}
            </Badge>
          )}

          {!unlocked && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                toast("Upgrade required", { description: `Upgrade to the ${app.requiredPlan} plan to unlock ${app.name}.` })
              }
            >
              Upgrade
            </Button>
          )}
          {unlocked && installed && (
            <Link href={app.basePath} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              <Check className="size-3 text-success" /> Open <ArrowUpRight className="size-3" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/** Keyed by org so switching org resets the install toggles to that org's list. */
export function AppMarketplace() {
  const { org } = useOrg();
  return <Marketplace key={org.id} />;
}

function Marketplace() {
  const { org } = useOrg();
  const [installedIds, setInstalledIds] = React.useState<Set<string>>(() => new Set(org.installedApps));

  function toggle(app: AppManifest, next: boolean) {
    setInstalledIds((prev) => {
      const s = new Set(prev);
      if (next) s.add(app.id);
      else s.delete(app.id);
      return s;
    });
    toast.success(next ? `${app.name} installed` : `${app.name} uninstalled`, {
      description: next
        ? `${app.name} now appears in the app switcher and sidebar.`
        : `${app.name} has been removed from this workspace.`,
    });
  }

  const sections = [...PODS]
    .sort((a, b) => a.order - b.order)
    .map((pod) => ({ pod, apps: getAppsByPod(pod.id) }))
    .filter((s) => s.apps.length > 0);

  return (
    <>
      <PageHeader
        title="App Marketplace"
        description={`Install or uninstall apps for ${org.name}. Apps are grouped by pod.`}
      />
      <div className="space-y-10">
        {sections.map(({ pod, apps }) => {
          const installedCount = apps.filter((a) => installedIds.has(a.id)).length;
          return (
            <section key={pod.id}>
              <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border bg-muted/40 px-4 py-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <AppIcon name={pod.icon} className="size-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold tracking-tight">{pod.label}</h2>
                  <p className="text-xs text-muted-foreground">{POD_TAGLINE[pod.id]}</p>
                </div>
                <span className="rounded-full border bg-background px-2.5 py-0.5 text-xs text-muted-foreground">
                  {installedCount} of {apps.length} installed
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {apps.map((app) => (
                  <AppCard key={app.id} app={app} installed={installedIds.has(app.id)} onToggle={toggle} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
