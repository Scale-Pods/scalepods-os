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
        sideOffset={8}
        collisionPadding={12}
        className="flex w-[22rem] max-w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden p-0"
        style={{ maxHeight: "min(32rem, calc(100vh - 6rem))" }}
      >
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <p className="text-sm font-semibold">Switch app</p>
          <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">⌘J</kbd>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2">
          {PODS.map((pod, podIdx) => {
            const apps = APP_REGISTRY.filter((a) => a.pod === pod.id);
            if (apps.length === 0) return null;
            return (
              <div key={pod.id} className={cn(podIdx > 0 && "mt-2 border-t pt-2")}>
                <div className="flex items-center gap-1.5 px-2 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
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
                        "relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                        unlocked ? "cursor-pointer hover:bg-muted" : "cursor-not-allowed opacity-50",
                        active && "bg-muted"
                      )}
                    >
                      {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" />}
                      <div
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg",
                          active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                        )}
                      >
                        <AppIcon name={app.icon} className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium leading-tight">{app.name}</div>
                        <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{app.description}</div>
                      </div>
                      {active && <Check className="size-4 shrink-0 text-primary" />}
                      {!unlocked && (
                        <Badge variant="outline" className="shrink-0 gap-1 px-1.5 py-0 text-[10px]">
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
            className="flex items-center justify-center rounded-lg px-2 py-2 text-sm font-medium text-primary hover:bg-muted"
          >
            Browse App Marketplace
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
