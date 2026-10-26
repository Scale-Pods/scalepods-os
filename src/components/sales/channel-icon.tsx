import { Mail, MessageCircle, Globe, Phone, MessageSquareText } from "lucide-react";
import type { MessageChannel } from "@/lib/types/core";
import { cn } from "@/lib/utils";

const CHANNEL_META: Record<
  MessageChannel,
  { icon: typeof Mail; label: string; className: string }
> = {
  email: { icon: Mail, label: "Email", className: "text-primary" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp", className: "text-success" },
  web_chat: { icon: Globe, label: "Web chat", className: "text-accent" },
  sms: { icon: MessageSquareText, label: "SMS", className: "text-muted-foreground" },
};

export function ChannelIcon({
  channel,
  className,
  withLabel = false,
}: {
  channel: MessageChannel;
  className?: string;
  withLabel?: boolean;
}) {
  const meta = CHANNEL_META[channel] ?? { icon: Phone, label: channel, className: "text-muted-foreground" };
  const Icon = meta.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5", meta.className, className)}>
      <Icon className="size-3.5" />
      {withLabel && <span className="text-xs font-medium text-foreground">{meta.label}</span>}
    </span>
  );
}

export function channelLabel(channel: MessageChannel) {
  return CHANNEL_META[channel]?.label ?? channel;
}
