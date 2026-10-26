import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge, AiGeneratedBadge } from "@/components/shared/badges";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import { formatRelative } from "@/lib/format";
import { MEMBERS } from "@/lib/mock-data/orgs";
import type { ContentDraft } from "@/lib/mock-data/marketing";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DraftCard({ draft }: { draft: ContentDraft }) {
  const reviewer = MEMBERS.find((m) => m.id === draft.reviewerId);

  return (
    <Link href={`/marketing/content-os/drafts/${draft.id}`}>
      <Card className="gap-3 py-4 transition-colors hover:border-ring/40 hover:bg-card/80">
        <CardContent className="px-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <PlatformBadge platform={draft.platform} />
              <StatusBadge status={draft.status} />
            </div>
            {draft.aiGenerated && <AiGeneratedBadge />}
          </div>

          <h3 className="mt-2.5 line-clamp-1 text-sm font-semibold">{draft.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{draft.hook}</p>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarFallback>{reviewer ? initials(reviewer.name) : "?"}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {reviewer?.name ?? "Unassigned"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {draft.comments.length > 0 && (
                <span className="flex items-center gap-1">
                  <MessageSquareText className="size-3" />
                  {draft.comments.length}
                </span>
              )}
              <span>{formatRelative(draft.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
