"use client";

import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { AccountBadge } from "@/components/sales/outreach-system/account-badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MOCK_LINKEDIN_THREADS, type ChatThread } from "@/lib/mock-data/outreach-system";

export default function LinkedinChatPage() {
  const [active, setActive] = React.useState<ChatThread | null>(null);

  return (
    <>
      <PageHeader title="LinkedIn Chat" description="InMail and connection-request conversations across sender identities." />

      <Card>
        <CardContent className="px-0 py-0">
          <div className="divide-y">
            {MOCK_LINKEDIN_THREADS.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => setActive(thread)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted/50"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {thread.unread && <span className="size-2 shrink-0 rounded-full bg-primary" />}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{thread.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{thread.lastMessage}</p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <AccountBadge account={thread.account} />
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(thread.lastMessageAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {active && (
            <>
              <DialogHeader>
                <DialogTitle>{active.name}</DialogTitle>
              </DialogHeader>
              <p className="text-xs text-muted-foreground">{active.company}</p>
              <div className="max-h-[55vh] space-y-2 overflow-y-auto py-2">
                {active.messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn("flex", m.direction === "outbound" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                        m.direction === "outbound" ? "bg-primary/15 text-foreground" : "bg-muted text-foreground"
                      )}
                    >
                      {m.body}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
