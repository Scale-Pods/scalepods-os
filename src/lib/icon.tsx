import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";

export function AppIcon({
  name,
  ...props
}: { name: string } & LucideProps) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Square;
  return <Icon {...props} />;
}
