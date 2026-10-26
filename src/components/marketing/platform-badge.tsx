import { Share2, Camera, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PLATFORM_COLOR_CLASS, PLATFORM_LABEL, type ContentPlatform } from "@/lib/mock-data/marketing";

const PLATFORM_ICON: Record<ContentPlatform, typeof Share2> = {
  linkedin: Share2,
  instagram: Camera,
  blog: Newspaper,
};

export function PlatformBadge({
  platform,
  className,
}: {
  platform: ContentPlatform;
  className?: string;
}) {
  const Icon = PLATFORM_ICON[platform];
  const colors = PLATFORM_COLOR_CLASS[platform];
  return (
    <Badge
      variant="outline"
      className={cn("gap-1 border-0 text-[11px] font-medium", colors.bg, colors.text, className)}
    >
      <Icon className="size-3" />
      {PLATFORM_LABEL[platform]}
    </Badge>
  );
}

export function PlatformDot({ platform, className }: { platform: ContentPlatform; className?: string }) {
  const colors = PLATFORM_COLOR_CLASS[platform];
  return <span className={cn("inline-block size-2 shrink-0 rounded-full", colors.dot, className)} />;
}
