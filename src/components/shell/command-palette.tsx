"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { APP_REGISTRY } from "@/lib/registry/apps";
import { AppIcon } from "@/lib/icon";
import { Plus } from "lucide-react";
import { useCommandPaletteStore } from "@/lib/command-palette-store";

export function CommandPalette() {
  const { open, setOpen } = useCommandPaletteStore();
  const router = useRouter();

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  function go(path: string) {
    setOpen(false);
    router.push(path);
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search" description="Search ScalePods OS">
      <CommandInput placeholder="Search apps, contacts, deals, candidates, invoices, actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => go("/hr/recruit/jobs?new=1")}>
            <Plus className="size-4" />
            New job
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Apps">
          {APP_REGISTRY.map((app) => (
            <CommandItem key={app.id} onSelect={() => go(app.basePath)}>
              <AppIcon name={app.icon} className="size-4" />
              {app.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
