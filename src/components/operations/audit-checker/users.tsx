"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { AUDIT_USERS, ALL_AUDITS, ROLE_ROUTES, reviewerStats, KIND_LABEL, type AccessRole } from "@/lib/mock-data/audit-checker";
import { AuditDetailDialog } from "./audit-detail-dialog";
import { ChartCard, DecisionPill, Field, Pill, ScoreBadge, Section, StatusPill, fmtDate, fmtDateTime, type Accent } from "./shared";

const ROLE_ACCENT: Record<AccessRole, Accent> = { Admin: "red", developer: "purple", both: "blue", sales: "orange", purchase: "green" };
const ROLE_DESC: Record<AccessRole, string> = {
  Admin: "Everything, including user management",
  developer: "Everything, including user management",
  both: "Both audit areas, analytics and history",
  sales: "Sales dashboard, sales audit and history",
  purchase: "Purchase dashboard, purchase audit and history",
};

export function AuditUsersPage() {
  const [q, setQ] = React.useState("");
  const [role, setRole] = React.useState("All roles");
  const [open, setOpen] = React.useState<string | null>(null);
  const [auditId, setAuditId] = React.useState<string | null>(null);
  const stats = React.useMemo(() => reviewerStats(), []);
  const rows = stats.filter((r) => {
    if (role !== "All roles" && r.user.access !== role) return false;
    const s = q.trim().toLowerCase();
    return !s || r.user.name.toLowerCase().includes(s) || r.user.email.includes(s);
  });
  const sel = stats.find((r) => r.user.id === open);
  const selAudits = sel ? ALL_AUDITS.filter((a) => a.reviewerId === sel.user.id || a.decidedById === sel.user.id) : [];
  const selectedAudit = ALL_AUDITS.find((a) => a.id === auditId) ?? null;

  return (
    <>
      <PageHeader title="Users" description="Auditors and reviewers with their access role. Admin and developer roles manage users." />
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Users" value={String(AUDIT_USERS.length)} context={`${AUDIT_USERS.filter((u) => u.active).length} active`} />
        <KpiCard label="Admins / Developers" value={String(AUDIT_USERS.filter((u) => u.access === "Admin" || u.access === "developer").length)} context="can manage users" />
        <KpiCard label="Purchase Auditors" value={String(AUDIT_USERS.filter((u) => u.access === "purchase" || u.access === "both").length)} context="purchase access" />
        <KpiCard label="Sales Auditors" value={String(AUDIT_USERS.filter((u) => u.access === "sales" || u.access === "both").length)} context="sales access" />
      </div>

      <ListToolbar searchValue={q} onSearchChange={setQ} placeholder="Search name or email...">
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["All roles", "Admin", "developer", "both", "sales", "purchase"].map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
          </SelectContent>
        </Select>
      </ListToolbar>

      <div className="mb-6 overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Access</TableHead><TableHead className="text-right">Audits run</TableHead><TableHead className="text-right">Decisions</TableHead><TableHead>Last login</TableHead><TableHead>Status</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.user.id} className="cursor-pointer" onClick={() => setOpen(r.user.id)}>
                <TableCell className="font-medium">{r.user.name}</TableCell>
                <TableCell className="text-muted-foreground">{r.user.email}</TableCell>
                <TableCell><Pill label={r.user.access} accent={ROLE_ACCENT[r.user.access]} /></TableCell>
                <TableCell className="text-right tabular-nums">{r.owned}</TableCell>
                <TableCell className="text-right tabular-nums">{r.decided}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">{fmtDateTime(r.user.lastLogin)}</TableCell>
                <TableCell><Pill label={r.user.active ? "Active" : "Inactive"} accent={r.user.active ? "green" : "neutral"} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ChartCard title="Role access" subtitle="Which areas each access role can open">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {(Object.keys(ROLE_ROUTES) as AccessRole[]).map((r) => (
            <div key={r} className="rounded-lg border p-3">
              <div className="flex items-center gap-2"><Pill label={r} accent={ROLE_ACCENT[r]} /><span className="text-xs text-muted-foreground">{ROLE_DESC[r]}</span></div>
              <p className="mt-1.5 text-xs">{ROLE_ROUTES[r].join(" · ")}</p>
            </div>
          ))}
        </div>
      </ChartCard>

      <Dialog open={!!sel} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {sel && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">{sel.user.name}<Pill label={sel.user.access} accent={ROLE_ACCENT[sel.user.access]} /></DialogTitle>
                <DialogDescription>{sel.user.email}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="profile">
                <TabsList>
                  <TabsTrigger value="profile">Profile &amp; Access</TabsTrigger>
                  <TabsTrigger value="activity">Audit Activity ({selAudits.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="mt-3 space-y-4">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <Field label="Status" value={sel.user.active ? "Active" : "Inactive"} />
                    <Field label="Created" value={fmtDate(sel.user.createdAt)} />
                    <Field label="Last login" value={fmtDateTime(sel.user.lastLogin)} />
                    <Field label="Avg score of audits" value={sel.owned ? <ScoreBadge score={sel.avgScore} /> : "—"} />
                    <Field label="Audits run" value={sel.owned} />
                    <Field label="Decisions made" value={sel.decided} />
                    <Field label="Approved" value={sel.approved} />
                    <Field label="Rejected" value={sel.rejected} />
                  </div>
                  <Section title="Accessible areas">
                    <p className="rounded-lg border p-3 text-sm">{ROLE_ROUTES[sel.user.access].join(" · ")}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{ROLE_DESC[sel.user.access]}</p>
                  </Section>
                </TabsContent>
                <TabsContent value="activity" className="mt-3">
                  {selAudits.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">No audits yet for this user.</p>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border">
                      <Table>
                        <TableHeader><TableRow><TableHead>Reference</TableHead><TableHead>Type</TableHead><TableHead>Date</TableHead><TableHead>Result</TableHead><TableHead>Decision</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {selAudits.slice(0, 30).map((a) => (
                            <TableRow key={a.id} className="cursor-pointer" onClick={() => { setOpen(null); setAuditId(a.id); }}>
                              <TableCell className="font-medium">{a.ref}</TableCell>
                              <TableCell>{KIND_LABEL[a.kind]}</TableCell>
                              <TableCell className="text-muted-foreground">{fmtDate(a.createdAt)}</TableCell>
                              <TableCell><StatusPill status={a.status} /></TableCell>
                              <TableCell><DecisionPill decision={a.decision} /></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
      <AuditDetailDialog audit={selectedAudit} onClose={() => setAuditId(null)} />
    </>
  );
}
