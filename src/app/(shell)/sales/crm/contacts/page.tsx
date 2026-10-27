"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { UserPlus, Users, Mail, MessageSquarePlus, Tags, Trash2, ArrowUpDown } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/badges";
import { InitialsAvatar } from "@/components/sales/initials-avatar";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { DonutBreakdownChart } from "@/components/sales/charts/donut-breakdown-chart";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrg } from "@/lib/org-context";
import { contactsByOrg, getCompany } from "@/lib/mock-data/contacts";
import { leadSourceBreakdown, contactTypeBreakdown } from "@/lib/mock-data/sales";
import { RelativeTime } from "@/components/shared/relative-time";

export default function ContactsPage() {
  const { org } = useOrg();
  const allContacts = React.useMemo(() => contactsByOrg(org.id), [org.id]);

  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [sourceFilter, setSourceFilter] = React.useState<string>("all");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [newContactOpen, setNewContactOpen] = React.useState(false);

  const sources = React.useMemo(
    () => Array.from(new Set(allContacts.map((c) => c.source).filter(Boolean))) as string[],
    [allContacts]
  );

  const filtered = React.useMemo(() => {
    const result = allContacts.filter((c) => {
      if (typeFilter !== "all" && c.type !== typeFilter) return false;
      if (sourceFilter !== "all" && c.source !== sourceFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !c.name.toLowerCase().includes(q) &&
          !c.email.toLowerCase().includes(q) &&
          !getCompany(c.companyId)?.name.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
    return result.sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === "asc" ? diff : -diff;
    });
  }, [allContacts, typeFilter, sourceFilter, search, sortDir]);

  const leadCount = allContacts.filter((c) => c.type === "lead").length;
  const customerCount = allContacts.filter((c) => c.type === "customer").length;
  const sourceBreakdown = React.useMemo(() => leadSourceBreakdown(allContacts), [allContacts]);
  const typeBreakdown = React.useMemo(() => contactTypeBreakdown(allContacts), [allContacts]);
  const selectedCount = Object.values(selected).filter(Boolean).length;
  const allSelected = filtered.length > 0 && filtered.every((c) => selected[c.id]);

  function handleCreateContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    toast.success(`Contact "${name}" created`, {
      description: "This is a mocked create — no backend is wired up yet.",
    });
    setNewContactOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Contacts"
        description="Leads and customers shared across the Sales Pod."
        actions={
          <Dialog open={newContactOpen} onOpenChange={setNewContactOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="size-4" />
                New Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreateContact}>
                <DialogHeader>
                  <DialogTitle>New contact</DialogTitle>
                  <DialogDescription>
                    Add a lead or customer to your CRM.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" name="name" placeholder="Aarav Shah" required />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="aarav@example.com" required />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create contact</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Total contacts" value={String(allContacts.length)} context="In this workspace" icon={<Users className="size-4" />} />
        <KpiCard label="Leads" value={String(leadCount)} context="Open opportunities" trend="up" trendValue="+12" icon={<UserPlus className="size-4" />} />
        <KpiCard label="Customers" value={String(customerCount)} context="Converted" trend="flat" trendValue="0" icon={<Tags className="size-4" />} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-3 text-sm font-semibold">Lead source breakdown</h3>
            <DonutBreakdownChart data={sourceBreakdown} height={180} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-3 text-sm font-semibold">Contact type distribution</h3>
            <DonutBreakdownChart data={typeBreakdown} height={180} />
          </CardContent>
        </Card>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search name, email or company..."
      >
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="lead">Lead</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="candidate">Candidate</SelectItem>
            <SelectItem value="client_contact">Client contact</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            {sources.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedCount > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{selectedCount} selected</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success(`Queued email to ${selectedCount} contacts`)}
            >
              <Mail className="size-3.5" />
              Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success(`Enrolled ${selectedCount} contacts in a sequence`)}
            >
              <MessageSquarePlus className="size-3.5" />
              Enroll in sequence
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success(`Added tag to ${selectedCount} contacts`)}
            >
              <Tags className="size-3.5" />
              Add tag
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                toast.success(`Deleted ${selectedCount} contacts`);
                setSelected({});
              }}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>
        )}
      </ListToolbar>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No contacts match your filters"
          description="Try adjusting your search or filters, or add a new contact to get started."
          action={<Button onClick={() => setNewContactOpen(true)}>New Contact</Button>}
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(v) => {
                      const next: Record<string, boolean> = {};
                      if (v) filtered.forEach((c) => (next[c.id] = true));
                      setSelected(next);
                    }}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1"
                    onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                  >
                    Created <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Checkbox
                      checked={!!selected[c.id]}
                      onCheckedChange={(v) => setSelected((s) => ({ ...s, [c.id]: !!v }))}
                    />
                  </TableCell>
                  <TableCell>
                    <Link href={`/sales/crm/contacts/${c.id}`} className="flex items-center gap-2.5 hover:underline">
                      <InitialsAvatar name={c.name} size="sm" />
                      <span className="font-medium">{c.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.email}</TableCell>
                  <TableCell>{getCompany(c.companyId)?.name ?? "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={c.type} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {c.tags.map((t) => (
                        <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{c.source}</TableCell>
                  <TableCell><RelativeTime iso={c.createdAt} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
