"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { KpiCard } from "@/components/shared/kpi-card";
import { InitialsAvatar } from "@/components/sales/initials-avatar";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrg } from "@/lib/org-context";
import { MOCK_COMPANIES, contactsByOrg } from "@/lib/mock-data/contacts";

export default function CompaniesPage() {
  const { org } = useOrg();
  const companies = React.useMemo(
    () => MOCK_COMPANIES.filter((c) => c.orgId === org.id),
    [org.id]
  );
  const contacts = React.useMemo(() => contactsByOrg(org.id), [org.id]);

  const [search, setSearch] = React.useState("");
  const [industryFilter, setIndustryFilter] = React.useState("all");

  const industries = React.useMemo(
    () => Array.from(new Set(companies.map((c) => c.industry).filter(Boolean))) as string[],
    [companies]
  );

  const contactCountFor = React.useCallback(
    (companyId: string) => contacts.filter((c) => c.companyId === companyId).length,
    [contacts]
  );

  const filtered = companies.filter((c) => {
    if (industryFilter !== "all" && c.industry !== industryFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <PageHeader title="Companies" description="Organizations linked to your contacts and deals." />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Total companies" value={String(companies.length)} context="In this workspace" icon={<Building2 className="size-4" />} />
        <KpiCard label="Industries" value={String(industries.length)} context="Represented" icon={<Building2 className="size-4" />} />
        <KpiCard label="Avg. contacts / company" value={companies.length ? (contacts.length / companies.length).toFixed(1) : "0"} context="Across all companies" icon={<Users className="size-4" />} />
      </div>

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search companies...">
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All industries</SelectItem>
            {industries.map((i) => (
              <SelectItem key={i} value={i}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ListToolbar>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies match your filters"
          description="Try a different search term or clear the industry filter."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link key={c.id} href={`/sales/crm/companies/${c.id}`}>
              <Card className="transition-colors hover:border-primary/40">
                <CardContent className="flex items-start gap-3 px-4 py-4">
                  <InitialsAvatar name={c.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.domain}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                      <span className="rounded-full bg-muted px-2 py-0.5">{c.industry}</span>
                      <span className="rounded-full bg-muted px-2 py-0.5">{c.size} employees</span>
                      <span className="rounded-full bg-muted px-2 py-0.5">{contactCountFor(c.id)} contacts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
