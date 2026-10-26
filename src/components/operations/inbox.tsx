"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Mail,
  MessageCircle,
  Globe,
  Search,
  Send,
  Check,
  Pencil,
  X,
  Flag,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, AiGeneratedBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { InboxAnalyticsStrip } from "@/components/operations/inbox-analytics";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/format";
import type { MessageChannel } from "@/lib/types/core";
import {
  AI_SUGGESTED_REPLY,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES_BY_CONVERSATION,
} from "@/lib/mock-data/operations";

const CHANNEL_ICON: Record<MessageChannel, React.ElementType> = {
  whatsapp: MessageCircle,
  email: Mail,
  web_chat: Globe,
  sms: MessageCircle,
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function OperationsInbox() {
  const [search, setSearch] = React.useState("");
  const [channelFilter, setChannelFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = React.useState<string>("all");
  const [selectedId, setSelectedId] = React.useState<string>(MOCK_CONVERSATIONS[0]?.id ?? "");
  const [compose, setCompose] = React.useState("");
  const [suggestionDismissed, setSuggestionDismissed] = React.useState<Record<string, boolean>>({});

  const assignees = React.useMemo(
    () => Array.from(new Set(MOCK_CONVERSATIONS.map((c) => c.assigneeName ?? "Unassigned"))),
    []
  );

  const filtered = MOCK_CONVERSATIONS.filter((c) => {
    if (channelFilter !== "all" && c.channel !== channelFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (assigneeFilter !== "all" && (c.assigneeName ?? "Unassigned") !== assigneeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !c.contactName.toLowerCase().includes(q) &&
        !c.lastMessageSnippet.toLowerCase().includes(q) &&
        !(c.companyName ?? "").toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const selected = filtered.find((c) => c.id === selectedId) ?? filtered[0];
  const thread = selected ? MOCK_MESSAGES_BY_CONVERSATION[selected.id] ?? [] : [];
  const showSuggestion = selected && !suggestionDismissed[selected.id];

  function handleSend() {
    if (!compose.trim()) return;
    toast.success("Reply sent", {
      description: `Your message to ${selected?.contactName} was sent via ${selected?.channel.replace("_", " ")}.`,
    });
    setCompose("");
  }

  function acceptSuggestion() {
    if (!selected) return;
    setCompose(AI_SUGGESTED_REPLY.replace("{{name}}", selected.contactName.split(" ")[0]));
    setSuggestionDismissed((s) => ({ ...s, [selected.id]: true }));
    toast.success("AI suggestion accepted into compose box");
  }

  function editSuggestion() {
    if (!selected) return;
    setCompose(AI_SUGGESTED_REPLY.replace("{{name}}", selected.contactName.split(" ")[0]));
    setSuggestionDismissed((s) => ({ ...s, [selected.id]: true }));
  }

  function discardSuggestion() {
    if (!selected) return;
    setSuggestionDismissed((s) => ({ ...s, [selected.id]: true }));
    toast("AI suggestion discarded");
  }

  return (
    <>
      <InboxAnalyticsStrip />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
      {/* Conversation list */}
      <div className="flex flex-col rounded-lg border">
        <div className="space-y-2 border-b p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-sm"
            />
          </div>
          <div className="flex gap-1.5">
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger size="sm" className="h-7 flex-1 text-xs">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All channels</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="web_chat">Web chat</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger size="sm" className="h-7 flex-1 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger size="sm" className="h-7 flex-1 text-xs">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Everyone</SelectItem>
                {assignees.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <ScrollArea className="h-[600px]">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No conversations found"
              description="Try adjusting your search or filters."
              className="border-0 py-10"
            />
          ) : (
            <div className="divide-y">
              {filtered.map((c) => {
                const Icon = CHANNEL_ICON[c.channel];
                const active = selected?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={cn(
                      "flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/50",
                      active && "bg-muted"
                    )}
                  >
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className="bg-primary/15 text-xs text-primary">
                        {initials(c.contactName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{c.contactName}</span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {formatRelative(c.lastMessageAt)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-muted-foreground">
                        <Icon className="size-3 shrink-0" />
                        <p className="truncate text-xs">{c.lastMessageSnippet}</p>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <StatusBadge status={c.status} />
                        {c.sentimentFlag === "negative" && (
                          <span
                            title="Negative review/complaint intercepted"
                            className="flex items-center gap-0.5 text-[10px] font-medium text-destructive"
                          >
                            <Flag className="size-2.5" />
                            Negative
                          </span>
                        )}
                        {c.unread && <span className="size-1.5 rounded-full bg-primary" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Thread */}
      <div className="flex flex-col rounded-lg border">
        {selected ? (
          <>
            <div className="flex items-center justify-between gap-3 border-b p-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary/15 text-sm text-primary">
                    {initials(selected.contactName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{selected.contactName}</p>
                  <p className="text-xs text-muted-foreground">
                    {selected.companyName ?? "No company"} · {selected.channel.replace("_", " ")}
                    {selected.subject ? ` · ${selected.subject}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selected.sentimentFlag === "negative" && (
                  <div className="flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-[11px] font-medium text-destructive">
                    <AlertTriangle className="size-3" />
                    Negative review/complaint intercepted
                  </div>
                )}
                <StatusBadge status={selected.status} />
              </div>
            </div>

            <ScrollArea className="h-[420px] flex-1 p-4">
              <div className="flex flex-col gap-3">
                {thread.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex flex-col gap-1",
                      m.direction === "outbound" ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                        m.direction === "outbound"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {m.body}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span>{m.authorName}</span>
                      <span>·</span>
                      <span>{formatRelative(m.createdAt)}</span>
                      {m.aiGenerated && <AiGeneratedBadge />}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator />

            <div className="space-y-2 p-3">
              {showSuggestion && (
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <AiGeneratedBadge />
                    <span className="text-[11px] text-muted-foreground">AI suggested reply</span>
                  </div>
                  <p className="text-sm">
                    {AI_SUGGESTED_REPLY.replace("{{name}}", selected.contactName.split(" ")[0])}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="secondary" className="h-7 gap-1" onClick={acceptSuggestion}>
                      <Check className="size-3" />
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 gap-1" onClick={editSuggestion}>
                      <Pencil className="size-3" />
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 gap-1" onClick={discardSuggestion}>
                      <X className="size-3" />
                      Discard
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={compose}
                  onChange={(e) => setCompose(e.target.value)}
                  className="min-h-[60px] resize-none text-sm"
                />
                <Button className="self-end gap-1.5" onClick={handleSend}>
                  <Send className="size-3.5" />
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            icon={MessageCircle}
            title="No conversation selected"
            description="Select a conversation from the list to view the thread."
            className="h-full border-0"
          />
        )}
      </div>
      </div>
    </>
  );
}
