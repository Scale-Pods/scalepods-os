import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StaffingModeBadge({ className }: { className?: string }) {
  return (
    <Badge variant="secondary" className={cn("gap-1 bg-primary/15 text-primary text-[10px] hover:bg-primary/15", className)}>
      <Building2 className="size-2.5" />
      Staffing mode
    </Badge>
  );
}
