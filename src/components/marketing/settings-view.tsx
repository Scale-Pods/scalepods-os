"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { useOrg } from "@/lib/org-context";
import { MEMBERS } from "@/lib/mock-data/orgs";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import { Field, Pill } from "@/components/marketing/shared";
import { CONNECTIONS, ROLE_ACCESS, SAFETY_FLAGS } from "@/components/marketing/mock/workspace";
import { relativeToRef } from "@/lib/mock-data/marketing";

export function SettingsView() {
  const { org } = useOrg();
  const members = MEMBERS.filter((m) => m.orgId === org.id);
  const [sel, setSel] = React.useState<(typeof members)[number] | null>(null);
  const access = (role: string) => ROLE_ACCESS.find((r) => r.role === role) ?? ROLE_ACCESS[2];

  return (
    <>
      <PageHeader title="Settings" description={`Credit-safety status, connections, and team access for ${org.name}.`} />
      <Tabs defaultValue="safety">
        <TabsList>
          <TabsTrigger value="safety">Credit safety</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="team">Team and access</TabsTrigger>
        </TabsList>

        <TabsContent value="safety" className="space-y-3 pt-2">
          {SAFETY_FLAGS.map((f) => (
            <Card key={f.key} className="py-4">
              <CardContent className="flex items-center justify-between gap-4 px-4">
                <div>
                  <p className="flex items-center gap-2 font-mono text-sm font-semibold">
                    <ShieldCheck className="size-4 text-success" />
                    {f.key}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{f.note}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Pill label={f.on ? "On" : "Off"} tone={f.on ? "orange" : "green"} />
                  <Switch checked={f.on} disabled aria-label={f.key} />
                </div>
              </CardContent>
            </Card>
          ))}
          <p className="text-xs text-muted-foreground">Flags are read-only in the demo. Keep all three off until a stage is being demoed or used.</p>
        </TabsContent>

        <TabsContent value="connections" className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          {CONNECTIONS.map((c) => (
            <Card key={c.platform} className="py-3">
              <CardContent className="space-y-2 px-4 text-sm">
                <div className="flex items-center justify-between">
                  <PlatformBadge platform={c.platform} />
                  <Pill label={c.status} tone={c.status === "Connected" ? "green" : "orange"} />
                </div>
                <p className="font-medium">{c.route}</p>
                <p className="text-xs text-muted-foreground">{c.account} · synced {relativeToRef(c.lastSync)}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="team" className="pt-2">
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Board</TableHead>
                  <TableHead>Content</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.id} className="cursor-pointer" onClick={() => setSel(m)}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell className="text-muted-foreground">{m.email}</TableCell>
                    <TableCell className="capitalize">{m.role}</TableCell>
                    <TableCell>{access(m.role).board}</TableCell>
                    <TableCell>{access(m.role).content}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {sel && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{sel.name}</DialogTitle>
                <DialogDescription>{sel.email}</DialogDescription>
              </DialogHeader>
              <div className="divide-y rounded-lg border px-3 text-sm">
                <Field label="Role"><span className="capitalize">{sel.role}</span></Field>
                <Field label="Board access">{access(sel.role).board}</Field>
                <Field label="Content access">{access(sel.role).content}</Field>
                <Field label="Settings access">{access(sel.role).settings}</Field>
                <Field label="Can act as checker">{sel.role === "member" ? "No" : "Yes"}</Field>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
