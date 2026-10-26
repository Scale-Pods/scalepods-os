"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { getAppById } from "@/lib/registry/apps";
import { formatRelative } from "@/lib/format";
import { MOCK_APPROVALS } from "@/lib/mock-data/approvals";
import type { Approval } from "@/lib/types/core";

export function ApprovalsQueue() {
  const [approvals, setApprovals] = React.useState<Approval[]>(MOCK_APPROVALS);
  const [tab, setTab] = React.useState("pending");

  function setStatus(id: string, status: Approval["status"]) {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    const target = approvals.find((a) => a.id === id);
    toast(status === "approved" ? "Approved" : "Rejected", {
      description: target ? target.title : undefined,
    });
  }

  const filtered = approvals.filter((a) => a.status === tab);

  return (
    <>
      <PageHeader
        title="Approvals"
        description="Review AI-drafted actions waiting for a human to approve before they go out."
      />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({approvals.filter((a) => a.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvals.filter((a) => a.status === "approved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({approvals.filter((a) => a.status === "rejected").length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Bot}
              title={`No ${tab} approvals`}
              description="Items will appear here as AI agents draft outbound actions."
            />
          ) : (
            <div className="space-y-3">
              {filtered.map((a) => {
                const app = getAppById(a.appId);
                return (
                  <Card key={a.id}>
                    <CardContent className="flex items-start justify-between gap-4 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <p className="text-sm font-medium">{a.title}</p>
                          <Badge variant="outline" className="text-[10px]">
                            {app?.name ?? a.appId}
                          </Badge>
                          <Badge variant="secondary" className="gap-1 text-[10px]">
                            <Bot className="size-2.5" />
                            {a.agentType.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{a.description}</p>
                        <p className="mt-1.5 text-[11px] text-muted-foreground">
                          {formatRelative(a.createdAt)}
                        </p>
                      </div>
                      {a.status === "pending" && (
                        <div className="flex shrink-0 gap-2">
                          <Button size="sm" variant="secondary" className="gap-1" onClick={() => setStatus(a.id, "approved")}>
                            <Check className="size-3.5" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1" onClick={() => setStatus(a.id, "rejected")}>
                            <X className="size-3.5" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
