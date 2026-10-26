import { Mail, MessageSquare, Phone, Users as UsersIcon, StickyNote, Sparkles, ArrowRightLeft } from "lucide-react";
import type { Activity, ActivityType } from "@/lib/types/core";
import { formatRelative } from "@/lib/format";
import { AiGeneratedBadge } from "@/components/shared/badges";

const ICONS: Record<ActivityType, React.ComponentType<{ className?: string }>> = {
  call: Phone,
  email: Mail,
  whatsapp: MessageSquare,
  meeting: UsersIcon,
  note: StickyNote,
  stage_change: ArrowRightLeft,
  ai_action: Sparkles,
};

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity yet.</p>;
  }

  return (
    <ol className="space-y-4">
      {activities.map((activity) => {
        const Icon = ICONS[activity.type];
        return (
          <li key={activity.id} className="flex gap-3">
            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary">
              <Icon className="size-3.5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="text-sm font-medium">{activity.title}</p>
                {activity.aiGenerated && <AiGeneratedBadge />}
              </div>
              {activity.description && (
                <p className="mt-0.5 text-sm text-muted-foreground">{activity.description}</p>
              )}
              <p className="mt-0.5 text-xs text-muted-foreground">{formatRelative(activity.createdAt)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
