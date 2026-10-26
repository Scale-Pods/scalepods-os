"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { findAppByPath } from "@/lib/registry/apps";
import { DateRangePicker } from "@/components/shell/date-range-picker";
import { NotificationsBell } from "@/components/shell/notifications-bell";
import { OrgSwitcher } from "@/components/shell/org-switcher";
import { useCommandPaletteStore } from "@/lib/command-palette-store";

export function TopBar() {
  const pathname = usePathname();
  const setSearchOpen = useCommandPaletteStore((s) => s.setOpen);
  const app = findAppByPath(pathname);
  const rest = app ? pathname.slice(app.basePath.length).split("/").filter(Boolean) : [];

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <Breadcrumb className="hidden sm:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/home/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {app && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {rest.length === 0 ? (
                  <BreadcrumbPage>{app.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={app.basePath}>{app.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </>
          )}
          {rest.map((seg, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">
                  {decodeURIComponent(seg).replace(/-/g, " ")}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <button
        onClick={() => setSearchOpen(true)}
        className="ml-2 flex h-8 w-56 items-center gap-2 rounded-md border bg-secondary/50 px-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary lg:w-72"
      >
        <Search className="size-3.5" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="rounded border bg-background px-1 py-0.5 text-[10px]">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <DateRangePicker />
        <NotificationsBell />
        <OrgSwitcher />
      </div>
    </header>
  );
}
