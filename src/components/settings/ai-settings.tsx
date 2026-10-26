"use client";

import * as React from "react";
import { toast } from "sonner";
import { Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { AiSpendCharts } from "@/components/settings/ai-spend-charts";
import { MOCK_AUDIT_LOG } from "@/lib/mock-data/approvals";

const MODEL_OPTIONS = ["Claude Haiku", "Claude Sonnet", "GPT-4o mini", "Gemini Flash"];

const TASK_TYPES = [
  { id: "classification", label: "Classification", defaultModel: "Claude Haiku" },
  { id: "drafting", label: "Drafting", defaultModel: "Claude Sonnet" },
  { id: "scoring", label: "Fit scoring", defaultModel: "Claude Sonnet" },
  { id: "extraction", label: "Document extraction", defaultModel: "GPT-4o mini" },
];

const AGENT_TYPES = [
  { id: "lead-response", label: "Lead Response", defaultAuto: true },
  { id: "candidate-outreach", label: "Candidate Outreach", defaultAuto: false },
  { id: "payment-reminders", label: "Payment Reminders", defaultAuto: false },
  { id: "content-drafts", label: "Content Drafts", defaultAuto: false },
];

export function AiSettings() {
  const [models, setModels] = React.useState<Record<string, string>>(
    Object.fromEntries(TASK_TYPES.map((t) => [t.id, t.defaultModel]))
  );
  const [autoSend, setAutoSend] = React.useState<Record<string, boolean>>(
    Object.fromEntries(AGENT_TYPES.map((a) => [a.id, a.defaultAuto]))
  );
  const [budgetCap, setBudgetCap] = React.useState("50");

  const spentSoFar = MOCK_AUDIT_LOG.reduce((sum, a) => sum + (a.costUsd ?? 0), 0);
  const capNum = Number(budgetCap) || 1;
  const pct = Math.min(100, Math.round((spentSoFar / capNum) * 100));

  return (
    <>
      <PageHeader title="AI Settings" description="Models, autonomy and budget controls for your AI agents." />

      <Card className="mb-5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Default model per task type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {TASK_TYPES.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5">
              <span className="text-sm">{t.label}</span>
              <Select
                value={models[t.id]}
                onValueChange={(v) => setModels((m) => ({ ...m, [t.id]: v }))}
              >
                <SelectTrigger size="sm" className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODEL_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Auto-send vs. draft for approval</CardTitle>
          <p className="text-xs text-muted-foreground">
            Per agent type — when off, outbound actions wait in Settings → Approvals for a human to approve.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {AGENT_TYPES.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5">
              <div className="flex items-center gap-2">
                <Bot className="size-3.5 text-muted-foreground" />
                <span className="text-sm">{a.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {autoSend[a.id] ? "Auto-send" : "Draft for approval"}
                </span>
                <Switch
                  checked={autoSend[a.id]}
                  onCheckedChange={(v) => {
                    setAutoSend((s) => ({ ...s, [a.id]: v }));
                    toast.success(`${a.label} set to ${v ? "auto-send" : "draft for approval"}`);
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mb-5">
        <AiSpendCharts />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Monthly AI budget cap</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="budget-cap" className="text-sm">Cap ($)</Label>
            <Input
              id="budget-cap"
              type="number"
              value={budgetCap}
              onChange={(e) => setBudgetCap(e.target.value)}
              className="w-28"
            />
            <Button size="sm" onClick={() => toast.success("Budget cap saved")}>
              Save
            </Button>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span>Spent so far this month</span>
              <span className="text-muted-foreground">
                ${spentSoFar.toFixed(2)} / ${capNum.toFixed(2)}
              </span>
            </div>
            <Progress value={pct} />
            {pct >= 80 && (
              <p className="mt-1.5 text-xs text-warning">
                Approaching your AI budget cap for this month.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
