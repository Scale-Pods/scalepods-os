import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "ops-receivables",
  name: "Receivables Recovery",
  pod: "operations",
  description: "Party ledger, overdue tracking and automated email, WhatsApp and voice recovery",
  icon: "ReceiptText",
  basePath: "/operations/receivables",
  nav: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Upload Invoice", path: "/upload-invoice" },
    {
      label: "WhatsApp",
      path: "/whatsapp",
      children: [
        { label: "Dashboard", path: "/whatsapp/dashboard" },
        { label: "Chats", path: "/whatsapp/chats" },
        { label: "Leads", path: "/whatsapp/leads" },
        { label: "Analytics", path: "/whatsapp/analytics" },
      ],
    },
    {
      label: "Email",
      path: "/email",
      children: [
        { label: "Dashboard", path: "/email/dashboard" },
        { label: "Sent", path: "/email/sent" },
        { label: "Received", path: "/email/received" },
        { label: "Analytics", path: "/email/analytics" },
      ],
    },
    { label: "Voice Panel", path: "/voice" },
  ],
  requiredPlan: "basic",
  permissions: ["ops.read", "ops.write"],
  dashboardWidgets: ["ops.outstanding-amount", "ops.overdue-count"],
  featureFlags: [],
  status: "basic",
};
