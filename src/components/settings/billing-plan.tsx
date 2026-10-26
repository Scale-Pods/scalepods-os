"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import { DemoAdapterBadge } from "@/components/shared/badges";
import { UsageTrendChart } from "@/components/settings/usage-trend-chart";
import { useOrg } from "@/lib/org-context";
import { MOCK_AUDIT_LOG } from "@/lib/mock-data/approvals";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    features: ["1 app", "1 seat", "100 AI actions/mo", "50 outbound messages/mo"],
  },
  {
    id: "basic",
    name: "Basic",
    price: "$149/mo",
    features: ["Up to 5 apps", "5 seats", "2,000 AI actions/mo", "1,500 outbound messages/mo", "Email + WhatsApp adapters"],
  },
  {
    id: "growth",
    name: "Growth",
    price: "$349/mo",
    features: ["All pods unlocked", "20 seats", "10,000 AI actions/mo", "8,000 outbound messages/mo", "Priority support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$1,099+/mo",
    features: ["Unlimited seats", "Custom Studio apps", "SSO (stubbed)", "Dedicated usage pool", "Custom data residency"],
  },
] as const;

const FREE_AI_LIMIT = 100;
const FREE_MSG_LIMIT = 50;

export function BillingPlan() {
  const { org } = useOrg();

  const aiActionsUsed = MOCK_AUDIT_LOG.filter((a) => a.actorType === "agent").length + 68;
  const outboundMessagesUsed = 142;
  const aiSpend = MOCK_AUDIT_LOG.reduce((sum, a) => sum + (a.costUsd ?? 0), 0);
  const budgetCap = 50;

  const aiPct = Math.min(100, Math.round((aiActionsUsed / FREE_AI_LIMIT) * 100));
  const msgPct = Math.min(100, Math.round((outboundMessagesUsed / FREE_MSG_LIMIT) * 100));
  const isFree = org.plan === "free";

  return (
    <>
      <PageHeader title="Plan & Billing" description="Manage your subscription, usage and payment method." />

      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs text-muted-foreground">Current plan</p>
            <p className="text-xl font-semibold capitalize">{org.plan}</p>
          </div>
          <Button onClick={() => toast("Plan change is simulated in this demo")}>Change plan</Button>
        </CardContent>
      </Card>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === org.plan;
          return (
            <Card key={plan.id} className={cn(isCurrent && "border-primary ring-1 ring-primary/30")}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  {isCurrent && <Badge className="text-[10px]">Current</Badge>}
                </div>
                <p className="text-lg font-semibold">{plan.price}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Check className="mt-0.5 size-3 shrink-0 text-success" />
                    {f}
                  </div>
                ))}
                {!isCurrent && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() => toast(`Switched to ${plan.name} (simulated)`)}
                  >
                    {plan.id === "free" ? "Downgrade" : "Upgrade"}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Usage this month</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span>AI actions</span>
              <span className="text-muted-foreground">
                {aiActionsUsed} / {isFree ? FREE_AI_LIMIT : "10,000"}
              </span>
            </div>
            <Progress value={isFree ? aiPct : Math.round((aiActionsUsed / 10000) * 100)} />
            {isFree && aiPct >= 80 && (
              <p className="mt-1.5 text-xs text-warning">
                You&apos;re close to your Free tier limit — upgrade to keep agents running uninterrupted.
              </p>
            )}
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span>Outbound messages</span>
              <span className="text-muted-foreground">
                {outboundMessagesUsed} / {isFree ? FREE_MSG_LIMIT : "8,000"}
              </span>
            </div>
            <Progress value={isFree ? msgPct : Math.round((outboundMessagesUsed / 8000) * 100)} />
            {isFree && msgPct >= 80 && (
              <p className="mt-1.5 text-xs text-warning">
                Approaching your Free tier outbound message limit this month.
              </p>
            )}
          </div>
          {(isFree && (aiPct >= 80 || msgPct >= 80)) && (
            <Button size="sm" onClick={() => toast("Upgrade flow is simulated in this demo")}>
              Upgrade to Basic
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="mb-6">
        <UsageTrendChart />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Payment method</CardTitle>
            <DemoAdapterBadge />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <CreditCard className="size-4 text-muted-foreground" />
            <div className="flex-1 text-sm">
              <p className="font-medium">No payment method on file</p>
              <p className="text-xs text-muted-foreground">
                Billed via one <code className="rounded bg-muted px-1 py-0.5 text-[11px]">BillingProvider</code> interface:
              </p>
            </div>
            <Badge variant="outline" className="text-[11px]">Stripe (USD)</Badge>
            <Badge variant="outline" className="text-[11px]">Razorpay (INR)</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast("Payment method setup is simulated in this demo")}>
            Add payment method
          </Button>
          <p className="text-xs text-muted-foreground">
            This monthly spend so far ({`$${aiSpend.toFixed(2)}`} of a ${budgetCap} AI budget cap) is tracked in
            Settings → AI.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
