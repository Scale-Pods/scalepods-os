"use client";

import * as React from "react";
import { notFound, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Sparkles,
  MessageCircle,
  PhoneCall,
  FileEdit,
  ArrowRightLeft,
  StickyNote,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge, AiGeneratedBadge } from "@/components/shared/badges";
import { InitialsAvatar } from "@/components/sales/initials-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MOCK_CONTACTS, getCompany } from "@/lib/mock-data/contacts";
import { activitiesForContact, dealsByOrg, contactEngagementSeries } from "@/lib/mock-data/sales";
import { Sparkline } from "@/components/sales/charts/sparkline";
import { MEMBERS } from "@/lib/mock-data/orgs";
import { formatMoney } from "@/lib/format";
import { RelativeTime } from "@/components/shared/relative-time";
import type { Activity, Note } from "@/lib/types/core";

const ACTIVITY_ICON: Record<Activity["type"], typeof Mail> = {
  call: PhoneCall,
  email: Mail,
  whatsapp: MessageCircle,
  meeting: Calendar,
  note: StickyNote,
  stage_change: ArrowRightLeft,
  ai_action: Sparkles,
};

export default function ContactDetailPage() {
  const params = useParams<{ id: string }>();
  const contact = MOCK_CONTACTS.find((c) => c.id === params.id);
  const [noteDraft, setNoteDraft] = React.useState("");
  const [localNotes, setLocalNotes] = React.useState<Note[]>([]);
  const [now] = React.useState(() => Date.now());

  if (!contact) notFound();

  const company = getCompany(contact.companyId);
  const activities = activitiesForContact(contact.id, contact.orgId);
  const deals = dealsByOrg(contact.orgId).filter((d) => d.contactId === contact.id);
  const engagementSeries = contactEngagementSeries(contact.id, now);
  const engagementCount30d = engagementSeries.reduce((sum, p) => sum + p.count, 0);

  function addNote() {
    if (!noteDraft.trim()) return;
    setLocalNotes((prev) => [
      {
        id: `note-local-${prev.length + 1}`,
        orgId: contact!.orgId,
        contactId: contact!.id,
        body: noteDraft.trim(),
        authorId: "mem-1",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setNoteDraft("");
    toast.success("Note added");
  }

  return (
    <>
      <PageHeader
        title={contact.name}
        badge={<StatusBadge status={contact.type} />}
        description={company ? `${company.name} · ${company.industry ?? ""}` : undefined}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("Logging a call...")}>
              <PhoneCall className="size-3.5" />
              Log call
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Draft email opened")}>
              <Mail className="size-3.5" />
              Email
            </Button>
            <Button size="sm" onClick={() => toast.success("WhatsApp message sent", { description: "Demo adapter — no real message was sent." })}>
              <MessageCircle className="size-3.5" />
              WhatsApp
            </Button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 px-4 py-6 text-center">
            <InitialsAvatar name={contact.name} size="lg" className="size-16 text-lg" />
            <div>
              <p className="font-semibold">{contact.name}</p>
              <p className="text-xs text-muted-foreground">{contact.source} lead</p>
            </div>
            <Separator />
            <div className="w-full space-y-2 text-left text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-3.5" />
                <span className="truncate">{contact.email}</span>
              </div>
              {contact.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="size-3.5" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-3.5" />
                  <span>{contact.location}</span>
                </div>
              )}
              {company && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="size-3.5" />
                  <span>{company.name}</span>
                </div>
              )}
            </div>
            <Separator />
            <div className="flex w-full flex-wrap justify-center gap-1.5">
              {contact.tags.map((t) => (
                <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
            <Separator />
            <div className="w-full text-left">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Engagement (30d)</p>
                <p className="text-xs font-semibold">{engagementCount30d} activities</p>
              </div>
              <Sparkline data={engagementSeries} />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="activity">
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="deals">Deals ({deals.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-4">
            <div className="space-y-4">
              {activities.map((a) => {
                const Icon = ACTIVITY_ICON[a.type];
                const rep = MEMBERS.find((m) => m.id === a.repId);
                return (
                  <div key={a.id} className="flex gap-3">
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <Icon className="size-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{a.title}</p>
                        {a.aiGenerated && <AiGeneratedBadge />}
                      </div>
                      {a.description && (
                        <p className="mt-0.5 text-sm text-muted-foreground">{a.description}</p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {rep ? `${rep.name} · ` : ""}
                        <RelativeTime iso={a.createdAt} />
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Add a note about this contact..."
                rows={3}
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={addNote} disabled={!noteDraft.trim()}>
                  <FileEdit className="size-3.5" />
                  Add note
                </Button>
              </div>
            </div>
            {localNotes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes yet. Notes you add stay for this session.</p>
            ) : (
              <div className="space-y-3">
                {localNotes.map((n) => (
                  <Card key={n.id}>
                    <CardContent className="px-4 py-3">
                      <p className="text-sm">{n.body}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {MEMBERS.find((m) => m.id === n.authorId)?.name} · <RelativeTime iso={n.createdAt} />
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="deals" className="mt-4">
            {deals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No deals linked to this contact yet.</p>
            ) : (
              <div className="space-y-2">
                {deals.map((d) => (
                  <Card key={d.id}>
                    <CardContent className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{d.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Expected close {new Date(d.expectedCloseDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">{formatMoney(d.valueMinor, d.currency)}</span>
                        <StatusBadge status={d.stage} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
