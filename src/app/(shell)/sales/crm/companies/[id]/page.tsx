"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { Globe, Users, Building2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/badges";
import { InitialsAvatar } from "@/components/sales/initials-avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_COMPANIES, MOCK_CONTACTS } from "@/lib/mock-data/contacts";
import { MOCK_DEALS, dealsSummaryForCompany } from "@/lib/mock-data/sales";
import { StageValueBarChart } from "@/components/sales/charts/stage-value-bar-chart";
import { RelativeTime } from "@/components/shared/relative-time";

export default function CompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const company = MOCK_COMPANIES.find((c) => c.id === params.id);
  if (!company) notFound();

  const contacts = MOCK_CONTACTS.filter((c) => c.companyId === company.id);
  const dealsSummary = dealsSummaryForCompany(MOCK_DEALS, company.id);
  const hasDeals = dealsSummary.some((d) => d.count > 0);

  return (
    <>
      <PageHeader
        title={company.name}
        description={`${company.industry} · ${company.size} employees`}
        badge={
          company.domain ? (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="size-3" />
              {company.domain}
            </span>
          ) : undefined
        }
      />

      <div className="mb-6 flex items-center gap-3">
        <InitialsAvatar name={company.name} size="lg" />
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Building2 className="size-3.5" />
            {company.industry}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            {contacts.length} contacts
          </span>
        </div>
      </div>

      {hasDeals && (
        <>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Deals by stage</h2>
          <Card className="mb-6">
            <CardContent className="px-4 py-4">
              <StageValueBarChart data={dealsSummary} />
            </CardContent>
          </Card>
        </>
      )}

      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Contacts</h2>
      {contacts.length === 0 ? (
        <EmptyState icon={Users} title="No contacts yet" description="Contacts linked to this company will show up here." />
      ) : (
        <div className="space-y-2">
          {contacts.map((c) => (
            <Link key={c.id} href={`/sales/crm/contacts/${c.id}`}>
              <Card className="transition-colors hover:border-primary/40">
                <CardContent className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <InitialsAvatar name={c.name} size="sm" />
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={c.type} />
                    <span className="text-xs text-muted-foreground"><RelativeTime iso={c.createdAt} /></span>
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
