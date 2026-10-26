"use client";

import * as React from "react";
import { toast } from "sonner";
import { UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { useOrg } from "@/lib/org-context";
import { MEMBERS } from "@/lib/mock-data/orgs";
import type { Member } from "@/lib/types/core";

const ROLES: Member["role"][] = ["owner", "admin", "manager", "member", "viewer"];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export function MembersTable() {
  const { org } = useOrg();
  const [search, setSearch] = React.useState("");
  const [roles, setRoles] = React.useState<Record<string, Member["role"]>>(
    Object.fromEntries(MEMBERS.map((m) => [m.id, m.role]))
  );
  const [open, setOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<Member["role"]>("member");

  const orgMembers = MEMBERS.filter((m) => m.orgId === org.id);
  const filtered = orgMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleInvite() {
    if (!inviteEmail.trim()) return;
    toast.success("Invitation sent", { description: `${inviteEmail} was invited as ${inviteRole}.` });
    setOpen(false);
    setInviteEmail("");
  }

  return (
    <>
      <PageHeader
        title="Members & Roles"
        description={`People with access to ${org.name}.`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1.5">
                <UserPlus className="size-4" />
                Invite member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Invite a member</DialogTitle>
                <DialogDescription>They&apos;ll receive an email invite to join {org.name}.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="invite-email">Email</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="name@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as Member["role"])}>
                    <SelectTrigger className="w-full capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r} value={r} className="capitalize">
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInvite}>Send invite</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="relative mb-3 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 pl-8 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={UserPlus} title="No members found" description="Try a different search, or invite someone new." />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="flex items-center gap-2 font-medium">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-primary/15 text-xs text-primary">
                        {initials(m.name)}
                      </AvatarFallback>
                    </Avatar>
                    {m.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{m.email}</TableCell>
                  <TableCell>
                    <Select
                      value={roles[m.id]}
                      onValueChange={(v) => {
                        setRoles((r) => ({ ...r, [m.id]: v as Member["role"] }));
                        toast.success(`Role updated`, { description: `${m.name} is now ${v}.` });
                      }}
                    >
                      <SelectTrigger size="sm" className="w-32 capitalize">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r} className="capitalize">
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
