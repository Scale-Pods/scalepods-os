"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown, Lock, Check } from "lucide-react";
import { AppIcon } from "@/lib/icon";
import { APP_REGISTRY, findAppByPath, isAppUnlocked } from "@/lib/registry/apps";
import { PODS } from "@/lib/registry/pods";
import { useOrg } from "@/lib/org-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AppSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const { org } = useOrg();
  const [open, setOpen] = React.useState(false);
  const currentApp = findAppByPath(pathname) ?? APP_REGISTRY[0];

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const installed = new Set(org.installedApps);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-2 h-12 hover:bg-sidebar-accent"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <AppIcon name={currentApp.icon} className="size-4" />
          </div>
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-sm font-semibold truncate w-full text-left">
              {currentApp.name}
            </span>
            <span className="text-xs text-muted-foreground truncate w-full text-left">
              {org.name}
            </span>
          </div>
          <ChevronsUpDown className="size-4 text-muted-foreground shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-80 p-0 max-h-[70vh] overflow-y-auto"
      >
        <div className="p-2">
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Switch app <kbd className="ml-1 rounded border bg-muted px-1 py-0.5 text-[10px]">⌘J</kbd>
          </p>
          {PODS.map((pod) => {
            const apps = APP_REGISTRY.filter((a) => a.pod === pod.id);
            if (apps.length === 0) return null;
            return (
              <div key={pod.id} className="mb-1">
                <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground">
                  <AppIcon name={pod.icon} className="size-3.5" />
                  {pod.label}
                </div>
                {apps.map((app) => {
                  const unlocked = isAppUnlocked(app, org.plan) && installed.has(app.id);
                  const active = app.id === currentApp.id;
                  return (
                    <button
                      key={app.id}
                      disabled={!unlocked}
                      onClick={() => {
                        if (!unlocked) return;
                        setOpen(false);
                        router.push(app.basePath);
                      }}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm transition-colors",
                        unlocked
                          ? "hover:bg-accent/10 cursor-pointer"
                          : "cursor-not-allowed opacity-50",
                        active && "bg-accent/15"
                      )}
                    >
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary">
                        <AppIcon name={app.icon} className="size-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{app.name}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {app.description}
                        </div>
                      </div>
                      {active && <Check className="size-4 text-accent shrink-0" />}
                      {!unlocked && (
                        <Badge
                          variant="outline"
                          className="gap-1 shrink-0 text-[10px] px-1.5 py-0"
                        >
                          <Lock className="size-2.5" />
                          Upgrade
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="border-t p-2">
          <Link
            href="/settings/apps"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center rounded-md px-2 py-2 text-sm font-medium text-primary hover:bg-accent/10"
          >
            Browse App Marketplace
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
