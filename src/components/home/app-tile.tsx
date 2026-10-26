import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AppIcon } from "@/lib/icon";
import type { AppManifest } from "@/lib/types/manifest";

interface AppTileProps {
  app: AppManifest;
  metricLabel: string;
  metricValue: string;
}

export function AppTile({ app, metricLabel, metricValue }: AppTileProps) {
  return (
    <Link href={app.basePath} className="group block">
      <Card className="h-full transition-colors hover:bg-muted/40">
        <CardContent className="flex h-full flex-col gap-3 px-4">
          <div className="flex items-start justify-between">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <AppIcon name={app.icon} className="size-4.5" />
            </div>
            <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div>
            <p className="text-sm font-semibold">{app.name}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {app.description}
            </p>
          </div>
          <div className="mt-auto flex items-baseline justify-between border-t pt-3">
            <span className="text-xs text-muted-foreground">{metricLabel}</span>
            <span className="text-sm font-semibold">{metricValue}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
