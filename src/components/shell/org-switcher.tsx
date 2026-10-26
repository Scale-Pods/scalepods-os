"use client";

import { Check, ChevronDown, Building2 } from "lucide-react";
import { useOrg } from "@/lib/org-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function OrgSwitcher() {
  const { org, orgs, setOrgId } = useOrg();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 h-8">
          <Building2 className="size-3.5 text-muted-foreground" />
          <span className="max-w-32 truncate">{org.name}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {orgs.map((o) => (
          <DropdownMenuItem key={o.id} onClick={() => setOrgId(o.id)} className="justify-between">
            <span className="truncate">{o.name}</span>
            {o.id === org.id && <Check className="size-4 text-accent" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
