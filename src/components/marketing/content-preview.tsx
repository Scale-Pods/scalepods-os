import { Heart, MessageCircle, Repeat2, Send, Bookmark, MoreHorizontal, ThumbsUp, Share2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CURRENT_USER } from "@/lib/mock-data/orgs";
import type { ContentDraft } from "@/lib/mock-data/marketing";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ContentPreview({ draft }: { draft: ContentDraft }) {
  if (draft.platform === "linkedin") return <LinkedInPreview draft={draft} />;
  if (draft.platform === "instagram") return <InstagramPreview draft={draft} />;
  return <BlogPreview draft={draft} />;
}

function LinkedInPreview({ draft }: { draft: ContentDraft }) {
  const orgName = "Demo Realty";
  return (
    <Card className="mx-auto w-full max-w-xl gap-0 overflow-hidden py-0">
      <CardContent className="px-4 py-4">
        <div className="flex items-start gap-2.5">
          <Avatar>
            <AvatarFallback>{initials(orgName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-semibold">{orgName}</p>
            <p className="text-xs text-muted-foreground">2,481 followers</p>
            <p className="text-xs text-muted-foreground">Just now &middot; 🌐</p>
          </div>
          <MoreHorizontal className="size-4 text-muted-foreground" />
        </div>

        <div className="mt-3 space-y-3 whitespace-pre-line text-sm leading-relaxed">
          {draft.body}
        </div>

        {draft.hashtags && draft.hashtags.length > 0 && (
          <p className="mt-3 text-sm font-medium text-primary">{draft.hashtags.join(" ")}</p>
        )}

        {draft.imagePrompt && (
          <div className="mt-3 flex aspect-[1.91/1] items-center justify-center rounded-lg border border-dashed bg-muted/50 px-4 text-center text-xs text-muted-foreground">
            AI image placeholder &mdash; &ldquo;{draft.imagePrompt}&rdquo;
          </div>
        )}
      </CardContent>

      <Separator />
      <CardContent className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <ThumbsUp className="size-3.5" /> 128
        </div>
        <span>24 comments &middot; 6 reposts</span>
      </CardContent>
      <Separator />
      <CardContent className="grid grid-cols-4 gap-1 px-2 py-1.5 text-xs text-muted-foreground">
        {[
          { icon: ThumbsUp, label: "Like" },
          { icon: MessageCircle, label: "Comment" },
          { icon: Repeat2, label: "Repost" },
          { icon: Send, label: "Send" },
        ].map((a) => (
          <div key={a.label} className="flex items-center justify-center gap-1.5 rounded-md py-2 hover:bg-muted">
            <a.icon className="size-4" />
            <span className="hidden sm:inline">{a.label}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function InstagramPreview({ draft }: { draft: ContentDraft }) {
  const handle = "demorealty.ae";
  return (
    <Card className="mx-auto w-full max-w-sm gap-0 overflow-hidden py-0">
      <CardContent className="flex items-center gap-2.5 px-3 py-3">
        <Avatar size="sm" className="ring-2 ring-accent/50">
          <AvatarFallback>{initials(handle)}</AvatarFallback>
        </Avatar>
        <p className="flex-1 text-sm font-semibold">{handle}</p>
        <MoreHorizontal className="size-4 text-muted-foreground" />
      </CardContent>

      <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-accent/20 via-muted to-primary/10 px-6 text-center text-xs text-muted-foreground">
        {draft.imagePrompt ?? "AI-generated image placeholder"}
      </div>

      <CardContent className="px-3 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="size-5" />
            <MessageCircle className="size-5" />
            <Send className="size-5" />
          </div>
          <Bookmark className="size-5" />
        </div>
        <p className="mt-2 text-sm font-semibold">842 likes</p>
        <p className="mt-1 text-sm leading-relaxed">
          <span className="font-semibold">{handle}</span>{" "}
          <span className="whitespace-pre-line">{draft.body}</span>
        </p>
        {draft.hashtags && draft.hashtags.length > 0 && (
          <p className="mt-2 text-sm text-primary">{draft.hashtags.join(" ")}</p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">View all 36 comments</p>
      </CardContent>
    </Card>
  );
}

function BlogPreview({ draft }: { draft: ContentDraft }) {
  const paragraphs = draft.body.split("\n\n");
  return (
    <Card className="mx-auto w-full max-w-2xl py-0">
      <CardContent className="px-8 py-8">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Demo Realty Blog
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-tight">{draft.title}</h1>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Avatar size="sm">
            <AvatarFallback>{initials(CURRENT_USER.name)}</AvatarFallback>
          </Avatar>
          <span>By {CURRENT_USER.name}</span>
          <span>&middot;</span>
          <span>{Math.max(3, Math.round((draft.wordCount ?? 500) / 200))} min read</span>
        </div>

        <Separator className="my-5" />

        <article className="space-y-4 text-sm leading-relaxed">
          {paragraphs.map((p, i) => {
            if (p.startsWith("## ")) {
              return (
                <h2 key={i} className="pt-2 text-base font-semibold">
                  {p.replace("## ", "")}
                </h2>
              );
            }
            // simple bold markdown rendering for **text**
            const parts = p.split(/\*\*(.*?)\*\*/g);
            return (
              <p key={i} className="whitespace-pre-line text-muted-foreground">
                {parts.map((part, j) =>
                  j % 2 === 1 ? (
                    <strong key={j} className="font-semibold text-foreground">
                      {part}
                    </strong>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </p>
            );
          })}
        </article>

        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Share2 className="size-3.5" />
          Share this article
        </div>
      </CardContent>
    </Card>
  );
}
