"use client";

import { notFound, useParams } from "next/navigation";
import { Mail, MessageCircle, Sparkles, Users, Percent } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/badges";
import { KpiCard } from "@/components/shared/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { SequenceFunnelChart } from "@/components/sales/charts/sequence-funnel-chart";
import { sequenceById, sequenceStepFunnel } from "@/lib/mock-data/sales";
import type { MessageChannel } from "@/lib/types/core";

const CHANNEL_ICON: Record<MessageChannel, typeof Mail> = {
  email: Mail,
  whatsapp: MessageCircle,
  web_chat: Mail,
  sms: Mail,
};

export default function SequenceDetailPage() {
  const params = useParams<{ id: string }>();
  const sequence = sequenceById(params.id);
  if (!sequence) notFound();

  const funnel = sequenceStepFunnel(sequence);

  return (
    <>
      <PageHeader
        title={sequence.name}
        badge={<StatusBadge status={sequence.mode} />}
        description={`${sequence.steps.length}-step sequence`}
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Enrolled" value={String(sequence.enrolledCount)} context="Contacts currently enrolled" icon={<Users className="size-4" />} />
        <KpiCard label="Reply rate" value={`${sequence.replyRatePct}%`} context="Across all steps" icon={<Percent className="size-4" />} trend="up" trendValue="+2pts" />
        <KpiCard label="Mode" value={sequence.mode === "auto-send" ? "Auto-send" : "Approval"} context="Per-step send mode" icon={<Sparkles className="size-4" />} />
      </div>

      <Card className="mb-6">
        <CardContent className="px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold">Step-by-step funnel</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Contacts reaching each step, who replied there, and who dropped off before the next step.
          </p>
          <SequenceFunnelChart data={funnel} />
        </CardContent>
      </Card>

      <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Step timeline</h2>
      <div className="relative space-y-6 pl-8">
        <div className="absolute left-3.5 top-1 bottom-1 w-px bg-border" />
        {sequence.steps.map((step) => {
          const Icon = CHANNEL_ICON[step.channel];
          return (
            <div key={step.stepNumber} className="relative">
              <div className="absolute -left-8 flex size-7 items-center justify-center rounded-full border bg-background">
                <Icon className="size-3.5 text-muted-foreground" />
              </div>
              <Card>
                <CardContent className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Step {step.stepNumber} · {step.channel === "whatsapp" ? "WhatsApp" : "Email"}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {step.delayDays === 0 ? "Sent immediately" : `+${step.delayDays}d delay`}
                    </span>
                  </div>
                  {step.condition && (
                    <p className="mt-1 text-xs text-muted-foreground">Condition: {step.condition}</p>
                  )}
                  <div className="mt-2 flex items-start gap-1.5 rounded-md bg-accent/10 px-3 py-2">
                    <Sparkles className="mt-0.5 size-3.5 shrink-0 text-accent" />
                    <p className="text-sm">{step.aiPersonalizationNote}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </>
  );
}
