import {
  LayoutDashboard,
  Users,
  Target,
  Megaphone,
  Headset,
  Blocks,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PodCopy {
  icon: LucideIcon;
  name: string;
  tagline: string;
  apps: string[];
  status: "Full build" | "Basic" | "Scaffold";
}

const PODS: PodCopy[] = [
  {
    icon: LayoutDashboard,
    name: "Home",
    tagline: "One dashboard for every app you've installed",
    apps: ["Master Dashboard", "Executive Board"],
    status: "Full build",
  },
  {
    icon: Users,
    name: "HR Pod",
    tagline: "Screen, rank and outreach candidates with AI",
    apps: ["Recruit", "Staffing mode"],
    status: "Full build",
  },
  {
    icon: Target,
    name: "Sales Pod",
    tagline: "Reply to leads in under 60 seconds, every time",
    apps: ["Leads & CRM", "Lead Response", "Outreach", "Rep Activity"],
    status: "Full build",
  },
  {
    icon: Megaphone,
    name: "Marketing Pod",
    tagline: "AI drafts, maker-checker review, publishing calendar",
    apps: ["Content OS"],
    status: "Basic",
  },
  {
    icon: Headset,
    name: "Operations Pod",
    tagline: "Unified inbox and AI-chased receivables",
    apps: ["Customer Care", "Receivables Recovery"],
    status: "Basic",
  },
  {
    icon: Blocks,
    name: "Custom Studio",
    tagline: "Plug in a client-specific module via one manifest",
    apps: ["Inventory Intel (example)"],
    status: "Scaffold",
  },
];

const STATUS_STYLE: Record<PodCopy["status"], string> = {
  "Full build": "bg-success/15 text-success border-0",
  Basic: "bg-warning/15 text-warning border-0",
  Scaffold: "bg-muted text-muted-foreground border-0",
};

export function PodsSection() {
  return (
    <section id="pods" className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-3 text-accent border-accent/30 bg-accent/10">
            Smarter services, built with AI
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Every function of your business, one workspace
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Apps are grouped into Pods. Install what you need, upgrade to unlock more — your
            contacts, companies and conversations stay shared across every app.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PODS.map((pod) => (
            <Card key={pod.name} className="group transition-colors hover:border-primary/40">
              <CardContent className="flex flex-col gap-3 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <pod.icon className="size-5" />
                  </div>
                  <Badge className={STATUS_STYLE[pod.status]}>{pod.status}</Badge>
                </div>
                <div>
                  <h3 className="font-semibold">{pod.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{pod.tagline}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {pod.apps.map((app) => (
                    <span
                      key={app}
                      className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
