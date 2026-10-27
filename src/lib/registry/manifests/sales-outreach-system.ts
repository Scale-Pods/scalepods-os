import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "sales-outreach-system",
  name: "Outreach System",
  pod: "sales",
  description: "Multi-channel cold outreach: email, WhatsApp, voice and LinkedIn in one place",
  icon: "Radio",
  basePath: "/sales/outreach-system",
  nav: [
    {
      label: "Email",
      path: "/email",
      children: [
        { label: "Sent", path: "/email/sent" },
        { label: "Received", path: "/email/received" },
        { label: "Bounces", path: "/email/bounces" },
        { label: "Unsubscribed", path: "/email/unsubscribed" },
        { label: "Analytics", path: "/email/analytics" },
        { label: "Warmup", path: "/email/warmup" },
      ],
    },
    {
      label: "WhatsApp",
      path: "/whatsapp",
      children: [
        { label: "Chat", path: "/whatsapp/chat" },
        { label: "Leads", path: "/whatsapp/leads" },
        { label: "Analytics", path: "/whatsapp/analytics" },
      ],
    },
    {
      label: "Voice",
      path: "/voice",
      children: [
        { label: "Call Logs", path: "/voice/call-logs" },
        { label: "Cold Call Logs", path: "/voice/cold-call-logs" },
        { label: "Analytics", path: "/voice/analytics" },
      ],
    },
    {
      label: "LinkedIn",
      path: "/linkedin",
      children: [
        { label: "Chat", path: "/linkedin/chat" },
        { label: "Leads", path: "/linkedin/leads" },
        { label: "Analytics", path: "/linkedin/analytics" },
      ],
    },
    {
      label: "Campaigns",
      path: "/campaigns",
      children: [
        { label: "Upload Leads", path: "/campaigns/upload-leads" },
        { label: "Assign Person", path: "/campaigns/assign-person" },
      ],
    },
  ],
  requiredPlan: "free",
  permissions: ["sales.read", "sales.write"],
  dashboardWidgets: [],
  featureFlags: [],
  status: "full",
};
