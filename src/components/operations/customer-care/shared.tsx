"use client";

import * as React from "react";
import { Bot, Globe, Camera, MessageCircle, ShoppingBag, Star, User, UserCog, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ccFmtDateTime,
  ccChannelLabel,
  type CcChannel,
  type CcMessage,
  type CcPriority,
  type CcSentiment,
} from "@/lib/mock-data/customer-care";

export const inr = (n: number) => `Rs.${n.toLocaleString("en-IN")}`;

const CHANNEL_ICON: Record<CcChannel, LucideIcon> = {
  whatsapp: MessageCircle,
  shopify: ShoppingBag,
  instagram: Camera,
  website: Globe,
};
const CHANNEL_CLASS: Record<CcChannel, string> = {
  whatsapp: "bg-success/15 text-success",
  shopify: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  instagram: "bg-pink-500/15 text-pink-600 dark:text-pink-400",
  website: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
};

export function ChannelBadge({ channel }: { channel: CcChannel }) {
  const Icon = CHANNEL_ICON[channel];
  return (
    <Badge variant="outline" className={cn("gap-1 border-0 text-[11px]", CHANNEL_CLASS[channel])}>
      <Icon className="size-3" />
      {ccChannelLabel(channel)}
    </Badge>
  );
}

export function SentimentBadge({ sentiment }: { sentiment: CcSentiment }) {
  const cls =
    sentiment === "positive"
      ? "bg-success/15 text-success"
      : sentiment === "negative"
        ? "bg-destructive/15 text-destructive"
        : "bg-muted text-muted-foreground";
  return (
    <Badge variant="outline" className={cn("border-0 text-[11px] capitalize", cls)}>
      {sentiment}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: CcPriority }) {
  const cls =
    priority === "urgent"
      ? "bg-destructive/15 text-destructive"
      : priority === "high"
        ? "bg-warning/15 text-warning"
        : priority === "medium"
          ? "bg-primary/15 text-primary"
          : "bg-muted text-muted-foreground";
  return (
    <Badge variant="outline" className={cn("border-0 text-[11px] capitalize", cls)}>
      {priority}
    </Badge>
  );
}

export function Pill({ tone, children }: { tone: "green" | "red" | "orange" | "blue" | "neutral"; children: React.ReactNode }) {
  const cls = {
    green: "bg-success/15 text-success",
    red: "bg-destructive/15 text-destructive",
    orange: "bg-warning/15 text-warning",
    blue: "bg-primary/15 text-primary",
    neutral: "bg-muted text-muted-foreground",
  }[tone];
  return (
    <Badge variant="outline" className={cn("border-0 text-[11px]", cls)}>
      {children}
    </Badge>
  );
}

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          style={{ width: size, height: size }}
          className={n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}
        />
      ))}
    </span>
  );
}

export function Bubble({ m, who }: { m: CcMessage; who?: string }) {
  const isCustomer = m.sender === "customer";
  const Icon = m.sender === "ai" ? Bot : m.sender === "agent" ? UserCog : User;
  const label = m.sender === "ai" ? "AI agent" : m.sender === "agent" ? "Human agent" : (who ?? "Customer");
  return (
    <div className={cn("flex", isCustomer ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-3 py-2 text-sm",
          isCustomer && "bg-muted",
          m.sender === "ai" && "bg-primary/10",
          m.sender === "agent" && "bg-primary text-primary-foreground"
        )}
      >
        <div className="mb-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide opacity-70">
          <Icon className="size-3" />
          {label}
        </div>
        <p className="whitespace-pre-line">{m.msg}</p>
        <p className="mt-1 text-right text-[10px] opacity-60">{ccFmtDateTime(m.at)}</p>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm font-medium">{children}</div>
    </div>
  );
}

export function Bar({ pct, tone = "primary" }: { pct: number; tone?: "primary" | "green" | "orange" | "red" }) {
  const cls = { primary: "bg-primary", green: "bg-success", orange: "bg-warning", red: "bg-destructive" }[tone];
  return (
    <div className="h-1.5 w-full rounded-full bg-muted">
      <div className={cn("h-full rounded-full", cls)} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );
}

export const pctTone = (p: number): "green" | "orange" | "red" => (p >= 95 ? "green" : p >= 50 ? "orange" : "red");
