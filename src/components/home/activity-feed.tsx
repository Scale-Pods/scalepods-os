"use client";

import { Bot, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RelativeTime } from "@/components/shared/relative-time";
import type { AuditLogEntry } from "@/lib/types/core";

export function ActivityFeed({ entries }: { entries: AuditLogEntry[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Recent activity across your workspace</CardTitle>
        <span className="text-xs text-muted-foreground">{entries.length} events</span>
      </CardHeader>
      <CardContent className="px-0">
        <ScrollArea className="h-96 px-4">
          <ul className="divide-y">
            {entries.map((entry) => (
              <li key={entry.id} className="flex items-start gap-3 py-2.5">
                <div
                  className={
                    entry.actorType === "agent"
                      ? "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent"
                      : "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
                  }
                >
                  {entry.actorType === "agent" ? <Bot className="size-3.5" /> : <User className="size-3.5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">
                    <span className="font-medium">{entry.actorName}</span>{" "}
                    <span className="text-muted-foreground">{entry.action}</span>
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span><RelativeTime iso={entry.createdAt} /></span>
                    {entry.costUsd !== undefined && (
                      <>
                        <span>·</span>
                        <span>${entry.costUsd.toFixed(4)}</span>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
