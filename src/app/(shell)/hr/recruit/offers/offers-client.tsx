"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { FileSignature } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ListToolbar } from "@/components/hr/list-toolbar";
import { StatusBadge } from "@/components/shared/badges";
import { GenerateOfferDialog } from "@/components/hr/generate-offer-dialog";
import { FunnelChart } from "@/components/hr/funnel-chart";
import { KpiCard } from "@/components/shared/kpi-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MOCK_OFFERS,
  getJob,
  offerFunnel,
  avgTimeToAcceptDays,
  type OfferStatus,
} from "@/lib/mock-data/hr";
import { MOCK_CONTACTS } from "@/lib/mock-data/contacts";
import { formatMoney } from "@/lib/format";

export function OffersClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OfferStatus | "all">("all");
  const funnel = useMemo(() => offerFunnel(), []);
  const avgTimeToAccept = useMemo(() => avgTimeToAcceptDays(), []);
  const accepted = MOCK_OFFERS.filter((o) => o.status === "accepted").length;
  const acceptRate = MOCK_OFFERS.length === 0 ? 0 : Math.round((accepted / MOCK_OFFERS.length) * 100);

  const rows = useMemo(() => {
    return MOCK_OFFERS.map((offer) => ({
      offer,
      contact: MOCK_CONTACTS.find((c) => c.id === offer.candidateContactId),
      job: getJob(offer.jobId),
    }))
      .filter((r) => r.contact)
      .filter((r) => (status === "all" ? true : r.offer.status === status))
      .filter((r) => (search ? r.contact!.name.toLowerCase().includes(search.toLowerCase()) : true))
      .sort((a, b) => new Date(b.offer.sentAt).getTime() - new Date(a.offer.sentAt).getTime());
  }, [search, status]);

  return (
    <>
      <PageHeader
        title="Offers"
        description="Compensation offers generated and tracked through to acceptance."
        actions={<GenerateOfferDialog />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FunnelChart data={funnel} title="Offer funnel: sent → viewed → accepted/declined" height={220} />
        </div>
        <div className="grid gap-3">
          <KpiCard label="Avg. time-to-accept" value={`${avgTimeToAccept}d`} context="Sent → accepted" />
          <KpiCard label="Acceptance rate" value={`${acceptRate}%`} context={`${accepted} of ${MOCK_OFFERS.length} offers`} />
        </div>
      </div>

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search offers...">
        <Select value={status} onValueChange={(v) => setStatus(v as OfferStatus | "all")}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="viewed">Viewed</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>
      </ListToolbar>

      {rows.length === 0 ? (
        <EmptyState
          icon={FileSignature}
          title="No offers found"
          description="Try a different search or filter, or generate a new offer."
        />
      ) : (
        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Comp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ offer, contact, job }) => (
                <TableRow key={offer.id}>
                  <TableCell className="font-medium">
                    <Link href={`/hr/recruit/candidates/${contact!.id}`} className="hover:underline">
                      {contact!.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{job?.title}</TableCell>
                  <TableCell className="text-muted-foreground">{formatMoney(offer.compMinor, offer.currency)}</TableCell>
                  <TableCell>
                    <StatusBadge status={offer.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{format(new Date(offer.sentAt), "MMM d, yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  );
}
