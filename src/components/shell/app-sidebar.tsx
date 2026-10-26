"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Moon, Sun, Sparkles, ChevronRight, Lock } from "lucide-react";
import { useTheme } from "next-themes";
import { AppIcon } from "@/lib/icon";
import { findAppByPath, isAppUnlocked } from "@/lib/registry/apps";
import { PODS } from "@/lib/registry/pods";
import { APP_REGISTRY } from "@/lib/registry/apps";
import { AppSwitcher } from "@/components/shell/app-switcher";
import { CURRENT_USER } from "@/lib/mock-data/orgs";
import { useOrg } from "@/lib/org-context";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const currentApp = findAppByPath(pathname);
  const { theme, setTheme } = useTheme();
  const { org } = useOrg();

  const [toggledApps, setToggledApps] = React.useState<Set<string>>(() => new Set());

  function toggleApp(id: string) {
    setToggledApps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const initials = CURRENT_USER.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  const installed = new Set(org.installedApps);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-0 p-2">
        <AppSwitcher />
      </SidebarHeader>
      <SidebarContent className="px-2 gap-0">
        {PODS.map((pod) => {
          const apps = APP_REGISTRY.filter((a) => a.pod === pod.id);
          if (apps.length === 0) return null;
          return (
            <SidebarGroup key={pod.id} className="py-1">
              <SidebarGroupLabel className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                <AppIcon name={pod.icon} className="size-3" />
                {pod.label}
              </SidebarGroupLabel>
              <SidebarMenu>
                {apps.map((app) => {
                  const unlocked = isAppUnlocked(app, org.plan) && installed.has(app.id);
                  const active = app.id === currentApp?.id;
                  const defaultOpen = active;
                  const isOpen =
                    (toggledApps.has(app.id) ? !defaultOpen : defaultOpen) &&
                    app.nav.length > 0;
                  return (
                    <SidebarMenuItem key={app.id}>
                      <SidebarMenuButton
                        isActive={active && app.nav.length === 0}
                        disabled={!unlocked}
                        onClick={() => {
                          if (!unlocked) return;
                          if (app.nav.length > 0) toggleApp(app.id);
                        }}
                        asChild={app.nav.length === 0 && unlocked}
                        className={cn(!unlocked && "opacity-50")}
                      >
                        {app.nav.length === 0 && unlocked ? (
                          <Link href={app.basePath}>
                            <AppIcon name={app.icon} className="size-4" />
                            <span className="truncate">{app.name}</span>
                          </Link>
                        ) : (
                          <>
                            <AppIcon name={app.icon} className="size-4 shrink-0" />
                            <span className="truncate flex-1 text-left">{app.name}</span>
                            {!unlocked ? (
                              <Lock className="size-3 shrink-0 text-muted-foreground" />
                            ) : app.nav.length > 0 ? (
                              <ChevronRight
                                className={cn(
                                  "size-3.5 shrink-0 text-muted-foreground transition-transform",
                                  isOpen && "rotate-90"
                                )}
                              />
                            ) : null}
                          </>
                        )}
                      </SidebarMenuButton>
                      {!unlocked && (
                        <Badge
                          variant="outline"
                          className="ml-7 mt-0.5 text-[10px] px-1.5 py-0 text-muted-foreground"
                        >
                          Upgrade to {app.requiredPlan}
                        </Badge>
                      )}
                      {unlocked && isOpen && app.nav.length > 0 && (
                        <SidebarMenuSub>
                          {app.nav.map((item) => {
                            const href = `${app.basePath}${item.path}`;
                            const subActive = pathname.startsWith(href);
                            return (
                              <SidebarMenuSubItem key={item.path}>
                                <SidebarMenuSubButton asChild isActive={subActive}>
                                  <Link href={href}>
                                    <span className={cn(subActive && "font-medium text-primary")}>
                                      {item.label}
                                    </span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter className="gap-2 border-t p-2">
        <div className="flex items-center gap-2 px-1 text-[11px] text-muted-foreground">
          <Sparkles className="size-3 text-accent" />
          Powered by ScalePods
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="size-4 scale-100 dark:scale-0 transition-transform" />
            <Moon className="absolute size-4 scale-0 dark:scale-100 transition-transform" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-1 items-center gap-2 rounded-md px-1.5 py-1 text-left hover:bg-sidebar-accent">
                <Avatar className="size-7">
                  <AvatarFallback className="bg-primary/15 text-primary text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{CURRENT_USER.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {CURRENT_USER.role}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/settings/organization">Organization settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/members">Members &amp; roles</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">
                  <LogOut className="size-4" />
                  Sign out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
