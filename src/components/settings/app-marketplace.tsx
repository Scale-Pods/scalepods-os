"use client";

import * as React from "react";
import { toast } from "sonner";
import { Lock, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/shared/page-header";
import { DemoAdapterBadge } from "@/components/shared/badges";
import { AppIcon } from "@/lib/icon";
import { PODS, getPod } from "@/lib/registry/pods";
import { getAppsByPod, isAppUnlocked } from "@/lib/registry/apps";
import { useOrg } from "@/lib/org-context";
import type { AppManifest } from "@/lib/types/manifest";

function AppCard({ app }: { app: AppManifest }) {
  const { org } = useOrg();
  const unlocked = isAppUnlocked(app, org.plan);
  const [installed, setInstalled] = React.useState(org.installedApps.includes(app.id));

  function toggleInstall(next: boolean) {
    setInstalled(next);
    toast.success(next ? `${app.name} installed` : `${app.name} uninstalled`, {
      description: next
        ? `${app.name} now appears in the app switcher and sidebar.`
        : `${app.name} has been removed from this workspace.`,
    });
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <AppIcon name={app.icon} className="size-4.5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{app.name}</p>
              <p className="text-[11px] capitalize text-muted-foreground">{app.pod} pod</p>
            </div>
          </div>
          {app.badge && <DemoAdapterBadge />}
        </div>
        <p className="min-h-[2.5rem] text-xs text-muted-foreground">{app.description}</p>
        <div className="flex items-center justify-between border-t pt-3">
          {unlocked ? (
            <div className="flex items-center gap-2">
              <Switch checked={installed} onCheckedChange={toggleInstall} />
              <span className="text-xs text-muted-foreground">
                {installed ? "Installed" : "Not installed"}
              </span>
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
                toast("Upgrade required", {
                  description: `Upgrade to the ${app.requiredPlan} plan to unlock ${app.name}.`,
                })
              }
            >
              Upgrade
            </Button>
          )}
          {unlocked && installed && (
            <span className="flex items-center gap-1 text-[11px] text-success">
              <Check className="size-3" />
              Active
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function AppMarketplace() {
  const { org } = useOrg();

  return (
    <>
      <PageHeader
        title="App Marketplace"
        description={`Install or uninstall apps for ${org.name}. Locked apps require a plan upgrade.`}
      />
      <div className="space-y-8">
        {[...PODS].sort((a, b) => a.order - b.order).map((pod) => {
          const apps = getAppsByPod(pod.id);
          if (apps.length === 0) return null;
          return (
            <div key={pod.id}>
              <div className="mb-3 flex items-center gap-2">
                <AppIcon name={pod.icon} className="size-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">{getPod(pod.id)?.label}</h2>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {apps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
