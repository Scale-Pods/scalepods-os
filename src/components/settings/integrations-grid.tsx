"use client";

import * as React from "react";
import { toast } from "sonner";
import { MessageCircle, Mail, Calendar, Phone, Share2, Building2, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { DemoAdapterBadge } from "@/components/shared/badges";
import { cn } from "@/lib/utils";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  working: boolean;
}

const INTEGRATIONS: Integration[] = [
  { id: "whatsapp", name: "WhatsApp Cloud API", description: "Send and receive WhatsApp messages via Meta's Cloud API.", icon: MessageCircle, working: true },
  { id: "gmail", name: "Gmail OAuth", description: "Read and send email replies from your connected Gmail account.", icon: Mail, working: true },
  { id: "gcal", name: "Google Calendar", description: "Book interviews and meetings directly onto your calendar.", icon: Calendar, working: true },
  { id: "voice", name: "AI Voice Calls", description: "Outbound/inbound AI voice agent (Vapi/Retell/Twilio).", icon: Phone, working: false },
  { id: "linkedin", name: "LinkedIn", description: "Outreach and profile enrichment via LinkedIn.", icon: Share2, working: false },
  { id: "crm-sync", name: "CRM Sync (HubSpot/Zoho/Salesforce)", description: "Two-way contact and deal sync with external CRMs.", icon: Building2, working: false },
  { id: "ats", name: "ATS Imports", description: "Import candidates and jobs from external ATS platforms.", icon: Database, working: false },
];

function IntegrationCard({ integration }: { integration: Integration }) {
  const [connected, setConnected] = React.useState(false);
  const Icon = integration.icon;

  return (
    <Card className={cn(!integration.working && "opacity-80")}>
      <CardContent className="flex flex-col gap-3 px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4.5" />
            </div>
            <p className="text-sm font-semibold">{integration.name}</p>
          </div>
          {!integration.working && <DemoAdapterBadge />}
        </div>
        <p className="min-h-[2.5rem] text-xs text-muted-foreground">{integration.description}</p>
        <div className="border-t pt-3">
          {integration.working ? (
            connected ? (
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setConnected(false);
                  toast(`${integration.name} disconnected`);
                }}
              >
                Connected — disconnect
              </Button>
            ) : (
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  setConnected(true);
                  toast.success(`${integration.name} connected`, {
                    description: "This demo simulates the OAuth/connection flow.",
                  });
                }}
              >
                Connect
              </Button>
            )
          ) : (
            <Button size="sm" variant="secondary" className="w-full" disabled>
              Coming soon
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function IntegrationsGrid() {
  return (
    <>
      <PageHeader
        title="Integrations"
        description="Connect the channels and systems your AI agents use."
      />
      <div className="mb-3 text-xs font-medium text-muted-foreground">Working adapters</div>
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {INTEGRATIONS.filter((i) => i.working).map((i) => (
          <IntegrationCard key={i.id} integration={i} />
        ))}
      </div>
      <div className="mb-3 text-xs font-medium text-muted-foreground">Interface only (mock adapter)</div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {INTEGRATIONS.filter((i) => !i.working).map((i) => (
          <IntegrationCard key={i.id} integration={i} />
        ))}
      </div>
    </>
  );
}
