"use client";

import Link from "next/link";
import { Bell, Sparkles } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_APPROVALS } from "@/lib/mock-data/approvals";
import { formatRelative } from "@/lib/format";

export function NotificationsBell() {
  const pending = MOCK_APPROVALS.filter((a) => a.status === "pending");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative size-8">
          <Bell className="size-4" />
          {pending.length > 0 && (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
              {pending.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2.5">
          <p className="text-sm font-semibold">Approvals waiting</p>
          <Badge variant="secondary" className="text-xs">{pending.length} pending</Badge>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {pending.map((a) => (
            <Link
              key={a.id}
              href="/settings/approvals"
              className="flex gap-3 border-b px-3 py-3 text-sm hover:bg-accent/5 last:border-b-0"
            >
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Sparkles className="size-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-snug">{a.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{a.description}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{formatRelative(a.createdAt)}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="p-2">
          <Link href="/settings/approvals">
            <Button variant="ghost" size="sm" className="w-full">
              View all approvals
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
