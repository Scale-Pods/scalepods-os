"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ALL_AUDITS } from "@/lib/mock-data/audit-checker";
import { AuditTable } from "./audit-table";

export function AuditHistoryPage() {
  return (
    <>
      <PageHeader title="Audit History" description="Every purchase, sales and quick-check audit in one place. Search by invoice or order number." />
      <AuditTable audits={ALL_AUDITS} showKind partyLabel="Supplier / Customer" pageSize={25} />
    </>
  );
}
