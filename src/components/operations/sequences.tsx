"use client";

import * as React from "react";
import { Mail, MessageCircle, Workflow, CheckCircle2, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AiGeneratedBadge } from "@/components/shared/badges";
import { PageHeader } from "@/components/shared/page-header";
import { SequenceEffectivenessChart } from "@/components/operations/sequence-effectiveness";
import { cn } from "@/lib/utils";
import { MOCK_SEQUENCES, type ReminderSequence } from "@/lib/mock-data/operations";

function ChannelIcon({ channel }: { channel: "email" | "whatsapp" }) {
  return channel === "email" ? (
    <Mail className="size-3.5" />
  ) : (
    <MessageCircle className="size-3.5" />
  );
}

function SequenceCard({ seq }: { seq: ReminderSequence }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{seq.name}</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">Trigger: {seq.trigger}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="gap-1 text-[11px] capitalize">
              {seq.channel === "both" ? (
                <>
                  <Mail className="size-3" />
                  <MessageCircle className="size-3" />
                </>
              ) : (
                <ChannelIcon channel={seq.channel} />
              )}
              {seq.channel === "both" ? "Email + WhatsApp" : seq.channel}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "gap-1 text-[11px]",
                seq.mode === "auto-send" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
              )}
            >
              {seq.mode === "auto-send" ? <Zap className="size-3" /> : <CheckCircle2 className="size-3" />}
              {seq.mode === "auto-send" ? "Auto-send" : "Approval required"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-xs text-muted-foreground">
          {seq.activeInvoices} invoices currently enrolled
        </p>
        <div className="space-y-0">
          {seq.steps.map((step, idx) => (
            <div key={step.step} className="relative flex gap-3 pb-4 last:pb-0">
              {idx < seq.steps.length - 1 && (
                <span className="absolute left-[11px] top-6 h-full w-px bg-border" aria-hidden />
              )}
              <div className="z-10 flex size-6 shrink-0 items-center justify-center rounded-full border bg-background text-[11px] font-medium">
                {step.step}
              </div>
              <div className="flex-1 rounded-lg border bg-muted/30 p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <ChannelIcon channel={step.channel} />
                    {step.label}
                  </div>
                  <AiGeneratedBadge />
                </div>
                <p className="mb-1 text-[11px] font-medium text-muted-foreground">Tone: {step.tone}</p>
                <p className="text-xs italic text-muted-foreground">&ldquo;{step.preview}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SequencesPage() {
  return (
    <>
      <PageHeader
        title="Reminder Sequences"
        description="AI-drafted sequences that escalate in tone as invoices age, across email and WhatsApp."
      />
      <div className="mb-4 flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        <Workflow className="size-3.5" />
        Each sequence runs per-invoice; steps only fire once the trigger condition is met and, in approval
        mode, once a human approves the drafted message from Settings → Approvals.
      </div>
      <SequenceEffectivenessChart />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {MOCK_SEQUENCES.map((seq) => (
          <SequenceCard key={seq.id} seq={seq} />
        ))}
      </div>
    </>
  );
}
