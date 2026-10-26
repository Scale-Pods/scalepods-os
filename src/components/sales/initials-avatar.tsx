import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function InitialsAvatar({
  name,
  size = "default",
  className,
}: {
  name: string;
  size?: "default" | "sm" | "lg";
  className?: string;
}) {
  return (
    <Avatar size={size} className={cn(className)}>
      <AvatarFallback>{initials(name)}</AvatarFallback>
    </Avatar>
  );
}
