export type ContactType = "lead" | "candidate" | "customer" | "client_contact";

export interface Contact {
  id: string;
  orgId: string;
  type: ContactType;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  companyId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  source?: string;
  location?: string;
}

export interface Company {
  id: string;
  orgId: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  logoUrl?: string;
}

export type ActivityType =
  | "call"
  | "email"
  | "whatsapp"
  | "meeting"
  | "note"
  | "stage_change"
  | "ai_action";

export interface Activity {
  id: string;
  orgId: string;
  contactId: string;
  type: ActivityType;
  title: string;
  description?: string;
  repId?: string;
  createdAt: string;
  aiGenerated?: boolean;
}

export type MessageChannel = "email" | "whatsapp" | "web_chat" | "sms";
export type MessageDirection = "inbound" | "outbound";
export type MessageStatus = "sent" | "delivered" | "read" | "failed" | "draft" | "pending_approval";

export interface Message {
  id: string;
  orgId: string;
  conversationId: string;
  channel: MessageChannel;
  direction: MessageDirection;
  status: MessageStatus;
  body: string;
  aiGenerated: boolean;
  approvedBy?: string;
  createdAt: string;
  sentimentFlag?: "negative" | "neutral" | "positive";
}

export interface Conversation {
  id: string;
  orgId: string;
  contactId: string;
  channel: MessageChannel;
  subject?: string;
  status: "open" | "pending" | "resolved" | "escalated";
  assignedTo?: string;
  lastMessageAt: string;
  unread: boolean;
}

export interface Note {
  id: string;
  orgId: string;
  contactId: string;
  body: string;
  authorId: string;
  createdAt: string;
}

export interface Member {
  id: string;
  orgId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "owner" | "admin" | "manager" | "member" | "viewer";
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  plan: "free" | "basic" | "growth" | "enterprise";
  industryTemplate: "staffing" | "realty" | "home_services" | "general";
  region: "india" | "uae" | "us";
  installedApps: string[];
}

export interface UsageEvent {
  id: string;
  orgId: string;
  appId: string;
  agentType: string;
  model: string;
  tokens: number;
  costUsd: number;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  orgId: string;
  actorType: "user" | "agent";
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  costUsd?: number;
  /** AI model used for this action, when actorType is "agent". */
  model?: string;
  /** Coarse agent-type bucket (matches Settings → AI's AGENT_TYPES ids), when actorType is "agent". */
  agentType?: string;
  createdAt: string;
}

export interface Approval {
  id: string;
  orgId: string;
  appId: string;
  agentType: string;
  title: string;
  description: string;
  payload: Record<string, unknown>;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}
