"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, MapPin, CalendarDays, Wallet, Upload, Brain, BarChart3, Repeat, Layers } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MOCK_CAMPAIGNS,
  campaignStats,
  fmtDateShort,
  ROLE_SUGGESTIONS,
  type CampaignStatus,
} from "@/lib/mock-data/hr";
import { SuggestiveSearch } from "./shared";
import { cn } from "@/lib/utils";

const CAPS = [
  { icon: Upload, title: "Bulk Resume Upload", desc: "Upload multiple resumes in ZIP format for automated parsing" },
  { icon: Brain, title: "AI-Powered Analysis", desc: "Intelligent analysis of candidate strengths, gaps, and role fit" },
  { icon: BarChart3, title: "Smart Scoring System", desc: "Automated candidate scoring based on qualifications" },
  { icon: Repeat, title: "Multi-Round Tracking", desc: "Track candidates through multiple interview rounds" },
];

export function CampaignsList() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | CampaignStatus>("all");

  const rows = useMemo(
    () =>
      MOCK_CAMPAIGNS.filter(
        (c) =>
          (status === "all" || c.status === status) &&
          (!q || `${c.title} ${c.department} ${c.location}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, status],
  );

  return (
    <>
      <PageHeader
        title="Hiring Campaigns"
        description="Manage and track all your active and past hiring initiatives"
        actions={
          <Button asChild size="sm">
            <Link href="/hr/recruit/campaigns/new">
              <Plus className="size-3.5" /> New Campaign
            </Link>
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SuggestiveSearch value={q} onChange={setQ} suggestions={ROLE_SUGGESTIONS} />
        <Select value={status} onValueChange={(v) => setStatus(v as "all" | CampaignStatus)}>
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No campaigns match"
          description="Try a different search or status filter."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => {
            const s = campaignStats(c.id);
            return (
              <Link key={c.id} href={`/hr/recruit/campaigns/${c.id}`} className="block">
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.department}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "shrink-0 hover:bg-transparent",
                          c.status === "open" && "bg-success/15 text-success",
                          c.status === "closed" && "bg-muted text-muted-foreground",
                          c.status === "draft" && "bg-warning/15 text-warning",
                        )}
                      >
                        {c.status}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="size-3" /> {c.location}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <CalendarDays className="size-3" /> {fmtDateShort(c.startDate)} - {fmtDateShort(c.endDate)}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Wallet className="size-3" /> {c.salaryMinLpa}-{c.salaryMaxLpa} LPA · {c.rounds.length}{" "}
                        {c.rounds.length === 1 ? "round" : "rounds"}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-t pt-3 text-center">
                      <div>
                        <p className="text-lg font-semibold tabular-nums">{s.total}</p>
                        <p className="text-[10px] text-muted-foreground">Candidates</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold tabular-nums">{s.avgScore || "—"}</p>
                        <p className="text-[10px] text-muted-foreground">Avg score</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold tabular-nums">{s.passRate}%</p>
                        <p className="text-[10px] text-muted-foreground">Pass rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Platform capabilities
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CAPS.map((c) => (
          <Card key={c.title} className="gap-2 py-4">
            <CardContent className="px-4">
              <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <c.icon className="size-4" />
              </div>
              <p className="text-sm font-medium">{c.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
