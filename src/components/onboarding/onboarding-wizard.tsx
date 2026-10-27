"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Check,
  Sparkles,
  Users,
  Building,
  Wrench,
  Store,
  Headset,
  Target,
  Blocks,
  MessageCircle,
  Mail,
  Calendar,
  ArrowRight,
  ArrowLeft,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STEPS = ["Workspace", "Industry", "First app", "Connect", "Done"];

const TEMPLATES = [
  { id: "staffing", label: "Staffing agency", icon: Users, description: "Clients, requisitions, candidate pipelines." },
  { id: "realty", label: "Real estate brokerage", icon: Building, description: "Leads, listings and deal pipelines." },
  { id: "home_services", label: "Property & home services", icon: Wrench, description: "Jobs, scheduling and customer care." },
  { id: "general", label: "General SMB", icon: Store, description: "Sales CRM and operations, no preset vertical." },
];

const FIRST_APPS = [
  { id: "sales-outreach-system", label: "Outreach System", icon: Target, description: "Email, WhatsApp, voice and LinkedIn outreach in one place." },
  { id: "ops-customer-care", label: "Customer Care", icon: Headset, description: "Unified inbox with AI-suggested replies." },
  { id: "custom-studio-inventory-intel", label: "Inventory Intel", icon: Blocks, description: "Example custom module for SKU tracking." },
];

const CHANNELS = [
  { id: "whatsapp", label: "WhatsApp Cloud API", icon: MessageCircle },
  { id: "gmail", label: "Gmail", icon: Mail },
  { id: "gcal", label: "Google Calendar", icon: Calendar },
];

export function OnboardingWizard() {
  const [step, setStep] = React.useState(0);
  const [workspaceName, setWorkspaceName] = React.useState("");
  const [template, setTemplate] = React.useState<string | null>(null);
  const [firstApp, setFirstApp] = React.useState<string | null>(null);
  const [channel, setChannel] = React.useState<string | null>(null);
  const [skippedChannel, setSkippedChannel] = React.useState(false);

  const canNext =
    (step === 0 && workspaceName.trim().length > 0) ||
    (step === 1 && template !== null) ||
    (step === 2 && firstApp !== null) ||
    (step === 3 && (channel !== null || skippedChannel)) ||
    step === 4;

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  }
  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-10">
      <div className="mb-8 flex items-center gap-2">
        <Sparkles className="size-5 text-accent" />
        <span className="text-sm font-semibold">ScalePods OS</span>
      </div>

      {/* Stepper */}
      <div className="mb-10 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border text-[11px] font-medium",
                  i < step && "border-primary bg-primary text-primary-foreground",
                  i === step && "border-primary text-primary",
                  i > step && "border-border text-muted-foreground"
                )}
              >
                {i < step ? <Check className="size-3" /> : i + 1}
              </div>
              <span
                className={cn(
                  "hidden text-xs sm:inline",
                  i === step ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
          </React.Fragment>
        ))}
      </div>

      <div className="flex-1">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-semibold">Create your workspace</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                This is the name your team will see across ScalePods OS.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ws-name">Workspace name</Label>
              <Input
                id="ws-name"
                placeholder="e.g. Nimbus Staffing Co"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-semibold">Choose your industry template</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                We&apos;ll pre-configure pods and sample data for your workflow.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {TEMPLATES.map((t) => {
                const Icon = t.icon;
                const active = template === t.id;
                return (
                  <Card
                    key={t.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:border-primary/50",
                      active && "border-primary ring-1 ring-primary/30"
                    )}
                    onClick={() => setTemplate(t.id)}
                  >
                    <CardContent className="flex flex-col gap-2 px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-4.5" />
                        </div>
                        {active && <Check className="size-4 text-primary" />}
                      </div>
                      <p className="text-sm font-medium">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-semibold">Pick your first free app</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                You can install more apps later from the App Marketplace.
              </p>
            </div>
            <div className="space-y-2">
              {FIRST_APPS.map((a) => {
                const Icon = a.icon;
                const active = firstApp === a.id;
                return (
                  <Card
                    key={a.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:border-primary/50",
                      active && "border-primary ring-1 ring-primary/30"
                    )}
                    onClick={() => setFirstApp(a.id)}
                  >
                    <CardContent className="flex items-center gap-3 px-4 py-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-4.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{a.label}</p>
                        <p className="text-xs text-muted-foreground">{a.description}</p>
                      </div>
                      {active && <Check className="size-4 shrink-0 text-primary" />}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-semibold">Connect a channel</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Connect at least one channel so your agents can send and receive messages — or skip for now.
              </p>
            </div>
            <div className="space-y-2">
              {CHANNELS.map((c) => {
                const Icon = c.icon;
                const active = channel === c.id;
                return (
                  <Card
                    key={c.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:border-primary/50",
                      active && "border-primary ring-1 ring-primary/30"
                    )}
                    onClick={() => {
                      setChannel(c.id);
                      setSkippedChannel(false);
                    }}
                  >
                    <CardContent className="flex items-center gap-3 px-4 py-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-4.5" />
                      </div>
                      <p className="flex-1 text-sm font-medium">{c.label}</p>
                      {active && <Check className="size-4 text-primary" />}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <button
              onClick={() => {
                setSkippedChannel(true);
                setChannel(null);
              }}
              className={cn(
                "text-xs text-muted-foreground underline-offset-2 hover:underline",
                skippedChannel && "font-medium text-foreground"
              )}
            >
              Skip for now
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
              <PartyPopper className="size-8" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">You&apos;re all set!</h1>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {workspaceName || "Your workspace"} is ready. We&apos;ve seeded sample contacts,
                conversations and a dashboard so things already look alive.
              </p>
            </div>
            <Card className="w-full max-w-sm text-left">
              <CardContent className="space-y-2 px-4 py-3 text-xs text-muted-foreground">
                <p>✓ Industry template: {TEMPLATES.find((t) => t.id === template)?.label ?? "General SMB"}</p>
                <p>✓ First app installed: {FIRST_APPS.find((a) => a.id === firstApp)?.label ?? "Leads & CRM"}</p>
                <p>
                  {channel
                    ? `✓ Channel connected: ${CHANNELS.find((c) => c.id === channel)?.label}`
                    : "— No channel connected yet (you can add one anytime in Settings → Integrations)"}
                </p>
              </CardContent>
            </Card>
            <Button asChild size="lg" className="mt-2 gap-1.5" onClick={() => toast.success("Welcome to ScalePods OS!")}>
              <Link href="/home/dashboard">
                Go to dashboard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {step < 4 && (
        <div className="mt-8 flex items-center justify-between border-t pt-4">
          <Button variant="ghost" className="gap-1.5" onClick={back} disabled={step === 0}>
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button className="gap-1.5" onClick={next} disabled={!canNext}>
            Next
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
