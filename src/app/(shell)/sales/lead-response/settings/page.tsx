"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, Trash2, Bot, FileEdit } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DemoAdapterBadge } from "@/components/shared/badges";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { agentPerformanceThisWeek } from "@/lib/mock-data/sales";
import { cn } from "@/lib/utils";
import { TrendingDown, Target, Clock } from "lucide-react";

export default function AgentSettingsPage() {
  const [now] = React.useState(() => Date.now());
  const weeklyPerf = React.useMemo(() => agentPerformanceThisWeek(now), [now]);
  const [mode, setMode] = React.useState<"auto" | "approval">("auto");
  const [questions, setQuestions] = React.useState([
    "What's the approximate headcount or role count you're hiring for?",
    "What's your target start date or timeline?",
    "Which location or site is this role based in?",
  ]);
  const [channels, setChannels] = React.useState({
    web: true,
    whatsapp: true,
    email: true,
  });
  const [threshold, setThreshold] = React.useState(72);
  const [handoffRules, setHandoffRules] = React.useState(
    "Hand off to a human when the lead explicitly asks for a person, when qualification confidence is below the threshold, or when the lead mentions an enterprise deal above $50K."
  );

  function save() {
    toast.success("Agent settings saved", { description: "Changes are local to this demo session." });
  }

  return (
    <>
      <PageHeader
        title="Agent Settings"
        description="Configure how the Lead Response agent replies to inbound leads."
        actions={<Button onClick={save}>Save changes</Button>}
      />

      <Card className="mb-4">
        <CardContent className="px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold">Agent performance this week</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success/15">
                <TrendingDown className="size-4 text-success" />
              </div>
              <div>
                <p className="text-sm font-semibold">{weeklyPerf.handoffRatePct}%</p>
                <p className="text-xs text-muted-foreground">
                  Handoff rate ({weeklyPerf.handoffRateTrendPct}pts vs last week)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Target className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{weeklyPerf.qualificationAccuracyPct}%</p>
                <p className="text-xs text-muted-foreground">Qualification accuracy (est.)</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/15">
                <Clock className="size-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold">{weeklyPerf.avgResponseSeconds}s</p>
                <p className="text-xs text-muted-foreground">Avg. response time</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 px-4 py-4">
            <div className="flex items-center gap-2">
              <Bot className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Response mode</h3>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMode("auto")}
                className={cn(
                  "rounded-lg border p-3 text-left transition-colors",
                  mode === "auto" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                )}
              >
                <p className="text-sm font-medium">Auto-send</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  The agent replies instantly without waiting for approval. Best for speed.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setMode("approval")}
                className={cn(
                  "rounded-lg border p-3 text-left transition-colors",
                  mode === "approval" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                )}
              >
                <p className="text-sm font-medium">Draft for approval</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Replies are queued for a teammate to approve before sending.
                </p>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 px-4 py-4">
            <h3 className="text-sm font-semibold">Channels</h3>
            <div className="space-y-3">
              <ChannelRow
                label="Web form"
                checked={channels.web}
                onChange={(v) => setChannels((c) => ({ ...c, web: v }))}
              />
              <ChannelRow
                label="WhatsApp"
                checked={channels.whatsapp}
                onChange={(v) => setChannels((c) => ({ ...c, whatsapp: v }))}
                demoAdapter
              />
              <ChannelRow
                label="Email"
                checked={channels.email}
                onChange={(v) => setChannels((c) => ({ ...c, email: v }))}
                demoAdapter
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="space-y-3 px-4 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Qualification questions</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setQuestions((q) => [...q, "New qualification question..."])
                }
              >
                <Plus className="size-3.5" />
                Add question
              </Button>
            </div>
            <div className="space-y-2">
              {questions.map((q, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={q}
                    onChange={(e) =>
                      setQuestions((prev) => prev.map((p, idx) => (idx === i ? e.target.value : p)))
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setQuestions((prev) => prev.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              The agent asks these in order (up to 3) before scoring and routing the lead.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 px-4 py-4">
            <h3 className="text-sm font-semibold">Confidence threshold</h3>
            <p className="text-xs text-muted-foreground">
              Leads scored below this confidence are routed to a human instead of auto-handled.
            </p>
            <div className="flex items-center gap-3">
              <Progress value={threshold} className="flex-1" />
              <Input
                type="number"
                min={0}
                max={100}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 px-4 py-4">
            <div className="flex items-center gap-2">
              <FileEdit className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Handoff rules</h3>
            </div>
            <Textarea
              value={handoffRules}
              onChange={(e) => setHandoffRules(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function ChannelRow({
  label,
  checked,
  onChange,
  demoAdapter,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  demoAdapter?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm">{label}</span>
        {demoAdapter && <DemoAdapterBadge />}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
