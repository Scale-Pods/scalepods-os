"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserPlus, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { MOCK_HR_USERS, HR_TODAY, fmtDate, type HrUser } from "@/lib/mock-data/hr";
import { NameAvatar, Field } from "./shared";
import { cn } from "@/lib/utils";

export function UsersAdmin() {
  const [users, setUsers] = useState<HrUser[]>(MOCK_HR_USERS);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<HrUser["role"]>("Recruiter");
  const [openId, setOpenId] = useState<string | null>(null);
  const open = users.find((u) => u.id === openId) ?? null;

  const provision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 6) {
      toast.error("Enter a valid email and a password of at least 6 characters");
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error("A user with this email already exists");
      return;
    }
    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
    setUsers((p) => [
      ...p,
      {
        id: `u-${p.length + 1}`,
        email,
        fullName: name,
        role,
        status: "invited",
        createdAt: HR_TODAY,
        passwordsChangedAt: HR_TODAY,
        lastLogin: "",
        campaigns: 0,
      },
    ]);
    toast.success(`${email} provisioned as ${role}`);
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <PageHeader title="User Management" description="Provision and review access to the Recruit workspace" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>{users.length} accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last login</TableHead>
                  <TableHead>Password changed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className="cursor-pointer" onClick={() => setOpenId(u.id)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <NameAvatar name={u.fullName} size="sm" />
                        <div>
                          <p className="text-sm font-medium">{u.fullName}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "hover:bg-transparent",
                          u.status === "active" ? "bg-success/15 text-success" : "bg-warning/15 text-warning",
                        )}
                      >
                        {u.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{u.lastLogin ? fmtDate(u.lastLogin) : "—"}</TableCell>
                    <TableCell>{fmtDate(u.passwordsChangedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <UserPlus className="size-4 text-primary" /> Provision new user
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={provision} className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Email address</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@scalepods.co" />
                </div>
                <div className="space-y-1.5">
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as HrUser["role"])}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Recruiter">Recruiter</SelectItem>
                      <SelectItem value="Interviewer">Interviewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Create user
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <ShieldCheck className="size-4 text-success" /> Security policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs text-muted-foreground">
              <p>Passwords are stored hashed (bcrypt) and re-synced on every change or reset.</p>
              <p>Only admins can provision accounts. Invited users must reset their password on first login.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {open && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <NameAvatar name={open.fullName} size="lg" />
                  <div>
                    <DialogTitle>{open.fullName}</DialogTitle>
                    <DialogDescription>{open.email}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Role">{open.role}</Field>
                <Field label="Status">{open.status}</Field>
                <Field label="Owned campaigns">{open.campaigns}</Field>
                <Field label="Created">{fmtDate(open.createdAt)}</Field>
                <Field label="Last login">{open.lastLogin ? fmtDate(open.lastLogin) : "Never"}</Field>
                <Field label="Password changed">{fmtDate(open.passwordsChangedAt)}</Field>
              </div>
              <div className="flex gap-2 border-t pt-4">
                <Button size="sm" variant="outline" onClick={() => toast.success(`Password reset email sent to ${open.email}`)}>
                  Send password reset
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setUsers((p) => p.filter((u) => u.id !== open.id));
                    setOpenId(null);
                    toast.success(`${open.fullName} removed`);
                  }}
                >
                  Remove user
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
