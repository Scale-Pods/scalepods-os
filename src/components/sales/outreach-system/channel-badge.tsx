import { Mail, MessageCircle, Mic, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type OutreachChannel = "email" | "whatsapp" | "voice" | "linkedin";

const META: Record<OutreachChannel, { icon: typeof Mail; label: string; className: string }> = {
  email: { icon: Mail, label: "Email", className: "text-primary" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp", className: "text-success" },
  voice: { icon: Mic, label: "Voice", className: "text-warning" },
  linkedin: { icon: Share2, label: "LinkedIn", className: "text-accent" },
};

export function ChannelBadge({
  channel,
  withLabel = true,
  className,
}: {
  channel: OutreachChannel;
  withLabel?: boolean;
  className?: string;
}) {
  const meta = META[channel];
  const Icon = meta.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", meta.className, className)}>
      <Icon className="size-3.5" />
      {withLabel && meta.label}
    </span>
  );
}
